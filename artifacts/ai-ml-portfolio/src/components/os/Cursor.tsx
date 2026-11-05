import { useEffect, useRef, useState } from 'react';

function shouldEnableCustomCursor(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  const isHoverFine = window.matchMedia(
    '(hover: hover) and (pointer: fine)',
  ).matches;
  const isReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;
  return isHoverFine && !isReducedMotion;
}

export function Cursor() {
  const [enabled, setEnabled] = useState<boolean>(shouldEnableCustomCursor);
  const [visible, setVisible] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const hoverMq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)');

    const update = () => {
      setEnabled(hoverMq.matches && !motionMq.matches);
    };

    hoverMq.addEventListener('change', update);
    motionMq.addEventListener('change', update);
    return () => {
      hoverMq.removeEventListener('change', update);
      motionMq.removeEventListener('change', update);
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      setVisible(false);
      return;
    }

    let rafId = 0;
    const target = { x: -100, y: -100 };
    const current = { x: -100, y: -100 };
    let initialized = false;

    const onMouseMove = (event: MouseEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
      if (!initialized) {
        current.x = target.x;
        current.y = target.y;
        initialized = true;
      }
      setVisible(true);

      const el =
        event.target instanceof Element
          ? event.target.closest('a, button, [role="button"]')
          : null;
      setInteractive(Boolean(el));
    };

    const onMouseLeave = () => {
      setVisible(false);
    };

    const tick = () => {
      current.x += (target.x - current.x) * 0.24;
      current.y += (target.y - current.y) * 0.24;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${current.x.toFixed(1)}px, ${current.y.toFixed(1)}px, 0)`;
      }
      rafId = window.requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    rafId = window.requestAnimationFrame(tick);

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  return (
    <div
      ref={ringRef}
      className={`os-reticle-cursor ${visible ? 'is-visible' : ''} ${
        interactive ? 'is-interactive' : ''
      }`}
      aria-hidden="true"
      data-testid="custom-reticle-cursor"
    >
      <span className="os-reticle-ring" />
      <span className="os-reticle-dot" />
    </div>
  );
}
