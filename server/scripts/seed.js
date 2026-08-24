import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dns from 'dns';

// Ensure Google Public DNS is used for reliable Atlas SRV lookups on Windows
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch {}

import { connectDB } from '../src/config/database.js';
import Profile from '../src/models/Profile.js';
import Project from '../src/models/Project.js';
import Skill from '../src/models/Skill.js';
import Experience from '../src/models/Experience.js';
import CodingProfile from '../src/models/CodingProfile.js';
import SocialLink from '../src/models/SocialLink.js';
import Achievement from '../src/models/Achievement.js';

dotenv.config();

const profileData = {
  name: 'Akilesh A',
  firstName: 'Akilesh',
  lastName: 'A',
  title: 'M.Sc Software Systems (3rd Year) • Developer',
  college: 'Coimbatore Institute of Technology, Coimbatore, Tamil Nadu, India',
  degree: "M.Sc Software Systems (3rd Year - Integrated 5-Year Master's Degree)",
  tagline: 'Pursuing M.Sc Software Systems at CIT Coimbatore • Building thoughtful full-stack platforms, Core Java systems, and intelligent digital solutions.',
  bio: "I am currently pursuing my 3rd year of M.Sc Software Systems (Integrated 5-Year Master's Degree) at Coimbatore Institute of Technology (CIT), Coimbatore, Tamil Nadu, India. As an aspiring software systems and full-stack engineer, I specialize in translating complex algorithmic, architectural, and database challenges into practical, high-performance software. My technical experience spans low-level systems (8086 Assembly), enterprise Java applications (FinvisIQ), intelligent geospatial platforms (RouteVeda), and reactive modern web technologies.",
  highlights: [
    'M.Sc Software Systems (3rd Year)',
    'Coimbatore Institute of Technology (CIT)',
    'Coimbatore, Tamil Nadu, India',
    'Full-Stack & Java Systems Engineer',
  ],
  interests: [
    'Software Systems Engineering',
    'Full-Stack Web Development',
    'Core Java & Object-Oriented Design',
    'Geospatial Intelligence (PostGIS)',
    'Low-Level Systems & Assembly',
    'Database Architecture & Optimization',
  ],
  stats: [
    { label: 'Projects Built', value: 4, suffix: '' },
    { label: 'Core Technologies', value: 16, suffix: '+' },
    { label: 'Problems Solved', value: 150, suffix: '+' },
    { label: 'Active Year', value: 2026, suffix: '' },
  ],
  email: 'akileshanand302006@gmail.com',
  phone: '+91 9361314903',
  location: 'Coimbatore, Tamil Nadu, India',
  availability: 'Open to Internship Opportunities (2026)',
  github: 'https://github.com/akileshanand302006-sketch',
  linkedin: 'https://www.linkedin.com/in/akilesh-a-37444a320',
  leetcode: 'https://leetcode.com/u/Akilesh303/',
};

