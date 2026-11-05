import { ArrowUpRight } from 'lucide-react';
import { HudFrame } from '@/components/os/HudFrame';
import type { ContactContent } from '@/data/content';

interface ContactProps {
  content: ContactContent;
}

export function Contact({ content }: ContactProps) {
  return (
    <section
      id={content.id}
      className="os-module"
      aria-labelledby="contact-heading"
    >
      <HudFrame className="os-module-header">
        <div className="chapter-label">{content.chapterLabel}</div>
        <h2 id="contact-heading" className="os-module-heading">
          {content.heading}
        </h2>
      </HudFrame>

      <div className="contact-layout">
        <HudFrame delay={0.05}>
          <p className="contact-text">{content.text}</p>
        </HudFrame>

        <HudFrame className="contact-links" delay={0.1}>
          {content.links.map((link) => (
            <a
              key={link.id}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              className="hud-panel contact-link-row"
              data-testid={`link-${link.id}`}
            >
              <span className="contact-link-label">{link.label}</span>
              <span className="contact-link-value">{link.value}</span>
              <ArrowUpRight size={16} strokeWidth={1.6} aria-hidden="true" />
            </a>
          ))}
        </HudFrame>
      </div>
    </section>
  );
}
