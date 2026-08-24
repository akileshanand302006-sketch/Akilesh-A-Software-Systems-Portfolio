import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import profile from '../../data/profile';
import './LoadingScreen.css';

export default function LoadingScreen({ onComplete }) {
  const [phase, setPhase] = useState('ring'); // ring → name → done

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('name'), 800);
    const t2 = setTimeout(() => {
      setPhase('done');
      onComplete?.();
    }, 2000);

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          className="loading-screen"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="loading-content">
            {/* Glowing Ring */}
            <motion.div
              className="loading-ring"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <svg viewBox="0 0 100 100" className="loading-svg">
                <circle
                  cx="50" cy="50" r="40"
                  fill="none"
                  stroke="url(#loadingGradient)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="loading-circle"
                />
                <defs>
                  <linearGradient id="loadingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>

            {/* Name Reveal */}
            <AnimatePresence>
              {phase === 'name' && (
                <motion.div
                  className="loading-name"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <span className="loading-bracket">&lt;</span>
                  {profile.firstName || 'Portfolio'}
                  <span className="loading-bracket">/&gt;</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
