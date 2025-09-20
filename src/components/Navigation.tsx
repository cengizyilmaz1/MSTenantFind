import React, { memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { navigationLinks, NavItem } from '../config/navigation';
import { cn } from '../utils/theme';
import { HiOutlineHome } from 'react-icons/hi2';

interface NavigationProps {
  variant?: 'desktop' | 'mobile' | 'footer';
  onItemClick?: () => void;
  className?: string;
}

const Navigation: React.FC<NavigationProps> = memo(({
  variant = 'desktop',
  onItemClick,
  className = ''
}) => {
  const location = useLocation();

  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Filter links based on variant
  const links = navigationLinks.filter(item => {
    if (variant === 'footer') return true;
    return item.show !== 'footer';
  });

  if (variant === 'desktop') {
    return (
      <nav className={cn('hidden md:flex items-center gap-2', className)}>
        {links.map((item: NavItem) => {
          const Icon = item.icon || HiOutlineHome;
          const isActive = isActivePath(item.path);
          
          return (
            <motion.div
              key={item.label}
              whileHover={{ y: -3, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {item.external ? (
                <a
                  href={item.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'group relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-medium transition-all duration-300',
                    'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white',
                    'bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700',
                    'border border-gray-200/60 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600',
                    'shadow-sm hover:shadow-md'
                  )}
                >
                  <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                  <span className="relative">{item.label}</span>
                </a>
              ) : (
                <Link
                  to={item.path}
                  className={cn(
                    'group relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 border',
                    isActive 
                      ? 'text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20 border-transparent' 
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 border-gray-200/60 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm hover:shadow-md'
                  )}
                >
                  <Icon className={cn('w-5 h-5 transition-transform duration-300', isActive ? 'text-white' : 'group-hover:scale-110')} />
                  <span className="relative">
                    {item.label}
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
    );
  }

  if (variant === 'mobile') {
    return (
      <nav className={cn('space-y-4', className)}>
        {links.map((item: NavItem, index) => {
          const Icon = item.icon || HiOutlineHome;
          const isActive = isActivePath(item.path);
          
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              {item.external ? (
                <a
                  href={item.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onItemClick}
                  className="group flex items-center gap-4 p-4 rounded-xl transition-all duration-300 hover:bg-slate-50/80 dark:hover:bg-slate-800/80 text-slate-600 dark:text-slate-400"
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-slate-100/80 dark:bg-slate-800/80 group-hover:bg-slate-200/80 dark:group-hover:bg-slate-700/80 transition-all duration-300">
                    <Icon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-slate-900 dark:text-white">{item.label}</div>
                  </div>
                </a>
              ) : (
                <Link
                  to={item.path}
                  onClick={onItemClick}
                  className={cn(
                    'group flex items-center gap-4 p-4 rounded-xl transition-all duration-300',
                    isActive 
                      ? 'bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-700/50' 
                      : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/80 text-slate-600 dark:text-slate-400'
                  )}
                >
                  <div className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300',
                    isActive 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg shadow-blue-500/25' 
                      : 'bg-slate-100/80 dark:bg-slate-800/80 group-hover:bg-slate-200/80 dark:group-hover:bg-slate-700/80'
                  )}>
                    <Icon className={cn('w-5 h-5', isActive ? 'text-white' : 'text-slate-600 dark:text-slate-400')} />
                  </div>
                  <div className="flex-1">
                    <div className={cn('font-bold', isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-white')}>
                      {item.label}
                    </div>
                  </div>
                </Link>
              )}
            </motion.div>
          );
        })}
      </nav>
    );
  }

  // Footer variant
  return (
    <nav className={cn('space-y-2', className)}>
      {links.map((item: NavItem) => (
        item.external ? (
          <a
            key={item.label}
            href={item.path}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
          >
            {item.label}
          </a>
        ) : (
          <Link
            key={item.label}
            to={item.path}
            className="block text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
          >
            {item.label}
          </Link>
        )
      ))}
    </nav>
  );
});

Navigation.displayName = 'Navigation';

export default Navigation;

