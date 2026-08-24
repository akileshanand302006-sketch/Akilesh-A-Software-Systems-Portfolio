import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink, ChevronDown, ChevronUp, Layers } from 'lucide-react';
import { useTilt } from '../../hooks/useTilt';
import './ProjectCard.css';

export default function ProjectCard({ project, index }) {
  const [expanded, setExpanded] = useState(false);
  const { ref: tiltRef, handleMouseMove, handleMouseLeave } = useTilt(6);
  const [imgError, setImgError] = useState(false);

  return (
    <motion.article
      className="project-card glass-card"
      ref={tiltRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.12, duration: 0.6, ease: 'easeOut' }}
      style={{ '--project-color': project.color }}
    >
      {/* Image */}
      <div className="project-image-wrap">
        {!imgError ? (
          <img
            src={project.image}
            alt={`${project.title} screenshot`}
            className="project-image"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="project-image-fallback">
            <Layers size={40} strokeWidth={1} />
            <span>{project.shortTitle}</span>
          </div>
        )}
        <div className="project-image-overlay" />
        <span className="project-category-badge">{project.category}</span>
      </div>

      {/* Content */}
      <div className="project-content">
        <h3 className="project-title">{project.title}</h3>
        <p className="project-description">{project.description}</p>

        {/* Technologies */}
        <div className="project-tech-list">
          {project.technologies.slice(0, 5).map((tech) => (
            <span key={tech} className="project-tech-tag">{tech}</span>
          ))}
          {project.technologies.length > 5 && (
            <span className="project-tech-tag project-tech-more">
              +{project.technologies.length - 5}
            </span>
          )}
        </div>

        {/* Expandable Details */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              className="project-details"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {project.problem && (
                <div className="project-detail-block">
                  <h4>Problem</h4>
                  <p>{project.problem}</p>
                </div>
              )}
              <div className="project-detail-block">
                <h4>Key Features</h4>
                <ul className="project-features-list">
                  {project.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
              <div className="project-detail-block">
                <h4>Full Stack</h4>
                <div className="project-tech-list">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="project-tech-tag">{tech}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="project-actions">
          <button
            className="project-details-btn"
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {expanded ? 'Less' : 'Details'}
          </button>

          <div className="project-links">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="project-link-btn glass-button"
                aria-label={`${project.title} GitHub`}
              >
                <Github size={16} />
                Code
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="project-link-btn glass-button glass-button-primary"
                aria-label={`${project.title} live demo`}
              >
                <ExternalLink size={16} />
                Demo
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
