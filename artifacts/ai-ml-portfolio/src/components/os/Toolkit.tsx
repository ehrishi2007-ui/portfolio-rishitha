import { HudFrame } from '@/components/os/HudFrame';
import type { ToolkitContent } from '@/data/content';

interface ToolkitProps {
  content: ToolkitContent;
}

export function Toolkit({ content }: ToolkitProps) {
  return (
    <section
      id={content.id}
      className="os-module"
      aria-labelledby="toolkit-heading"
    >
      <HudFrame className="os-module-header">
        <div className="chapter-label">{content.chapterLabel}</div>
        <h2 id="toolkit-heading" className="os-module-heading">
          {content.heading}
        </h2>
      </HudFrame>

      <HudFrame delay={0.05}>
        <p className="toolkit-subline">{content.subline}</p>
      </HudFrame>

      <div className="toolkit-groups">
        {content.groups.map((group, idx) => (
          <HudFrame key={group.category} delay={Math.min(0.2, idx * 0.04)}>
            <div className="hud-panel toolkit-group-row">
              <h3 className="toolkit-category">{group.category}</h3>
              <ul className="toolkit-items">
                {group.items.map((item) => (
                  <li key={item} className="toolkit-chip">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </HudFrame>
        ))}
      </div>

      <HudFrame delay={0.18}>
        <div
          className="hud-panel certifications-panel"
          aria-labelledby="certifications-heading"
        >
          <h3 id="certifications-heading" className="certifications-heading">
            {content.certificationsHeading}
          </h3>
          <ul className="certifications-list">
            {content.certifications.map((cert) => (
              <li key={cert.title} className="certification-item">
                <span>{cert.title}</span>
                <span className="certification-issued">({cert.issued})</span>
              </li>
            ))}
          </ul>
        </div>
      </HudFrame>
    </section>
  );
}
