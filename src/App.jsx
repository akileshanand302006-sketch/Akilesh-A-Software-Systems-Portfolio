import { useTheme } from './hooks/useTheme';
import BackgroundEffects from './components/BackgroundEffects/BackgroundEffects';
import ParticlesBackground from './components/ParticlesBackground/ParticlesBackground';
import CustomCursor from './components/CustomCursor/CustomCursor';
import ScrollProgress from './components/ScrollProgress/ScrollProgress';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Skills from './components/Skills/Skills';
import Projects from './components/Projects/Projects';
import Experience from './components/Experience/Experience';
import Achievements from './components/Achievements/Achievements';
import CodingProfiles from './components/CodingProfiles/CodingProfiles';
import CTA from './components/CTA/CTA';
import Resume from './components/Resume/Resume';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';

export default function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="portfolio-app" data-theme={theme}>
      {/* Global Multi-Layer 3D Background */}
      <BackgroundEffects theme={theme} />
      <ParticlesBackground theme={theme} />

      {/* Interactive Desktop Utilities */}
      <CustomCursor />
      <ScrollProgress />

      {/* Fixed Glass Navigation */}
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      {/* Main Sections */}
      <main id="main-content">
        <Hero theme={theme} />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Achievements />
        <CodingProfiles />
        <CTA />
        <Resume />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
