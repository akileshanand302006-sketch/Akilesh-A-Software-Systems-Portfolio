import React, { useState } from 'react';
import { useTheme } from './hooks/useTheme';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import BackgroundEffects from './components/BackgroundEffects/BackgroundEffects';
import ParticlesBackground from './components/ParticlesBackground/ParticlesBackground';
import CustomCursor from './components/CustomCursor/CustomCursor';
import ScrollProgress from './components/ScrollProgress/ScrollProgress';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Skills from './components/Skills/Skills';
import Experience from './components/Experience/Experience';
import Projects from './components/Projects/Projects';
import Achievements from './components/Achievements/Achievements';
import CodingProfiles from './components/CodingProfiles/CodingProfiles';
import Resume from './components/Resume/Resume';
import CTA from './components/CTA/CTA';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';

import './styles/variables.css';
import './styles/animations.css';
import './styles/glass.css';
import './styles/background.css';
import './styles/3d-scene.css';
import './styles/responsive.css';
import './App.css';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="portfolio-app" data-theme={theme}>
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}

      <BackgroundEffects theme={theme} />
      <ParticlesBackground theme={theme} />

      <CustomCursor />
      <ScrollProgress />

      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <main id="main-content">
        <Hero theme={theme} />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Achievements />
        <CodingProfiles />
        <Resume />
        <CTA />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
