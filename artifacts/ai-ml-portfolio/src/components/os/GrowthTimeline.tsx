import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { HudFrame } from '@/components/os/HudFrame';
import type { GrowthContent } from '@/data/content';

interface GrowthTimelineProps {
  content: GrowthContent;
}

export function GrowthTimeline({ content }: GrowthTimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 78%', 'end 68%'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 26,
    restDelta: 0.001,
  });

  return (
    <section
      id={content.id}
      className="os-module"
      aria-labelledby="growth-heading"
    >
      <HudFrame className="os-module-header">
        <div className="chapter-label">{content.chapterLabel}</div>
        <h2 id="growth-heading" className="os-module-heading">
          {content.heading}
        </h2>
      </HudFrame>

      <div ref={timelineRef} className="growth-timeline">
        <div className="growth-timeline-track" aria-hidden="true">
          <motion.div
            className="growth-timeline-fill"
            style={{
              scaleY: reducedMotion ? 1 : smoothProgress,
            }}
          />
        </div>

        {content.entries.map((entry, idx) => (
          <HudFrame key={entry.id} delay={Math.min(0.24, idx * 0.04)}>
            <article
              className="hud-panel growth-item"
              data-testid={`growth-item-${entry.id}`}
            >
              <div className="growth-item-header">
                <h3 className="growth-role-org">
                  {entry.role}
                  <span className="growth-org">, {entry.organization}</span>
                </h3>
                <span className="growth-period">{entry.period}</span>
              </div>
              <p className="growth-description">{entry.description}</p>
            </article>
          </HudFrame>
        ))}
      </div>
    </section>
  );
}
