import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown, Check } from 'lucide-react';

const languages = [
  {
    code: 'tr',
    name: 'Türkçe',
    flag: '🇹🇷',
    nativeName: 'Türkçe'
  },
  {
    code: 'en',
    name: 'English',
    flag: '🇺🇸',
    nativeName: 'English'
  }
];

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'dropdown' | 'toggle' | 'compact';
  showFlag?: boolean;
  showName?: boolean;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  className = '',
  variant = 'dropdown',
  showFlag = true,
  showName = true
}) => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  
  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];
  const otherLanguages = languages.filter(lang => lang.code !== i18n.language);

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
    
    // Track language change
    if (window.gtag) {
      window.gtag('event', 'language_change', {
        event_category: 'engagement',
        event_label: langCode,
        value: 1
      });
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  if (variant === 'toggle') {
    return (
      <div className={`flex items-center space-x-1 ${className}`}>
        {languages.map((lang) => (
          <motion.button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`
              px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200
              ${i18n.language === lang.code 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={t('language.switchTo', { language: lang.name })}
          >
            {showFlag && <span className="mr-1">{lang.flag}</span>}
            {showName && <span>{lang.code.toUpperCase()}</span>}
          </motion.button>
        ))}
      </div>
    );
  }

  if (variant === 'compact') {
    const nextLanguage = otherLanguages[0];
    return (
      <motion.button
        onClick={() => handleLanguageChange(nextLanguage.code)}
        className={`
          flex items-center space-x-1 px-2 py-1 text-sm text-gray-600 dark:text-gray-300
          hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 ${className}
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={t('language.switchTo', { language: nextLanguage.name })}
      >
        <Globe className="w-4 h-4" />
        {showFlag && <span>{nextLanguage.flag}</span>}
        {showName && <span className="hidden sm:inline">{nextLanguage.code.toUpperCase()}</span>}
      </motion.button>
    );
  }

  // Default dropdown variant
  return (
    <div className={`relative ${className}`}>
      <motion.button
        onClick={toggleDropdown}
        className="
          flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200
          bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg
          hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500
          transition-all duration-200
        "
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={t('accessibility.languageSwitch')}
      >
        <Globe className="w-4 h-4" />
        {showFlag && <span>{currentLanguage.flag}</span>}
        {showName && <span className="hidden sm:inline">{currentLanguage.nativeName}</span>}
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="
                absolute right-0 top-full mt-2 w-48 z-20
                bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg
                py-1 max-h-60 overflow-auto
              "
              role="listbox"
            >
              {languages.map((lang) => (
                <motion.button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className="
                    flex items-center justify-between w-full px-4 py-2 text-sm text-left
                    text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700
                    focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700
                    transition-colors duration-150
                  "
                  whileHover={{ x: 4 }}
                  role="option"
                  aria-selected={i18n.language === lang.code}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{lang.flag}</span>
                    <div>
                      <div className="font-medium">{lang.nativeName}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{lang.name}</div>
                    </div>
                  </div>
                  
                  {i18n.language === lang.code && (
                    <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  )}
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher; 