const projectsData = [
  {
    title: 'RouteVeda',
    slug: 'routeveda',
    subtitle: 'Intelligent Travel Discovery & Itinerary Planner',
    description: 'An AI-powered travel discovery platform providing curated itineraries, dynamic destination maps, budget optimization, and interactive travel journals for modern explorers.',
    longDescription: 'RouteVeda transforms trip planning by integrating geospatial discovery with customizable travel schedules. Built with React and interactive mapping engines, it features real-time weather forecasts, dynamic day-by-day route generation, and collaborative travel planning tools.',
    category: 'Full-Stack Web Applications',
    year: '2026',
    status: 'Completed',
    featured: true,
    order: 1,
    tags: ['React', 'Geospatial API', 'TailwindCSS', 'Vite', 'Node.js'],
    technologies: ['React', 'Vite', 'Leaflet', 'OpenStreetMap', 'CSS3', 'Node.js'],
    features: [
      'Interactive geospatial destination discovery with Mapbox & Leaflet integration',
      'Dynamic day-by-day smart itinerary builder with custom waypoints',
      'Real-time budget tracker with multi-currency expense estimation',
      'Responsive Liquid Glass interface with dark/light mode optimization',
      'Offline caching for saved travel guides and route previews',
    ],
    imageFallback: '/projects/tripforge.png',
    gradient: 'from-sky-500/20 via-blue-500/10 to-indigo-500/20',
    accentColor: '#38bdf8',
    github: 'https://github.com/akileshanand302006-sketch/RouteVeda-Intelligent-Travel-Discovery-Adventure-Planner',
    live: '',
  },
  {
    title: 'FinvisIQ',
    slug: 'finvisiq',
    subtitle: 'Enterprise Personal Finance & Portfolio Intelligence',
    description: 'An enterprise-grade Java personal finance management and analytics desktop platform designed for secure budgeting, automated ledger tracking, and algorithmic investment visualization.',
    longDescription: 'FinvisIQ is a comprehensive Core Java desktop financial analytics suite developed to solve disorganized personal expense tracking. Utilizing pure Java object-oriented architecture and Swing/JavaFX rendering, it delivers real-time portfolio asset valuation, automated monthly recurring expense recognition, and encrypted transaction storage.',
    category: 'Core Java Applications',
    year: '2026',
    status: 'Completed',
    featured: true,
    order: 2,
    tags: ['Java', 'Swing/JavaFX', 'OOP Architecture', 'Data Structures', 'JDBC', 'MySQL'],
    technologies: ['Core Java (JDK 21)', 'JavaFX / Swing', 'Object-Oriented Design', 'JDBC', 'MySQL', 'Design Patterns'],
    features: [
      'Multi-account ledger balance aggregation across checking, savings, and investments',
      'Interactive monthly budget categorization and expense velocity forecasting',
      'Portfolio asset allocation visualizer with risk breakdown metrics',
      'Encrypted local SQLite/MySQL data persistence with atomic transaction commits',
      'Exportable financial audit statements in CSV and PDF formats',
    ],
    imageFallback: '/projects/finora.png',
    gradient: 'from-cyan-500/20 via-blue-500/10 to-teal-500/20',
    accentColor: '#22d3ee',
    github: 'https://github.com/akileshanand302006-sketch/FinvisIQ-Personal-Finance-Intelligence-Platform',
    live: '',
  },
  {
    title: 'Smart Hospital Bed Management System',
    slug: 'smart-hospital-bed-management',
    subtitle: 'Real-Time Ward Monitoring & Bed Allocation Platform',
    description: 'A comprehensive healthcare resource management platform designed for hospitals to monitor bed occupancy, patient admissions, ICU capacity, and ward workflows in real time.',
    longDescription: 'Developed to address critical hospital bed shortages and manual allocation bottlenecks, this platform gives healthcare administrators real-time visibility into bed status across Emergency, ICU, General, and Pediatric wards.',
    category: 'Full-Stack Web Applications',
    year: '2026',
    status: 'Completed',
    featured: true,
    order: 3,
    tags: ['React', 'Node.js', 'Express', 'MongoDB', 'REST API'],
    technologies: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Chart.js', 'CSS Modules'],
    features: [
      'Live ward dashboard displaying real-time occupied, reserved, and available beds',
      'Instant admission and discharge workflows with automatic status updates',
      'ICU & Emergency prioritization queue with color-coded critical alerts',
      'Comprehensive department analytics and occupancy rate visualizations',
      'Role-based access control for doctors, nurses, and administrative staff',
    ],
    imageFallback: '/projects/hospital.png',
    gradient: 'from-blue-500/20 via-cyan-500/10 to-indigo-500/20',
    accentColor: '#3b82f6',
    github: '',
    live: '',
  },
  {
    title: 'QuoteVerse',
    slug: 'quoteverse',
    subtitle: 'Daily Inspiration, Wisdom & Author Discovery Hub',
    description: 'An elegant, responsive web platform for discovering, bookmarking, and sharing curated quotes from renowned authors, thinkers, and historical figures across various genres.',
    longDescription: 'QuoteVerse is an interactive content platform focused on literature, mindfulness, and wisdom. Featuring instant search, category filtering, daily inspirational feeds, and custom quote card generators.',
    category: 'Web Applications',
    year: '2026',
    status: 'Completed',
    featured: true,
    order: 4,
    tags: ['React', 'REST API', 'Framer Motion', 'Vite', 'TailwindCSS'],
    technologies: ['React', 'Vite', 'REST APIs', 'Framer Motion', 'Web Share API'],
    features: [
      'Daily curated quote carousel with dynamic mood-based categories',
      'Instant search by author, topic, or keyword with debounced queries',
      'Interactive quote card designer with downloadable image exports',
      'Personal favorites collection saved via local storage and user bookmarks',
      'One-click sharing to social media via native Web Share API',
    ],
    imageFallback: '/projects/quoteverse.png',
    gradient: 'from-violet-500/20 via-blue-500/10 to-cyan-500/20',
    accentColor: '#818cf8',
    github: 'https://github.com/akileshanand302006-sketch/QuoteVerse-A-Universe-of-Inspiration',
    live: '',
  },
];

