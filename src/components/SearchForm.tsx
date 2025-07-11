import React, { useState, useCallback, useMemo, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Upload, Download, Copy, Check, AlertCircle, Info, X, Sparkles, Globe, Shield, Clock, Zap, FileText, Keyboard, ExternalLink, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import ExportButton from './ExportButton';
import LoadingSpinner from './LoadingSpinner';
import { findTenantInfo, validateDomain, parseDomainsFromText } from '../utils/dns';
import { cn } from '../utils/theme';
import type { MultiDomainResult } from '../types';

interface SearchFormProps {
  className?: string;
}

interface SearchStats {
  total: number;
  found: number;
  notFound: number;
  errors: number;
}

const SearchForm: React.FC<SearchFormProps> = memo(({ className = '' }) => {
  const [domains, setDomains] = useState<string>('');
  const [results, setResults] = useState<MultiDomainResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Memoized stats calculation
  const stats = useMemo((): SearchStats => {
    return results.reduce((acc, result) => {
      acc.total++;
      if (result.tenantInfo?.tenantId) {
        acc.found++;
      } else if (result.error) {
        acc.errors++;
      } else {
        acc.notFound++;
      }
      return acc;
    }, { total: 0, found: 0, notFound: 0, errors: 0 });
  }, [results]);

  // Memoized domain list parsing
  const domainList = useMemo(() => {
    if (!domains.trim()) return [];
    return parseDomainsFromText(domains)
      .filter(domain => validateDomain(domain))
      .slice(0, 100); // Limit to 100 domains
  }, [domains]);

  // Memoized validation
  const isValid = useMemo(() => domainList.length > 0, [domainList]);

  const handleSearch = useCallback(async () => {
    if (!isValid || isLoading) return;

    setIsLoading(true);
    setResults([]);

    try {
      const searchPromises = domainList.map(async (domain): Promise<MultiDomainResult> => {
        try {
          const tenantInfo = await findTenantInfo(domain);
          return {
            domain,
            tenantInfo,
            timestamp: new Date().toISOString()
          };
        } catch (error) {
          return {
            domain,
            tenantInfo: null,
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString()
          };
        }
      });

      const searchResults = await Promise.all(searchPromises);
      setResults(searchResults);

      const foundCount = searchResults.filter(r => r.tenantInfo?.tenantId).length;
      toast.success(`Search completed! Found ${foundCount}/${searchResults.length} tenant(s)`, {
        icon: '🎉',
        duration: 3000
      });
    } catch (error) {
      toast.error('Search failed. Please try again.');
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [domainList, isValid, isLoading]);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
    // Shift+Enter allows new line (default behavior)
  }, [handleSearch]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        setDomains(prev => prev ? `${prev}\n${text}` : text);
        toast.success('File uploaded successfully!');
      }
    };
    reader.readAsText(file);
  }, []);

  const downloadSampleFile = useCallback(() => {
    const sampleContent = `contoso.com
microsoft.com
fabrikam.com
adatum.com
wingtiptoys.com
fourthcoffee.com
proseware.com
nwtraders.com
woodgrove.com
tailwindcorp.com`;
    
    const blob = new Blob([sampleContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-domains.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Sample file downloaded!');
  }, []);

  const handleClear = useCallback(() => {
    setDomains('');
    setResults([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    textareaRef.current?.focus();
  }, []);

  const copyDomains = useCallback(async () => {
    if (!domainList.length) return;
    
    try {
      await navigator.clipboard.writeText(domainList.join('\n'));
      toast.success(`${domainList.length} domain${domainList.length > 1 ? 's' : ''} copied to clipboard!`, {
        icon: '📝',
        duration: 2000
      });
    } catch (error) {
      toast.error('Failed to copy domains');
    }
  }, [domainList]);

  const copyAllResults = useCallback(async () => {
    if (!results.length) return;
    
    try {
      const resultText = results.map(result => {
        if (result.tenantInfo?.tenantId) {
          return `${result.domain}: ${result.tenantInfo.tenantId}`;
        } else if (result.error) {
          return `${result.domain}: ERROR - ${result.error}`;
        } else {
          return `${result.domain}: No tenant found`;
        }
      }).join('\n');
      
      await navigator.clipboard.writeText(resultText);
      toast.success(`All ${results.length} results copied to clipboard!`, {
        icon: '📊',
        duration: 2500
      });
    } catch (error) {
      toast.error('Failed to copy all results');
    }
  }, [results]);

  // Memoized result components
  const SearchResults = useMemo(() => {
    if (!results.length) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mt-12 space-y-8"
      >
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard icon={Globe} label="Total" value={stats.total} color="blue" />
          <StatsCard icon={Check} label="Found" value={stats.found} color="green" />
          <StatsCard icon={X} label="Not Found" value={stats.notFound} color="yellow" />
          <StatsCard icon={AlertCircle} label="Errors" value={stats.errors} color="red" />
        </div>

        {/* Action Bar - Ultra Modern */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex flex-wrap gap-4 justify-between items-center bg-gradient-to-r from-white/80 via-white/70 to-slate-50/60 dark:from-slate-800/80 dark:via-slate-800/70 dark:to-slate-900/60 backdrop-blur-2xl rounded-3xl p-8 border border-white/40 dark:border-slate-700/40 shadow-2xl relative z-10 overflow-visible"
        >
          <div className="flex flex-wrap items-center gap-4">
            <motion.button
              onClick={copyAllResults}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200"
            >
              <Copy className="w-5 h-5" />
              Copy All Results
            </motion.button>
            
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-100/80 dark:bg-slate-700/80 backdrop-blur-sm rounded-xl">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {results.length} result{results.length !== 1 ? 's' : ''} processed
              </span>
            </div>
          </div>
          
          <div className="relative z-20">
            <ExportButton data={results} variant="secondary" />
          </div>
        </motion.div>

        {/* Results Grid */}
        <div className="space-y-6">
          {results.map((result, index) => (
            <ResultCard key={`${result.domain}-${index}`} result={result} />
          ))}
        </div>
      </motion.div>
    );
  }, [results, stats, copyAllResults]);

  return (
    <div className={cn("max-w-5xl mx-auto", className)}>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50/80 dark:bg-blue-900/30 backdrop-blur-xl rounded-full border border-blue-200/60 dark:border-blue-700/60 mb-8">
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Professional Microsoft Tool</span>
        </div>

        <h1 className="text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Microsoft Tenant Finder
          </span>
        </h1>
        
        <p className="text-xl lg:text-2xl text-slate-600 dark:text-slate-400 max-w-4xl mx-auto leading-relaxed font-medium">
          Instantly discover Microsoft Azure and Office 365 tenant information for any domain. 
          Get tenant IDs, MX records, and SPF configurations.
        </p>
      </motion.div>

      {/* Main Search Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-8 lg:p-12 border border-white/20 dark:border-slate-700/20 shadow-2xl shadow-blue-500/10"
      >
        {/* Input Section */}
        <div className="space-y-6">
          <div className="relative">
            <label className="block text-lg font-bold text-slate-900 dark:text-white mb-4">
              Enter Domain Names
              <span className="text-sm font-normal text-slate-500 dark:text-slate-400 ml-2">
                (Single domain or multiple domains, one per line)
              </span>
            </label>
            
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={domains}
                onChange={(e) => setDomains(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter domain names (one per line):

contoso.com
microsoft.com
fabrikam.com

Press Enter to search, Shift+Enter for new line"
                className="w-full bg-slate-50/80 dark:bg-slate-800/80 border-2 border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-6 text-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 resize-none backdrop-blur-xl placeholder:text-slate-400 font-mono leading-relaxed min-h-40"
                rows={8}
              />
              
              {/* Domain Counter */}
              {domainList.length > 0 && (
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <span className="text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-lg font-medium border border-blue-200 dark:border-blue-700">
                    {domainList.length} domain{domainList.length !== 1 ? 's' : ''}
                  </span>
                </div>
              )}

              {/* Keyboard Shortcuts Info - Modern */}
              <div className="absolute bottom-4 right-4 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 opacity-80 hover:opacity-100 transition-opacity duration-200">
                <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
                  <Zap className="w-3 h-3 text-blue-500" />
                  <kbd className="px-2 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded font-mono text-xs font-bold shadow-sm">Enter</kbd>
                  <span className="font-medium">Search</span>
                </div>
                <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
                  <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 rounded font-mono text-xs font-bold shadow-sm">Shift+Enter</kbd>
                  <span className="font-medium">New line</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <motion.button
              onClick={handleSearch}
              disabled={!isValid || isLoading}
              className="flex-1 min-w-64 flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 disabled:from-slate-400 disabled:via-slate-500 disabled:to-slate-600 text-white rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 disabled:shadow-none disabled:cursor-not-allowed transform hover:scale-105 disabled:hover:scale-100"
              whileHover={isValid && !isLoading ? { scale: 1.02 } : {}}
              whileTap={isValid && !isLoading ? { scale: 0.98 } : {}}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" color="white" />
                  <span>Searching {domainList.length} domain{domainList.length !== 1 ? 's' : ''}...</span>
                </>
              ) : (
                <>
                  <Search className="w-6 h-6" />
                  <span>Search Tenants</span>
                  {domainList.length > 1 && (
                    <span className="bg-white/20 px-2 py-1 rounded-lg text-sm">
                      {domainList.length}
                    </span>
                  )}
                </>
              )}
            </motion.button>
          </div>

          {/* File Actions */}
          <div className="flex flex-wrap gap-3">
            <motion.label
              className="flex items-center gap-2 px-4 py-3 bg-green-100/80 dark:bg-green-900/30 hover:bg-green-200/80 dark:hover:bg-green-900/50 text-green-700 dark:text-green-300 rounded-xl font-medium transition-all duration-300 cursor-pointer backdrop-blur-xl border border-green-200/60 dark:border-green-700/60"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Upload className="w-4 h-4" />
              Upload File
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </motion.label>

            <motion.button
              onClick={downloadSampleFile}
              className="flex items-center gap-2 px-4 py-3 bg-orange-100/80 dark:bg-orange-900/30 hover:bg-orange-200/80 dark:hover:bg-orange-900/50 text-orange-700 dark:text-orange-300 rounded-xl font-medium transition-all duration-300 backdrop-blur-xl border border-orange-200/60 dark:border-orange-700/60"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download className="w-4 h-4" />
              Download Sample
            </motion.button>

            {domainList.length > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={copyDomains}
                className="flex items-center gap-2 px-4 py-3 bg-purple-100/80 dark:bg-purple-900/30 hover:bg-purple-200/80 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-xl font-medium transition-all duration-300 backdrop-blur-xl border border-purple-200/60 dark:border-purple-700/60"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Copy className="w-4 h-4" />
                Copy Domains
              </motion.button>
            )}

            {(domains || results.length > 0) && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={handleClear}
                className="flex items-center gap-2 px-4 py-3 bg-red-100/80 dark:bg-red-900/30 hover:bg-red-200/80 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 rounded-xl font-medium transition-all duration-300 backdrop-blur-xl border border-red-200/60 dark:border-red-700/60"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <X className="w-4 h-4" />
                Clear All
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Search Results */}
      {SearchResults}
    </div>
  );
});

SearchForm.displayName = 'SearchForm';

// Memoized Stats Card Component - Ultra Modern
const StatsCard = memo<{
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  color: 'blue' | 'green' | 'yellow' | 'red';
}>(({ icon: Icon, label, value, color }) => {
  const colorSchemes = {
    blue: {
      gradient: 'from-blue-500 via-blue-600 to-cyan-500',
      shadow: 'shadow-blue-500/25 hover:shadow-blue-500/40',
      glow: 'shadow-blue-500/20',
      border: 'border-blue-200/40 dark:border-blue-700/40'
    },
    green: {
      gradient: 'from-emerald-500 via-green-600 to-emerald-500',
      shadow: 'shadow-emerald-500/25 hover:shadow-emerald-500/40',
      glow: 'shadow-emerald-500/20',
      border: 'border-emerald-200/40 dark:border-emerald-700/40'
    },
    yellow: {
      gradient: 'from-yellow-500 via-orange-600 to-amber-500',
      shadow: 'shadow-yellow-500/25 hover:shadow-yellow-500/40',
      glow: 'shadow-yellow-500/20',
      border: 'border-yellow-200/40 dark:border-yellow-700/40'
    },
    red: {
      gradient: 'from-red-500 via-rose-600 to-pink-500',
      shadow: 'shadow-red-500/25 hover:shadow-red-500/40',
      glow: 'shadow-red-500/20',
      border: 'border-red-200/40 dark:border-red-700/40'
    }
  };

  const scheme = colorSchemes[color];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ scale: 1.05, y: -2 }}
      transition={{ 
        duration: 0.4,
        ease: [0.21, 1.11, 0.81, 0.99],
        hover: { duration: 0.2 }
      }}
      className={cn(
        "relative overflow-hidden group",
        "bg-gradient-to-br from-white/90 via-white/80 to-slate-50/70",
        "dark:from-slate-800/90 dark:via-slate-800/80 dark:to-slate-900/70",
        "backdrop-blur-xl rounded-3xl p-8 border",
        scheme.border,
        "shadow-xl hover:shadow-2xl",
        scheme.glow,
        "transition-all duration-300"
      )}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10 dark:opacity-20">
        <div className={cn("absolute top-0 right-0 w-32 h-32 bg-gradient-to-br rounded-full blur-2xl", scheme.gradient)} />
      </div>
      
      <div className="relative z-10 flex items-center gap-6">
        <div className={cn(
          "w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br shadow-xl relative overflow-hidden",
          scheme.gradient
        )}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/20" />
          <Icon className="w-8 h-8 text-white relative z-10 drop-shadow-lg" />
        </div>
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-black text-slate-900 dark:text-white mb-1 tracking-tight"
          >
            {value}
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm font-semibold text-slate-600 dark:text-slate-400 tracking-wide"
          >
            {label}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
});

