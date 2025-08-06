import { createContext, ReactNode } from 'react';

export type Theme = 
  | 'dark-professional'
  | 'light-minimal' 
  | 'midnight-blue'
  | 'forest-green'
  | 'warm-copper'
  | 'deep-purple'
  | 'arctic-ice'
  | 'rose-gold';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themes: { id: Theme; name: string; colors: [string, string]; description: string }[];
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
