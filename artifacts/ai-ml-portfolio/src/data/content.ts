export type ProjectSlug =
  | 'ekms'
  | 'civiq'
  | 'meru'
  | 'nlp-faq-chatbot'
  | 'translator'
  | 'jugaad'
  | 'isl-vocalizer'
  | 'flyrank-capstone';

export type SectionId =
  | 'origin'
  | 'future'
  | 'work'
  | 'shipped'
  | 'skills'
  | 'growth'
  | 'contact';

export interface NavItem {
  id: SectionId;
  label: string;
}

export interface NavContent {
  logo: string;
  homeAriaLabel: string;
  navAriaLabel: string;
  menuOpenAriaLabel: string;
  menuCloseAriaLabel: string;
  items: NavItem[];
  resumeLabel: string;
}

export interface BootSequenceContent {
  storageKey: string;
  ariaLabel: string;
  skipHint: string;
  lines: string[];
}

export interface HeroContent {
  introLine: string;
  headlineFirst: string;
  headlineSecond: string;
  subline: string;
  scrollCue: string;
  scrollTarget: string;
  avatarTypedLine: string;
  avatarRevealLabel: string;
  avatarCanvasAriaLabel: string;
}

export interface SystemProfileItem {
  id: 'location' | 'education' | 'cgpa' | 'focus' | 'status';
  label: string;
  value: string;
  countUp?: {
    prefix?: string;
    target: number;
    decimals: number;
    suffix?: string;
  };
}

export interface OriginContent {
  id: SectionId;
  chapterLabel: string;
  heading: string;
  throughlineLabel: string;
  throughline: string;
  story: string[];
  whoIAmLabel: string;
  whoIAmHeading: string;
  whoIAmPoints: string[];
  systemProfileHeading: string;
  systemProfile: SystemProfileItem[];
}

export interface BecomingContent {
  id: SectionId;
  chapterLabel: string;
  heading: string;
  quote: string;
  points: string[];
}

export interface ProjectItem {
  slug: ProjectSlug;
  index: string;
  title: string;
  subtitle?: string;
  outcome: string;
  keyMetric?: string;
  otherMetrics?: string;
  status: 'in-progress' | 'shipped';
  statusBadge: string;
  coverAlt: string;
  tags?: string[];
  githubUrl?: string;
  liveUrl?: string;
}

