import type { FooterContent } from '@/data/content';

interface FooterProps {
  content: FooterContent;
}

export function Footer({ content }: FooterProps) {
  return (
    <footer className="os-footer">
      <a
        href={content.backToTopHref}
        className="os-back-to-top"
        data-testid="link-back-top"
      >
        {content.backToTopLabel}
      </a>
    </footer>
  );
}
