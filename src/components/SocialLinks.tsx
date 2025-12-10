import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/theme';
import { socialLinks, primarySocialLinks, SocialLink } from '../config/social';

interface SocialLinksProps {
  variant?: 'header' | 'footer' | 'mobile' | 'all';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animated?: boolean;
}

const SocialLinks: React.FC<SocialLinksProps> = memo(({
  variant = 'all',
  size = 'md',
  className = '',
  animated = true
}) => {
  // Select links based on variant
  const links = variant === 'all' ? socialLinks : primarySocialLinks;

  // Size classes
  const sizeClasses = {
    sm: {
      container: 'p-2',
      icon: 'w-4 h-4'
    },
    md: {
      container: 'p-2.5',
      icon: 'w-5 h-5'
    },
    lg: {
      container: 'p-3',
      icon: 'w-6 h-6'
    }
  };

  // Variant styles
  const variantStyles = {
    header: 'bg-white/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700/90 border-2 border-white/60 dark:border-slate-700/60 shadow-lg hover:shadow-xl',
    footer: 'bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80',
    mobile: 'bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80',
    all: 'bg-white/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700/90'
  };

  const MotionComponent = animated ? motion.a : 'a';
  const motionProps = animated ? {
    whileHover: { scale: 1.1, y: -2 },
    whileTap: { scale: 0.9 }
  } : {};

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {links.map((social: SocialLink) => {
        const Icon = social.icon;
        return (
          <MotionComponent
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'relative rounded-xl transition-all duration-300',
              sizeClasses[size].container,
              variantStyles[variant]
            )}
            aria-label={social.ariaLabel}
            {...motionProps}
          >
            <Icon className={cn(sizeClasses[size].icon, social.color, social.hoverColor)} />
          </MotionComponent>
        );
      })}
    </div>
  );
});

SocialLinks.displayName = 'SocialLinks';

export default SocialLinks;

