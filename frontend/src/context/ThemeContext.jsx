import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ACCENT_PALETTES = [
  { id: 'indigo', name: 'Cyber Indigo', primary: '#6366f1', accent: '#06b6d4', desc: 'Electric Indigo & Cyan' },
  { id: 'cyan', name: 'Cyan Sentry', primary: '#0ea5e9', accent: '#6366f1', desc: 'Sky Blue & Cyber Violet' },
  { id: 'emerald', name: 'Emerald Matrix', primary: '#10b981', accent: '#06b6d4', desc: 'Neon Emerald & Cyber Teal' },
  { id: 'violet', name: 'Hyper Violet', primary: '#8b5cf6', accent: '#ec4899', desc: 'Deep Violet & Pink Neon' },
  { id: 'crimson', name: 'Crimson Shield', primary: '#f43f5e', accent: '#fb7185', desc: 'Stealth Rose & Carmine' },
];

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    const saved = localStorage.getItem('cloudguard_theme');
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
    return 'dark';
  });

  const [accent, setAccentState] = useState(() => {
    const savedAccent = localStorage.getItem('cloudguard_accent');
    if (ACCENT_PALETTES.some(p => p.id === savedAccent)) {
      return savedAccent;
    }
    return 'indigo';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('cloudguard_theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-accent', accent);
    localStorage.setItem('cloudguard_accent', accent);
  }, [accent]);

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (newTheme) => {
    if (newTheme === 'light' || newTheme === 'dark') {
      setThemeState(newTheme);
    }
  };

  const setAccent = (newAccent) => {
    if (ACCENT_PALETTES.some(p => p.id === newAccent)) {
      setAccentState(newAccent);
    }
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      toggleTheme,
      setTheme,
      accent,
      setAccent,
      accentList: ACCENT_PALETTES,
      isDark: theme === 'dark',
      isLight: theme === 'light'
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
