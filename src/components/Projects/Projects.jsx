import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProjectCard from '../ProjectCard/ProjectCard';
import { portfolioService } from '../../services/portfolioService';
import initialProjects from '../../data/projects';
import './Projects.css';

export default function Projects() {
  const [projectsList, setProjectsList] = useState(initialProjects);

  useEffect(() => {
    let isMounted = true;
    portfolioService.getProjects().then((data) => {
      if (isMounted && Array.isArray(data) && data.length > 0) {
        setProjectsList(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section id="projects" className="section">
      <div className="container-custom">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="section-label">Projects</div>
          <h2 className="section-title">What I've Built</h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Real projects solving real problems — from hospital systems to travel platforms.
          </p>
        </motion.div>

        <div className="projects-grid">
          {projectsList.map((project, index) => (
            <ProjectCard key={project._id || project.id || project.slug} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
