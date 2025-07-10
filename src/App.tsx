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
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
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
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/author" element={<Author />} />
              </Routes>
            </Suspense>
          </Layout>
          
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(15, 23, 42, 0.95)',
                color: '#f8fafc',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(51, 65, 85, 0.6)',
                borderRadius: '16px',
                padding: '16px',
                fontSize: '14px',
                fontWeight: '500',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#f8fafc',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#f8fafc',
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