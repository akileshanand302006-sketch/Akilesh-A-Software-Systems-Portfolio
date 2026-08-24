import { motion } from 'framer-motion';
import {
  Sparkles, Target, Users, BookOpen, GraduationCap, MapPin, Building2,
  Cpu, Globe, Code2, Compass, Binary, Database
} from 'lucide-react';
import { useCountUp } from '../../hooks/useCountUp';
import profile from '../../data/profile';
import './About.css';

const statIcons = {
  0: Sparkles,
  1: Target,
  2: Users,
  3: BookOpen,
};

const domainConfig = [
  { name: 'Software Systems Engineering', icon: Cpu, color: '#38bdf8' },
  { name: 'Full-Stack Web Development', icon: Globe, color: '#3b82f6' },
  { name: 'Core Java & Object-Oriented Design', icon: Code2, color: '#a855f7' },
  { name: 'Geospatial Intelligence (PostGIS)', icon: Compass, color: '#10b981' },
  { name: 'Low-Level Systems & Assembly', icon: Binary, color: '#f59e0b' },
  { name: 'Database Architecture & Optimization', icon: Database, color: '#ec4899' },
];

function StatCard({ stat, index }) {
  const { count, ref } = useCountUp(stat.value, 1500);
  const Icon = statIcons[index] || Sparkles;

  return (
    <motion.div
      className="stat-card glass-card"
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
    >
      <div className="stat-icon-wrap">
        <Icon size={22} />
      </div>
      <div className="stat-value">
        {count}{stat.suffix}
      </div>
      <div className="stat-label">{stat.label}</div>
    </motion.div>
  );
}

export default function About() {
  return (
    <section id="about" className="section">
      <div className="container-custom">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="section-label">About Me</div>
          <h2 className="section-title">Who I Am</h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Academic foundation, core engineering principles, and technical specializations.
          </p>
        </motion.div>

        <div className="about-grid">
          {/* Bio & Education */}
          <motion.div
            className="about-text glass-panel"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* Education Spotlight Card */}
            <div className="about-education-spotlight">
              <div className="aed-icon-wrap">
                <GraduationCap size={24} />
              </div>
              <div className="aed-details">
                <span className="aed-badge">Current Academic Program</span>
                <h3 className="aed-degree">M.Sc Software Systems (3rd Year)</h3>
                <p className="aed-institution">
                  <Building2 size={14} />
                  <span>Coimbatore Institute of Technology (CIT)</span>
                </p>
                <p className="aed-location">
                  <MapPin size={14} />
                  <span>Coimbatore, Tamil Nadu, India</span>
                </p>
              </div>
            </div>

            <p className="about-bio">{profile.bio}</p>

            <div className="about-highlights">
              {profile.highlights.map((item, i) => (
                <span key={i} className="highlight-tag glass-pill">
                  {item}
                </span>
              ))}
            </div>

            {/* Punchy Technical Domains & Interests */}
            <div className="about-interests">
              <div className="about-interests-header">
                <Sparkles size={16} className="aih-icon" />
                <h3 className="about-interests-title">Technical Domains & Interests</h3>
              </div>
              
              <div className="interest-list">
                {domainConfig.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.name}
                      className="interest-tag"
                      style={{
                        '--domain-color': item.color,
                        '--domain-bg': `${item.color}12`,
                        '--domain-border': `${item.color}35`,
                        '--domain-glow': `${item.color}30`,
                      }}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05, duration: 0.35 }}
                      whileHover={{ scale: 1.04, y: -2 }}
                    >
                      <span className="it-icon-wrap">
                        <Icon size={14} />
                      </span>
                      <span className="it-text">{item.name}</span>
                      <span className="it-dot" />
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Statistics & Focus */}
          <motion.div
            className="about-stats"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {profile.stats.map((stat, i) => (
              <StatCard key={i} stat={stat} index={i} />
            ))}

            <div className="about-quote-card glass-card">
              <span className="aqc-label">Engineering Philosophy</span>
              <p className="aqc-text">
                "Writing clean, modular code with strong architectural foundations — bridging low-level system performance with intuitive modern user experiences."
              </p>
              <span className="aqc-author">— Akilesh A</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