StatsCard.displayName = 'StatsCard';

// Memoized Result Card Component - Ultra Modern Design
const ResultCard = memo<{ result: MultiDomainResult }>(({ result }) => {
  const hasError = !!result.error;
  const hasTenant = !!result.tenantInfo?.tenantId;

  const copyTenantId = useCallback(async (tenantId: string) => {
    try {
      await navigator.clipboard.writeText(tenantId);
      toast.success('Tenant ID copied to clipboard!', {
        icon: '🆔',
        duration: 2000
      });
    } catch (error) {
      toast.error('Failed to copy Tenant ID');
    }
  }, []);

  const copyDomain = useCallback(async (domain: string) => {
    try {
      await navigator.clipboard.writeText(domain);
      toast.success(`Domain "${domain}" copied!`, {
        icon: '🌐',
        duration: 2000
      });
    } catch (error) {
      toast.error('Failed to copy domain');
    }
  }, []);

  const copyFullResult = useCallback(async () => {
    try {
      let resultText = `Domain: ${result.domain}\n`;
      if (hasTenant) {
        resultText += `Tenant ID: ${result.tenantInfo?.tenantId}\n`;
        resultText += `Tenant Name: ${result.tenantInfo?.name || 'Not available'}\n`;
        if (result.tenantInfo?.mxRecords?.length) {
          resultText += `MX Records: ${result.tenantInfo.mxRecords.map(r => typeof r === 'string' ? r : r.host).join(', ')}\n`;
        }
        if (result.tenantInfo?.spfRecord) {
          resultText += `SPF Record: ${typeof result.tenantInfo.spfRecord === 'string' ? result.tenantInfo.spfRecord : result.tenantInfo.spfRecord.record}\n`;
        }
      } else if (hasError) {
        resultText += `Error: ${result.error}\n`;
      } else {
        resultText += 'No Microsoft tenant found\n';
      }
      resultText += `Timestamp: ${new Date(result.timestamp).toLocaleString()}`;
      
      await navigator.clipboard.writeText(resultText);
      toast.success('Complete result copied to clipboard!', {
        icon: '📋',
        duration: 2500
      });
    } catch (error) {
      toast.error('Failed to copy result');
    }
  }, [result, hasTenant, hasError]);

  const getStatusConfig = () => {
    if (hasTenant) {
      return {
        iconBg: "bg-gradient-to-br from-emerald-400 via-emerald-500 to-green-600",
        status: "FOUND",
        statusBg: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
        cardBorder: "border-emerald-200/40 dark:border-emerald-700/40",
        glow: "shadow-emerald-500/10"
      };
    } else if (hasError) {
      return {
        iconBg: "bg-gradient-to-br from-red-400 via-red-500 to-rose-600",
        status: "ERROR",
        statusBg: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
        cardBorder: "border-red-200/40 dark:border-red-700/40",
        glow: "shadow-red-500/10"
      };
    } else {
      return {
        iconBg: "bg-gradient-to-br from-slate-400 via-slate-500 to-slate-600",
        status: "NOT FOUND",
        statusBg: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400",
        cardBorder: "border-slate-200/40 dark:border-slate-700/40",
        glow: "shadow-slate-500/10"
      };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ 
        duration: 0.5, 
        ease: [0.21, 1.11, 0.81, 0.99],
        hover: { duration: 0.3 }
      }}
      className={cn(
        "group relative overflow-hidden",
        "bg-gradient-to-br from-white/98 via-white/95 to-slate-50/90",
        "dark:from-slate-800/98 dark:via-slate-800/95 dark:to-slate-900/90",
        "backdrop-blur-3xl rounded-[2rem] p-10 border-2",
        statusConfig.cardBorder,
        "shadow-[0_32px_64px_-12px_rgba(0,0,0,0.25)] hover:shadow-[0_48px_80px_-12px_rgba(0,0,0,0.35)]",
        statusConfig.glow,
        "transition-all duration-700 hover:duration-300"
      )}
      style={{
        background: hasTenant 
          ? 'linear-gradient(135deg, rgba(34,197,94,0.03) 0%, rgba(59,130,246,0.03) 100%)' 
          : hasError 
            ? 'linear-gradient(135deg, rgba(239,68,68,0.03) 0%, rgba(168,85,247,0.03) 100%)'
            : 'linear-gradient(135deg, rgba(71,85,105,0.03) 0%, rgba(99,102,241,0.03) 100%)'
      }}
    >
      {/* Advanced Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]">
        <div className="absolute top-0 -left-8 w-96 h-96 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute top-0 -right-8 w-96 h-96 bg-gradient-to-l from-purple-500 to-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-12 left-24 w-96 h-96 bg-gradient-to-t from-pink-500 to-orange-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>
      
      {/* Status accent line */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-1 rounded-t-[2rem]",
        hasTenant ? "bg-gradient-to-r from-emerald-400 to-green-500" :
        hasError ? "bg-gradient-to-r from-red-400 to-rose-500" :
        "bg-gradient-to-r from-slate-300 to-slate-400"
      )} />

             {/* Header Section */}
       <div className="relative z-10 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-10">
         <div className="flex items-start gap-8">
           {/* Status Icon */}
           <div className="relative flex-shrink-0">
             <div className={cn(
               "w-28 h-28 rounded-[1.5rem] flex items-center justify-center shadow-[0_24px_48px_-12px_rgba(0,0,0,0.25)] overflow-hidden border-4 border-white/30 dark:border-white/10",
               statusConfig.iconBg
             )}>
               <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/20" />
               <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent" />
               {hasTenant ? (
                 <Check className="w-14 h-14 text-white relative z-10 drop-shadow-2xl" />
               ) : hasError ? (
                 <AlertCircle className="w-14 h-14 text-white relative z-10 drop-shadow-2xl" />
               ) : (
                 <X className="w-14 h-14 text-white relative z-10 drop-shadow-2xl" />
               )}
             </div>
             
             {/* Success Badge */}
             {hasTenant && (
               <motion.div
                 className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(251,191,36,0.4)] border-3 border-white dark:border-slate-800"
                 animate={{ 
                   rotate: [0, 12, -12, 0],
                   scale: [1, 1.15, 1]
                 }}
                 transition={{ 
                   duration: 4, 
                   repeat: Infinity, 
                   ease: "easeInOut" 
                 }}
               >
                 <Star className="w-5 h-5 text-white drop-shadow-lg" />
                 <div className="absolute inset-0 bg-gradient-to-t from-orange-600/30 to-transparent rounded-full" />
               </motion.div>
             )}
           </div>

           {/* Domain Info */}
           <div className="flex-1 min-w-0">
             <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
               <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight break-all leading-tight">
                 {result.domain}
               </h3>
               <motion.button
                 onClick={() => copyDomain(result.domain)}
                 whileHover={{ scale: 1.15 }}
                 whileTap={{ scale: 0.85 }}
                 className="self-start sm:self-center opacity-0 group-hover:opacity-100 p-3.5 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 backdrop-blur-sm text-slate-600 dark:text-slate-300 rounded-2xl hover:from-slate-200 hover:to-slate-300 dark:hover:from-slate-600 dark:hover:to-slate-500 transition-all duration-300 shadow-lg hover:shadow-xl"
               >
                 <Copy className="w-5 h-5" />
               </motion.button>
             </div>
             
             <div className="flex flex-wrap items-center gap-4 mb-2">
               <div className="flex items-center gap-2 px-3 py-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl shadow-sm">
                 <Clock className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                 <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                   {new Date(result.timestamp).toLocaleString()}
                 </span>
               </div>
               <div className={cn(
                 "px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase shadow-lg border border-white/20",
                 statusConfig.statusBg
               )}>
                 {statusConfig.status}
               </div>
             </div>
           </div>
         </div>
        
                 {/* Action Buttons */}
         <div className="flex flex-wrap gap-3 lg:flex-nowrap">
           <motion.button
             onClick={copyFullResult}
             whileHover={{ scale: 1.05, y: -2 }}
             whileTap={{ scale: 0.95 }}
             className="flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold shadow-[0_8px_32px_rgba(59,130,246,0.3)] hover:shadow-[0_12px_40px_rgba(59,130,246,0.4)] transition-all duration-300 border border-blue-400/20"
           >
             <Copy className="w-5 h-5" />
             Copy All
           </motion.button>
           
           {hasTenant && (
             <motion.button
               onClick={() => copyTenantId(result.tenantInfo!.tenantId!)}
               whileHover={{ scale: 1.05, y: -2 }}
               whileTap={{ scale: 0.95 }}
               className="flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-600 hover:via-green-600 hover:to-emerald-700 text-white rounded-2xl font-bold shadow-[0_8px_32px_rgba(34,197,94,0.3)] hover:shadow-[0_12px_40px_rgba(34,197,94,0.4)] transition-all duration-300 border border-emerald-400/20"
             >
               <Shield className="w-5 h-5" />
               Copy ID
             </motion.button>
           )}
         </div>
      </div>

             {/* Content Section */}
       <div className="relative z-10">
         {hasError ? (
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.4, delay: 0.2 }}
             className="bg-gradient-to-br from-red-50/95 via-red-100/80 to-rose-50/70 dark:from-red-900/40 dark:via-red-900/30 dark:to-rose-900/20 border-2 border-red-200/70 dark:border-red-700/50 rounded-2xl p-8 backdrop-blur-sm shadow-lg"
           >
             <div className="flex items-start gap-6">
               <div className="w-14 h-14 bg-gradient-to-r from-red-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                 <AlertCircle className="w-7 h-7 text-white drop-shadow-sm" />
               </div>
               <div className="flex-1 min-w-0">
                 <h4 className="text-xl font-bold text-red-800 dark:text-red-200 mb-2">Error Occurred</h4>
                 <p className="text-red-700 dark:text-red-300 leading-relaxed">{result.error}</p>
                 <div className="mt-4 text-sm text-red-600 dark:text-red-400 bg-red-100/50 dark:bg-red-800/20 px-4 py-2 rounded-lg">
                   This domain may not be associated with Microsoft services or there might be a network issue.
                 </div>
               </div>
             </div>
           </motion.div>
         ) : hasTenant ? (
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.4, delay: 0.2 }}
             className="space-y-6"
           >
             <TenantInfoDisplay tenantInfo={result.tenantInfo!} />
           </motion.div>
         ) : (
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.4, delay: 0.2 }}
             className="bg-gradient-to-br from-slate-50/95 via-slate-100/80 to-gray-50/70 dark:from-slate-800/95 dark:via-slate-800/80 dark:to-slate-900/70 border-2 border-slate-200/70 dark:border-slate-700/50 rounded-2xl p-8 backdrop-blur-sm shadow-lg"
           >
             <div className="flex items-start gap-6">
               <div className="w-14 h-14 bg-gradient-to-r from-slate-500 to-gray-500 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                 <Info className="w-7 h-7 text-white drop-shadow-sm" />
               </div>
               <div className="flex-1 min-w-0">
                 <h4 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">No Tenant Found</h4>
                 <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">No Microsoft tenant found for this domain. This could mean:</p>
                 <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside bg-slate-100/50 dark:bg-slate-800/20 px-4 py-3 rounded-lg">
                   <li>The domain is not associated with Microsoft services</li>
                   <li>The domain uses a different email provider</li>
                   <li>The domain has not been verified with Microsoft</li>
                 </ul>
               </div>
             </div>
           </motion.div>
         )}
       </div>
    </motion.div>
  );
});

