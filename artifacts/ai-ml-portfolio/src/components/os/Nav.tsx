import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { NavContent, SectionId } from '@/data/content';
import { getResumeUrl } from '@/lib/assets';

interface NavProps {
  content: NavContent;
}

export function Nav({ content }: NavProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState<SectionId | null>(null);
  const closeMenu = () => setMenuOpen(false);
  const resumeHref = getResumeUrl();

  useEffect(() => {
    const elements = content.items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const visibleMap = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleMap.set(entry.target.id, entry.intersectionRatio);
          } else {
            visibleMap.delete(entry.target.id);
          }
        });

        if (visibleMap.size === 0) {
          if (window.scrollY < 260) {
            setActiveId(null);
          }
          return;
        }

        let bestId: string | null = null;
        let bestRatio = -1;
        visibleMap.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        });

        if (bestId) {
          setActiveId(bestId as SectionId);
        }
      },
      {
        rootMargin: '-20% 0px -45% 0px',
        threshold: [0, 0.15, 0.35, 0.6],
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [content.items]);

  return (
    <header className="os-nav">
      <a
        href="#top"
        className="os-logo"
        aria-label={content.homeAriaLabel}
        onClick={closeMenu}
        data-testid="link-home"
      >
        {content.logo}
      </a>

      <nav
        className={`os-nav-links ${menuOpen ? 'is-open' : ''}`}
        aria-label={content.navAriaLabel}
      >
        {content.items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`os-nav-link ${isActive ? 'is-active' : ''}`}
              aria-current={isActive ? 'location' : undefined}
              onClick={closeMenu}
              data-testid={`link-nav-${item.id}`}
            >
              {item.label}
            </a>
          );
        })}
        <a
          href={resumeHref}
          target="_blank"
          rel="noopener noreferrer"
          className="os-nav-resume"
          onClick={closeMenu}
          data-testid="link-nav-resume"
        >
          {content.resumeLabel}
        </a>
      </nav>

      <button
        type="button"
        className="os-menu-toggle"
        aria-label={menuOpen ? content.menuCloseAriaLabel : content.menuOpenAriaLabel}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((prev) => !prev)}
        data-testid="button-menu"
      >
        {menuOpen ? <X size={18} strokeWidth={1.75} /> : <Menu size={18} strokeWidth={1.75} />}
      </button>
    </header>
  );
}