const skillsData = [
  {
    category: 'Programming Languages',
    categoryIcon: 'Code',
    categoryColor: '#38bdf8',
    order: 1,
    skills: [
      { name: 'C', icon: 'c' },
      { name: 'C++', icon: 'cpp' },
      { name: 'Java', icon: 'java' },
      { name: 'Python', icon: 'python' },
      { name: '8086 Assembly', icon: 'cpu' },
      { name: 'JavaScript (ES6+)', icon: 'javascript' },
    ],
  },
  {
    category: 'Frontend Development',
    categoryIcon: 'Layout',
    categoryColor: '#3b82f6',
    order: 2,
    skills: [
      { name: 'HTML5', icon: 'html5' },
      { name: 'CSS3', icon: 'css3' },
      { name: 'React.js', icon: 'react' },
      { name: 'Vite', icon: 'vite' },
      { name: 'Responsive UI Design', icon: 'smartphone' },
      { name: 'Framer Motion', icon: 'animation' },
    ],
  },
  {
    category: 'Database & Systems',
    categoryIcon: 'Database',
    categoryColor: '#22d3ee',
    order: 3,
    skills: [
      { name: 'MySQL', icon: 'mysql' },
      { name: 'MongoDB', icon: 'mongodb' },
      { name: 'PostgreSQL / PostGIS', icon: 'postgresql' },
      { name: 'Database Architecture & Normalization', icon: 'table' },
    ],
  },
  {
    category: 'Core Computer Science',
    categoryIcon: 'Cpu',
    categoryColor: '#818cf8',
    order: 4,
    skills: [
      { name: 'Data Structures & Algorithms', icon: 'binary' },
      { name: 'Object-Oriented Programming (OOP)', icon: 'boxes' },
      { name: 'Database Management Systems (DBMS)', icon: 'database' },
      { name: 'Operating Systems (OS)', icon: 'server' },
      { name: 'Microprocessor Architecture (8086)', icon: 'chip' },
    ],
  },
  {
    category: 'Developer Tools & Practices',
    categoryIcon: 'Terminal',
    categoryColor: '#a855f7',
    order: 5,
    skills: [
      { name: 'Git & GitHub', icon: 'git' },
      { name: 'VS Code', icon: 'vscode' },
      { name: 'MASM / DOSBox', icon: 'terminal' },
      { name: 'REST APIs', icon: 'api' },
      { name: 'Agile & Version Control', icon: 'workflow' },
    ],
  },
];

const experienceData = [
  {
    type: 'academic',
    role: 'M.Sc Software Systems (Integrated 5-Year Master\'s Degree)',
    organization: 'Coimbatore Institute of Technology (CIT)',
    location: 'Coimbatore, Tamil Nadu, India',
    period: '2023 – 2028 (Currently in 3rd Year)',
    description: 'Pursuing a rigorous 5-year integrated Master of Science program covering foundational and advanced software systems engineering, algorithms, database architectures, and distributed systems.',
    highlights: [
      'Comprehensive study of Data Structures, Algorithms, OS, Computer Networks, and DBMS',
      'Hands-on system programming using 8086 Assembly, C, C++, and Core Java',
      'Advanced coursework in Full-Stack Web Development, Cloud Services, and Modern Software Architecture',
    ],
    skills: ['Data Structures', 'Operating Systems', 'Core Java', 'DBMS', '8086 Assembly', 'System Design'],
    order: 1,
  },
];

