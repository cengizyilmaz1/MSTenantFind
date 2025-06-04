import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

interface StatusBadgeProps {
  status: 'success' | 'error' | 'warning' | 'info';
  text: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  text, 
  size = 'md',
  className = '' 
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'success':
        return {
          icon: CheckCircle,
          bgColor: 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
          borderColor: 'border-green-200/50 dark:border-green-700/50',
          textColor: 'text-green-800 dark:text-green-200',
          iconColor: 'text-green-600 dark:text-green-400'
        };
      case 'error':
        return {
          icon: XCircle,
          bgColor: 'bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20',
          borderColor: 'border-red-200/50 dark:border-red-700/50',
          textColor: 'text-red-800 dark:text-red-200',
          iconColor: 'text-red-600 dark:text-red-400'
        };
      case 'warning':
        return {
          icon: AlertCircle,
          bgColor: 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20',
          borderColor: 'border-yellow-200/50 dark:border-yellow-700/50',
          textColor: 'text-yellow-800 dark:text-yellow-200',
          iconColor: 'text-yellow-600 dark:text-yellow-400'
        };
      case 'info':
        return {
          icon: Info,
          bgColor: 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
          borderColor: 'border-blue-200/50 dark:border-blue-700/50',
          textColor: 'text-blue-800 dark:text-blue-200',
          iconColor: 'text-blue-600 dark:text-blue-400'
        };
      default:
        return {
          icon: Info,
          bgColor: 'bg-gray-50 dark:bg-gray-900/20',
          borderColor: 'border-gray-200/50 dark:border-gray-700/50',
          textColor: 'text-gray-800 dark:text-gray-200',
          iconColor: 'text-gray-600 dark:text-gray-400'
        };
    }
  };

  const getSizeConfig = () => {
    switch (size) {
      case 'sm':
        return {
          padding: 'px-3 py-1.5',
          textSize: 'text-sm',
          iconSize: 'w-4 h-4',
          rounded: 'rounded-lg'
        };
      case 'md':
        return {
          padding: 'px-4 py-2',
          textSize: 'text-sm',
          iconSize: 'w-4 h-4',
          rounded: 'rounded-xl'
        };
      case 'lg':
        return {
          padding: 'px-5 py-2.5',
          textSize: 'text-base',
          iconSize: 'w-5 h-5',
          rounded: 'rounded-xl'
        };
      default:
        return {
          padding: 'px-4 py-2',
          textSize: 'text-sm',
          iconSize: 'w-4 h-4',
          rounded: 'rounded-xl'
        };
    }
  };

  const statusConfig = getStatusConfig();
  const sizeConfig = getSizeConfig();
  const Icon = statusConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`
        inline-flex items-center gap-2 font-semibold backdrop-blur-xl border shadow-lg hover:shadow-xl transition-all duration-300
        ${statusConfig.bgColor}
        ${statusConfig.borderColor}
        ${statusConfig.textColor}
        ${sizeConfig.padding}
        ${sizeConfig.textSize}
        ${sizeConfig.rounded}
        ${className}
      `}
    >
      <Icon className={`${sizeConfig.iconSize} ${statusConfig.iconColor}`} />
      <span>{text}</span>
    </motion.div>
  );
};

export default StatusBadge; 