import { motion } from 'framer-motion';
import { Layers, Cpu, MapPin, Zap } from 'lucide-react';
import achievementsData from '../../data/achievements';
import './Achievements.css';

const iconMap = { Layers, Cpu, MapPin, Zap };

export default function Achievements() {
  return (
    <section id="achievements" className="section">
      <div className="container-custom">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="section-label">Achievements</div>
          <h2 className="section-title">Highlights</h2>
        </motion.div>

        <div className="achievements-grid">
          {achievementsData.map((item, index) => {
            const Icon = iconMap[item.icon] || Layers;
            return (
              <motion.div
                key={item.id}
                className="achievement-card glass-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="achievement-icon-wrap">
                  <Icon size={24} />
                </div>
                <div className="achievement-content">
                  <div className="achievement-meta">
                    <span className="achievement-year">{item.year}</span>
                    <span className="achievement-category">{item.category}</span>
                  </div>
                  <h3 className="achievement-title">{item.title}</h3>
                  <p className="achievement-desc">{item.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
