import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Global analytics interface
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

const GA_TRACKING_ID = 'G-E6HR73GY9H';

// Initialize Google Analytics with enhanced configuration
export const initializeGA = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    // Enhanced Google Analytics configuration
    window.gtag('config', GA_TRACKING_ID, {
      page_title: document.title,
      page_location: window.location.href,
      send_page_view: true,
      anonymize_ip: true,
      cookie_flags: 'SameSite=None;Secure',
      custom_map: {
        'custom_parameter_1': 'tenant_search',
        'custom_parameter_2': 'search_type',
        'custom_parameter_3': 'user_type'
      }
    });

    // Set default parameters
    window.gtag('set', {
      'custom_parameter_1': 'tenant_finder',
      'app_name': 'Microsoft Tenant Finder',
      'app_version': '2.0.0'
    });

    console.log('Google Analytics initialized with enhanced tracking');
  }
};

// Enhanced page view tracking
export const trackPageView = (path: string, title?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: path,
      page_title: title || document.title,
      page_location: window.location.origin + path,
      content_language: document.documentElement.lang,
      send_page_view: true
    });

    // Additional page view event
    window.gtag('event', 'page_view', {
      page_title: title || document.title,
      page_location: window.location.origin + path,
      page_path: path
    });
  }
};

// Enhanced event tracking
export const trackEvent = (action: string, category?: string, label?: string, value?: number, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category || 'engagement',
      event_label: label,
      value: value,
      ...parameters
    });
  }
};

// Hook to track page views automatically with performance metrics
export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page view
    trackPageView(location.pathname + location.search);

    // Track page load performance
    if ('performance' in window) {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (perfData) {
          trackEvent('timing_complete', 'performance', 'page_load', Math.round(perfData.loadEventEnd - perfData.loadEventStart));
        }
      }, 0);
    }
  }, [location]);
};

// Enhanced search tracking
export const trackSearch = (query: string, results: number, searchType: 'single' | 'bulk' = 'single') => {
  trackEvent('search', 'tenant_lookup', query, results, {
    search_term: query,
    search_type: searchType,
    results_count: results,
    custom_parameter_2: searchType
  });

  // Track search performance
  trackEvent('search_performance', 'user_behavior', `${searchType}_search`, results);
};

// Enhanced export tracking
export const trackExport = (format: string, count: number, fileSize?: number) => {
  trackEvent('export', 'data_export', format, count, {
    export_format: format,
    export_count: count,
    file_size: fileSize
  });

  // Track user engagement
  trackEvent('file_download', 'engagement', format, count);
};

// Enhanced copy tracking
export const trackCopy = (content: string, contentType: 'tenant_id' | 'mx_record' | 'spf_record' | 'other' = 'other') => {
  trackEvent('copy', 'user_interaction', contentType, content.length, {
    content_type: contentType,
    content_length: content.length
  });

  // Track clipboard usage
  trackEvent('clipboard_usage', 'productivity', contentType);
};

// Language change tracking
export const trackLanguageChange = (language: string, previousLanguage?: string) => {
  trackEvent('language_change', 'localization', language, undefined, {
    new_language: language,
    previous_language: previousLanguage || 'unknown'
  });
};

// User engagement tracking
export const trackUserEngagement = (action: 'scroll' | 'click' | 'hover' | 'focus', element?: string) => {
  trackEvent('user_engagement', 'interaction', action, undefined, {
    engagement_type: action,
    element: element
  });
};

// Error tracking
export const trackError = (error: Error, errorInfo?: string) => {
  trackEvent('exception', 'error', error.message, undefined, {
    description: error.message,
    error_info: errorInfo,
    fatal: false
  });
};

// Performance tracking
export const trackPerformance = (metric: string, value: number, unit: 'ms' | 'bytes' | 'count' = 'ms') => {
  trackEvent('performance_metric', 'performance', metric, value, {
    metric_name: metric,
    metric_value: value,
    metric_unit: unit
  });
};

// Conversion tracking
export const trackConversion = (conversionType: 'search_success' | 'export_success' | 'blog_read', value?: number) => {
  trackEvent('conversion', 'goal_completion', conversionType, value, {
    conversion_type: conversionType
  });
};

// Social sharing tracking
export const trackSocialShare = (platform: string, content: string) => {
  trackEvent('share', 'social_media', platform, undefined, {
    platform: platform,
    content_type: content
  });
};

// Feature usage tracking
export const trackFeatureUsage = (feature: string, usage_count: number = 1) => {
  trackEvent('feature_usage', 'product_analytics', feature, usage_count, {
    feature_name: feature,
    usage_count: usage_count
  });
};

// Session tracking
export const trackSessionStart = () => {
  trackEvent('session_start', 'user_behavior', 'session_begin', undefined, {
    session_id: Math.random().toString(36).substr(2, 9)
  });
};

// Scroll depth tracking
export const trackScrollDepth = (depth: number) => {
  trackEvent('scroll', 'user_engagement', `${depth}%`, depth, {
    scroll_depth: depth
  });
};

// Form interaction tracking
export const trackFormInteraction = (action: 'focus' | 'blur' | 'input' | 'submit', formName: string) => {
  trackEvent('form_interaction', 'user_input', action, undefined, {
    form_name: formName,
    interaction_type: action
  });
};