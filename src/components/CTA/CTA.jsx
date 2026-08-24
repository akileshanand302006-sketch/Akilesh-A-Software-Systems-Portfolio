import { motion } from 'framer-motion';
import { FolderOpen, Send, FileText } from 'lucide-react';
import './CTA.css';

export default function CTA() {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="cta-section section">
      <div className="container-custom">
        <motion.div
          className="cta-content glass-panel"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="cta-title">
            Let's build something <span className="gradient-text">meaningful.</span>
          </h2>
          <p className="cta-subtitle">
            Open to internship opportunities, collaborative projects, and software systems engineering challenges.
          </p>
          <div className="cta-buttons">
            <button className="glass-button glass-button-primary" onClick={() => scrollTo('projects')}>
              <FolderOpen size={18} />
              <span>View Projects</span>
            </button>
            <button className="glass-button" onClick={() => scrollTo('contact')}>
              <Send size={18} />
              <span>Contact Me</span>
            </button>
            <button className="glass-button" onClick={() => scrollTo('resume')}>
              <FileText size={18} />
              <span>Resumes (SDE & Data)</span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
