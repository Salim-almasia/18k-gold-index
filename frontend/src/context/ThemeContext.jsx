import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const THEMES = {
  dark: {
    name: 'Sombre',
    bg: '#0d1117',
    card: '#161b22',
    border: '#30363d',
    text: '#c9d1d9',
    muted: '#8b949e',
  },
  light: {
    name: 'Clair',
    bg: '#f5f5f5',
    card: '#ffffff',
    border: '#e0e0e0',
    text: '#1a1a1a',
    muted: '#666666',
  },
  midnight: {
    name: 'Minuit',
    bg: '#0a0a0f',
    card: '#12121a',
    border: '#1e1e2e',
    text: '#e0e0e0',
    muted: '#888899',
  },
  gold: {
    name: 'Or',
    bg: '#1a1510',
    card: '#252015',
    border: '#3d3020',
    text: '#f0e6d3',
    muted: '#a09080',
  },
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('luxoria_theme');
    return saved && THEMES[saved] ? saved : 'dark';
  });

  useEffect(() => {
    localStorage.setItem('luxoria_theme', theme);

    // Apply CSS variables
    const root = document.documentElement;
    const colors = THEMES[theme];
    root.style.setProperty('--color-terminal-bg', colors.bg);
    root.style.setProperty('--color-terminal-card', colors.card);
    root.style.setProperty('--color-terminal-border', colors.border);
    root.style.setProperty('--color-terminal-text', colors.text);
    root.style.setProperty('--color-terminal-muted', colors.muted);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
