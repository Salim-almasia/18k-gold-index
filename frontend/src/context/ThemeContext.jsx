import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const THEMES = {
  blueGold: {
    name: 'Bleu & Or',
    bg: '#0a1628',
    card: '#0f1f36',
    border: '#1e3a5f',
    text: '#e2e8f0',
    muted: '#94a3b8',
    accent: '#C9A961',
  },
  light: {
    name: 'Clair',
    bg: '#f1f5f9',
    card: '#ffffff',
    border: '#cbd5e1',
    text: '#0f172a',
    muted: '#64748b',
    accent: '#C9A961',
  },
  midnight: {
    name: 'Minuit',
    bg: '#020617',
    card: '#0f172a',
    border: '#1e293b',
    text: '#e2e8f0',
    muted: '#64748b',
    accent: '#C9A961',
  },
  elegance: {
    name: 'Elegance',
    bg: '#1a1a2e',
    card: '#16213e',
    border: '#0f3460',
    text: '#eaeaea',
    muted: '#a0a0a0',
    accent: '#C9A961',
  },
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('luxoria_theme');
    return saved && THEMES[saved] ? saved : 'blueGold';
  });

  useEffect(() => {
    localStorage.setItem('luxoria_theme', theme);

    const root = document.documentElement;
    const colors = THEMES[theme];
    root.style.setProperty('--color-terminal-bg', colors.bg);
    root.style.setProperty('--color-terminal-card', colors.card);
    root.style.setProperty('--color-terminal-border', colors.border);
    root.style.setProperty('--color-terminal-text', colors.text);
    root.style.setProperty('--color-terminal-muted', colors.muted);
    root.style.setProperty('--color-accent', colors.accent);
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
