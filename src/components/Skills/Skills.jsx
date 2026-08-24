import { motion } from 'framer-motion';
import { Code2, Layout, Server, Database, Wrench, Sparkles } from 'lucide-react';
import SkillTicker from '../SkillTicker/SkillTicker';
import skillsData from '../../data/skills';
import './Skills.css';

const iconMap = {
  Code2,
  Layout,
  Server,
  Database,
  Wrench,
};

export default function Skills() {
  return (
    <section id="skills" className="section">
      <div className="container-custom">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="section-label">Skills & Tech Stack</div>
          <h2 className="section-title">Technologies I Build With</h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            A comprehensive overview of programming languages, frameworks, database architectures, and systems tools.
          </p>
        </motion.div>

        {/* Skill Ticker */}
        <SkillTicker />

        {/* Skill Categories Grid */}
        <div className="skills-grid">
          {skillsData.categories.map((category, catIndex) => {
            const Icon = iconMap[category.icon] || Code2;
            return (
              <motion.div
                key={category.name}
                className="skill-category glass-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: catIndex * 0.08, duration: 0.5 }}
                style={{ '--category-color': category.color || 'var(--accent)' }}
              >
                <div className="skill-category-header">
                  <div
                    className="skill-category-icon"
                    style={{
                      background: `${category.color || '#38bdf8'}15`,
                      color: category.color || 'var(--accent)',
                      borderColor: `${category.color || '#38bdf8'}30`,
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <h3 className="skill-category-name">{category.name}</h3>
                </div>

                <div className="skill-pills-wrap">
                  {category.skills.map((skillName, i) => (
                    <motion.span
                      key={skillName}
                      className="skill-pill glass-pill"
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: catIndex * 0.05 + i * 0.02, duration: 0.3 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                    >
                      <span className="skill-dot" style={{ background: category.color || 'var(--accent)' }} />
                      <span className="skill-pill-text">{skillName}</span>
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
