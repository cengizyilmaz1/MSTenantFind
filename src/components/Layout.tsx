import React, { useState, useCallback, memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BookOpen, Shield, User, Menu, X, Github, Twitter, Linkedin, Moon, Sun, Sparkles } from 'lucide-react';
import { useTheme } from '../utils/theme';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = memo(({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const navigation = [
    { name: 'Home', href: '/', icon: Search, description: 'Find Microsoft Tenant IDs', external: false },
    { name: 'Blog', href: '/blog', icon: BookOpen, description: 'Tech insights and tutorials', external: false },
    { name: 'Personal Blog', href: 'https://blog.cengizyilmaz.org', icon: BookOpen, description: 'Personal blog and articles', external: true },
    { name: 'Author', href: '/author', icon: User, description: 'About the developer', external: false },
  ];

  const isActivePath = useCallback((path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 backdrop-blur-3xl bg-gradient-to-r from-white/90 via-blue-50/80 to-indigo-50/90 dark:from-slate-900/90 dark:via-slate-800/80 dark:to-slate-900/90 border-b border-gradient-to-r from-blue-200/40 via-purple-200/40 to-indigo-200/40 dark:from-blue-800/40 dark:via-purple-800/40 dark:to-indigo-800/40 shadow-2xl shadow-blue-500/10 dark:shadow-purple-500/10"
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
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl group-hover:shadow-blue-500/30 transition-all duration-500 group-hover:rotate-3">
                    <Search className="w-7 h-7 text-white group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-indigo-600/30 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-110"></div>
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
            <nav className="hidden md:flex items-center gap-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = isActivePath(item.href);
                
                return (
                  <motion.div
                    key={item.name}
                    whileHover={{ y: -3, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.external ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`
                          group relative flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 border-2
                          text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white/70 dark:bg-slate-800/70 hover:bg-white/90 dark:hover:bg-slate-700/90 border-white/50 dark:border-slate-700/50 hover:border-blue-200/60 dark:hover:border-blue-700/60 hover:shadow-xl
                        `}
                      >
                        <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110`} />
                        <span className="relative">
                          {item.name}
                        </span>
                      </a>
                    ) : (
                      <Link
                        to={item.href}
                        className={`
                          group relative flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 border-2
                          ${isActive 
                            ? 'text-white bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 shadow-2xl shadow-blue-500/25 border-transparent' 
                            : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white/70 dark:bg-slate-800/70 hover:bg-white/90 dark:hover:bg-slate-700/90 border-white/50 dark:border-slate-700/50 hover:border-blue-200/60 dark:hover:border-blue-700/60 hover:shadow-xl'
                          }
                        `}
                      >
                        <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'text-white' : 'group-hover:scale-110'}`} />
                        <span className="relative">
                          {item.name}
                          {isActive && (
                            <motion.div
                              layoutId="activeUnderline"
                              className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white/80 rounded-full"
                              transition={{ type: "spring", duration: 0.6 }}
                            />
                          )}
                        </span>
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ duration: 0.3 }}
                            className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"
                          />
                        )}
                      </Link>
                    )}
                  </motion.div>
                );
              })}
            </nav>

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
              <div className="hidden sm:flex items-center gap-3">
                <motion.a
                  href="https://github.com/cengizyilmaz1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative p-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 hover:bg-black/90 dark:hover:bg-slate-700/90 transition-all duration-300 group border-2 border-white/60 dark:border-slate-700/60 hover:border-gray-300/60 dark:hover:border-gray-600/60 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="GitHub"
                >
                  <Github className="w-6 h-6 text-slate-600 dark:text-slate-400 group-hover:text-white dark:group-hover:text-white transition-colors duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-800/20 to-black/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                </motion.a>
                <motion.a
                  href="https://www.linkedin.com/in/cengizyilmazz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative p-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 hover:bg-blue-600/90 dark:hover:bg-blue-700/90 transition-all duration-300 group border-2 border-white/60 dark:border-slate-700/60 hover:border-blue-300/60 dark:hover:border-blue-600/60 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-6 h-6 text-slate-600 dark:text-slate-400 group-hover:text-white transition-colors duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-blue-800/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                </motion.a>
                <motion.a
                  href="https://x.com/cengizyilmazz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative p-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 hover:bg-blue-500/90 dark:hover:bg-blue-600/90 transition-all duration-300 group border-2 border-white/60 dark:border-slate-700/60 hover:border-blue-300/60 dark:hover:border-blue-600/60 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Twitter"
                >
                  <Twitter className="w-6 h-6 text-slate-600 dark:text-slate-400 group-hover:text-white transition-colors duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                </motion.a>
              </div>

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
                  <nav className="space-y-4">
                    {navigation.map((item, index) => {
                      const Icon = item.icon;
                      const isActive = isActivePath(item.href);
                      
                      return (
                        <motion.div
                          key={item.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          {item.external ? (
                            <a
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={closeMobileMenu}
                              className="group flex items-center gap-4 p-4 rounded-xl transition-all duration-300 hover:bg-slate-50/80 dark:hover:bg-slate-800/80 text-slate-600 dark:text-slate-400"
                            >
                              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-slate-100/80 dark:bg-slate-800/80 group-hover:bg-slate-200/80 dark:group-hover:bg-slate-700/80 transition-all duration-300">
                                <Icon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                              </div>
                              <div className="flex-1">
                                <div className="font-bold text-slate-900 dark:text-white">
                                  {item.name}
                                </div>
                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                  {item.description}
                                </div>
                              </div>
                            </a>
                          ) : (
                            <Link
                              to={item.href}
                              onClick={closeMobileMenu}
                              className={`
                                group flex items-center gap-4 p-4 rounded-xl transition-all duration-300
                                ${isActive 
                                  ? 'bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-700/50' 
                                  : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/80 text-slate-600 dark:text-slate-400'
                                }
                              `}
                            >
                            <div className={`
                              w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
                              ${isActive 
                                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg shadow-blue-500/25' 
                                : 'bg-slate-100/80 dark:bg-slate-800/80 group-hover:bg-slate-200/80 dark:group-hover:bg-slate-700/80'
                              }
                            `}>
                              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-600 dark:text-slate-400'}`} />
                            </div>
                            <div className="flex-1">
                              <div className={`font-bold ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-white'}`}>
                                {item.name}
                              </div>
                              <div className="text-sm text-slate-500 dark:text-slate-400">
                                {item.description}
                              </div>
                            </div>
                              {isActive && (
                                <motion.div
                                  initial={{ scale: 0, rotate: -180 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <Sparkles className="w-5 h-5 text-blue-500" />
                                </motion.div>
                              )}
                            </Link>
                          )}
                        </motion.div>
                      );
                    })}
                  </nav>

                  {/* Mobile Social Links */}
                  <div className="mt-6 pt-6 border-t border-slate-200/60 dark:border-slate-700/60">
                    <div className="flex items-center justify-center gap-4">
                      <motion.a
                        href="https://github.com/cengizyilmaz1"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 transition-all duration-300"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Github className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                      </motion.a>
                      <motion.a
                        href="https://www.linkedin.com/in/cengizyilmazz/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 transition-all duration-300"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Linkedin className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                      </motion.a>
                      <motion.a
                        href="https://x.com/cengizyilmazz"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 transition-all duration-300"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Twitter className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                      </motion.a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-t border-slate-200/60 dark:border-slate-700/60"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-black bg-gradient-to-r from-slate-900 via-blue-700 to-indigo-700 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                  TenantFind
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Professional Microsoft Tenant ID discovery tool. Find Azure and Office 365 tenant information instantly.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Quick Links</h3>
              <nav className="space-y-2">
                {navigation.map((item) => (
                  item.external ? (
                    <a
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
                    >
                      {item.name}
                    </a>
                  ) : (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="block text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
                    >
                      {item.name}
                    </Link>
                  )
                ))}
              </nav>
            </div>

            {/* Contact & Social */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Connect</h3>
              <div className="space-y-3">
                <p className="text-slate-600 dark:text-slate-400">
                  Built with ❤️ by{' '}
                  <a
                    href="https://cengizyilmaz.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200"
                  >
                    Cengiz Yılmaz
                  </a>
                </p>
                <div className="flex items-center gap-3">
                  <motion.a
                    href="https://github.com/cengizyilmaz1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Github className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </motion.a>
                  <motion.a
                    href="https://www.linkedin.com/in/cengizyilmazz/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Linkedin className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </motion.a>
                  <motion.a
                    href="https://x.com/cengizyilmazz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Twitter className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </motion.a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 pt-8 border-t border-slate-200/60 dark:border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              © {new Date().getFullYear()} TenantFind. All rights reserved.
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