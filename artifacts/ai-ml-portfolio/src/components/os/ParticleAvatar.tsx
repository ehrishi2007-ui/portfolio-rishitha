import { useEffect, useRef, useState } from 'react';
import { getAvatarSilhouetteUrl } from '@/lib/assets';

interface ParticleAvatarProps {
  revealLabel: string;
  canvasAriaLabel: string;
}

interface Particle {
  nx: number;
  ny: number;
  z: number;
  ox: number;
  oy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  phase: number;
  speed: number;
  size: number;
  isEdge: boolean;
}

const FALLBACK_SILHOUETTE_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 480" width="400" height="480">
    <rect width="400" height="480" fill="#ffffff"/>
    <path fill="#000000" d="M200 58c-52 0-92 42-92 98 0 35 14 66 36 86-6 18-16 30-35 38-46 18-75 56-81 116-2 18 12 34 30 34h284c18 0 32-16 30-34-6-60-35-98-81-116-19-8-29-20-35-38 22-20 36-51 36-86 0-56-40-98-92-98z"/>
  </svg>`,
)}`;

export function ParticleAvatar({
  revealLabel,
  canvasAriaLabel,
}: ParticleAvatarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  const revealedRef = useRef(revealed);
  revealedRef.current = revealed;

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };
    mediaQuery.addEventListener('change', onChange);
    return () => mediaQuery.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isUnmounted = false;
    let isInView = true;
    let rafId = 0;

    let cssWidth = 360;
    let cssHeight = 420;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const pointer = {
      x: -9999,
      y: -9999,
      normX: 0,
      normY: 0,
      active: false,
    };

    const tilt = {
      currentX: 0,
      currentY: 0,
    };

    let revealBlend = revealedRef.current || reducedMotion ? 1 : 0;
    let particles: Particle[] = [];
    let silhouetteCanvas: HTMLCanvasElement | null = null;
    let loadedImage: HTMLImageElement | null = null;

    const buildFromImage = (img: HTMLImageElement) => {
      const sampleW = 240;
      const sampleH = 280;
      const offscreen = document.createElement('canvas');
      offscreen.width = sampleW;
      offscreen.height = sampleH;
      const offCtx = offscreen.getContext('2d', { willReadFrequently: true });
      if (!offCtx) return;

      offCtx.fillStyle = '#FFFFFF';
      offCtx.fillRect(0, 0, sampleW, sampleH);

      const pad = 0.08;
      const availW = sampleW * (1 - pad * 2);
      const availH = sampleH * (1 - pad * 2);
      const imgAspect =
        img.naturalWidth && img.naturalHeight
          ? img.naturalWidth / img.naturalHeight
          : 400 / 480;
      const boxAspect = availW / availH;

      let drawW = availW;
      let drawH = availH;
      if (imgAspect > boxAspect) {
        drawH = availW / imgAspect;
      } else {
        drawW = availH * imgAspect;
      }
      const drawX = (sampleW - drawW) * 0.5;
      const drawY = (sampleH - drawH) * 0.5;

      offCtx.drawImage(img, drawX, drawY, drawW, drawH);

      const imgData = offCtx.getImageData(0, 0, sampleW, sampleH).data;
      const isShape = new Uint8Array(sampleW * sampleH);
      const isEdge = new Uint8Array(sampleW * sampleH);

      for (let y = 0; y < sampleH; y += 1) {
        for (let x = 0; x < sampleW; x += 1) {
          const idx = y * sampleW + x;
          const p = idx * 4;
          const r = imgData[p];
          const g = imgData[p + 1];
          const b = imgData[p + 2];
          const a = imgData[p + 3];
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          if (a > 100 && lum < 170) {
            isShape[idx] = 1;
          }
        }
      }

      const edgeCandidates: { nx: number; ny: number; z: number }[] = [];
      const innerCandidates: { nx: number; ny: number; z: number }[] = [];

      // Create clean coral-outlined, teal-filled silhouette canvas
      const outlineCanvas = document.createElement('canvas');
      outlineCanvas.width = sampleW;
      outlineCanvas.height = sampleH;
      const outlineCtx = outlineCanvas.getContext('2d');
      const outlineImgData = outlineCtx
        ? outlineCtx.createImageData(sampleW, sampleH)
        : null;

      for (let y = 1; y < sampleH - 1; y += 1) {
        for (let x = 1; x < sampleW - 1; x += 1) {
          const idx = y * sampleW + x;
          if (!isShape[idx]) continue;

          let boundary = false;
          for (let dy = -2; dy <= 2 && !boundary; dy += 1) {
            for (let dx = -2; dx <= 2; dx += 1) {
              const nxIdx = (y + dy) * sampleW + (x + dx);
              if (
                x + dx < 0 ||
                x + dx >= sampleW ||
                y + dy < 0 ||
                y + dy >= sampleH ||
                !isShape[nxIdx]
              ) {
                boundary = true;
                break;
              }
            }
          }

          if (boundary) {
            isEdge[idx] = 1;
          }

          const nx = x / sampleW;
          const ny = y / sampleH;
          const centerDist = Math.hypot(nx - 0.5, (ny - 0.48) * 0.85);
          const z = Math.max(-0.6, 1 - centerDist * 2.6);

          if (boundary) {
            edgeCandidates.push({ nx, ny, z });
          } else {
            innerCandidates.push({ nx, ny, z });
          }

          if (outlineImgData) {
            const p = idx * 4;
            if (boundary) {
              // Coral outline (#FF6F5E)
              outlineImgData.data[p] = 255;
              outlineImgData.data[p + 1] = 111;
              outlineImgData.data[p + 2] = 94;
              outlineImgData.data[p + 3] = 255;
            } else {
              // Teal fill (#0E4F4A)
              outlineImgData.data[p] = 14;
              outlineImgData.data[p + 1] = 79;
              outlineImgData.data[p + 2] = 74;
              outlineImgData.data[p + 3] = 235;
            }
          }
        }
      }

      if (outlineCtx && outlineImgData) {
        outlineCtx.putImageData(outlineImgData, 0, 0);
        silhouetteCanvas = outlineCanvas;
      }

      const isMobile = window.innerWidth < 768;
      const targetCount = isMobile ? 2500 : 6000;
      const allCandidates = [...edgeCandidates, ...innerCandidates];

      if (allCandidates.length === 0) return;

      // Deterministic pseudo-random shuffle so particles are evenly distributed
      let seed = 1337;
      const nextRand = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
      };

      const edgeTarget = Math.min(
        edgeCandidates.length,
        Math.floor(targetCount * 0.34),
      );
      const innerTarget = targetCount - edgeTarget;

      const pickPoints = (
        pool: { nx: number; ny: number; z: number }[],
        count: number,
        edgeFlag: boolean,
      ): Particle[] => {
        if (pool.length === 0 || count <= 0) return [];
        const result: Particle[] = [];
        const step = pool.length / count;

        for (let i = 0; i < count; i += 1) {
          const base = pool[Math.floor(i * step) % pool.length];
          const jitterX = (nextRand() - 0.5) * (0.9 / sampleW);
          const jitterY = (nextRand() - 0.5) * (0.9 / sampleH);
          const nx = Math.min(0.98, Math.max(0.02, base.nx + jitterX));
          const ny = Math.min(0.98, Math.max(0.02, base.ny + jitterY));
          const ox = nx * cssWidth;
          const oy = ny * cssHeight;

          result.push({
            nx,
            ny,
            z: base.z,
            ox,
            oy,
            x: ox,
            y: oy,
            vx: 0,
            vy: 0,
            phase: nextRand() * Math.PI * 2,
            speed: 1.4 + nextRand() * 1.6,
            size: edgeFlag ? 1.25 + nextRand() * 0.45 : 0.95 + nextRand() * 0.5,
            isEdge: edgeFlag,
          });
        }
        return result;
      };

      particles = [
        ...pickPoints(edgeCandidates, edgeTarget, true),
        ...pickPoints(innerCandidates, innerTarget, false),
      ];
    };

    const updateCanvasSize = () => {
      const rect = container.getBoundingClientRect();
      cssWidth = Math.max(240, Math.floor(rect.width));
      cssHeight = Math.max(280, Math.floor(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(cssWidth * dpr);
      canvas.height = Math.floor(cssHeight * dpr);

      if (loadedImage) {
        buildFromImage(loadedImage);
      }
    };

    const drawStaticSilhouette = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cssWidth, cssHeight);
      if (silhouetteCanvas) {
        ctx.save();
        ctx.shadowColor = 'rgba(255, 111, 94, 0.45)';
        ctx.shadowBlur = 12;
        ctx.drawImage(silhouetteCanvas, 0, 0, cssWidth, cssHeight);
        ctx.restore();
      }
    };

    const renderFrame = (timestamp: number) => {
      if (isUnmounted) return;
      if (!isInView) {
        rafId = 0;
        return;
      }

      if (reducedMotion) {
        drawStaticSilhouette();
        rafId = 0;
        return;
      }

      const timeSec = timestamp * 0.001;
      const targetReveal = revealedRef.current ? 1 : 0;
      revealBlend += (targetReveal - revealBlend) * 0.12;

      const targetTiltX = pointer.active ? pointer.normX * 11 : 0;
      const targetTiltY = pointer.active ? pointer.normY * 8 : 0;
      tilt.currentX += (targetTiltX - tilt.currentX) * 0.09;
      tilt.currentY += (targetTiltY - tilt.currentY) * 0.09;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cssWidth, cssHeight);

      if (revealBlend > 0.01 && silhouetteCanvas) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, revealBlend);
        ctx.shadowColor = 'rgba(255, 111, 94, 0.45)';
        ctx.shadowBlur = 12;
        ctx.translate(tilt.currentX * 0.45, tilt.currentY * 0.45);
        ctx.drawImage(silhouetteCanvas, 0, 0, cssWidth, cssHeight);
        ctx.restore();
      }

      const particleAlphaScale = 1 - revealBlend * 0.92;
      if (particleAlphaScale > 0.02 && particles.length > 0) {
        const repelRadius = Math.min(cssWidth, cssHeight) * 0.2;
        const repelRadiusSq = repelRadius * repelRadius;

        ctx.fillStyle = '#FF6F5E';

        for (let i = 0; i < particles.length; i += 1) {
          const p = particles[i];
          const targetX =
            p.ox +
            tilt.currentX * p.z +
            Math.sin(timeSec * p.speed + p.phase) * 0.9;
          const targetY =
            p.oy +
            tilt.currentY * p.z +
            Math.cos(timeSec * p.speed + p.phase) * 0.9;

          if (pointer.active && revealBlend < 0.5) {
            const dx = p.x - pointer.x;
            const dy = p.y - pointer.y;
            const distSq = dx * dx + dy * dy;
            if (distSq < repelRadiusSq && distSq > 0.001) {
              const dist = Math.sqrt(distSq);
              const force = (1 - dist / repelRadius) * 2.35;
              p.vx += (dx / dist) * force;
              p.vy += (dy / dist) * force;
            }
          }

          p.vx += (targetX - p.x) * 0.12;
          p.vy += (targetY - p.y) * 0.12;
          p.vx *= 0.78;
          p.vy *= 0.78;
          p.x += p.vx;
          p.y += p.vy;

          const shimmer = 0.5 + 0.5 * Math.sin(timeSec * p.speed * 1.7 + p.phase);
          const baseAlpha = p.isEdge ? 0.58 + shimmer * 0.42 : 0.3 + shimmer * 0.45;
          ctx.globalAlpha = baseAlpha * particleAlphaScale;

          const s = p.size;
          ctx.fillRect(p.x - s * 0.5, p.y - s * 0.5, s, s);
        }
        ctx.globalAlpha = 1;
      }

      rafId = window.requestAnimationFrame(renderFrame);
    };

    const startLoop = () => {
      if (isUnmounted) return;
      if (reducedMotion) {
        drawStaticSilhouette();
        return;
      }
      if (!rafId && isInView) {
        rafId = window.requestAnimationFrame(renderFrame);
      }
    };

    const updatePointerFromClient = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      pointer.x = x;
      pointer.y = y;
      pointer.normX = ((x / Math.max(1, rect.width)) - 0.5) * 2;
      pointer.normY = ((y / Math.max(1, rect.height)) - 0.5) * 2;
      pointer.active = true;
    };

    const onMouseMove = (event: MouseEvent) => {
      updatePointerFromClient(event.clientX, event.clientY);
    };

    const onMouseLeave = () => {
      pointer.active = false;
      pointer.x = -9999;
      pointer.y = -9999;
    };

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        const touch = event.touches[0];
        updatePointerFromClient(touch.clientX, touch.clientY);
      }
    };

    const onTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        const touch = event.touches[0];
        updatePointerFromClient(touch.clientX, touch.clientY);
      }
    };

    const onTouchEnd = () => {
      pointer.active = false;
      pointer.x = -9999;
      pointer.y = -9999;
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isInView = entry.isIntersecting;
        if (isInView) {
          startLoop();
        } else if (rafId) {
          window.cancelAnimationFrame(rafId);
          rafId = 0;
        }
      },
      { threshold: 0.05 },
    );

    observer.observe(container);
    updateCanvasSize();

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (isUnmounted) return;
      loadedImage = img;
      buildFromImage(img);
      startLoop();
    };
    img.onerror = () => {
      if (isUnmounted) return;
      if (img.src !== FALLBACK_SILHOUETTE_SVG) {
        img.src = FALLBACK_SILHOUETTE_SVG;
      }
    };

    const resolvedUrl = getAvatarSilhouetteUrl();
    img.src = resolvedUrl ?? FALLBACK_SILHOUETTE_SVG;

    window.addEventListener('resize', updateCanvasSize);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    canvas.addEventListener('touchmove', onTouchMove, { passive: true });
    canvas.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      isUnmounted = true;
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      observer.disconnect();
      window.removeEventListener('resize', updateCanvasSize);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
    };
  }, [reducedMotion]);

  return (
    <div className="os-avatar-module" data-testid="particle-avatar-module">
      <div
        ref={containerRef}
        className="hud-panel os-avatar-canvas-wrap"
      >
        <canvas
          ref={canvasRef}
          className="os-avatar-canvas"
          role="img"
          aria-label={canvasAriaLabel}
          data-testid="canvas-particle-avatar"
        />
      </div>

      <div className="os-avatar-controls">
        <button
          type="button"
          className={`os-avatar-reveal-btn ${revealed ? 'is-active' : ''}`}
          aria-pressed={revealed}
          onClick={() => setRevealed((prev) => !prev)}
          data-testid="button-avatar-reveal"
        >
          {revealLabel}
        </button>
      </div>
    </div>
  );
}
