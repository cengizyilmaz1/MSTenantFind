import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import SearchForm from './components/SearchForm';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Author from './pages/Author';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import CookieConsent from './components/CookieConsent';
import SEO from './components/SEO';
import { initializeGA, usePageTracking, trackPageView } from './utils/analytics';

// Google Analytics page tracking component
const GoogleAnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page view
    if (window.gtag) {
      window.gtag('config', 'G-E6HR73GY9H', {
        page_path: location.pathname + location.search,
        page_title: document.title
      });
    }
  }, [location]);

  return null;
};

// Analytics wrapper component
const AnalyticsWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  usePageTracking();
  return <>{children}</>;
};

function App() {
  useEffect(() => {
    initializeGA();
    // Track initial page view
    trackPageView(window.location.pathname + window.location.search);
  }, []);

  return (
    <MotionConfig>
      <HelmetProvider>
        <Router>
          <GoogleAnalyticsTracker />
          <AnalyticsWrapper>
            <Layout>
              <Routes>
                <Route path="/" element={
                  <>
                    <SEO path="/" type="website" />
                    <SearchForm />
                  </>
                } />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/privacy" element={
                  <>
                    <SEO path="/privacy" type="article" />
                    <Privacy />
                  </>
                } />
                <Route path="/terms" element={
                  <>
                    <SEO path="/terms" type="article" />
                    <Terms />
                  </>
                } />
                <Route path="/cengizyilmazkimdir" element={
                  <>
                    <SEO path="/cengizyilmazkimdir" type="profile" />
                    <Author />
                  </>
                } />
                {/* Catch all route to redirect to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <CookieConsent />
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: 'var(--toast-bg)',
                    color: 'var(--toast-color)',
                    border: '1px solid var(--toast-border)',
                  },
                }}
              />
            </Layout>
          </AnalyticsWrapper>
        </Router>
      </HelmetProvider>
    </MotionConfig>
  );
}

export default App;