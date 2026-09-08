import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { animateThemeToggle, createGlassRipple } from '../../animations';
import './ThemeToggle.css';

export default function ThemeToggle({ theme, toggleTheme }) {
  const isDark = theme === 'dark';
  const buttonRef = useRef(null);
  const iconRef = useRef(null);

  const handleClick = (e) => {
    createGlassRipple(buttonRef.current, e);
    animateThemeToggle(iconRef.current);
    toggleTheme();
  };

  return (
    <button
      ref={buttonRef}
      className="theme-toggle"
      onClick={handleClick}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div ref={iconRef} className="theme-toggle-icon-wrap">
        <motion.div
          className="theme-toggle-icon"
          key={theme}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          {isDark ? <Moon size={18} /> : <Sun size={18} />}
        </motion.div>
      </div>
    </button>
  );
}
