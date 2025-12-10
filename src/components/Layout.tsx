import React, { useState, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { useTheme } from '../utils/theme';
import { siteConfig } from '../config';
import SocialLinks from './SocialLinks';
import Navigation from './Navigation';
import OwlIcon from './OwlIcon';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = memo(({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);



  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip to main content link for accessibility */}
      <a 
        href="#main-content" 
        className="skip-link sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Navigation Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 backdrop-blur-3xl bg-gradient-to-r from-white/90 via-blue-50/80 to-indigo-50/90 dark:from-slate-900/90 dark:via-slate-800/80 dark:to-slate-900/90 border-b border-blue-200/40 dark:border-blue-800/40 shadow-2xl shadow-blue-500/10 dark:shadow-purple-500/10"
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/"
                onClick={closeMobileMenu}
                className="flex items-center gap-4 group"
              >
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl group-hover:shadow-indigo-500/30 transition-all duration-500 group-hover:rotate-3 p-2">
                    <OwlIcon className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/30 via-purple-500/30 to-indigo-600/30 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-110"></div>
                </div>
                <div className="hidden md:block">
                  <div className="flex flex-col">
                    <span className="text-2xl font-black bg-gradient-to-r from-slate-900 via-blue-700 to-indigo-700 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:via-purple-600 group-hover:to-indigo-600 dark:group-hover:from-blue-300 dark:group-hover:via-purple-300 dark:group-hover:to-indigo-300 transition-all duration-300">
                      TenantFind
                    </span>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      Microsoft Tenant Discovery
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <Navigation variant="desktop" />

            {/* Actions */}
            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <motion.button
                onClick={toggleTheme}
                className="relative p-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 hover:bg-white/95 dark:hover:bg-slate-700/90 transition-all duration-300 group border-2 border-white/60 dark:border-slate-700/60 hover:border-yellow-200/60 dark:hover:border-yellow-600/60 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Toggle theme"
              >
                <AnimatePresence mode="wait">
                  {theme === 'dark' ? (
                    <motion.div
                      key="sun"
                      initial={{ rotate: -180, opacity: 0, scale: 0.5 }}
                      animate={{ rotate: 0, opacity: 1, scale: 1 }}
                      exit={{ rotate: 180, opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.4, type: "spring" }}
                    >
                      <Sun className="w-6 h-6 text-yellow-500 group-hover:text-yellow-400 drop-shadow-lg" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ rotate: 180, opacity: 0, scale: 0.5 }}
                      animate={{ rotate: 0, opacity: 1, scale: 1 }}
                      exit={{ rotate: -180, opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.4, type: "spring" }}
                    >
                      <Moon className="w-6 h-6 text-slate-600 group-hover:text-slate-900 drop-shadow-lg" />
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 dark:from-blue-400/20 dark:to-purple-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
              </motion.button>

              {/* Social Links */}
              <SocialLinks 
                variant="header" 
                size="lg" 
                className="hidden sm:flex" 
              />

              {/* Mobile Menu Button */}
              <motion.button
                onClick={toggleMobileMenu}
                className="md:hidden relative p-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 hover:bg-white/95 dark:hover:bg-slate-700/90 transition-all duration-300 border-2 border-white/60 dark:border-slate-700/60 hover:border-purple-200/60 dark:hover:border-purple-600/60 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -180, opacity: 0, scale: 0.5 }}
                      animate={{ rotate: 0, opacity: 1, scale: 1 }}
                      exit={{ rotate: 180, opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.3, type: "spring" }}
                    >
                      <X className="w-6 h-6 text-red-500 dark:text-red-400" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 180, opacity: 0, scale: 0.5 }}
                      animate={{ rotate: 0, opacity: 1, scale: 1 }}
                      exit={{ rotate: -180, opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.3, type: "spring" }}
                    >
                      <Menu className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 md:hidden"
                onClick={closeMobileMenu}
              />
              
              {/* Mobile Menu */}
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute top-full left-0 right-0 z-50 mx-4 mt-2 md:hidden"
              >
                <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-2xl p-6">
                  <Navigation variant="mobile" onItemClick={closeMobileMenu} />

                  {/* Mobile Social Links */}
                  <div className="mt-6 pt-6 border-t border-slate-200/60 dark:border-slate-700/60">
                    <SocialLinks 
                      variant="mobile" 
                      size="md" 
                      className="justify-center" 
                    />
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Main Content */}
      <main id="main-content" className="flex-1" role="main" tabIndex={-1}>
        {children}
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-t border-slate-200/60 dark:border-slate-700/60"
        role="contentinfo"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg p-1">
                  <OwlIcon className="w-8 h-8 text-white" />
                </div>
                <span className="text-xl font-black bg-gradient-to-r from-slate-900 via-blue-700 to-indigo-700 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                  {siteConfig.shortName}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {siteConfig.description}
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Quick Links</h3>
              <Navigation variant="footer" />
            </div>

            {/* Contact & Social */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Connect</h3>
              <div className="space-y-3">
                <p className="text-slate-600 dark:text-slate-400">
                  Built with ❤️ by{' '}
                  <a
                    href={siteConfig.author.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200"
                  >
                    {siteConfig.author.name}
                  </a>
                </p>
                <SocialLinks 
                  variant="footer" 
                  size="sm" 
                />
              </div>
            </div>
          </div>

          {/* Backlinks Section */}
          <div className="mt-8 pt-8 border-t border-slate-200/60 dark:border-slate-700/60">
            <div className="text-center space-y-4">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Other Projects</h4>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="https://cengizyilmaz.net"
                    target="_blank"
                    rel="noopener noreferrer"
                  className="px-4 py-2 text-sm bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 rounded-lg transition-colors duration-200 text-slate-700 dark:text-slate-300"
                >
                  cengizyilmaz.net
                </a>
                <a
                  href="https://message.cengizyilmaz.net"
                    target="_blank"
                    rel="noopener noreferrer"
                  className="px-4 py-2 text-sm bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 rounded-lg transition-colors duration-200 text-slate-700 dark:text-slate-300"
                >
                  message.cengizyilmaz.net
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 pt-8 border-t border-slate-200/60 dark:border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              © {siteConfig.copyright.year} {siteConfig.shortName}. {siteConfig.copyright.rights}
            </p>
            <div className="flex items-center gap-6 text-sm">
              <Link
                to="/privacy"
                className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
              >
                Privacy
              </Link>
              <Link
                to="/terms"
                className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
});

Layout.displayName = 'Layout';

export default Layout;