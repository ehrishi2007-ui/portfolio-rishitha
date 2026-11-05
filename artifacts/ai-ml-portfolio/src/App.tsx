import { useEffect, type ReactNode } from 'react';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import { BootSequence } from '@/components/os/BootSequence';
import { Contact } from '@/components/os/Contact';
import { Cursor } from '@/components/os/Cursor';
import { Footer } from '@/components/os/Footer';
import { GrowthTimeline } from '@/components/os/GrowthTimeline';
import { Hero } from '@/components/os/Hero';
import { Nav } from '@/components/os/Nav';
import { ProjectList } from '@/components/os/ProjectList';
import { StoryChapters } from '@/components/os/StoryChapters';
import { Toolkit } from '@/components/os/Toolkit';
import { portfolioContent } from '@/data/content';
import { getOgImageUrl } from '@/lib/assets';
import NotFound from '@/pages/not-found';

function Home() {
  useEffect(() => {
    const ogUrl = getOgImageUrl();
    if (!ogUrl) return;
    const absoluteUrl = new URL(ogUrl, window.location.origin).href;
    const ogMeta = document.querySelector<HTMLMetaElement>(
      'meta[property="og:image"]',
    );
    const twitterMeta = document.querySelector<HTMLMetaElement>(
      'meta[name="twitter:image"]',
    );
    if (ogMeta) ogMeta.content = absoluteUrl;
    if (twitterMeta) twitterMeta.content = absoluteUrl;
  }, []);

  return (
    <div className="os-shell" id="top">
      <Cursor />
      <BootSequence content={portfolioContent.boot} />
      <Nav content={portfolioContent.nav} />
      <main>
        <Hero content={portfolioContent.hero} />
        <StoryChapters
          origin={portfolioContent.origin}
          becoming={portfolioContent.becoming}
        />
        <ProjectList section={portfolioContent.building} />
        <ProjectList section={portfolioContent.shipped} />
        <Toolkit content={portfolioContent.toolkit} />
        <GrowthTimeline content={portfolioContent.growth} />
        <Contact content={portfolioContent.contact} />
      </main>
      <Footer content={portfolioContent.footer} />
    </div>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

export default function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <Router />
    </WouterRouter>
  );
}
