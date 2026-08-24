import { ArrowUp, Phone, Mail, MapPin, Github, Linkedin, Code2, ExternalLink } from 'lucide-react';
import profile from '../../data/profile';
import './Footer.css';

const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'profiles', label: 'Where I Code' },
  { id: 'contact', label: 'Contact' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-wrap">
      <div className="container-custom">
        <div className="footer-panel glass-panel">
          {/* Top Row */}
          <div className="footer-top">
            {/* Brand & Bio */}
            <div className="footer-brand">
              <button className="footer-logo" onClick={scrollToTop} aria-label="Back to top">
                <span className="logo-bracket">&lt;</span>
                <span className="logo-name">{profile.name}</span>
                <span className="logo-bracket">/&gt;</span>
              </button>
              <p className="footer-tagline">
                {profile.title} • {profile.tagline}
              </p>
              <div className="footer-status-pill">
                <span className="footer-pulse-dot" />
                <span>{profile.availability}</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-nav">
              <h4 className="footer-heading">Quick Navigation</h4>
              <ul className="footer-nav-list">
                {navLinks.map((link) => (
                  <li key={link.id}>
                    <button
                      className="footer-nav-link"
                      onClick={() => scrollTo(link.id)}
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact & Coding Profiles */}
            <div className="footer-connect">
              <h4 className="footer-heading">Direct Contact</h4>
              
              <div className="footer-contact-items">
                <a href={`tel:${profile.phone.replace(/\s+/g, '')}`} className="footer-contact-link">
                  <Phone size={15} className="fc-icon" />
                  <span>{profile.phone}</span>
                </a>
                
                <a href={`mailto:${profile.email}`} className="footer-contact-link">
                  <Mail size={15} className="fc-icon" />
                  <span>{profile.email}</span>
                </a>

                <div className="footer-contact-link static">
                  <MapPin size={15} className="fc-icon" />
                  <span>{profile.location}</span>
                </div>
              </div>

              <h4 className="footer-heading" style={{ marginTop: '16px' }}>Developer Profiles</h4>
              <div className="footer-social-row">
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-btn glass"
                  title="GitHub Profile"
                >
                  <Github size={18} />
                </a>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-btn glass"
                  title="LinkedIn Profile"
                >
                  <Linkedin size={18} />
                </a>
                <a
                  href={profile.leetcode}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-btn glass"
                  title="LeetCode Profile"
                >
                  <Code2 size={18} />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="footer-bottom">
            <p className="footer-copyright">
              © {currentYear} {profile.name}. Built with React, Three.js & Liquid Glass UI.
            </p>
            
            <button
              className="footer-back-top glass-button"
              onClick={scrollToTop}
              aria-label="Scroll back to top"
            >
              <span>Back to top</span>
              <ArrowUp size={16} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
