import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Sun, Moon, Github, User, FileText, Shield, Home, Linkedin, Award, Menu, X, Globe2, Twitter, ExternalLink, MessageCircle, Newspaper } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

// Custom theme hook
const useTheme = () => {
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    const stored = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    return (stored as 'light' | 'dark') || systemTheme;
  });

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return { theme, setTheme };
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme, setTheme } = useTheme();
  const { i18n, t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'tr' : 'en';
    
    // Update the URL
    const url = new URL(window.location.href);
    if (newLang === 'en') {
      url.searchParams.delete('lang');
    } else {
      url.searchParams.set('lang', newLang);
    }
    
    // Change language without forcing page refresh
    i18n.changeLanguage(newLang).then(() => {
      window.history.pushState({}, '', url.toString());
    });
  };

  const NavTooltip = ({ children, content }: { children: React.ReactNode; content: string }) => (
    <div className="group relative">
      {children}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 px-3 py-2 bg-gray-900/90 dark:bg-gray-700/90 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50">
        {content}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-gray-900/90 dark:border-b-gray-700/90"></div>
      </div>
    </div>
  );

  const navItems = [
    { path: '/blog', icon: Newspaper, label: t('navigation.blog'), tooltip: t('navigation.blog') },
    { path: '/cengizyilmazkimdir', icon: User, label: t('navigation.about'), tooltip: t('navigation.about') },
    { path: '/terms', icon: FileText, label: t('navigation.terms'), tooltip: t('navigation.terms') },
    { path: '/privacy', icon: Shield, label: t('navigation.privacy'), tooltip: t('navigation.privacy') }
  ];

  const socialLinks = [
    { href: 'https://github.com/cengizyilmaz1', icon: Github, label: 'GitHub' },
    { href: 'https://linkedin.com/in/cengizyilmazz', icon: Linkedin, label: 'LinkedIn' },
    { href: 'https://twitter.com/cengizyilmaz_', icon: Twitter, label: 'Twitter' }
  ];

  const externalLinks = [
    { href: 'https://message.cengizyilmaz.net', icon: MessageCircle, label: 'Message Center' },
    { href: 'https://cengizyilmaz.net', icon: ExternalLink, label: 'CengizYILMAZ Blog' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 transition-all duration-500">
      {/* Ultra-Modern Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-700/60 shadow-lg shadow-slate-900/5 dark:shadow-slate-900/20" role="navigation" aria-label="Main navigation">
        <div className="max-w-6xl mx-auto px-4 lg:px-6">
          <div className="flex justify-between items-center h-16">
            
            {/* Modern Logo Section */}
            <div className="flex items-center">
              <Link 
                to="/" 
                className="group flex items-center gap-3 py-2 transition-all duration-300"
                aria-label="Go to home page"
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all duration-300 group-hover:scale-105">
                    <Home className="h-5 w-5 text-white" />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="hidden sm:block">
                  <div className="text-lg font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-blue-700 dark:from-white dark:via-slate-200 dark:to-blue-300 bg-clip-text text-transparent">
                    MS Tenant Finder
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium -mt-0.5">
                    Professional Tool
                  </div>
                </div>
              </Link>
            </div>

            {/* Clean Center Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavTooltip key={item.path} content={item.tooltip}>
                    <Link
                      to={item.path}
                      className="group flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80 rounded-xl transition-all duration-200 backdrop-blur-xl"
                      aria-label={item.tooltip}
                    >
                      <Icon size={16} className="transition-transform duration-200 group-hover:scale-110" />
                      <span>{item.label}</span>
                    </Link>
                  </NavTooltip>
                );
              })}
            </div>

            {/* Modern Right Controls */}
            <div className="hidden lg:flex items-center gap-3">
              
              {/* External Links */}
              <div className="flex items-center gap-1">
                {externalLinks.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <NavTooltip key={index} content={link.label}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="dofollow"
                        className="group flex items-center gap-2 px-3 py-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80 rounded-xl transition-all duration-200 backdrop-blur-xl font-medium cursor-pointer"
                        aria-label={link.label}
                      >
                        <Icon size={14} className="transition-transform duration-200 group-hover:scale-110" />
                        <span className="text-sm">{link.label}</span>
                      </a>
                    </NavTooltip>
                  );
                })}
              </div>

              {/* Icon Controls */}
              <div className="flex items-center gap-1 pl-2 border-l border-slate-200 dark:border-slate-700">
                <NavTooltip content={i18n.language === 'en' ? 'Türkçeye Geç' : 'Switch to English'}>
                  <button
                    onClick={toggleLanguage}
                    className="group p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80 rounded-xl transition-all duration-200 backdrop-blur-xl cursor-pointer"
                    aria-label={i18n.language === 'en' ? 'Switch to Turkish' : 'Switch to English'}
                  >
                    <Globe2 size={16} className="transition-transform duration-200 group-hover:scale-110" />
                  </button>
                </NavTooltip>

                <NavTooltip content={theme === 'dark' ? 'Açık Tema' : 'Koyu Tema'}>
                  <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="group p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80 rounded-xl transition-all duration-200 backdrop-blur-xl cursor-pointer"
                    aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                  >
                    {theme === 'dark' ? 
                      <Sun size={16} className="transition-transform duration-200 group-hover:scale-110 group-hover:rotate-90" /> : 
                      <Moon size={16} className="transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-12" />
                    }
                  </button>
                </NavTooltip>

                {/* Social Links */}
                {socialLinks.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <NavTooltip key={index} content={link.label}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="dofollow"
                        className="group p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80 rounded-xl transition-all duration-200 backdrop-blur-xl cursor-pointer"
                        aria-label={link.label}
                      >
                        <Icon size={16} className="transition-transform duration-200 group-hover:scale-110" />
                      </a>
                    </NavTooltip>
                  );
                })}
              </div>
            </div>

            {/* Mobile Menu Button - Bigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-4 rounded-2xl text-slate-600 dark:text-slate-300 transition-all duration-300 outline-none"
              aria-label="Toggle menu"
            >
              <div className="transition-transform duration-300">
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </div>
            </button>
          </div>

          {/* Mobile Menu - Enhanced */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="lg:hidden mt-4 pb-6"
              >
                <div className="space-y-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
                  {navItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={item.path}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Link
                          to={item.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 outline-none text-slate-600 dark:text-slate-300"
                        >
                          <Icon size={18} />
                          <span className="font-medium text-lg">{item.tooltip}</span>
                        </Link>
                      </motion.div>
                    );
                  })}
                  
                  {/* Mobile External Links */}
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3 px-2">External Links</p>
                    {externalLinks.map((link, index) => {
                      const Icon = link.icon;
                      return (
                        <motion.div
                          key={link.href}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: (navItems.length + index) * 0.1 }}
                        >
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 text-slate-600 dark:text-slate-300 outline-none"
                          >
                            <Icon size={18} />
                            <span className="font-medium text-lg">{link.label}</span>
                            <ExternalLink size={16} className="ml-auto" />
                          </a>
                        </motion.div>
                      );
                    })}
                  </div>
                  
                  {/* Mobile Controls - Better Layout */}
                  <div className="flex gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <button
                      onClick={toggleLanguage}
                      className="flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-300 flex-1 outline-none"
                    >
                      <Globe2 size={18} className="text-slate-600 dark:text-slate-300 transition-colors duration-300" />
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-300 uppercase">
                        {i18n.language === 'en' ? 'TR' : 'EN'}
                      </span>
                    </button>
                    
                    <button
                      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                      className="p-3 rounded-xl text-slate-600 dark:text-slate-300 transition-all duration-300 outline-none"
                    >
                      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-8" role="main" aria-label="Main content">
        {children}
      </main>

      {/* Compact Footer */}
      <footer className="relative border-t border-white/30 dark:border-slate-700/30" role="contentinfo" aria-label="Footer">
        <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-white/40 to-white/60 dark:from-slate-900/60 dark:via-slate-900/40 dark:to-slate-900/60 backdrop-blur-2xl"></div>
        <div className="relative max-w-6xl mx-auto py-6 px-4 lg:px-6">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="text-center lg:text-left">
              <p className="text-slate-600 dark:text-slate-400 flex items-center gap-3 flex-wrap justify-center lg:justify-start text-sm">
                © {new Date().getFullYear()}{' '}
                <a 
                  href="https://cengizyilmaz.net" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-300 font-medium"
                  aria-label="Visit Cengiz YILMAZ's website"
                >
                  Cengiz YILMAZ
                </a>
                <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-gradient-to-r from-orange-500/10 to-red-500/10 dark:from-orange-500/20 dark:to-red-500/20 border border-orange-200/30 dark:border-orange-700/30 backdrop-blur-xl">
                  <Award className="w-3 h-3 text-orange-600 dark:text-orange-400" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400 font-medium text-xs">
                    Microsoft MVP
                  </span>
                </span>
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                to="/privacy"
                className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 text-xs font-medium"
                aria-label="Privacy policy"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 text-xs font-medium"
                aria-label="Terms of service"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;