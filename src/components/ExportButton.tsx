import React, { useCallback, useState, memo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, FileText, FileSpreadsheet, Code, Check, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../utils/theme';
import type { MultiDomainResult } from '../types';

interface ExportButtonProps {
  data: MultiDomainResult[];
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  fileName?: string;
}

type ExportFormat = 'json' | 'csv' | 'txt';

const ExportButton: React.FC<ExportButtonProps> = memo(({ 
  data, 
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  fileName = 'tenant-search-results'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const exportData = useCallback(async (format: ExportFormat) => {
    if (!data.length) {
      toast.error('No data to export');
      return;
    }

    setIsExporting(true);
    setIsOpen(false);

    try {
      let content: string;
      let filename: string;
      let mimeType: string;

      switch (format) {
        case 'json':
          content = JSON.stringify(data, null, 2);
          filename = `${fileName}-${new Date().toISOString().split('T')[0]}.json`;
          mimeType = 'application/json';
          break;

        case 'csv':
          const csvHeaders = ['Domain', 'Tenant ID', 'Tenant Name', 'Status', 'Error', 'MX Records', 'SPF Record', 'Timestamp'];
          const csvRows = data.map(result => [
            result.domain,
            result.tenantInfo?.tenantId || '',
            result.tenantInfo?.name || '',
            result.tenantInfo?.tenantId ? 'Found' : result.error ? 'Error' : 'Not Found',
            result.error || '',
            result.tenantInfo?.mxRecords?.map(r => typeof r === 'string' ? r : r.host).join('; ') || '',
            result.tenantInfo?.spfRecord ? (typeof result.tenantInfo.spfRecord === 'string' ? result.tenantInfo.spfRecord : result.tenantInfo.spfRecord.record) : '',
            new Date(result.timestamp).toLocaleString()
          ]);
          
          content = [csvHeaders.join(','), ...csvRows.map(row => 
            row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
          )].join('\n');
          filename = `${fileName}-${new Date().toISOString().split('T')[0]}.csv`;
          mimeType = 'text/csv';
          break;

        case 'txt':
          content = data.map(result => {
            let resultText = `Domain: ${result.domain}\n`;
            if (result.tenantInfo?.tenantId) {
              resultText += `Tenant ID: ${result.tenantInfo.tenantId}\n`;
              resultText += `Tenant Name: ${result.tenantInfo.name || 'Not available'}\n`;
              if (result.tenantInfo.mxRecords?.length) {
                resultText += `MX Records:\n${result.tenantInfo.mxRecords.map(r => `  - ${typeof r === 'string' ? r : r.host}`).join('\n')}\n`;
              }
              if (result.tenantInfo.spfRecord) {
                resultText += `SPF Record: ${typeof result.tenantInfo.spfRecord === 'string' ? result.tenantInfo.spfRecord : result.tenantInfo.spfRecord.record}\n`;
              }
              resultText += 'Status: Found\n';
            } else if (result.error) {
              resultText += `Error: ${result.error}\n`;
              resultText += 'Status: Error\n';
            } else {
              resultText += 'Status: No tenant found\n';
            }
            resultText += `Timestamp: ${new Date(result.timestamp).toLocaleString()}\n`;
            return resultText;
          }).join('\n' + '='.repeat(50) + '\n\n');
          filename = `${fileName}-${new Date().toISOString().split('T')[0]}.txt`;
          mimeType = 'text/plain';
          break;

        default:
          throw new Error('Unsupported format');
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(`Exported ${data.length} results as ${format.toUpperCase()}!`, {
        icon: '📥',
        duration: 3000
      });
    } catch (error) {
      toast.error(`Failed to export as ${format.toUpperCase()}`);
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  }, [data]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  const exportFormats = [
    {
      format: 'csv' as ExportFormat,
      label: 'CSV Spreadsheet',
      description: 'Excel-compatible format',
      icon: FileSpreadsheet,
      color: 'from-green-500 to-emerald-500'
    },
    {
      format: 'json' as ExportFormat,
      label: 'JSON Data',
      description: 'Structured data format',
      icon: Code,
      color: 'from-blue-500 to-indigo-500'
    },
    {
      format: 'txt' as ExportFormat,
      label: 'Text Report',
      description: 'Human-readable format',
      icon: FileText,
      color: 'from-purple-500 to-pink-500'
    }
  ];

  if (!data.length) {
    return null;
  }

  const buttonVariants = {
    primary: "bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-green-500/25 hover:shadow-green-500/40",
    secondary: "bg-white/80 dark:bg-slate-800/80 hover:bg-white/90 dark:hover:bg-slate-700/90 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 shadow-md"
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm gap-2",
    md: "px-6 py-3 text-base gap-3",
    lg: "px-8 py-4 text-lg gap-3"
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  return (
    <div ref={dropdownRef} className={cn("relative", className)}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting || disabled}
        className={cn(
          "flex items-center rounded-2xl font-semibold transition-all duration-300 backdrop-blur-xl disabled:opacity-50 disabled:cursor-not-allowed",
          sizeClasses[size],
          buttonVariants[variant]
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isExporting ? (
          <>
            <div className={cn("border-2 border-current border-t-transparent rounded-full animate-spin", iconSizes[size])} />
            <span>Exporting...</span>
          </>
        ) : (
          <>
            <Download className={iconSizes[size]} />
            <span>{size === 'sm' ? 'Export' : 'Export Results'}</span>
            {size !== 'sm' && (
              <span className="bg-white/20 dark:bg-slate-700/50 px-2 py-0.5 rounded-lg text-xs">
                {data.length}
              </span>
            )}
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className={iconSizes[size]} />
            </motion.div>
          </>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Dropdown Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full mt-2 left-0 min-w-[400px] max-w-[500px] w-max bg-white/98 dark:bg-slate-800/98 backdrop-blur-2xl rounded-2xl border border-white/60 dark:border-slate-700/60 shadow-2xl z-[9999] overflow-hidden"
              style={{
                transform: 'translateX(-50%)',
                left: '50%'
              }}
            >
              <div className="p-4">
                <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 px-2">
                  Choose Export Format
                </div>
                <div className="space-y-2">
                  {exportFormats.map(({ format, label, description, icon: Icon, color }) => (
                    <motion.button
                      key={format}
                      onClick={() => exportData(format)}
                      className="w-full flex items-center gap-4 p-4 rounded-xl bg-slate-50/80 dark:bg-slate-700/50 hover:bg-slate-100/80 dark:hover:bg-slate-600/60 transition-all duration-200 group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r shadow-lg", color)}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-semibold text-slate-900 dark:text-white group-hover:text-slate-800 dark:group-hover:text-slate-100">
                          {label}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {description}
                        </div>
                      </div>
                      <div className="text-xs bg-slate-200/60 dark:bg-slate-600/60 px-2 py-1 rounded-lg font-mono uppercase">
                        {format}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="bg-slate-50/50 dark:bg-slate-700/30 px-4 py-3 border-t border-slate-200/60 dark:border-slate-600/60">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>{data.length} results ready for export</span>
                  <div className="flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>All formats supported</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
});

ExportButton.displayName = 'ExportButton';

export default ExportButton; 