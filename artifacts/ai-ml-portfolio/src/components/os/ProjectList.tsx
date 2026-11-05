import { useCallback, useEffect, useState, type MouseEvent } from 'react';
import { CaseStudyPanel } from '@/components/os/CaseStudyPanel';
import { HudFrame } from '@/components/os/HudFrame';
import {
  ProjectPreview,
  ProjectPreviewMedia,
} from '@/components/os/ProjectPreview';
import type { ProjectItem, ProjectSectionContent } from '@/data/content';

interface ProjectListProps {
  section: ProjectSectionContent;
}

function detectHoverCapable(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return true;
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

function detectReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function ProjectList({ section }: ProjectListProps) {
  const headingId = `${section.id}-heading`;

  const [isHoverCapable, setIsHoverCapable] = useState<boolean>(
    detectHoverCapable,
  );
  const [reducedMotion, setReducedMotion] = useState<boolean>(
    detectReducedMotion,
  );
  const [hoveredProject, setHoveredProject] = useState<ProjectItem | null>(
    null,
  );
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const [caseStudyProject, setCaseStudyProject] = useState<ProjectItem | null>(
    null,
  );
  const [cursorPosition, setCursorPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const hoverMq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)');

    const onHoverChange = (event: MediaQueryListEvent) => {
      setIsHoverCapable(event.matches);
    };
    const onMotionChange = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };

    hoverMq.addEventListener('change', onHoverChange);
    motionMq.addEventListener('change', onMotionChange);

    return () => {
      hoverMq.removeEventListener('change', onHoverChange);
      motionMq.removeEventListener('change', onMotionChange);
    };
  }, []);

  const useFloatingPreview = isHoverCapable && !reducedMotion;

  const handleRowMouseEnter = (
    project: ProjectItem,
    event: MouseEvent<HTMLButtonElement>,
  ) => {
    if (!isHoverCapable) return;
    setCursorPosition({ x: event.clientX, y: event.clientY });
    setHoveredProject(project);
  };

  const handleRowMouseMove = (event: MouseEvent<HTMLButtonElement>) => {
    if (!useFloatingPreview) return;
    setCursorPosition({ x: event.clientX, y: event.clientY });
  };

  const handleRowMouseLeave = () => {
    if (!isHoverCapable) return;
    setHoveredProject(null);
  };

  const handleRowFocus = (
    project: ProjectItem,
    element: HTMLButtonElement,
  ) => {
    const rect = element.getBoundingClientRect();
    setCursorPosition({
      x: Math.max(120, rect.right - 360),
      y: rect.top + rect.height * 0.5,
    });
    setHoveredProject(project);
  };

  const handleRowActivate = (project: ProjectItem) => {
    if (!isHoverCapable) {
      setExpandedSlug((prev) => (prev === project.slug ? null : project.slug));
      return;
    }
    setCaseStudyProject(project);
  };

  const handleCloseCaseStudy = useCallback(() => {
    setCaseStudyProject(null);
  }, []);

  return (
    <section
      id={section.id}
      className="os-module"
      aria-labelledby={headingId}
      onMouseLeave={handleRowMouseLeave}
    >
      <HudFrame className="os-module-header">
        <div className="chapter-label">{section.chapterLabel}</div>
        <h2 id={headingId} className="os-module-heading">
          {section.heading}
        </h2>
      </HudFrame>

      <div
        className="os-mw-project-list"
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node)) {
            setHoveredProject(null);
          }
        }}
      >
        {section.projects.map((project, idx) => {
          const isHoveredOrFocused = hoveredProject?.slug === project.slug;
          const isTouchExpanded =
            !isHoverCapable && expandedSlug === project.slug;
          const showInlinePreview =
            isTouchExpanded || (reducedMotion && isHoveredOrFocused);

          return (
            <HudFrame key={project.slug} delay={Math.min(0.2, idx * 0.04)}>
              <article
                className={`os-mw-row-wrapper ${
                  isHoveredOrFocused || isTouchExpanded ? 'is-active' : ''
                }`}
                data-testid={`project-row-${project.slug}`}
              >
                <button
                  type="button"
                  className="os-mw-row-button"
                  aria-expanded={!isHoverCapable ? isTouchExpanded : undefined}
                  onMouseEnter={(event) => handleRowMouseEnter(project, event)}
                  onMouseMove={handleRowMouseMove}
                  onFocus={(event) =>
                    handleRowFocus(project, event.currentTarget)
                  }
                  onClick={() => handleRowActivate(project)}
                  data-testid={`button-project-${project.slug}`}
                >
                  <span className="os-mw-row-index">{project.index}</span>

                  <span className="os-mw-row-title">{project.title}</span>

                  <span className="os-mw-row-outcome">{project.outcome}</span>

                  <span className="os-mw-row-meta">
                    {project.keyMetric && (
                      <span className="project-metric-badge">
                        {project.keyMetric}
                      </span>
                    )}
                    <span
                      className={`project-status-badge ${
                        project.status === 'in-progress' ? 'is-in-progress' : ''
                      }`}
                    >
                      {project.statusBadge}
                    </span>
                  </span>
                </button>

                <div className="os-mw-row-line" aria-hidden="true" />

                {showInlinePreview && (
                  <div
                    className="hud-panel os-inline-preview"
                    data-testid={`inline-preview-${project.slug}`}
                  >
                    <div className="os-inline-preview-media">
                      <ProjectPreviewMedia
                        project={project}
                        placeholderLabel={section.previewPlaceholder}
                        active={true}
                      />
                    </div>
                    <div className="os-inline-preview-actions">
                      <button
                        type="button"
                        className="os-view-case-study-btn"
                        onClick={() => setCaseStudyProject(project)}
                        data-testid={`button-view-case-study-${project.slug}`}
                      >
                        {section.viewCaseStudyLabel}
                      </button>
                    </div>
                  </div>
                )}
              </article>
            </HudFrame>
          );
        })}
      </div>

      {useFloatingPreview && (
        <ProjectPreview
          project={hoveredProject}
          placeholderLabel={section.previewPlaceholder}
          targetPosition={cursorPosition}
        />
      )}

      <CaseStudyPanel
        project={caseStudyProject}
        section={section}
        onClose={handleCloseCaseStudy}
      />
    </section>
  );
}
