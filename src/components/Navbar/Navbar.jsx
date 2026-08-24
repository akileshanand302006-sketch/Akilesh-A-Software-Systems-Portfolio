import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Mail } from 'lucide-react';
import { useActiveSection } from '../../hooks/useActiveSection';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import profile from '../../data/profile';
import './Navbar.css';

const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'profiles', label: 'Profiles' },
  { id: 'resume', label: 'Resume' },
  { id: 'contact', label: 'Contact' },
];

const sectionIds = navItems.map((item) => item.id);

export default function Navbar({ theme, toggleTheme }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeSection = useActiveSection(sectionIds);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setIsScrolled(currentY > 40);
      setIsVisible(currentY < lastScrollY || currentY < 80);
      setLastScrollY(currentY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setMobileOpen(false);
    }
  };

  return (
    <>
      <motion.nav
        className={`navbar-float glass-nav ${isScrolled ? 'scrolled' : ''}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ 
          y: isVisible ? 0 : -80, 
          opacity: isVisible ? 1 : 0 
        }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="navbar-container">
          {/* Logo */}
          <button className="navbar-logo" onClick={() => scrollTo('home')} aria-label="Go to home">
            <span className="logo-bracket">&lt;</span>
            <span className="logo-name">{profile.firstName || 'Akilesh'}</span>
            <span className="logo-bracket">/&gt;</span>
          </button>

          {/* Desktop Nav */}
          <ul className="navbar-links" role="menubar">
            {navItems.map((item) => (
              <li key={item.id} role="none">
                <button
                  role="menuitem"
                  className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
                  onClick={() => scrollTo(item.id)}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <motion.div
                      className="nav-active-indicator"
                      layoutId="navIndicator"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              </li>
            ))}
          </ul>

          {/* Desktop Right — Clean Theme Toggle */}
          <div className="navbar-actions">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>

          {/* Mobile Right */}
          <div className="navbar-mobile-actions">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              className="mobile-menu glass-panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mobile-menu-header">
                <button className="navbar-logo" onClick={() => scrollTo('home')}>
                  <span className="logo-bracket">&lt;</span>
                  <span className="logo-name">{profile.firstName || 'Akilesh'}</span>
                  <span className="logo-bracket">/&gt;</span>
                </button>
                <button className="mobile-close-btn" onClick={() => setMobileOpen(false)} aria-label="Close menu">
                  <X size={22} />
                </button>
              </div>

              <ul className="mobile-nav-links">
                {navItems.map((item, i) => (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <button
                      className={`mobile-nav-link ${activeSection === item.id ? 'active' : ''}`}
                      onClick={() => scrollTo(item.id)}
                    >
                      {item.label}
                    </button>
                  </motion.li>
                ))}
              </ul>

              <div className="mobile-menu-footer">
                <a
                  href={`mailto:${profile.email}`}
                  className="glass-button glass-button-primary mobile-contact-btn"
                >
                  <Mail size={16} />
                  <span>Get In Touch</span>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
