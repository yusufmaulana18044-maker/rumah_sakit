// src/context/ThemeContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

// Buat Context
const ThemeContext = createContext();

// Hook untuk menggunakan theme di komponen lain
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme harus digunakan di dalam ThemeProvider');
  }
  return context;
};

// Provider yang akan membungkus seluruh aplikasi
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [fontSize, setFontSize] = useState('medium');
  const [colorScheme, setColorScheme] = useState('teal');
  const [isLoading, setIsLoading] = useState(true);

  // Fungsi untuk menerapkan tema ke DOM
  const applyTheme = (newTheme) => {
    const root = document.documentElement;
    
    // Hapus class dark jika theme = light, tambahkan jika theme = dark
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Simpan ke localStorage
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
  };

  // Fungsi untuk menerapkan ukuran font
  const applyFontSize = (size) => {
    const root = document.documentElement;
    const sizes = {
      small: '14px',
      medium: '16px',
      large: '18px'
    };
    root.style.fontSize = sizes[size] || '16px';
    localStorage.setItem('fontSize', size);
    setFontSize(size);
  };

  // Fungsi untuk menerapkan skema warna
  const applyColorScheme = (color) => {
    const root = document.documentElement;
    
    // Hapus semua class warna sebelumnya
    root.classList.remove('color-teal', 'color-blue', 'color-purple');
    
    // Tambahkan class warna baru
    root.classList.add(`color-${color}`);
    
    localStorage.setItem('colorScheme', color);
    setColorScheme(color);
  };

  // Load semua pengaturan dari localStorage saat aplikasi pertama kali dijalankan
  useEffect(() => {
    const loadSettings = () => {
      // Ambil data dari localStorage
      const savedTheme = localStorage.getItem('theme') || 'light';
      const savedFontSize = localStorage.getItem('fontSize') || 'medium';
      const savedColorScheme = localStorage.getItem('colorScheme') || 'teal';

      // Terapkan theme ke DOM
      const root = document.documentElement;
      if (savedTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }

      // Terapkan font size
      const sizes = {
        small: '14px',
        medium: '16px',
        large: '18px'
      };
      root.style.fontSize = sizes[savedFontSize] || '16px';

      // Terapkan color scheme
      root.classList.remove('color-teal', 'color-blue', 'color-purple');
      root.classList.add(`color-${savedColorScheme}`);

      // Update state
      setTheme(savedTheme);
      setFontSize(savedFontSize);
      setColorScheme(savedColorScheme);
      setIsLoading(false);
    };

    loadSettings();
  }, []);

  // Fungsi untuk update semua pengaturan sekaligus
  const updateAllSettings = (newSettings) => {
    if (newSettings.theme) {
      applyTheme(newSettings.theme);
    }
    if (newSettings.fontSize) {
      applyFontSize(newSettings.fontSize);
    }
    if (newSettings.colorScheme) {
      applyColorScheme(newSettings.colorScheme);
    }
  };

  // Nilai yang akan disediakan ke seluruh aplikasi
  const value = {
    theme,
    fontSize,
    colorScheme,
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