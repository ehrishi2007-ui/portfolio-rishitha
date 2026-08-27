import { useEffect, useRef, useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  Activity,
  ArrowDown,
  ArrowUpRight,
  BrainCircuit,
  ChevronDown,
  Download,
  Github,
  Layers3,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Route as RouteIcon,
  Terminal,
  X,
} from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

const profileLinks = {
  email: 'mailto:your.email@example.com',
  linkedin: 'https://www.linkedin.com/in/your-profile',
  github: 'https://github.com/your-username',
  resume: '/resume.md',
};

const sections = [
  { id: 'origin', label: 'Origin' },
  { id: 'work', label: 'Building' },
  { id: 'shipped', label: 'Shipped' },
  { id: 'skills', label: 'Toolkit' },
  { id: 'growth', label: 'Growth' },
  { id: 'contact', label: 'Contact' },
];

function Reveal({
  children,
  className = '',
  delay = '',
}: {
  children: ReactNode;
  className?: string;
  delay?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${delay} ${visible ? 'is-visible' : ''} ${className}`}>
      {children}
    </div>
  );
}

function ProgressRail({ activeSection, progress }: { activeSection: string; progress: number }) {
  return (
    <aside className="progress-rail" aria-label="Page progress">
      <div className="progress-fill" style={{ height: `${Math.max(4, Math.min(100, progress))}%` }} />
      {sections.map((section, index) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          aria-label={`Jump to ${section.label}`}
          data-testid={`link-progress-${section.id}`}
          className={`progress-dot ${activeSection === section.id ? 'is-active' : ''}`}
          style={{ top: `${((index + 1) / (sections.length + 1)) * 100}%` }}
        />
      ))}
    </aside>
  );
}

function Topbar({ menuOpen, setMenuOpen }: { menuOpen: boolean; setMenuOpen: (open: boolean) => void }) {
  const closeMenu = () => setMenuOpen(false);
  return (
    <header className="topbar">
      <a className="monogram" href="#top" onClick={closeMenu} data-testid="link-home">
        <span className="monogram-mark">AK</span>
        <span>AI / ML ENGINEER</span>
      </a>
      <nav className={`topnav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
        {sections.map((section) => (
          <a key={section.id} href={`#${section.id}`} onClick={closeMenu} data-testid={`link-nav-${section.id}`}>
            {section.label}
          </a>
        ))}
        <a href={profileLinks.resume} download onClick={closeMenu} data-testid="link-nav-resume">Resume ↗</a>
      </nav>
      <button
        className="menu-button"
        type="button"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(!menuOpen)}
        data-testid="button-menu"
      >
        {menuOpen ? <X size={19} strokeWidth={1.5} /> : <Menu size={19} strokeWidth={1.5} />}
      </button>
    </header>
  );
}

const activeProjects = [
  {
    number: '01',
    title: 'EKMS',
    type: 'Enterprise Knowledge Management System',
    detail: 'A RAG-based document Q&A platform that makes internal knowledge easier to find, question, and trust.',
    tags: ['RAG', 'Document Q&A', 'Backend'],
    icon: <Layers3 size={20} strokeWidth={1.4} />,
  },
  {
    number: '02',
    title: 'Jugaad',
    type: 'Multimodal Route Planner',
    detail: 'A route planner that chains transit modes together for smarter urban commuting, not just the shortest route.',
    tags: ['Multimodal', 'Urban mobility', 'Routing'],
    icon: <RouteIcon size={20} strokeWidth={1.4} />,
  },
  {
    number: '03',
    title: 'ISL Vocalizer',
    type: 'Wearable Sign Language Interface',
    detail: 'A smart glove recognizing Indian Sign Language in real time and translating movement into a voice-ready interface.',
    tags: ['Computer vision', 'Wearables', 'Real-time'],
    icon: <Activity size={20} strokeWidth={1.4} />,
  },
];

const shippedProjects = [
  {
    number: '01 / 03',
    title: 'Posture Detection App',
    description: 'Full-stack posture tracking with AI coaching.',
    tags: ['FastAPI', 'React'],
  },
  {
    number: '02 / 03',
    title: 'NLP FAQ Chatbot',
    description: 'Question-answering that stays direct and useful.',
    tags: ['Python', 'Streamlit'],
  },
  {
    number: '03 / 03',
    title: 'Multilingual Translator',
    description: '20+ languages, speech features, and confidence cues.',
    tags: ['Python', 'Streamlit'],
  },
];

