import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Globe, Quote, TrendingUp, BookOpen } from 'lucide-react';
import experienceData from '../../data/experience';
import { animateTimelineProgress, createGlassSheen, cleanupAnime } from '../../animations';
import './Experience.css';

const iconMap = { Cpu, Globe, Quote, TrendingUp, BookOpen };

export default function Experience() {
  const lineRef = useRef(null);
  const sectionRef = useRef(null);

  // Progressive timeline draw animation using Anime.js
  useEffect(() => {
    const line = lineRef.current;
    if (!line) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animateTimelineProgress(line, 950);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(line);

    return () => {
      observer.disconnect();
      cleanupAnime(line);
    };
  }, []);

  return (
    <section id="experience" className="section" ref={sectionRef}>
      <div className="container-custom">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="section-label">Experience</div>
          <h2 className="section-title">My Journey</h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Key projects and milestones in my development journey.
          </p>
        </motion.div>

        <div className="timeline">
          <div className="timeline-line" ref={lineRef} />
          {experienceData.map((item, index) => {
            const Icon = iconMap[item.icon] || BookOpen;
            return (
              <motion.div
                key={item.id}
                className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="timeline-dot">
                  <Icon size={16} />
                </div>
                <div
                  className="timeline-card glass-card"
                  onMouseEnter={(e) => createGlassSheen(e.currentTarget)}
                >
                  <div className="timeline-card-header">
                    <span className="timeline-period">{item.period}</span>
                    <span className="timeline-org">{item.organization}</span>
                  </div>
                  <h3 className="timeline-title">{item.title}</h3>
                  <p className="timeline-desc">{item.description}</p>
                  <div className="timeline-techs">
                    {item.technologies.map((tech) => (
                      <span key={tech} className="project-tech-tag">{tech}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
