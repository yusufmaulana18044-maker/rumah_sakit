// src/main.jsx atau src/index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './context/ThemeContext'; // ← Import ini
import './index.css'; // Pastikan CSS Anda diimport

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>  {/* ← Bungkus App dengan ThemeProvider */}
      <App />
    </ThemeProvider>
  </React.StrictMode>
);