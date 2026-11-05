import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import type { ProjectItem, ProjectSectionContent } from '@/data/content';
import { getProjectCoverUrl } from '@/lib/assets';

interface CaseStudyPanelProps {
  project: ProjectItem | null;
  section: ProjectSectionContent;
  onClose: () => void;
}

export function CaseStudyPanel({
  project,
  section,
  onClose,
}: CaseStudyPanelProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [project?.slug]);

  useEffect(() => {
    if (!project) {
      return;
    }

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 10);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === first) {
            event.preventDefault();
            last.focus();
          }
        } else if (document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [project, onClose]);

  if (!project) {
    return null;
  }

  const coverUrl = getProjectCoverUrl(project.slug);
  const hasMetrics = Boolean(project.keyMetric || project.otherMetrics);
  const hasTags = Boolean(project.tags && project.tags.length > 0);
  const hasGithub = Boolean(project.githubUrl && project.githubUrl.trim());
  const hasLive = Boolean(project.liveUrl && project.liveUrl.trim());
  const titleId = `case-study-title-${project.slug}`;

  return (
    <div
      className="os-case-study-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      data-testid="case-study-backdrop"
    >
      <div
        ref={dialogRef}
        className="hud-panel os-case-study-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        data-testid={`case-study-panel-${project.slug}`}
      >
        <div className="os-case-study-topbar">
          <div className="os-case-study-meta">
            <span className="os-case-study-index">{project.index}</span>
            <span
              className={`project-status-badge ${
                project.status === 'in-progress' ? 'is-in-progress' : ''
              }`}
            >
              {project.statusBadge}
            </span>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            className="os-case-study-close"
            aria-label={section.closeCaseStudyAriaLabel}
            onClick={onClose}
            data-testid="button-close-case-study"
          >
            <span>{section.closeCaseStudyLabel}</span>
            <X size={15} strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>

        <div className="os-case-study-media">
          {coverUrl && !imageFailed ? (
            <img
              src={coverUrl}
              alt={project.coverAlt}
              width={960}
              height={540}
              className="os-preview-media"
              loading="lazy"
              decoding="async"
              onError={() => setImageFailed(true)}
              data-testid={`case-study-img-${project.slug}`}
            />
          ) : (
            <div
              className="os-preview-placeholder"
              data-testid={`case-study-placeholder-${project.slug}`}
            >
              <span className="os-preview-placeholder-text">
                {section.previewPlaceholder}
              </span>
            </div>
          )}
        </div>

        <div className="os-case-study-body">
          <header className="os-case-study-header">
            <h2 id={titleId} className="os-case-study-title">
              {project.title}
            </h2>
            {project.subtitle && (
              <p className="os-case-study-subtitle">{project.subtitle}</p>
            )}
          </header>

          <div className="os-case-study-section">
            <h3 className="os-case-study-section-heading">
              {section.overviewHeading}
            </h3>
            <p className="os-case-study-description">{project.outcome}</p>
          </div>

          {hasMetrics && (
            <div className="os-case-study-section">
              <h3 className="os-case-study-section-heading">
                {section.metricsHeading}
              </h3>
              <div className="os-case-study-metrics">
                {project.keyMetric && (
                  <div className="os-case-study-key-metric">
                    {project.keyMetric}
                  </div>
                )}
                {project.otherMetrics && (
                  <p className="os-case-study-other-metrics">
                    {project.otherMetrics}
                  </p>
                )}
              </div>
            </div>
          )}

          {hasTags && (
            <div className="os-case-study-section">
              <h3 className="os-case-study-section-heading">
                {section.stackHeading}
              </h3>
              <ul className="toolkit-items">
                {project.tags!.map((tag) => (
                  <li key={tag} className="toolkit-chip">
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(hasGithub || hasLive) && (
            <div className="os-case-study-links">
              {hasGithub && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="os-case-study-link"
                  data-testid={`case-study-github-${project.slug}`}
                >
                  <span>{section.githubLabel}</span>
                  <ArrowUpRight size={15} strokeWidth={1.6} aria-hidden="true" />
                </a>
              )}
              {hasLive && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="os-case-study-link"
                  data-testid={`case-study-live-${project.slug}`}
                >
                  <span>{section.liveLabel}</span>
                  <ArrowUpRight size={15} strokeWidth={1.6} aria-hidden="true" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
