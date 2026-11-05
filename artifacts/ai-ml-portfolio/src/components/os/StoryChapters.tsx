import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { HudFrame } from '@/components/os/HudFrame';
import type {
  BecomingContent,
  OriginContent,
  SystemProfileItem,
} from '@/data/content';

interface StoryChaptersProps {
  origin: OriginContent;
  becoming: BecomingContent;
}

function ProfileValue({
  item,
  inView,
  reducedMotion,
}: {
  item: SystemProfileItem;
  inView: boolean;
  reducedMotion: boolean;
}) {
  const [displayNumber, setDisplayNumber] = useState<string>(() => {
    if (!item.countUp) return item.value;
    if (reducedMotion) return item.countUp.target.toFixed(item.countUp.decimals);
    return (0).toFixed(item.countUp.decimals);
  });

  useEffect(() => {
    if (!item.countUp) return;
    const { target, decimals } = item.countUp;

    if (reducedMotion) {
      setDisplayNumber(target.toFixed(decimals));
      return;
    }

    if (!inView) {
      return;
    }

    let rafId = 0;
    const durationMs = 1100;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      // Cubic ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      setDisplayNumber(current.toFixed(decimals));

      if (progress < 1) {
        rafId = window.requestAnimationFrame(step);
      } else {
        setDisplayNumber(target.toFixed(decimals));
      }
    };

    rafId = window.requestAnimationFrame(step);
    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [inView, item.countUp, reducedMotion]);

  if (!item.countUp) {
    return <dd className="system-profile-value">{item.value}</dd>;
  }

  return (
    <dd className="system-profile-value">
      {item.countUp.prefix ?? ''}
      <span className="system-profile-counter">{displayNumber}</span>
      {item.countUp.suffix ?? ''}
    </dd>
  );
}

export function StoryChapters({ origin, becoming }: StoryChaptersProps) {
  const profileRef = useRef<HTMLDivElement>(null);
  const [profileInView, setProfileInView] = useState(false);
  const reducedMotion = Boolean(useReducedMotion());

  useEffect(() => {
    const node = profileRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setProfileInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section
        id={origin.id}
        className="os-module"
        aria-labelledby="origin-heading"
      >
        <HudFrame className="os-module-header">
          <div className="chapter-label">{origin.chapterLabel}</div>
          <h2 id="origin-heading" className="os-module-heading">
            {origin.heading}
          </h2>
        </HudFrame>

        <div className="origin-grid">
          <HudFrame className="hud-panel throughline-box" delay={0.05}>
            <span className="throughline-label">{origin.throughlineLabel}</span>
            <p className="throughline-text">{origin.throughline}</p>
          </HudFrame>

          <HudFrame className="origin-story" delay={0.1}>
            {origin.story.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </HudFrame>
        </div>

        <HudFrame className="hud-panel origin-who-panel" delay={0.12}>
          <span className="origin-who-label">{origin.whoIAmLabel}</span>
          <h3 className="origin-who-heading">{origin.whoIAmHeading}</h3>
          <ul className="hud-bullet-list">
            {origin.whoIAmPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </HudFrame>

        <HudFrame delay={0.15}>
          <div
            ref={profileRef}
            className="hud-panel system-profile-panel"
            aria-labelledby="system-profile-title"
          >
            <div className="system-profile-header">
              <h3 id="system-profile-title" className="system-profile-title">
                {origin.systemProfileHeading}
              </h3>
            </div>
            <dl className="system-profile-grid">
              {origin.systemProfile.map((item) => (
                <div
                  key={item.id}
                  className="system-profile-item"
                  data-testid={`profile-${item.id}`}
                >
                  <dt className="system-profile-label">{item.label}</dt>
                  <ProfileValue
                    item={item}
                    inView={profileInView}
                    reducedMotion={reducedMotion}
                  />
                </div>
              ))}
            </dl>
          </div>
        </HudFrame>
      </section>

      <div className="os-module-light-wrapper">
        <section
          id={becoming.id}
          className="os-module-light"
          aria-labelledby="becoming-heading"
        >
          <HudFrame className="os-module-header">
            <div className="chapter-label">{becoming.chapterLabel}</div>
            <h2 id="becoming-heading" className="os-module-heading">
              {becoming.heading}
            </h2>
          </HudFrame>

          <HudFrame className="becoming-card" delay={0.08}>
            <h3 className="becoming-quote">{becoming.quote}</h3>
            <ul className="becoming-points">
              {becoming.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </HudFrame>
        </section>
      </div>
    </>
  );
}
