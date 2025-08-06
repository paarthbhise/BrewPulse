import { useState, useEffect, ReactNode } from 'react';
import { ThemeContext, type Theme } from '@/context/ThemeContext';

interface ThemeProviderProps {
  children: ReactNode;
}

const THEMES = [
  { 
    id: 'dark-professional' as Theme, 
    name: 'Dark Professional', 
    colors: ['hsl(220, 13%, 2%)', 'hsl(213, 100%, 58%)'] as [string, string],
    description: 'Sleek modern interface'
  },
  { 
    id: 'light-minimal' as Theme, 
    name: 'Light Minimal', 
    colors: ['hsl(0, 0%, 100%)', 'hsl(213, 100%, 52%)'] as [string, string],
    description: 'Clean and minimalist'
  },
  { 
    id: 'midnight-blue' as Theme, 
    name: 'Midnight Blue', 
    colors: ['hsl(210, 40%, 3%)', 'hsl(191, 100%, 55%)'] as [string, string],
    description: 'Deep ocean vibes'
  },
  { 
    id: 'forest-green' as Theme, 
    name: 'Forest Green', 
    colors: ['hsl(120, 40%, 3%)', 'hsl(142, 100%, 45%)'] as [string, string],
    description: 'Natural and organic'
  },
  { 
    id: 'warm-copper' as Theme, 
    name: 'Warm Copper', 
    colors: ['hsl(20, 60%, 3%)', 'hsl(17, 100%, 62%)'] as [string, string],
    description: 'Rich and warm'
  },
  { 
    id: 'deep-purple' as Theme, 
    name: 'Deep Purple', 
    colors: ['hsl(260, 40%, 3%)', 'hsl(270, 100%, 65%)'] as [string, string],
    description: 'Mystical and premium'
  },
  { 
    id: 'arctic-ice' as Theme, 
    name: 'Arctic Ice', 
    colors: ['hsl(200, 30%, 96%)', 'hsl(200, 100%, 45%)'] as [string, string],
    description: 'Cool and pristine'
  },
  { 
    id: 'rose-gold' as Theme, 
    name: 'Rose Gold', 
    colors: ['hsl(340, 30%, 3%)', 'hsl(350, 85%, 65%)'] as [string, string],
    description: 'Elegant and luxurious'
  },
];

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>('dark-professional');

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('coffeeops-theme') as Theme;
    if (savedTheme && THEMES.find(t => t.id === savedTheme)) {
      setThemeState(savedTheme);
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
    // Add smooth transition
    document.documentElement.style.transition = 'all 0.3s ease';
    
    const timeoutId = setTimeout(() => {
      document.documentElement.style.transition = '';
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('coffeeops-theme', newTheme);
  };

  const value = {
    theme,
    setTheme,
    themes: THEMES,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
