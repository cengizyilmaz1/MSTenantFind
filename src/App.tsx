import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';
import CookieConsent from './components/CookieConsent';
import SEO from './components/SEO';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Author = lazy(() => import('./pages/Author'));

// Loading fallback component
const PageLoadingFallback: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
    <div className="text-center">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-slate-600 dark:text-slate-400 font-medium">Loading page...</p>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <SEO />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <Layout>
            <Suspense fallback={<PageLoadingFallback />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/author" element={<Author />} />
              </Routes>
            </Suspense>
          </Layout>
          
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(249, 250, 251, 0.98) 100%)',
                color: '#111827',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '2px solid rgba(229, 231, 235, 0.8)',
                borderRadius: '20px',
                padding: '18px 24px',
                fontSize: '15px',
                fontWeight: '600',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                minWidth: '300px',
                maxWidth: '500px',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#ffffff',
                },
                style: {
                  background: 'linear-gradient(135deg, rgba(236, 253, 245, 0.98) 0%, rgba(209, 250, 229, 0.98) 100%)',
                  color: '#065f46',
                  border: '2px solid rgba(16, 185, 129, 0.3)',
                },
                duration: 3000,
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#ffffff',
                },
                style: {
                  background: 'linear-gradient(135deg, rgba(254, 242, 242, 0.98) 0%, rgba(254, 226, 226, 0.98) 100%)',
                  color: '#991b1b',
                  border: '2px solid rgba(239, 68, 68, 0.3)',
                },
                duration: 5000,
              },
              loading: {
                style: {
                  background: 'linear-gradient(135deg, rgba(239, 246, 255, 0.98) 0%, rgba(219, 234, 254, 0.98) 100%)',
                  color: '#1e40af',
                  border: '2px solid rgba(59, 130, 246, 0.3)',
                },
              },
            }}
          />
          
          <CookieConsent />
        </div>
      </Router>
    </HelmetProvider>
  );
};

export default App;