ResultCard.displayName = 'ResultCard';

// Memoized Tenant Info Display Component - Enhanced
const TenantInfoDisplay = memo<{ tenantInfo: NonNullable<MultiDomainResult['tenantInfo']> }>(({ tenantInfo }) => (
  <div className="grid md:grid-cols-2 gap-6">
    <InfoSection 
      title="Tenant Information" 
      icon={Shield}
      type="tenant"
      items={[
        { label: 'Tenant ID', value: tenantInfo.tenantId },
        { label: 'Tenant Name', value: tenantInfo.name || 'Not available' }
      ]}
    />
    
    {tenantInfo.mxRecords && tenantInfo.mxRecords.length > 0 && (
      <InfoSection 
        title="MX Records" 
        icon={Globe}
        type="mx"
        items={tenantInfo.mxRecords.map((record, index) => ({
          label: `MX ${index + 1}`,
          value: typeof record === 'string' ? record : record.host || 'Unknown'
        }))}
      />
    )}
    
    {tenantInfo.spfRecord && (
      <InfoSection 
        title="SPF Record" 
        icon={FileText}
        type="spf"
        items={[{
          label: 'SPF',
          value: typeof tenantInfo.spfRecord === 'string' 
            ? tenantInfo.spfRecord 
            : tenantInfo.spfRecord.record || 'Available'
        }]}
      />
    )}
  </div>
));

