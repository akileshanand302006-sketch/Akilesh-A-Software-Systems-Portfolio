import skillsData from '../../data/skills';
import './SkillTicker.css';

export default function SkillTicker() {
  const items = skillsData.ticker;
  // Duplicate for seamless loop
  const doubled = [...items, ...items];

  return (
    <div className="ticker-wrapper" aria-label="Skills marquee">
      <div className="ticker-track">
        {doubled.map((skill, i) => (
          <span key={i} className="ticker-item glass">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
