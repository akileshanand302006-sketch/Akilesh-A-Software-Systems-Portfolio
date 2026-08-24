import { useState, useEffect, useCallback } from 'react';

/**
 * Theme toggle hook with localStorage persistence and animated transitions.
 */
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('portfolio-theme') || 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.style.colorScheme = theme;
    
    try {
      localStorage.setItem('portfolio-theme', theme);
    } catch {
      // localStorage unavailable
    }

    // Update meta theme-color
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', theme === 'dark' ? '#050510' : '#f0f4ff');
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  }, []);

  const isDark = theme === 'dark';

  return { theme, toggleTheme, isDark };
}
