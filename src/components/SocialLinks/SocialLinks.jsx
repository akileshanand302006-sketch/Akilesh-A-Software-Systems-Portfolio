import { Github, Linkedin, Instagram, Youtube, Twitter } from 'lucide-react';
import socialsData from '../../data/socials';
import './SocialLinks.css';

const iconMap = { Github, Linkedin, Instagram, Youtube, Twitter };

export default function SocialLinks({ compact = false }) {
  const activeSocials = socialsData.filter((s) => s.url);

  if (activeSocials.length === 0) return null;

  return (
    <div className={`social-links ${compact ? 'compact' : ''}`}>
      {activeSocials.map((social) => {
        const Icon = iconMap[social.icon] || Github;
        return (
          <a
            key={social.id}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="social-link glass"
            aria-label={social.platform}
            title={social.platform}
          >
            <Icon size={compact ? 18 : 20} />
          </a>
        );
      })}
    </div>
  );
}
