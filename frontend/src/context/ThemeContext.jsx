// src/context/ThemeContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme harus digunakan di dalam ThemeProvider');
  }
  return context;
};

// ✅ TAMBAHKAN INI: Mapping warna
const getColors = (scheme) => {
  const colors = {
    teal: {
      primary: 'from-teal-700 via-teal-600 to-teal-500',
      primarySolid: 'teal-600',
      primaryLight: 'teal-100',
      primaryHover: 'teal-700',
      primaryBg: 'teal-50',
      accent: 'from-teal-600 to-blue-600',
      badge: 'from-teal-100 to-blue-100',
      badgeText: 'teal-700',
      border: 'teal-100',
      button: 'from-teal-600 to-teal-500',
      buttonHover: 'teal-700',
      statsBorder: 'teal-600',
      statsText: 'teal-700',
      cardHover: 'teal-700',
      ring: 'ring-teal-100/50',
    },
    blue: {
      primary: 'from-blue-700 via-blue-600 to-blue-500',
      primarySolid: 'blue-600',
      primaryLight: 'blue-100',
      primaryHover: 'blue-700',
      primaryBg: 'blue-50',
      accent: 'from-blue-600 to-indigo-600',
      badge: 'from-blue-100 to-indigo-100',
      badgeText: 'blue-700',
      border: 'blue-100',
      button: 'from-blue-600 to-blue-500',
      buttonHover: 'blue-700',
      statsBorder: 'blue-600',
      statsText: 'blue-700',
      cardHover: 'blue-700',
      ring: 'ring-blue-100/50',
    },
    purple: {
      primary: 'from-purple-700 via-purple-600 to-purple-500',
      primarySolid: 'purple-600',
      primaryLight: 'purple-100',
      primaryHover: 'purple-700',
      primaryBg: 'purple-50',
      accent: 'from-purple-600 to-pink-600',
      badge: 'from-purple-100 to-pink-100',
      badgeText: 'purple-700',
      border: 'purple-100',
      button: 'from-purple-600 to-purple-500',
      buttonHover: 'purple-700',
      statsBorder: 'purple-600',
      statsText: 'purple-700',
      cardHover: 'purple-700',
      ring: 'ring-purple-100/50',
    },
  };
  return colors[scheme] || colors.teal;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [fontSize, setFontSize] = useState('medium');
  const [colorScheme, setColorScheme] = useState('teal');
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Ambil colors berdasarkan colorScheme
  const colors = getColors(colorScheme);

  const applyTheme = (newTheme) => {
    const root = document.documentElement;
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
  };

  const applyFontSize = (size) => {
    const root = document.documentElement;
    const sizes = { small: '14px', medium: '16px', large: '18px' };
    root.style.fontSize = sizes[size] || '16px';
    localStorage.setItem('fontSize', size);
    setFontSize(size);
  };

  const applyColorScheme = (color) => {
    const root = document.documentElement;
    root.classList.remove('color-teal', 'color-blue', 'color-purple');
    root.classList.add(`color-${color}`);
    localStorage.setItem('colorScheme', color);
    setColorScheme(color);
  };

  useEffect(() => {
    const loadSettings = () => {
      const savedTheme = localStorage.getItem('theme') || 'light';
      const savedFontSize = localStorage.getItem('fontSize') || 'medium';
      const savedColorScheme = localStorage.getItem('colorScheme') || 'teal';

      const root = document.documentElement;
      if (savedTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }

      const sizes = { small: '14px', medium: '16px', large: '18px' };
      root.style.fontSize = sizes[savedFontSize] || '16px';

      root.classList.remove('color-teal', 'color-blue', 'color-purple');
      root.classList.add(`color-${savedColorScheme}`);

      setTheme(savedTheme);
      setFontSize(savedFontSize);
      setColorScheme(savedColorScheme);
      setIsLoading(false);
    };
    loadSettings();
  }, []);

  const updateAllSettings = (newSettings) => {
    if (newSettings.theme) applyTheme(newSettings.theme);
    if (newSettings.fontSize) applyFontSize(newSettings.fontSize);
    if (newSettings.colorScheme) applyColorScheme(newSettings.colorScheme);
  };

  const value = {
    theme,
    fontSize,
    colorScheme,
    colors, // ✅ EXPOSE colors
    isLoading,
    applyTheme,
    applyFontSize,
    applyColorScheme,
    updateAllSettings,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};