export interface ProjectSectionContent {
  id: SectionId;
  chapterLabel: string;
  heading: string;
  previewPlaceholder: string;
  metricLabel: string;
  viewCaseStudyLabel: string;
  closeCaseStudyLabel: string;
  closeCaseStudyAriaLabel: string;
  overviewHeading: string;
  metricsHeading: string;
  stackHeading: string;
  githubLabel: string;
  liveLabel: string;
  projects: ProjectItem[];
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface CertificationItem {
  title: string;
  issued: string;
}

export interface ToolkitContent {
  id: SectionId;
  chapterLabel: string;
  heading: string;
  subline: string;
  groups: SkillGroup[];
  certificationsHeading: string;
  certifications: CertificationItem[];
}

export interface TimelineItem {
  id: string;
  role: string;
  organization: string;
  period: string;
  description: string;
}

export interface GrowthContent {
  id: SectionId;
  chapterLabel: string;
  heading: string;
  entries: TimelineItem[];
}

export interface ContactLinkItem {
  id: 'email' | 'linkedin' | 'github';
  label: string;
  value: string;
  href: string;
  external?: boolean;
}

export interface ContactContent {
  id: SectionId;
  chapterLabel: string;
  heading: string;
  text: string;
  links: ContactLinkItem[];
}

export interface FooterContent {
  backToTopLabel: string;
  backToTopHref: string;
}

export interface PortfolioContent {
  boot: BootSequenceContent;
  nav: NavContent;
  hero: HeroContent;
  origin: OriginContent;
  becoming: BecomingContent;
  building: ProjectSectionContent;
  shipped: ProjectSectionContent;
  toolkit: ToolkitContent;
  growth: GrowthContent;
  contact: ContactContent;
  footer: FooterContent;
}

export const portfolioContent: PortfolioContent = {
  boot: {
    storageKey: 'rishitha_os_boot_v1',
    ariaLabel: 'System boot sequence',
    skipHint: '[PRESS ANY KEY OR CLICK TO SKIP]',
    lines: [
      '> INIT KERNEL // SYS.BOOT v2.6',
      '> MOUNTING NARRATIVE MODULES [01..07]',
      '> CALIBRATING NEURAL PARTICLE MESH...',
      '> SYSTEM ONLINE // READY',
    ],
  },

  nav: {
    logo: 'SR',
    homeAriaLabel: 'System Home',
    navAriaLabel: 'System modules navigation',
    menuOpenAriaLabel: 'Open navigation menu',
    menuCloseAriaLabel: 'Close navigation menu',
    items: [
      { id: 'origin', label: 'Origin' },
      { id: 'future', label: 'Becoming' },
      { id: 'work', label: 'Building' },
      { id: 'shipped', label: 'Shipped' },
      { id: 'skills', label: 'Toolkit' },
      { id: 'growth', label: 'Growth' },
      { id: 'contact', label: 'Contact' },
    ],
    resumeLabel: 'Resume ↗',
  },

  hero: {
    introLine: "Hey there, I'm Rishitha. Here is a look at my journey.",
    headlineFirst: 'I came for the break-ins.',
    headlineSecond: 'I stayed for the build-outs.',
    subline:
      'An AI/ML engineer in progress, drawn to the edge where thoughtful systems meet messy, human problems.',
    scrollCue: 'Follow the thread',
    scrollTarget: '#origin',
    avatarTypedLine:
      "> Hi, I'm the system avatar. Hover around, I'm watching.",
    avatarRevealLabel: 'REVEAL',
    avatarCanvasAriaLabel: 'Interactive coral particle avatar silhouette',
  },

  origin: {
    id: 'origin',
    chapterLabel: '01 / ORIGIN',
    heading: 'The first question was how do systems break?',
    throughlineLabel: 'The throughline',
    throughline:
      'I still start with curiosity: find the seams, understand the rules, then make them work for people.',
    story: [
      'I started with cybersecurity: breaking systems, defending them, learning where trust can fail.',
      'Then AI/ML pulled me in. It felt bigger. Less bounded. More like building the future than only protecting the present.',
    ],
    whoIAmLabel: 'Who I am now',
    whoIAmHeading: 'Curious by default, structured by habit.',
    whoIAmPoints: [
      "I push into problems that feel just out of reach; I've lost count of the late nights spent debugging one more thing before calling it done.",
      'Building alone only gets you so far. Some of my best ideas have come from conversations, mentoring sessions, and talking a problem through with someone else.',
      'I like staying organised amid all of it; systems and structure keep the chaos workable.',
      "Off the clock, I'm a huge Marvel fan, and dancing or music is usually how I reset.",
      "Three years into this field, and I still feel like I'm just getting started, which is the part I like most.",
    ],
    systemProfileHeading: 'SYSTEM PROFILE',
    systemProfile: [
      { id: 'location', label: 'Location', value: 'Hyderabad, India' },
      {
        id: 'education',
        label: 'Education',
        value: 'B.Tech CSE (AI & ML), HITAM, 3rd year',
        countUp: {
          prefix: 'B.Tech CSE (AI & ML), HITAM, ',
          target: 3,
          decimals: 0,
          suffix: 'rd year',
        },
      },
      {
        id: 'cgpa',
        label: 'CGPA',
        value: '9.09',
        countUp: {
          target: 9.09,
          decimals: 2,
        },
      },
      { id: 'focus', label: 'Focus', value: 'RAG and LLM systems' },
      { id: 'status', label: 'Status', value: 'Building in public' },
    ],
  },

  becoming: {
    id: 'future',
    chapterLabel: '02 / BECOMING',
    heading: 'Who I want to be.',
    quote: 'Someone who builds things that matter, not things that impress.',
    points: [
      'I want to build AI systems that solve real problems for real people: not novelty demos, but tools people actually rely on.',
      "I'm drawn to the parts of AI that are still being figured out: systems that reason and act, not just respond.",
      'Long-term, I want to go beyond using the tools of this field to understanding them deeply enough to help shape what comes next.',
    ],
  },

  building: {
    id: 'work',
    chapterLabel: '03 / BUILDING',
    heading: 'Ideas are useful when they move.',
    previewPlaceholder: 'PREVIEW COMING SOON',
    metricLabel: 'KEY METRIC',
    viewCaseStudyLabel: 'View case study',
    closeCaseStudyLabel: 'ESC / CLOSE',
    closeCaseStudyAriaLabel: 'Close case study panel',
    overviewHeading: 'OVERVIEW',
    metricsHeading: 'METRICS & NOTES',
    stackHeading: 'ARCHITECTURE FOCUS',
    githubLabel: 'GitHub ↗',
    liveLabel: 'Live Demo ↗',
    projects: [
      {
        slug: 'jugaad',
        index: '01',
        title: 'Jugaad',
        subtitle: 'Multimodal Route Planner',
        outcome:
          'Chains urban transit modes together into practical end-to-end commuter routes.',
        status: 'in-progress',
        statusBadge: 'URBAN MOBILITY',
        coverAlt: 'Jugaad multimodal transit route planner preview',
        githubUrl: '',
        liveUrl: '',
      },
      {
        slug: 'isl-vocalizer',
        index: '02',
        title: 'ISL Vocalizer',
        subtitle: 'Wearable Sign Language Interface',
        outcome:
          'A wearable smart glove for Indian Sign Language recognition.',
        status: 'in-progress',
        statusBadge: 'WEARABLE ML',
        coverAlt: 'ISL Vocalizer wearable sign language interface preview',
        githubUrl: '',
        liveUrl: '',
      },
      {
        slug: 'flyrank-capstone',
        index: '03',
        title: 'Backend AI Track Capstone',
        subtitle: 'Week 8 Engineering Capstone',
        outcome:
          'Production backend capstone system integrating asynchronous job queues and usage metering.',
        status: 'in-progress',
        statusBadge: 'WEEK 8 CAPSTONE',
        coverAlt: 'Backend AI engineering track capstone preview',
        githubUrl: '',
        liveUrl: '',
      },
    ],
  },

  shipped: {
    id: 'shipped',
    chapterLabel: '04 / SHIPPED',
    heading: 'Proof lives in the details.',
    previewPlaceholder: 'PREVIEW COMING SOON',
    metricLabel: 'KEY METRIC',
    viewCaseStudyLabel: 'View case study',
    closeCaseStudyLabel: 'ESC / CLOSE',
    closeCaseStudyAriaLabel: 'Close case study panel',
    overviewHeading: 'OVERVIEW',
    metricsHeading: 'METRICS & EVALUATION',
    stackHeading: 'SYSTEM COMPONENTS',
    githubLabel: 'GitHub ↗',
    liveLabel: 'Live Demo ↗',
    projects: [
      {
        slug: 'ekms',
        index: '01',
        title: 'EKMS',
        subtitle: 'Enterprise Knowledge Management System',
        outcome:
          'Document Q&A platform supporting 11 file formats with Vision OCR, page-level citations and role-based access (RLS, JWT).',
        keyMetric: '84.1% Precision@K',
        otherMetrics:
          '94.3% Hit@K, 86.7% faithfulness score, 0% error rate across a 53-query live evaluation using MiniLM + lexical fusion.',
        status: 'shipped',
        statusBadge: 'DOC Q&A',
        coverAlt:
          'EKMS Knowledge Hub interface answering an attendance policy question with page-level document citations',
        tags: [
          'Gemini Vision OCR',
          'MiniLM Cross-Encoder',
          'Row-Level Security (RLS)',
          'JWT Auth',
          'Page-Level Citations',
        ],
        githubUrl: '',
        liveUrl: '',
      },
      {
        slug: 'civiq',
        index: '02',
        title: 'CIVIQ',
        subtitle:
          'Government Scheme Intelligence Platform (Smart India Hackathon 2026, Team Ravens)',
        outcome:
          'Matches citizens to government schemes with a deterministic eligibility engine and clause-cited answers (6-scheme prototype).',
        keyMetric: '96 automated tests',
        otherMetrics:
          'Integrates Gemini File API, Tavily Search and Google Cloud Translation.',
        status: 'shipped',
        statusBadge: 'SIH 2026',
        coverAlt:
          'CIVIQ Scheme Dashboard showing citizen eligibility matches and match scores for PM-KISAN, PMEGP, and WARB',
        tags: [
          'Deterministic Eligibility Engine',
          'Gemini File API',
          'Tavily Search',
          'Google Cloud Translation',
          'Clause-Cited Answers',
        ],
        githubUrl: '',
        liveUrl: '',
      },
      {
        slug: 'meru',
        index: '03',
        title: 'Meru',
        subtitle: 'Real-Time Posture Detection and AI Ergonomics Coach',
        outcome:
          'Live posture tracking and spine-angle telemetry on a desktop client-server architecture with AI-generated coaching reports.',
        keyMetric: '~25-45 ms inference',
        status: 'shipped',
        statusBadge: 'DESKTOP VISION',
        coverAlt:
          'Meru ergonomics dashboard showing a 94% posture score, 164.2 degree spine angle, 7-day trend chart, and AI coach feedback',
        tags: [
          'Electron Desktop Runtime',
          'Pose Landmark Telemetry',
          'Ergonomics Coaching Reports',
          'SQLite Session Sync',
        ],
        githubUrl: '',
        liveUrl: '',
      },
      {
        slug: 'nlp-faq-chatbot',
        index: '04',
        title: 'NLP FAQ Chatbot',
        outcome:
          'Vector-similarity FAQ assistant with confidence scoring, input validation and rate limiting.',
        keyMetric: 'Cosine similarity',
        status: 'shipped',
        statusBadge: 'NLP ASSISTANT',
        coverAlt:
          'NLP FAQ Chatbot interface displaying suggested questions and automated answers with confidence percentages',
        tags: [
          'TF-IDF Vectorization',
          'Confidence Thresholding',
          'NLTK Preprocessing',
          'Rate Limiting',
        ],
        githubUrl: '',
        liveUrl: '',
      },
      {
        slug: 'translator',
        index: '05',
        title: 'Multi-language Translator',
        outcome:
          'Cross-lingual web translator using the MyMemory REST interface, with speech synthesis and request throttling.',
        keyMetric: '20+ languages',
        status: 'shipped',
        statusBadge: 'SPEECH & TEXT',
        coverAlt:
          'Multi-language Translator interface translating English text into Telugu script with audio playback and download options',
        tags: [
          'MyMemory Translation API',
          'gTTS Speech Synthesis',
          'Character Quota Guard',
          'Audio Stream Export',
        ],
        githubUrl: '',
        liveUrl: '',
      },
    ],
  },

  toolkit: {
    id: 'skills',
    chapterLabel: '05 / TOOLKIT',
    heading: 'A stack is only as good as its judgment.',
    subline: 'The technical layer matters. So does knowing why.',
    groups: [
      {
        category: 'Programming',
        items: ['Python', 'SQL', 'JavaScript', 'HTML', 'CSS'],
      },
      {
        category: 'Backend and Data',
        items: [
          'FastAPI',
          'REST APIs',
          'PostgreSQL',
          'Supabase',
          'Docker',
          'Git',
        ],
      },
      {
        category: 'AI / ML',
        items: [
          'Machine Learning',
          'NLP',
          'Generative AI',
          'Hybrid Retrieval (BM25 + embeddings)',
          'RAG Evaluation (RAGAS, MRR)',
          'Prompt Engineering',
          'LangChain',
          'ChromaDB',
        ],
      },
      {
        category: 'Frontend and Tools',
        items: [
          'React.js',
          'Streamlit',
          'OpenCV',
          'MediaPipe',
          'Scikit-learn',
          'NumPy',
          'Pandas',
        ],
      },
      {
        category: 'Soft skills',
        items: [
          'Leadership',
          'Mentoring',
          'Communication',
          'Teamwork',
          'Problem-solving',
        ],
      },
    ],
    certificationsHeading: 'CERTIFICATIONS',
    certifications: [
      { title: 'Microsoft Azure AI Essentials', issued: 'Jul 2026' },
      { title: 'Claude Platform 101', issued: 'Jul 2026' },
      { title: 'Claude 101', issued: 'Jul 2026' },
      { title: 'AI Skills Fest 2026', issued: 'Jul 2026' },
      { title: 'AWS Fundamentals of ML & AI', issued: 'Mar 2026' },
      { title: 'Infosys Springboard Intro to NLP', issued: 'Mar 2026' },
      { title: 'IBM Project Management Fundamentals', issued: 'Sep 2025' },
    ],
  },

  growth: {
    id: 'growth',
    chapterLabel: '06 / GROWTH',
    heading: 'Learning the work behind the work.',
    entries: [
      {
        id: 'flyrank-ai',
        role: 'Backend AI Engineer Intern',
        organization: 'FlyRank AI',
        period: 'Jun 2026 - Oct 2026',
        description:
          'Built CRUD services connected to a relational database, containerised the stack, implemented authentication with protected routes, and built a polite web scraper. Training also covers model API integration, background jobs and usage metering.',
      },
      {
        id: 'csm-hod',
        role: 'CSM Student HOD (SSG)',
        organization: 'Student Success Group',
        period: 'May 2026 - present',
        description:
          'Lead Student Faculty, Mentors and Coordinators; organise SSG days and technical and cultural events.',
      },
      {
        id: 'ieom-hitam',
        role: 'Deputy Secretary',
        organization: 'IEOM Student Chapter',
        period: 'May 2026 - present',
        description:
          'Support chapter operations, coordination and documentation.',
      },
      {
        id: 'codealpha',
        role: 'AI Intern',
        organization: 'CodeAlpha',
        period: 'Apr 2026 - May 2026',
        description:
          'Delivered automated customer-support and cross-lingual communication web applications during an intensive machine learning internship.',
      },
      {
        id: 'iucee-ewb',
        role: 'Member',
        organization: 'IUCEE-EWB Student Chapter',
        period: 'Mar 2026 - present',
        description:
          'Community-based engineering projects, including hands-on prototyping and stakeholder interaction.',
      },
      {
        id: 'student-faculty',
        role: 'Student Faculty',
        organization: 'Peer Academic Mentorship',
        period: 'May 2025 - Apr 2026',
        description:
          'Mentored junior students, resolved subject doubts and ran peer-learning sessions.',
      },
      {
        id: 'for-a-cause',
        role: 'Student Volunteer',
        organization: 'For A Cause Social Welfare Association',
        period: 'Sep 2025 - Jun 2026',
        description:
          'Contributed time and energy to social welfare initiatives.',
      },
    ],
  },

  contact: {
    id: 'contact',
    chapterLabel: '07 / CONTACT',
    heading: 'Have a hard problem?',
    text: 'Open to collaborating on useful AI, careful backend systems, and conversations about the questions this field is still learning how to answer.',
    links: [
      {
        id: 'email',
        label: 'EMAIL',
        value: 'prishitha12007@gmail.com',
        href: 'mailto:prishitha12007@gmail.com',
      },
      {
        id: 'linkedin',
        label: 'LINKEDIN',
        value: 'LinkedIn',
        href: 'https://www.linkedin.com/in/sai-jyothi-rishitha-p-b51386329',
        external: true,
      },
      {
        id: 'github',
        label: 'GITHUB',
        value: 'https://github.com/ehrishi2007-ui',
        href: 'https://github.com/ehrishi2007-ui',
        external: true,
      },
    ],
  },

  footer: {
    backToTopLabel: 'Back to top ↑',
    backToTopHref: '#top',
  },
};
