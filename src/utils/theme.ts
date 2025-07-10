import { useState, useEffect } from 'react';

// Modern Color Palette
export const colors = {
  // Primary Microsoft-inspired colors
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6', // Main primary
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  
  // Microsoft Blue variants
  microsoft: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  
  // Success states
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  
  // Warning states
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  
  // Error states
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  
  // Neutral grays
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
};

// Theme hook for managing dark/light mode
export const useTheme = () => {
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';
    
    const stored = localStorage.getItem('theme');
    if (stored && (stored === 'light' || stored === 'dark')) {
      return stored;
    }
    
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return { theme, setTheme, toggleTheme };
};

// Theme configuration
export const theme = {
  light: {
    bg: {
      primary: colors.gray[50],
      secondary: '#ffffff',
      tertiary: colors.gray[100],
    },
    text: {
      primary: colors.gray[900],
      secondary: colors.gray[700],
      tertiary: colors.gray[500],
    },
    border: {
      primary: colors.gray[200],
      secondary: colors.gray[300],
    },
    accent: {
      primary: colors.microsoft[600],
      secondary: colors.primary[500],
    }
  },
  dark: {
    bg: {
      primary: colors.gray[900],
      secondary: colors.gray[800],
      tertiary: colors.gray[700],
    },
    text: {
      primary: colors.gray[50],
      secondary: colors.gray[300],
      tertiary: colors.gray[400],
    },
    border: {
      primary: colors.gray[700],
      secondary: colors.gray[600],
    },
    accent: {
      primary: colors.microsoft[500],
      secondary: colors.primary[400],
    }
  }
};

// Status colors
export const statusColors = {
  success: colors.success[500],
  warning: colors.warning[500],
  error: colors.error[500],
  info: colors.microsoft[500],
  pending: colors.gray[400],
};

// Icon utilities
export const iconSizes = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
  '2xl': 'w-10 h-10',
  '3xl': 'w-12 h-12',
};

// Button variants
export const buttonVariants = {
  primary: `
    bg-gradient-to-r from-microsoft-600 to-primary-600 
    hover:from-microsoft-700 hover:to-primary-700
    text-white font-medium
    shadow-lg hover:shadow-xl
    transform hover:scale-105
    transition-all duration-200
  `,
  secondary: `
    bg-white dark:bg-gray-800 
    text-gray-900 dark:text-gray-100
    border border-gray-300 dark:border-gray-600
    hover:bg-gray-50 dark:hover:bg-gray-700
    shadow-sm hover:shadow-md
    transition-all duration-200
  `,
  success: `
    bg-gradient-to-r from-success-500 to-success-600
    hover:from-success-600 hover:to-success-700
    text-white font-medium
    shadow-lg hover:shadow-xl
    transition-all duration-200
  `,
  warning: `
    bg-gradient-to-r from-warning-500 to-warning-600
    hover:from-warning-600 hover:to-warning-700
    text-white font-medium
    shadow-lg hover:shadow-xl
    transition-all duration-200
  `,
  error: `
    bg-gradient-to-r from-error-500 to-error-600
    hover:from-error-600 hover:to-error-700
    text-white font-medium
    shadow-lg hover:shadow-xl
    transition-all duration-200
  `,
  ghost: `
    text-gray-700 dark:text-gray-300
    hover:bg-gray-100 dark:hover:bg-gray-800
    hover:text-gray-900 dark:hover:text-gray-100
    transition-all duration-200
  `,
};

// Card variants
export const cardVariants = {
  default: `
    bg-white dark:bg-gray-800
    border border-gray-200 dark:border-gray-700
    rounded-xl shadow-sm hover:shadow-lg
    transition-all duration-300
  `,
  elevated: `
    bg-white dark:bg-gray-800
    border border-gray-200 dark:border-gray-700
    rounded-xl shadow-lg hover:shadow-xl
    transform hover:-translate-y-1
    transition-all duration-300
  `,
  success: `
    bg-success-50 dark:bg-success-900/20
    border border-success-200 dark:border-success-800
    rounded-xl shadow-sm
  `,
  warning: `
    bg-warning-50 dark:bg-warning-900/20
    border border-warning-200 dark:border-warning-800
    rounded-xl shadow-sm
  `,
  error: `
    bg-error-50 dark:bg-error-900/20
    border border-error-200 dark:border-error-800
    rounded-xl shadow-sm
  `,
};

// Input variants
export const inputVariants = {
  default: `
    bg-white dark:bg-gray-900
    border border-gray-300 dark:border-gray-600
    rounded-lg px-4 py-3
    text-gray-900 dark:text-gray-100
    placeholder-gray-500 dark:placeholder-gray-400
    focus:ring-2 focus:ring-microsoft-500 focus:border-transparent
    shadow-sm hover:shadow-md
    transition-all duration-200
  `,
  error: `
    bg-white dark:bg-gray-900
    border border-error-300 dark:border-error-600
    rounded-lg px-4 py-3
    text-gray-900 dark:text-gray-100
    placeholder-gray-500 dark:placeholder-gray-400
    focus:ring-2 focus:ring-error-500 focus:border-transparent
    shadow-sm
    transition-all duration-200
  `,
};

// Animation utilities
export const animations = {
  fadeIn: 'animate-fadeIn',
  slideIn: 'animate-slideIn',
  slideUp: 'animate-slideUp',
  bounce: 'animate-bounce',
  pulse: 'animate-pulse',
  spin: 'animate-spin',
};

// Responsive breakpoints
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Helper function to get theme-aware classes
export const getThemeClass = (lightClass: string, darkClass: string): string => {
  return `${lightClass} dark:${darkClass}`;
};

// Helper function to combine classes
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
}; 