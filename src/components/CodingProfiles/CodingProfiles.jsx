import { motion } from 'framer-motion';
import { ExternalLink, Github, Linkedin, Code2, Award, Trophy, BookOpen } from 'lucide-react';
import profilesData from '../../data/profiles';
import './CodingProfiles.css';

const iconMap = { Github, Linkedin, Code2, Award, Trophy, BookOpen };

export default function CodingProfiles() {
  const activeProfiles = profilesData.filter((p) => p.url);

  if (activeProfiles.length === 0) return null;

  return (
    <section id="profiles" className="section">
      <div className="container-custom">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="section-label">Profiles</div>
          <h2 className="section-title">Where I Code</h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            My coding profiles and professional networks.
          </p>
        </motion.div>

        <div className="profiles-grid">
          {activeProfiles.map((profile, index) => {
            const Icon = iconMap[profile.icon] || Code2;
            return (
              <motion.a
                key={profile.id}
                href={profile.url}
                target="_blank"
                rel="noopener noreferrer"
                className="profile-card glass-card"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
                style={{ '--profile-color': profile.color }}
              >
                <div className="profile-icon-wrap" style={{ background: `${profile.color}15`, borderColor: `${profile.color}30` }}>
                  <Icon size={24} style={{ color: profile.color }} />
                </div>
                <h3 className="profile-platform">{profile.platform}</h3>
                <p className="profile-username">@{profile.username}</p>
                <p className="profile-desc">{profile.description}</p>
                <div className="profile-visit">
                  <span>Visit</span>
                  <ExternalLink size={14} />
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
