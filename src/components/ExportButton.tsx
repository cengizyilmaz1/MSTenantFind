import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, FileText, Database, Copy, Check, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { exportToJSON, exportToCSV, copyToClipboard, TenantResult, validateExportData, formatTenantData } from '../utils/exportUtils';
import { cn } from '../utils/theme';

interface ExportButtonProps {
  data: any[];
  filename?: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  className?: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({
  data,
  filename,
  disabled = false,
  variant = 'secondary',
  className = ''
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  // Validate and format data
  const isDataValid = validateExportData(data);
  const exportData: TenantResult[] = data.map(item => formatTenantData(item));

  const exportOptions = [
    {
      id: 'json',
      label: 'JSON',
      icon: Database,
      description: t('export.jsonDescription', 'Export as JSON file'),
      action: () => handleExport('json')
    },
    {
      id: 'csv',
      label: 'CSV', 
      icon: FileText,
      description: t('export.csvDescription', 'Export as CSV file'),
      action: () => handleExport('csv')
    },
    {
      id: 'copy-json',
      label: t('copy') + ' JSON',
      icon: Copy,
      description: t('export.copyJsonDescription', 'Copy JSON to clipboard'),
      action: () => handleCopy('json')
    },
    {
      id: 'copy-csv',
      label: t('copy') + ' CSV',
      icon: Copy,
      description: t('export.copyCsvDescription', 'Copy CSV to clipboard'),
      action: () => handleCopy('csv')
    }
  ];

  const handleExport = async (format: 'json' | 'csv') => {
    if (!isDataValid || disabled || exportData.length === 0) return;

    setLoading(format);
    try {
      if (format === 'json') {
        exportToJSON(exportData, filename);
      } else {
        exportToCSV(exportData, filename);
      }
      
      // Track export in analytics
      if (window.gtag) {
        window.gtag('event', 'export_data', {
          event_category: 'engagement',
          event_label: format,
          value: exportData.length
        });
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setLoading(null);
      setIsOpen(false);
    }
  };

  const handleCopy = async (format: 'json' | 'csv') => {
    if (!isDataValid || disabled || exportData.length === 0) return;

    setLoading(format === 'json' ? 'copy-json' : 'copy-csv');
    try {
      await copyToClipboard(exportData, format);
      setCopied(format);
      setTimeout(() => setCopied(null), 2000);
      
      // Track copy in analytics
      if (window.gtag) {
        window.gtag('event', 'copy_data', {
          event_category: 'engagement',
          event_label: format,
        });
      }
    } catch (error) {
      console.error('Copy failed:', error);
    } finally {
      setLoading(null);
    }
  };

  if (!isDataValid || exportData.length === 0) {
    return null;
  }

  return (
    <div className={`relative z-[100] ${className}`}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        type="button"
        className={cn(
          'flex items-center space-x-3 px-6 py-4 rounded-2xl font-bold transition-all duration-300 backdrop-blur-xl border',
          variant === 'primary' 
            ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 border-blue-500/20'
            : 'bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border-slate-200/60 dark:border-slate-700/60 hover:bg-white dark:hover:bg-slate-700 shadow-xl hover:shadow-2xl',
          disabled && 'opacity-50 cursor-not-allowed',
          'focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500'
        )}
        whileHover={!disabled ? { scale: 1.02, y: -1 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <Download className="w-5 h-5" />
        <span>{t('download')}</span>
        <span className="text-sm bg-slate-100/90 dark:bg-slate-700/90 px-3 py-1 rounded-xl font-bold backdrop-blur-xl border border-slate-200/50 dark:border-slate-600/50">
          {exportData.length}
        </span>
        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-[90]" 
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />
            
            {/* Ultra-Modern Dropdown Menu */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="
                absolute right-0 bottom-full mb-3 w-80 z-[110]
                bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl
                border border-slate-200/60 dark:border-slate-700/60 
                rounded-3xl shadow-2xl shadow-slate-900/10 dark:shadow-slate-900/30
                overflow-hidden
              "
              role="menu"
            >
              {/* Ultra-Modern Header */}
              <div className="px-6 py-4 bg-gradient-to-r from-slate-50/80 via-white/80 to-blue-50/40 dark:from-slate-800/80 dark:via-slate-900/80 dark:to-slate-800/40 border-b border-slate-200/60 dark:border-slate-700/60">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Download className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Export Options
                  </h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                  {exportData.length} results ready for export
                </p>
              </div>

              {/* Compact Export Cards */}
              <div className="p-4 space-y-3">
                {exportOptions.map((option, index) => {
                  const Icon = option.icon;
                  const isLoading = loading === option.id;
                  const isCopied = copied === option.id.replace('copy-', '');
                  
                  const gradients = [
                    'from-blue-500 via-indigo-500 to-purple-500', // JSON
                    'from-emerald-500 via-teal-500 to-green-500', // CSV
                    'from-blue-400 via-purple-400 to-indigo-400', // Copy JSON
                    'from-emerald-400 via-teal-400 to-green-400'  // Copy CSV
                  ];
                  
                  const bgColors = [
                    'from-blue-50/80 via-indigo-50/80 to-purple-50/80 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20',
                    'from-emerald-50/80 via-teal-50/80 to-green-50/80 dark:from-emerald-900/20 dark:via-teal-900/20 dark:to-green-900/20',
                    'from-blue-50/60 via-purple-50/60 to-indigo-50/60 dark:from-blue-900/15 dark:via-purple-900/15 dark:to-indigo-900/15',
                    'from-emerald-50/60 via-teal-50/60 to-green-50/60 dark:from-emerald-900/15 dark:via-teal-900/15 dark:to-green-900/15'
                  ];
                  
                  return (
                    <motion.div
                      key={option.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="relative group"
                    >
                      {/* Card Glow Effect */}
                      <div className={`absolute -inset-0.5 bg-gradient-to-r ${gradients[index]} rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300`}></div>
                      
                      <motion.button
                        onClick={option.action}
                        disabled={isLoading}
                        className={`
                          relative w-full p-4 text-left rounded-xl backdrop-blur-xl
                          bg-gradient-to-r ${bgColors[index]}
                          border border-white/20 dark:border-slate-700/30
                          hover:border-white/40 dark:hover:border-slate-600/50
                          transition-all duration-300 disabled:opacity-50
                          shadow-lg hover:shadow-xl
                          transform hover:scale-[1.02] active:scale-[0.98]
                        `}
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        role="menuitem"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {/* Compact Icon Container */}
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br ${gradients[index]}`}>
                              {isLoading ? (
                                <div className="w-4 h-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                              ) : isCopied ? (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ duration: 0.3, type: "spring" }}
                                >
                                  <Check className="w-4 h-4 text-white" />
                                </motion.div>
                              ) : (
                                <Icon className="w-4 h-4 text-white" />
                              )}
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1">
                              <div className="font-bold text-slate-900 dark:text-white mb-1">
                                {option.label}
                              </div>
                              <div className="text-xs text-slate-600 dark:text-slate-400">
                                {isCopied ? '✨ Copied successfully!' : option.description}
                              </div>
                            </div>
                          </div>
                          
                          {/* Arrow Indicator */}
                          {!isLoading && !isCopied && (
                            <div className="opacity-40 group-hover:opacity-100 transition-opacity duration-300">
                              <ChevronDown className="w-4 h-4 text-slate-600 dark:text-slate-400 rotate-[-90deg]" />
                            </div>
                          )}
                          
                          {/* Success Indicator */}
                          {isCopied && (
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ duration: 0.4, type: "spring" }}
                              className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center"
                            >
                              <Check className="w-3 h-3 text-white" />
                            </motion.div>
                          )}
                        </div>
                      </motion.button>
                    </motion.div>
                  );
                })}
              </div>
              
              {/* Compact Footer */}
              <div className="px-6 py-3 bg-gradient-to-r from-slate-50/60 via-white/60 to-slate-50/60 dark:from-slate-800/60 dark:via-slate-900/60 dark:to-slate-800/60 border-t border-slate-200/40 dark:border-slate-700/40">
                <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">Full tenant details included</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExportButton; 