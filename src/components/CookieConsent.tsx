import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const CookieConsent: React.FC = () => {
  const [showConsent, setShowConsent] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'true');
    setShowConsent(false);
  };

  const declineCookies = () => {
    localStorage.setItem('cookie-consent', 'false');
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 shadow-lg z-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('analytics.cookieConsent')}
            </p>
            <a 
              href="/privacy" 
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
            >
              {t('analytics.learnMore')}
            </a>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={declineCookies}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
            >
              {t('analytics.decline')}
            </button>
            <button
              onClick={acceptCookies}
              className="px-6 py-2 bg-microsoft-600 hover:bg-microsoft-700 text-white rounded-lg transition-colors duration-200 whitespace-nowrap"
            >
              {t('analytics.accept')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;