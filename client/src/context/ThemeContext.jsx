import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('ssc-theme') || 'light';
  });
  const [fontScale, setFontScaleState] = useState(() => {
    return parseFloat(localStorage.getItem('ssc-fontscale')) || 1.0;
  });
  const [highContrast, setHighContrastState] = useState(() => {
    return localStorage.getItem('ssc-highcontrast') === 'true';
  });
  const [reduceMotion, setReduceMotionState] = useState(() => {
    return localStorage.getItem('ssc-reducemotion') === 'true';
  });

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('ssc-theme', newTheme);
  };

  const setFontScale = (scale) => {
    const clampedScale = Math.min(Math.max(scale, 0.75), 1.75);
    setFontScaleState(clampedScale);
    localStorage.setItem('ssc-fontscale', clampedScale);
  };

  const setHighContrast = (enabled) => {
    setHighContrastState(enabled);
    localStorage.setItem('ssc-highcontrast', enabled ? 'true' : 'false');
  };

  const setReduceMotion = (enabled) => {
    setReduceMotionState(enabled);
    localStorage.setItem('ssc-reducemotion', enabled ? 'true' : 'false');
  };

  useEffect(() => {
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('dark', 'sepia');
    
    // Apply selected theme class
    if (theme === 'dark' || theme === 'sepia') {
      root.classList.add(theme);
    }
    
    // Apply contrast
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Apply motion
    if (reduceMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // Apply font scale
    root.style.fontSize = `${fontScale}rem`;
    
  }, [theme, fontScale, highContrast, reduceMotion]);

  return (
    <ThemeContext.Provider value={{
      theme,
      setTheme,
      fontScale,
      setFontScale,
      highContrast,
      setHighContrast,
      reduceMotion,
      setReduceMotion
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
