import { useEffect, useRef, useState } from 'react';
import type { ProjectItem } from '@/data/content';
import {
  getProjectCoverUrl,
  hasProjectPreviewVideo,
  loadProjectPreviewVideoUrl,
} from '@/lib/assets';

interface ProjectPreviewMediaProps {
  project: ProjectItem;
  placeholderLabel: string;
  active: boolean;
}

export function ProjectPreviewMedia({
  project,
  placeholderLabel,
  active,
}: ProjectPreviewMediaProps) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const coverUrl = getProjectCoverUrl(project.slug);
  const hasVideo = hasProjectPreviewVideo(project.slug);

  useEffect(() => {
    setVideoUrl(null);
    setVideoFailed(false);
    setImageFailed(false);
  }, [project.slug]);

  useEffect(() => {
    if (!active || !hasVideo) {
      return;
    }

    let cancelled = false;
    loadProjectPreviewVideoUrl(project.slug).then((resolved) => {
      if (!cancelled) {
        if (resolved) {
          setVideoUrl(resolved);
        } else {
          setVideoFailed(true);
        }
      }
    });

    return () => {
      cancelled = true;
    };
  }, [active, hasVideo, project.slug]);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl || !videoUrl || !active) return;
    videoEl.play().catch(() => {
      // Autoplay blocked or interrupted; keep muted video element ready
    });
  }, [active, videoUrl]);

  if (hasVideo && videoUrl && !videoFailed) {
    return (
      <video
        ref={videoRef}
        src={videoUrl}
        width={640}
        height={360}
        className="os-preview-media"
        muted
        loop
        playsInline
        preload="none"
        onError={() => setVideoFailed(true)}
        data-testid={`preview-video-${project.slug}`}
      />
    );
  }

  if (coverUrl && !imageFailed) {
    return (
      <img
        src={coverUrl}
        alt={project.coverAlt}
        width={640}
        height={360}
        className="os-preview-media"
        loading="lazy"
        decoding="async"
        onError={() => setImageFailed(true)}
        data-testid={`preview-img-${project.slug}`}
      />
    );
  }

  return (
    <div
      className="os-preview-placeholder"
      data-testid={`preview-placeholder-${project.slug}`}
    >
      <span className="os-preview-placeholder-text">{placeholderLabel}</span>
    </div>
  );
}

interface FloatingProjectPreviewProps {
  project: ProjectItem | null;
  placeholderLabel: string;
  targetPosition: { x: number; y: number };
}

export function ProjectPreview({
  project,
  placeholderLabel,
  targetPosition,
}: FloatingProjectPreviewProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const currentPosRef = useRef<{ x: number; y: number }>({
    x: targetPosition.x,
    y: targetPosition.y,
  });
  const targetPosRef = useRef<{ x: number; y: number }>(targetPosition);
  const initializedRef = useRef(false);

  targetPosRef.current = targetPosition;

  useEffect(() => {
    if (!project) {
      initializedRef.current = false;
      return;
    }

    if (!initializedRef.current) {
      currentPosRef.current = {
        x: targetPosRef.current.x,
        y: targetPosRef.current.y,
      };
      initializedRef.current = true;
    }

    let rafId = 0;
    const cardWidth = 340;
    const cardHeight = 216;
    const offsetX = 28;
    const offsetY = -28;

    const animate = () => {
      const card = cardRef.current;
      if (card) {
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        let desiredX = targetPosRef.current.x + offsetX;
        let desiredY = targetPosRef.current.y + offsetY;

        if (desiredX + cardWidth + 16 > vw) {
          desiredX = Math.max(16, targetPosRef.current.x - cardWidth - offsetX);
        }
        if (desiredY + cardHeight + 16 > vh) {
          desiredY = vh - cardHeight - 16;
        }
        if (desiredY < 72) {
          desiredY = 72;
        }

        currentPosRef.current.x += (desiredX - currentPosRef.current.x) * 0.16;
        currentPosRef.current.y += (desiredY - currentPosRef.current.y) * 0.16;

        card.style.transform = `translate3d(${currentPosRef.current.x.toFixed(1)}px, ${currentPosRef.current.y.toFixed(1)}px, 0)`;
      }
      rafId = window.requestAnimationFrame(animate);
    };

    rafId = window.requestAnimationFrame(animate);
    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [project]);

  if (!project) {
    return null;
  }

  return (
    <div
      ref={cardRef}
      className="hud-panel os-floating-preview"
      aria-hidden="true"
      data-testid="floating-project-preview"
    >
      <div className="os-floating-preview-header">
        <span className="os-floating-preview-index">{project.index}</span>
        <span className="os-floating-preview-status">{project.statusBadge}</span>
      </div>
      <div className="os-floating-preview-body">
        <ProjectPreviewMedia
          project={project}
          placeholderLabel={placeholderLabel}
          active={true}
        />
      </div>
    </div>
  );
}
