/* ============================================================
   PROJECTS DATA
   Verified Projects Built in 2026
   Order: 1. RouteVeda, 2. FinvisIQ, 3. Smart Hospital, 4. QuoteVerse
   ============================================================ */

const projects = [
  {
    id: 1,
    title: 'RouteVeda',
    shortTitle: 'RouteVeda',
    year: '2026',
    description: 'An intelligent full-stack travel discovery and trip planning platform for exploring destinations across India, powered by PostgreSQL PostGIS geospatial queries.',
    problem: 'Travelers struggle with scattered itinerary tools and lack intelligent proximity-based discovery for regional heritage sites and budget estimation.',
    technologies: [
      'Angular', 'TypeScript', 'Angular Signals', 'Bootstrap 5', 'Node.js', 'Express.js',
      'PostgreSQL', 'PostGIS', 'Google Places API', 'Wikimedia Commons API'
    ],
    features: [
      'State-wise destination exploration & filtering',
      'PostGIS geospatial proximity discovery',
      'Interactive smart trip builder & itinerary planner',
      'Real-time budget estimation module',
      'Wishlist, user reviews & recommendation engine',
      'JWT Authentication & user profiles',
      'Liquid Glass responsive dark/light UI',
    ],
    image: '/projects/tripforge.png',
    github: 'https://github.com/akileshanand302006-sketch/RouteVeda-Intelligent-Travel-Discovery-Adventure-Planner',
    demo: '',
    featured: true,
    category: 'Full-Stack & Geospatial',
    color: '#06b6d4',
  },
  {
    id: 2,
    title: 'FinvisIQ',
    shortTitle: 'FinvisIQ',
    year: '2026',
    description: 'A comprehensive standalone Java financial visualization and intelligence desktop system built with Core Java, JavaFX, OOP patterns, and MySQL.',
    problem: 'Users need a secure, offline-capable, robust desktop application to track complex income streams, analyze budget variance, and generate predictive financial reports without cloud exposure.',
    technologies: [
      'Java', 'JavaFX', 'OOP Architecture', 'JDBC', 'MySQL', 'Java Concurrency', 'Custom Charting'
    ],
    features: [
      'Multi-category income and expense tracking',
      'Real-time financial analytics & dynamic charts',
      'Monthly budget allocation & variance alerts',
      'Custom transaction search, filters & export',
      'Relational database persistence via JDBC',
      'Clean Model-View-Controller (MVC) architecture',
    ],
    image: '/projects/finora.png',
    github: 'https://github.com/akileshanand302006-sketch/FinvisIQ-Personal-Finance-Intelligence-Platform',
    demo: '',
    featured: true,
    category: 'Java Desktop Application',
    color: '#8b5cf6',
  },
  {
    id: 3,
    title: 'Smart Hospital Bed Management System',
    shortTitle: 'Smart Hospital',
    year: '2026',
    description: 'A hybrid hospital resource management system combining an 8086 Assembly core allocation engine with a modern web interface for real-time triage and bed monitoring.',
    problem: 'Hospitals require instant, deterministic resource allocation during high-urgency admissions. Traditional manual logging is slow and vulnerable to bottleneck errors.',
    technologies: [
      '8086 Assembly', 'EMU8086', 'PHP', 'MySQL', 'JavaScript', 'HTML5', 'CSS3', 'File I/O'
    ],
    features: [
      'Priority-based triage & MEWS assessment',
      '8086 Assembly core allocation engine',
      'Automated ICU & general bed assignment',
      'Real-time resource tracking dashboard',
      'Emergency admission & discharge protocols',
      'Bi-directional file-based ASM polling bridge',
      'Web-based staff control console',
    ],
    image: '/projects/hospital.png',
    github: '',
    demo: '',
    featured: true,
    category: 'Systems + Web Integration',
    color: '#3b82f6',
  },
  {
    id: 4,
    title: 'QuoteVerse',
    shortTitle: 'QuoteVerse',
    year: '2026',
    description: 'An interactive modern quote discovery and inspiration platform built with React, Vite, and Node.js, featuring mood-based recommendations and a creative studio.',
    problem: 'Existing quote collections are static text lists. QuoteVerse reimagines inspiration as an interactive, personalized discovery experience.',
    technologies: [
      'React', 'Vite', 'JavaScript', 'Bootstrap', 'Node.js', 'Express.js', 'MySQL'
    ],
    features: [
      'Mood-based quote exploration & smart filters',
      'Daily Quote Challenge & Quote Roulette wheel',
      'Quote Studio for custom typography & card export',
      'Read-aloud voice synthesis integration',
      'Favorites bookmarking & exploration history',
      'Command Palette & keyboard navigation',
      'Light/Dark liquid theme engine',
    ],
    image: '/projects/quoteverse.png',
    github: 'https://github.com/akileshanand302006-sketch/QuoteVerse-A-Universe-of-Inspiration',
    demo: '',
    featured: true,
    category: 'Full-Stack Web Application',
    color: '#f59e0b',
  },
];

export default projects;
