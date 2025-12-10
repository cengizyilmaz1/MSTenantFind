import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Check, Settings } from 'lucide-react';

const CookieConsent: React.FC = () => {
  const [showConsent, setShowConsent] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowConsent(false);
  };

  const declineCookies = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setShowConsent(false);
  };

  const acceptEssential = () => {
    localStorage.setItem('cookieConsent', 'essential');
    setShowConsent(false);
    setShowSettings(false);
  };

  if (!showConsent) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4"
      >
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Cookie className="w-6 h-6 text-white" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  Cookie Preferences
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">
                  We use essential cookies for theme and language preferences. We also use Google Analytics to understand usage patterns and improve our service. 
                  No personal data is collected or stored.
                </p>
                
                <div className="flex flex-wrap gap-3">
                  <motion.button
                    onClick={acceptCookies}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-green-500/25"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Check className="w-4 h-4" />
                    Accept All
                  </motion.button>
                  
                  <motion.button
                    onClick={() => setShowSettings(!showSettings)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl font-medium transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Settings className="w-4 h-4" />
                    Customize
                  </motion.button>
                  
                  <motion.button
                    onClick={declineCookies}
                    className="inline-flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <X className="w-4 h-4" />
                    Decline
                  </motion.button>
                </div>
              </div>
            </div>
            
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50/80 dark:bg-slate-800/80 rounded-xl">
                      <div>
                        <h4 className="font-medium text-slate-900 dark:text-white">Essential Cookies</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Required for basic site functionality</p>
                      </div>
                      <div className="text-green-600 font-medium">Always Active</div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-slate-50/80 dark:bg-slate-800/80 rounded-xl">
                      <div>
                        <h4 className="font-medium text-slate-900 dark:text-white">Analytics Cookies</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Help us understand how you use our service</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex gap-3">
                      <motion.button
                        onClick={acceptEssential}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Save Preferences
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CookieConsent;