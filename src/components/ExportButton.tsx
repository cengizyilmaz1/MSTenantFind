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
    <div className={`relative ${className}`}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'flex items-center space-x-3 px-6 py-3 rounded-2xl font-semibold transition-all duration-200',
          variant === 'primary' 
            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-md hover:shadow-lg',
          disabled && 'opacity-50 cursor-not-allowed',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
        )}
        whileHover={!disabled ? { scale: 1.02 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <Download className="w-5 h-5" />
        <span>{t('download')}</span>
        <span className="text-sm opacity-75 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full">
          {exportData.length}
        </span>
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
            
            {/* Dropdown Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="
                absolute right-0 top-full mt-2 w-80 z-20
                bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                rounded-2xl shadow-xl py-3 backdrop-blur-xl
              "
              role="menu"
            >
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {t('export.title', 'Export Options')}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('export.subtitle', `${exportData.length} results available`)}
                </p>
              </div>

              {exportOptions.map((option) => {
                const Icon = option.icon;
                const isLoading = loading === option.id;
                const isCopied = copied === option.id.replace('copy-', '');
                
                return (
                  <motion.button
                    key={option.id}
                    onClick={option.action}
                    disabled={isLoading}
                    className="
                      flex items-center justify-between w-full px-4 py-4 text-left
                      text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700
                      focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700
                      transition-colors duration-150 disabled:opacity-50
                    "
                    whileHover={{ x: 4 }}
                    role="menuitem"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {isLoading ? (
                          <div className="w-5 h-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
                        ) : isCopied ? (
                          <Check className="w-5 h-5 text-green-600" />
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {isCopied ? t('copied') : option.description}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExportButton; 