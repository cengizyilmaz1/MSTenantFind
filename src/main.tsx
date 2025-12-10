import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Apply theme based on localStorage or system preference
const applyTheme = () => {
  const stored = localStorage.getItem('theme');
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const theme = stored || systemTheme;
  
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

// Apply theme immediately to prevent flash
applyTheme();

// Mark document as hydrated for CSS transitions
const markHydrated = () => {
  document.documentElement.classList.add('hydrated');
};

// Performance monitoring
const reportWebVitals = () => {
  if ('performance' in window && 'getEntriesByType' in performance) {
    const paintEntries = performance.getEntriesByType('paint');
    paintEntries.forEach((entry) => {
      console.debug(`${entry.name}: ${Math.round(entry.startTime)}ms`);
    });
  }
};

const rootElement = document.getElementById('root')!;

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Mark as hydrated after render
markHydrated();

// Report web vitals in development
if (import.meta.env.DEV) {
  reportWebVitals();
}