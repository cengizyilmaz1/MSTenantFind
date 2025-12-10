import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

// 404 Not Found Component
const NotFound = lazy(() => import('./pages/NotFound'));

// Loading fallback component
const PageLoadingFallback: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" role="status" aria-label="Loading page">
    <div className="text-center">
      <LoadingSpinner size="lg" variant="dots" />
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
                {/* 404 Not Found Route */}
                <Route path="/404" element={<NotFound />} />
                {/* Catch all unmatched routes */}
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </Suspense>
          </Layout>
          
          <Toaster
            position="top-center"
            gutter={12}
            containerStyle={{
              top: 20,
            }}
            toastOptions={{
              duration: 3000,
              style: {
                background: 'rgba(255, 255, 255, 0.95)',
                color: '#1f2937',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(229, 231, 235, 0.6)',
                borderRadius: '16px',
                padding: '14px 20px',
                fontSize: '14px',
                fontWeight: '500',
                boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5)',
                maxWidth: '420px',
                lineHeight: '1.5',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#ffffff',
                },
                style: {
                  background: 'linear-gradient(135deg, rgba(236, 253, 245, 0.98) 0%, rgba(220, 252, 231, 0.98) 100%)',
                  color: '#065f46',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  boxShadow: '0 10px 40px -10px rgba(16, 185, 129, 0.3), 0 0 0 1px rgba(16, 185, 129, 0.1)',
                },
                duration: 2500,
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#ffffff',
                },
                style: {
                  background: 'linear-gradient(135deg, rgba(254, 242, 242, 0.98) 0%, rgba(254, 226, 226, 0.98) 100%)',
                  color: '#991b1b',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  boxShadow: '0 10px 40px -10px rgba(239, 68, 68, 0.3), 0 0 0 1px rgba(239, 68, 68, 0.1)',
                },
                duration: 4000,
              },
              loading: {
                style: {
                  background: 'linear-gradient(135deg, rgba(239, 246, 255, 0.98) 0%, rgba(219, 234, 254, 0.98) 100%)',
                  color: '#1e40af',
                  border: '1px solid rgba(59, 130, 246, 0.25)',
                  boxShadow: '0 10px 40px -10px rgba(59, 130, 246, 0.3), 0 0 0 1px rgba(59, 130, 246, 0.1)',
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