const codingProfilesData = [
  {
    name: 'LeetCode',
    platform: 'leetcode',
    username: 'Akilesh303',
    url: 'https://leetcode.com/u/Akilesh303/',
    icon: 'Terminal',
    color: '#f59e0b',
    borderColor: 'rgba(245, 158, 11, 0.3)',
    stats: [
      { label: 'Solved', value: '150+' },
      { label: 'Focus', value: 'DSA & Algorithmic Problem Solving' },
    ],
    badges: ['Daily Streak', 'Algorithm Explorer', 'Data Structures Pro'],
    order: 1,
  },
  {
    name: 'GitHub',
    platform: 'github',
    username: 'akileshanand302006-sketch',
    url: 'https://github.com/akileshanand302006-sketch',
    icon: 'GitBranch',
    color: '#38bdf8',
    borderColor: 'rgba(56, 189, 248, 0.3)',
    stats: [
      { label: 'Repositories', value: '4+ Core' },
      { label: 'Primary Language', value: 'JavaScript / Java' },
    ],
    badges: ['Full-Stack Projects', 'System Engineering', 'Open Source Contributor'],
    order: 2,
  },
  {
    name: 'LinkedIn',
    platform: 'linkedin',
    username: 'akilesh-a-37444a320',
    url: 'https://www.linkedin.com/in/akilesh-a-37444a320',
    icon: 'Linkedin',
    color: '#3b82f6',
    borderColor: 'rgba(59, 130, 246, 0.3)',
    stats: [
      { label: 'Network', value: 'Tech & Engineering' },
      { label: 'Institution', value: 'CIT Coimbatore' },
    ],
    badges: ['Software Systems Student', 'Professional Network', 'Active Engineer'],
    order: 3,
  },
];

const socialLinksData = [
  {
    name: 'GitHub',
    platform: 'github',
    url: 'https://github.com/akileshanand302006-sketch',
    icon: 'Github',
    color: '#38bdf8',
    order: 1,
  },
  {
    name: 'LinkedIn',
    platform: 'linkedin',
    url: 'https://www.linkedin.com/in/akilesh-a-37444a320',
    icon: 'Linkedin',
    color: '#3b82f6',
    order: 2,
  },
  {
    name: 'LeetCode',
    platform: 'leetcode',
    url: 'https://leetcode.com/u/Akilesh303/',
    icon: 'Code',
    color: '#f59e0b',
    order: 3,
  },
];

async function seedDatabase() {
  console.log('🌱 [MongoDB Seed] Starting database seeding process...');

  const conn = await connectDB();
  if (!conn) {
    console.error('❌ Cannot seed database: No active MongoDB connection.');
    process.exit(1);
  }

  try {
    // 1. Seed Profile
    await Profile.deleteMany({});
    await Profile.create(profileData);
    console.log('✅ Profile seeded successfully.');

    // 2. Seed Projects (Upsert by slug to avoid duplicates)
    for (const proj of projectsData) {
      await Project.findOneAndUpdate({ slug: proj.slug }, proj, { upsert: true, new: true });
    }
    console.log(`✅ ${projectsData.length} Projects seeded successfully.`);

    // 3. Seed Skills
    await Skill.deleteMany({});
    await Skill.insertMany(skillsData);
    console.log(`✅ ${skillsData.length} Skill categories seeded successfully.`);

    // 4. Seed Experience
    await Experience.deleteMany({});
    await Experience.insertMany(experienceData);
    console.log(`✅ ${experienceData.length} Experience items seeded successfully.`);

    // 5. Seed Coding Profiles
    await CodingProfile.deleteMany({});
    await CodingProfile.insertMany(codingProfilesData);
    console.log(`✅ ${codingProfilesData.length} Coding profiles seeded successfully.`);

    // 6. Seed Social Links
    await SocialLink.deleteMany({});
    await SocialLink.insertMany(socialLinksData);
    console.log(`✅ ${socialLinksData.length} Social links seeded successfully.`);

    console.log('🎉 [MongoDB Seed] All database collections seeded successfully into Atlas!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