TenantInfoDisplay.displayName = 'TenantInfoDisplay';

// Memoized Info Section Component - Ultra Modern
const InfoSection = memo<{
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  type?: 'tenant' | 'mx' | 'spf';
  items: Array<{ label: string; value: string }>;
}>(({ title, icon: Icon, type = 'default', items }) => {
  const copyValue = useCallback(async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      const shortValue = value.length > 30 ? value.substring(0, 30) + '...' : value;
      toast.success(`"${shortValue}" copied!`, {
        icon: '📄',
        duration: 2000
      });
    } catch (error) {
      toast.error('Failed to copy value');
    }
  }, []);

  const getColorScheme = (type: string) => {
    switch (type) {
      case 'tenant':
        return {
          background: 'bg-gradient-to-br from-emerald-50/95 via-green-50/80 to-emerald-100/60 dark:from-emerald-900/25 dark:via-green-900/20 dark:to-emerald-900/15',
          border: 'border-emerald-200/70 dark:border-emerald-700/50',
          iconBg: 'bg-gradient-to-r from-emerald-500 to-green-500',
          copyBg: 'from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600',
          headerGlow: 'shadow-emerald-500/20'
        };
      case 'mx':
        return {
          background: 'bg-gradient-to-br from-orange-50/95 via-amber-50/80 to-orange-100/60 dark:from-orange-900/25 dark:via-amber-900/20 dark:to-orange-900/15',
          border: 'border-orange-200/70 dark:border-orange-700/50',
          iconBg: 'bg-gradient-to-r from-orange-500 to-amber-500',
          copyBg: 'from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600',
          headerGlow: 'shadow-orange-500/20'
        };
      case 'spf':
        return {
          background: 'bg-gradient-to-br from-purple-50/95 via-violet-50/80 to-purple-100/60 dark:from-purple-900/25 dark:via-violet-900/20 dark:to-purple-900/15',
          border: 'border-purple-200/70 dark:border-purple-700/50',
          iconBg: 'bg-gradient-to-r from-purple-500 to-violet-500',
          copyBg: 'from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600',
          headerGlow: 'shadow-purple-500/20'
        };
      default:
        return {
          background: 'bg-gradient-to-br from-slate-50/95 via-slate-50/80 to-slate-100/60 dark:from-slate-800/95 dark:via-slate-800/80 dark:to-slate-800/60',
          border: 'border-slate-200/70 dark:border-slate-700/50',
          iconBg: 'bg-gradient-to-r from-blue-500 to-indigo-500',
          copyBg: 'from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600',
          headerGlow: 'shadow-blue-500/20'
        };
    }
  };

  const colors = getColorScheme(type);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        colors.background,
        colors.border,
        "rounded-2xl p-6 border backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center shadow-lg",
          colors.iconBg,
          colors.headerGlow
        )}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h4 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h4>
      </div>
      
             {/* Items */}
       <div className="space-y-4">
         {items.map((item, index) => (
           <motion.div 
             key={index} 
             initial={{ opacity: 0, x: -10 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: index * 0.1 }}
             className="group"
           >
             <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
               {item.label}
             </label>
             <div className="flex items-center gap-3">
               <div className="flex-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-2 border-slate-200/60 dark:border-slate-700/60 rounded-xl p-4 shadow-sm group-hover:shadow-md transition-all duration-200">
                 <span className="text-slate-900 dark:text-white font-mono text-sm break-all leading-relaxed block">
                   {item.value}
                 </span>
               </div>
               <motion.button
                 onClick={() => copyValue(item.value)}
                 whileHover={{ scale: 1.1 }}
                 whileTap={{ scale: 0.9 }}
                 className={cn(
                   "opacity-0 group-hover:opacity-100",
                   "p-3 bg-gradient-to-r text-white rounded-xl shadow-lg",
                   "transition-all duration-200 hover:shadow-xl",
                   "flex-shrink-0",
                   colors.copyBg
                 )}
                 title="Copy to clipboard"
               >
                 <Copy className="w-4 h-4" />
               </motion.button>
             </div>
           </motion.div>
         ))}
       </div>
    </motion.div>
  );
});

InfoSection.displayName = 'InfoSection';

export default SearchForm;