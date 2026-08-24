import { motion } from 'framer-motion';
import { Download, Eye, Sparkles, Code2, Database, FileText } from 'lucide-react';
import { analyticsService } from '../../services/analyticsService';
import './Resume.css';

const resumes = [
  {
    id: 'sde',
    title: 'Software Development Engineer (SDE)',
    badge: 'Core Technical Profile',
    icon: Code2,
    color: '#38bdf8',
    description: 'Specialized for full-stack engineering, Core Java systems, 8086 low-level integration, and modern reactive web architectures.',
    highlights: [
      'Full-Stack Web (React 19, Angular, Node.js, Express)',
      'Systems & Core Java (JavaFX, JDBC, 8086 Assembly)',
      'Databases (PostgreSQL, PostGIS, MySQL)',
      'Algorithmic Problem Solving (LeetCode)',
    ],
    pdfUrl: '/resumes/Akilesh_A_SDE_Resume.pdf',
    docxUrl: '/resumes/Akilesh_A_SDE_Resume.docx',
  },
  {
    id: 'data',
    title: 'Data & Systems Engineering',
    badge: 'Data & Analytics Profile',
    icon: Database,
    color: '#22d3ee',
    description: 'Specialized for geospatial data systems (PostGIS), relational database architecture, visual financial analytics, and data-driven systems.',
    highlights: [
      'Geospatial Queries & Spatial Indexing (PostGIS)',
      'Relational Database Modeling & Optimization (SQL, PL/SQL)',
      'Data Visualization & Desktop Analytics (FinvisIQ)',
      'API Integration & Geospatial Discovery (RouteVeda)',
    ],
    pdfUrl: '/resumes/Akilesh_A_Data_Resume.pdf',
    docxUrl: '/resumes/Akilesh_A_Data_Resume.docx',
  },
];

export default function Resume() {
  const handleTrack = (type, id) => {
    analyticsService.track(type, `resume_${id}`);
  };

  return (
    <section id="resume" className="section">
      <div className="container-custom">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="section-label">Curriculum Vitae</div>
          <h2 className="section-title">Resumes & Credentials</h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Choose between my specialized <strong>SDE</strong> and <strong>Data Engineering</strong> resumes tailored for 2026 internship opportunities.
          </p>
        </motion.div>

        <div className="resume-grid">
          {resumes.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                className="resume-dual-card glass-panel"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.12, duration: 0.5 }}
                style={{ '--resume-accent': item.color }}
              >
                {/* Header */}
                <div className="rdc-header">
                  <div className="rdc-icon-wrap" style={{ background: `${item.color}18`, borderColor: `${item.color}40` }}>
                    <Icon size={28} style={{ color: item.color }} />
                  </div>
                  <div className="rdc-badge-wrap">
                    <span className="rdc-badge" style={{ color: item.color, borderColor: `${item.color}40`, background: `${item.color}15` }}>
                      <Sparkles size={12} />
                      {item.badge}
                    </span>
                    <h3 className="rdc-title">{item.title}</h3>
                  </div>
                </div>

                <p className="rdc-desc">{item.description}</p>

                {/* Highlights List */}
                <div className="rdc-highlights">
                  <h4 className="rdc-hl-title">Key Competencies</h4>
                  <ul className="rdc-hl-list">
                    {item.highlights.map((hl, i) => (
                      <li key={i}>
                        <span className="rdc-bullet" style={{ color: item.color }}>✓</span>
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="rdc-actions">
                  <a
                    href={item.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rdc-btn rdc-btn-primary"
                    aria-label={`View ${item.title} PDF`}
                    onClick={() => handleTrack('resume_view', item.id)}
                  >
                    <Eye size={16} />
                    <span>View PDF</span>
                  </a>

                  <a
                    href={item.pdfUrl}
                    download={`Akilesh_A_${item.id.toUpperCase()}_Resume.pdf`}
                    className="rdc-btn rdc-btn-secondary"
                    aria-label={`Download ${item.title} PDF`}
                    onClick={() => handleTrack('resume_download', item.id)}
                  >
                    <Download size={16} />
                    <span>Download PDF</span>
                  </a>

                  <a
                    href={item.docxUrl}
                    download={`Akilesh_A_${item.id.toUpperCase()}_Resume.docx`}
                    className="rdc-btn rdc-btn-docx"
                    aria-label={`Download ${item.title} Word DOCX`}
                    onClick={() => handleTrack('resume_download', `${item.id}_docx`)}
                  >
                    <FileText size={16} className="rdc-docx-icon" />
                    <span>Download Word Document (.docx)</span>
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
