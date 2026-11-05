import { useCallback, useEffect, useState } from 'react';
import type { BootSequenceContent } from '@/data/content';

interface BootSequenceProps {
  content: BootSequenceContent;
}

function shouldShowBoot(storageKey: string): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  try {
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return false;
    }
    return window.sessionStorage.getItem(storageKey) !== '1';
  } catch {
    return false;
  }
}

export function BootSequence({ content }: BootSequenceProps) {
  const [active, setActive] = useState<boolean>(() =>
    shouldShowBoot(content.storageKey),
  );
  const [fading, setFading] = useState(false);
  const [visibleLineCount, setVisibleLineCount] = useState(1);

  const dismiss = useCallback(() => {
    try {
      window.sessionStorage.setItem(content.storageKey, '1');
    } catch {
      // Ignore storage errors in restricted environments
    }
    setActive(false);
  }, [content.storageKey]);

  useEffect(() => {
    if (!active) {
      return;
    }

    try {
      window.sessionStorage.setItem(content.storageKey, '1');
    } catch {
      // Ignore storage errors
    }

    const timers: number[] = [];
    const totalLines = content.lines.length;
    const stepMs = 240;

    for (let i = 2; i <= totalLines; i += 1) {
      timers.push(
        window.setTimeout(() => {
          setVisibleLineCount(i);
        }, (i - 1) * stepMs),
      );
    }

    // Begin fade at 1150ms, unmount at 1450ms (<= 1.5s total)
    timers.push(
      window.setTimeout(() => {
        setFading(true);
      }, 1150),
    );
    timers.push(
      window.setTimeout(() => {
        setActive(false);
      }, 1450),
    );

    const onKeyDown = () => {
      dismiss();
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      timers.forEach((id) => window.clearTimeout(id));
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [active, content.lines.length, content.storageKey, dismiss]);

  if (!active) {
    return null;
  }

  return (
    <div
      className={`os-boot-overlay ${fading ? 'is-fading' : ''}`}
      role="status"
      aria-live="polite"
      aria-label={content.ariaLabel}
      onClick={dismiss}
      data-testid="boot-overlay"
    >
      <div className="hud-panel os-boot-terminal">
        <div className="os-boot-lines">
          {content.lines.slice(0, visibleLineCount).map((line) => (
            <div key={line} className="os-boot-line">
              {line}
            </div>
          ))}
        </div>
        <div className="os-boot-skip">{content.skipHint}</div>
      </div>
    </div>
  );
}
