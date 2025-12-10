import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/theme';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'blue' | 'white' | 'gray' | 'gradient';
  className?: string;
  text?: string;
  variant?: 'spinner' | 'dots' | 'pulse';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = memo(({ 
  size = 'md', 
  color = 'blue',
  className = '',
  text,
  variant = 'spinner'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const dotSizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2.5 h-2.5',
    lg: 'w-3.5 h-3.5',
    xl: 'w-4 h-4'
  };

  const colorClasses = {
    blue: 'border-blue-500/30 border-t-blue-600',
    white: 'border-white/30 border-t-white',
    gray: 'border-gray-300 border-t-gray-600 dark:border-gray-600 dark:border-t-gray-400',
    gradient: 'border-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500'
  };

  const dotColorClasses = {
    blue: 'bg-blue-600',
    white: 'bg-white',
    gray: 'bg-gray-600 dark:bg-gray-400',
    gradient: 'bg-gradient-to-r from-blue-500 to-indigo-500'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  // Dots variant
  if (variant === 'dots') {
    return (
      <div className={cn("flex flex-col items-center justify-center gap-3", className)} role="status" aria-label="Loading">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={cn("rounded-full", dotSizeClasses[size], dotColorClasses[color])}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
        {text && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={cn("font-medium text-slate-600 dark:text-slate-400", textSizeClasses[size])}
          >
            {text}
          </motion.p>
        )}
        <span className="sr-only">{text || 'Loading...'}</span>
      </div>
    );
  }

  // Pulse variant
  if (variant === 'pulse') {
    return (
      <div className={cn("flex flex-col items-center justify-center gap-3", className)} role="status" aria-label="Loading">
        <motion.div
          className={cn(
            "rounded-full",
            sizeClasses[size],
            color === 'gradient' 
              ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500' 
              : dotColorClasses[color]
          )}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        {text && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={cn("font-medium text-slate-600 dark:text-slate-400", textSizeClasses[size])}
          >
            {text}
          </motion.p>
        )}
        <span className="sr-only">{text || 'Loading...'}</span>
      </div>
    );
  }

  // Default spinner variant
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)} role="status" aria-label="Loading">
      <motion.div
        className={cn(
          "border-4 rounded-full",
          sizeClasses[size],
          colorClasses[color]
        )}
        animate={{ rotate: 360 }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={cn(
            "font-medium text-slate-600 dark:text-slate-400",
            textSizeClasses[size]
          )}
        >
          {text}
        </motion.p>
      )}
      <span className="sr-only">{text || 'Loading...'}</span>
    </div>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner; 