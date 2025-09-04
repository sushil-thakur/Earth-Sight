import React, { createContext, useContext, useState, useEffect } from 'react';

const themes = {
  nature: {
    name: 'Nature',
    bg: 'linear-gradient(135deg, #0f4c3a 0%, #1a5f4a 25%, #2d7d5f 50%, #4ade80 75%, #86efac 100%)',
    cardBg: 'rgba(255, 255, 255, 0.15)',
    textColor: '#ffffff',
    accentColor: '#22c55e',
    glowColor: 'rgba(34, 197, 94, 0.4)',
    particles: 'leaf-particles',
    emoji: '🌿'
  },
  cyberpunk: {
    name: 'Cyberpunk',
    bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    cardBg: 'rgba(255, 255, 255, 0.95)',
    textColor: '#ffffff',
    accentColor: '#00ffff',
    glowColor: 'rgba(59, 130, 246, 0.5)',
    particles: 'particles-container',
    emoji: '⚡'
  },
  modern: {
    name: 'Modern',
    bg: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
    cardBg: 'rgba(255, 255, 255, 0.9)',
    textColor: '#1e293b',
    accentColor: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.3)',
    particles: 'modern-particles',
    emoji: '🏢'
  },
  sunset: {
    name: 'Sunset',
    bg: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 25%, #ffb627 50%, #ff9505 75%, #ff6b35 100%)',
    cardBg: 'rgba(255, 255, 255, 0.85)',
    textColor: '#ffffff',
    accentColor: '#ff6b35',
    glowColor: 'rgba(255, 107, 53, 0.4)',
    particles: 'sunset-particles',
    emoji: '🌅'
  }
};

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('nature');

  useEffect(() => {
    const savedTheme = localStorage.getItem('earthslight-theme');
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  const changeTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
      localStorage.setItem('earthslight-theme', themeName);
    }
  };

  const theme = themes[currentTheme];

  return (
    <ThemeContext.Provider value={{ theme, currentTheme, changeTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};