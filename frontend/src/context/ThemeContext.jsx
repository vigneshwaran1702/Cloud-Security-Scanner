import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ACCENT_PALETTES = [
  { id: 'evolve', name: 'WeEvolveIT Magenta', primary: '#e4007c', accent: '#7c5bff', desc: 'Electric Magenta & Cyber Violet' },
  { id: 'indigo', name: 'Cyber Indigo', primary: '#6366f1', accent: '#06b6d4', desc: 'Electric Indigo & Cyan' },
  { id: 'cyan', name: 'Cyan Sentry', primary: '#0ea5e9', accent: '#6366f1', desc: 'Sky Blue & Cyber Violet' },
  { id: 'emerald', name: 'Emerald Matrix', primary: '#10b981', accent: '#06b6d4', desc: 'Neon Emerald & Cyber Teal' },
  { id: 'violet', name: 'Hyper Violet', primary: '#8b5cf6', accent: '#ec4899', desc: 'Deep Violet & Pink Neon' },
  { id: 'crimson', name: 'Crimson Shield', primary: '#f43f5e', accent: '#fb7185', desc: 'Stealth Rose & Carmine' },
];

export function ThemeProvider({ children }) {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.setAttribute('data-accent', 'evolve');
    try {
      localStorage.setItem('cloudguard_theme', 'dark');
      localStorage.setItem('cloudguard_accent', 'evolve');
    } catch {}
  }, []);

  return (
    <ThemeContext.Provider value={{
      theme: 'dark',
      toggleTheme: () => {},
      setTheme: () => {},
      accent: 'evolve',
      setAccent: () => {},
      accentList: ACCENT_PALETTES,
      isDark: true,
      isLight: false
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
