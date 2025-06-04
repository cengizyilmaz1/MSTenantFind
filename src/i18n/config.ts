import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import tr from './locales/tr.json';

const resources = {
  en: { translation: en },
  tr: { translation: tr },
};

// Custom language detector for URL-based language switching
const customDetector = {
  name: 'customDetector',
  lookup() {
    const urlParams = new URLSearchParams(window.location.search);
    const langFromUrl = urlParams.get('lang');
    
    if (langFromUrl && ['tr', 'en'].includes(langFromUrl)) {
      return langFromUrl;
    }
    
    // Check browser language
    const browserLang = navigator.language.toLowerCase();
    
    // If browser is Turkish, use Turkish, otherwise default to English
    if (browserLang.startsWith('tr')) {
      return 'tr';
    }
    
    return 'en'; // Default to English
  },
  cacheUserLanguage(lng: string) {
    try {
      localStorage.setItem('i18nextLng', lng);
    } catch (e) {
      console.warn('Unable to cache language preference:', e);
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'translation',
    debug: import.meta.env.DEV,
    
    detection: {
      order: ['customDetector', 'querystring', 'localStorage', 'navigator'],
      lookupQuerystring: 'lang',
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    },
    
    interpolation: {
      escapeValue: false,
    },
    
    react: {
      bindI18n: 'languageChanged',
      useSuspense: false,
    },
    
    supportedLngs: ['tr', 'en'],
    
    saveMissing: import.meta.env.DEV,
    missingKeyHandler: function(lng, _, key) {
      if (import.meta.env.DEV) {
        console.warn(`Missing translation key: ${key} for language: ${lng}`);
      }
    }
  });

// Register custom detector
i18n.services.languageDetector.addDetector(customDetector);

// Update URL and metadata when language changes
i18n.on('languageChanged', (lng) => {
  const url = new URL(window.location.href);
  
  // Default language (EN) doesn't need lang parameter
  if (lng === 'en') {
    url.searchParams.delete('lang');
  } else {
    url.searchParams.set('lang', lng);
  }
  
  window.history.replaceState({}, '', url.toString());
  document.documentElement.lang = lng;
  
  // Track language change in analytics
  if (window.gtag) {
    window.gtag('event', 'language_change', {
      event_category: 'engagement',
      event_label: lng,
    });
  }
});

export default i18n; 