const skillGroups = [
  ['Programming', 'Python · JavaScript'],
  ['Frameworks & Tools', 'FastAPI · React.js · Streamlit · Git'],
  ['AI / ML', 'Machine Learning · NLP · Generative AI · Prompt Engineering'],
  ['Soft Skills', 'Leadership · Mentoring · Cross-functional Communication · Structured Problem-Solving'],
];

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openProject, setOpenProject] = useState('EKMS');
  const [activeSection, setActiveSection] = useState('origin');
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const midpoint = window.scrollY + window.innerHeight * 0.36;
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0);
      let current = sections[0].id;
      sections.forEach((section) => {
        const node = document.getElementById(section.id);
        if (node && node.offsetTop <= midpoint) current = section.id;
      });
      setActiveSection(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="site-shell" id="top">
      <ProgressRail activeSection={activeSection} progress={scrollProgress} />
      <Topbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <Reveal>
              <div className="eyebrow">A field note from Hyderabad</div>
            </Reveal>
            <Reveal delay="reveal-delay-1">
              <h1 id="hero-title">I break things<br />to <em>build</em> better ones.</h1>
            </Reveal>
            <Reveal delay="reveal-delay-2">
              <p className="hero-intro">
                An AI/ML engineer in progress — drawn to the edge where thoughtful systems meet messy, human problems.
              </p>
              <div className="hero-meta">
                <span><MapPin size={13} strokeWidth={1.4} /> <b>Hyderabad, India</b></span>
                <span><BrainCircuit size={13} strokeWidth={1.4} /> <b>3rd-year B.Tech AI &amp; ML / HITAM</b></span>
                <span><Terminal size={13} strokeWidth={1.4} /> <b>Building in public</b></span>
              </div>
            </Reveal>
          </div>
          <a href="#origin" className="scroll-cue" data-testid="link-scroll-origin">Follow the thread <ArrowDown size={14} strokeWidth={1.3} /></a>
        </section>

        <section className="section" id="origin" aria-labelledby="origin-title">
          <div className="section-heading">
            <Reveal><div className="section-index">01 <span>/ origin</span></div></Reveal>
            <Reveal delay="reveal-delay-1"><h2 id="origin-title">The first question was<br /><strong>how do systems break?</strong></h2></Reveal>
          </div>
          <div className="story-grid">
            <Reveal><div className="story-note"><strong>Before the models</strong>Curiosity has always started with the mechanism. Find the seams. Understand the rules. Then make them work for people.</div></Reveal>
            <Reveal delay="reveal-delay-1">
              <div className="story-body">
                <p>I started with cybersecurity — breaking systems, defending them, learning where trust can fail.</p>
                <p>Then AI/ML pulled me in. It felt bigger. Less bounded. More like building the future than only protecting the present.</p>
              </div>
            </Reveal>
          </div>
          <Reveal delay="reveal-delay-2">
            <div className="present-note">
              <span>Who I am now</span>
              <p>I’m a 3rd-year B.Tech AI &amp; ML student at HITAM, Hyderabad (CGPA 9.09), and a Backend AI Engineer Intern at FlyRank AI. I’m learning how real AI applications get built end-to-end — beyond model calls, into APIs, data flow, evaluation, and structured outputs.</p>
            </div>
          </Reveal>
          <Reveal delay="reveal-delay-2">
            <div className="stat-strip" aria-label="Current profile">
              <div className="stat" data-testid="stat-year"><span className="stat-value">03</span><span className="stat-label">Year of B.Tech</span></div>
              <div className="stat" data-testid="stat-cgpa"><span className="stat-value">9.09</span><span className="stat-label">CGPA / HITAM</span></div>
              <div className="stat" data-testid="stat-focus"><span className="stat-value">AI</span><span className="stat-label">Current focus</span></div>
              <div className="stat" data-testid="stat-city"><span className="stat-value">HYD</span><span className="stat-label">Where I work</span></div>
            </div>
          </Reveal>
        </section>

        <section className="section" id="work" aria-labelledby="work-title">
          <div className="section-heading">
            <Reveal><div className="section-index">02 <span>/ in motion</span></div></Reveal>
            <Reveal delay="reveal-delay-1"><h2 id="work-title">Ideas are useful<br />when they <strong>move.</strong></h2></Reveal>
          </div>
          <Reveal><div className="project-list">
            {activeProjects.map((project) => {
              const isOpen = openProject === project.title;
              return (
                <article className={`project-card building-card ${isOpen ? 'is-open' : ''}`} key={project.title} data-testid={`card-project-${project.number}`}>
                  <button className="project-trigger" type="button" aria-expanded={isOpen} onClick={() => setOpenProject(isOpen ? '' : project.title)} data-testid={`button-expand-${project.number}`}>
                    <span className="project-number">{project.number}</span>
                    <span>
                      <span className="project-title">{project.title}</span>
                      <span className="project-type">{project.type}</span>
                    </span>
                    <span className="project-arrow" aria-hidden="true">{isOpen ? <X size={19} strokeWidth={1.3} /> : <ChevronDown size={19} strokeWidth={1.3} />}</span>
                  </button>
                  {isOpen && <div className="project-detail"><p>{project.detail}</p><div className="tag-row">{project.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div></div>}
                  <div className="build-track" aria-hidden="true" />
                  <div className="build-caption"><span>{project.icon} currently building</span><span>work in motion / 2024—25</span></div>
                </article>
              );
            })}
          </div></Reveal>
        </section>

        <section className="section" id="shipped" aria-labelledby="shipped-title">
          <div className="section-heading">
            <Reveal><div className="section-index">03 <span>/ shipped</span></div></Reveal>
            <Reveal delay="reveal-delay-1"><h2 id="shipped-title">Proof lives in<br /><strong>the details.</strong></h2></Reveal>
          </div>
          <Reveal>
            <div className="shipped-grid">
              {shippedProjects.map((project, index) => (
                <article className={`shipped-card ${index === 0 ? 'featured' : ''}`} key={project.title} data-testid={`card-shipped-${index + 1}`}>
                  <span className="shipped-index">{project.number}</span>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="tag-row">{project.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
                </article>
              ))}
            </div>
          </Reveal>
        </section>

        <section className="section" id="skills" aria-labelledby="skills-title">
          <div className="section-heading">
            <Reveal><div className="section-index">04 <span>/ toolkit</span></div></Reveal>
            <Reveal delay="reveal-delay-1"><h2 id="skills-title">A stack is only<br />as good as its <strong>judgment.</strong></h2></Reveal>
          </div>
          <div className="skills-layout">
            <Reveal><div className="skill-intro">The technical layer matters.<br /><span>So does knowing why.</span></div></Reveal>
            <Reveal delay="reveal-delay-1">
              <div className="skill-groups">
                {skillGroups.map(([label, skills]) => <div className="skill-group" key={label}><h3>{label}</h3><p>{skills}</p></div>)}
              </div>
            </Reveal>
          </div>
        </section>

        <section className="section" id="growth" aria-labelledby="growth-title">
          <div className="section-heading">
            <Reveal><div className="section-index">05 <span>/ growth log</span></div></Reveal>
            <Reveal delay="reveal-delay-1"><h2 id="growth-title">Learning the work<br />behind the <strong>work.</strong></h2></Reveal>
          </div>
          <div className="timeline">
            <Reveal><div className="timeline-item"><div className="timeline-meta"><strong>Now / internship</strong>FlyRank AI</div><div className="timeline-content"><h3>Backend AI Engineer Intern</h3><p>Learning how real AI applications are built end-to-end on the backend — beyond model calls.</p></div></div></Reveal>
            <Reveal delay="reveal-delay-1"><div className="timeline-item"><div className="timeline-meta"><strong>Campus / leadership</strong>HITAM</div><div className="timeline-content"><h3>CSM Student HOD (SSG)</h3><p>Coordinating students, faculty, and mentors while shaping workshops around industry-aligned learning.</p></div></div></Reveal>
            <Reveal delay="reveal-delay-1"><div className="timeline-item"><div className="timeline-meta"><strong>Operations / chapter</strong>IEOM HITAM</div><div className="timeline-content"><h3>Deputy Secretary</h3><p>Supporting the student chapter’s operations and turning plans into shared momentum.</p></div></div></Reveal>
            <Reveal delay="reveal-delay-2"><div className="timeline-item"><div className="timeline-meta"><strong>Community / engineering</strong>IUCEE-EWB</div><div className="timeline-content"><h3>Member</h3><p>Collaborating on community engineering projects where technical choices have human weight.</p></div></div></Reveal>
          </div>
        </section>

        <section className="section contact" id="contact" aria-labelledby="contact-title">
          <div className="section-heading">
            <Reveal><div className="section-index">06 <span>/ open line</span></div></Reveal>
          </div>
          <div className="contact-inner">
            <Reveal><h2 id="contact-title">Have a hard<br /><em>problem?</em></h2></Reveal>
            <Reveal delay="reveal-delay-1">
              <div className="contact-aside">
                <p>I’m interested in useful AI, careful backend systems, and conversations that start before the answer is obvious.</p>
                <div className="contact-links">
                  <a className="contact-link" href={profileLinks.email} data-testid="link-email"><span><Mail size={14} strokeWidth={1.4} />&nbsp; Email me</span><span><ArrowUpRight size={16} strokeWidth={1.3} /></span></a>
                  <a className="contact-link" href={profileLinks.linkedin} target="_blank" rel="noreferrer" data-testid="link-linkedin"><span><Linkedin size={14} strokeWidth={1.4} />&nbsp; LinkedIn</span><span><ArrowUpRight size={16} strokeWidth={1.3} /></span></a>
                  <a className="contact-link" href={profileLinks.github} target="_blank" rel="noreferrer" data-testid="link-github"><span><Github size={14} strokeWidth={1.4} />&nbsp; GitHub</span><span><ArrowUpRight size={16} strokeWidth={1.3} /></span></a>
                  <a className="contact-link" href={profileLinks.resume} download data-testid="link-resume"><span><Download size={14} strokeWidth={1.4} />&nbsp; Download resume</span><span><ArrowDown size={16} strokeWidth={1.3} /></span></a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="footer">
        <span>AI & ML / building in public</span>
        <span>Built with curiosity, not certainty.</span>
        <a href="#top" data-testid="link-back-top">Back to top ↑</a>
      </footer>
    </div>
  );
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

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;