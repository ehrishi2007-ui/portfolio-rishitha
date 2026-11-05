import { useEffect, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { ParticleAvatar } from '@/components/os/ParticleAvatar';
import type { HeroContent } from '@/data/content';

interface HeroProps {
  content: HeroContent;
}

export function Hero({ content }: HeroProps) {
  const [typedLength, setTypedLength] = useState<number>(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return content.avatarTypedLine.length;
    }
    return 0;
  });

  useEffect(() => {
    const fullLength = content.avatarTypedLine.length;
    if (typedLength >= fullLength) {
      return;
    }
    const timer = window.setTimeout(() => {
      setTypedLength((prev) => Math.min(fullLength, prev + 1));
    }, 28);
    return () => window.clearTimeout(timer);
  }, [content.avatarTypedLine, typedLength]);

  const displayedTypedLine = content.avatarTypedLine.slice(0, typedLength);

  return (
    <section className="os-hero" aria-labelledby="hero-title">
      <div className="os-hero-grid">
        <div className="os-hero-copy-col">
          <div className="hud-panel os-hero-frame">
            <p className="os-hero-intro">{content.introLine}</p>
            <h1 id="hero-title" className="os-hero-headline">
              <span
                className="os-hero-headline-line os-glitch-layer"
                data-text={content.headlineFirst}
              >
                {content.headlineFirst}
              </span>
              <span
                className="os-hero-headline-accent os-glitch-layer"
                data-text={content.headlineSecond}
              >
                {content.headlineSecond}
              </span>
            </h1>
            <p className="os-hero-subline">{content.subline}</p>
          </div>

          <a
            href={content.scrollTarget}
            className="os-scroll-cue"
            data-testid="link-scroll-origin"
          >
            <span>{content.scrollCue}</span>
            <ArrowDown size={14} strokeWidth={1.6} aria-hidden="true" />
          </a>
        </div>

        <div className="os-hero-avatar-col">
          <ParticleAvatar
            revealLabel={content.avatarRevealLabel}
            canvasAriaLabel={content.avatarCanvasAriaLabel}
          />
          <p
            className="hud-panel os-avatar-typed-line"
            aria-label={content.avatarTypedLine}
            data-testid="avatar-typed-line"
          >
            <span>{displayedTypedLine}</span>
            <span className="os-typing-cursor" aria-hidden="true">
              _
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
