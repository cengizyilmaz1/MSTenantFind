import React, { useState, useCallback, useMemo, useRef, memo } from 'react';
import { motion } from 'framer-motion';
import { Search, Copy, Info, X, Clock, Zap } from 'lucide-react';
import { 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaTimesCircle,
  FaShieldAlt,
  FaEnvelope,
  FaRegCopy,
  FaIdCard,
  FaClipboardList,
  FaCloud,
  FaMicrosoft
} from 'react-icons/fa';
import { 
  BiError
} from 'react-icons/bi';
import { 
  MdEmail, 
  MdDomain,
  MdError,
  MdContentCopy
} from 'react-icons/md';
import { HiOutlineClipboardDocument } from 'react-icons/hi2';
import { IoMdCloudDone } from 'react-icons/io';
import toast from 'react-hot-toast';
import ExportButton from './ExportButton';
import LoadingSpinner from './LoadingSpinner';
import { findTenantInfo, validateDomain, parseDomainsFromText } from '../utils/dns';
import { cn } from '../utils/theme';
import { siteConfig } from '../constants';
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
      .slice(0, siteConfig.features.maxDomainsPerSearch);
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


  const handleClear = useCallback(() => {
    setDomains('');
    setResults([]);
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
      <div className="space-y-6">
        {/* Results Header with Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-2xl p-4 border border-blue-200/40 dark:border-blue-800/40"
        >
          <div className="flex flex-wrap gap-4 justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <IoMdCloudDone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                  {results.length} result{results.length !== 1 ? 's' : ''} found
                </span>
              </div>
              
              <button
                onClick={copyAllResults}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/60 dark:bg-slate-800/60 hover:bg-white/80 dark:hover:bg-slate-700/80 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-all duration-200 border border-gray-200/40 dark:border-gray-700/40"
              >
                <FaClipboardList className="w-3.5 h-3.5" />
                <span>Copy All</span>
              </button>
            </div>
            
            <ExportButton data={results} variant="primary" size="sm" />
          </div>
        </motion.div>

        {/* Results Grid with Lazy Loading */}
        <div className="space-y-6">
          {results.slice(0, 10).map((result, index) => (
            <ResultCard key={`${result.domain}-${index}`} result={result} />
          ))}
          {results.length > 10 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <div className="inline-flex flex-col items-center gap-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Showing 10 of {results.length} results
                </div>
                <button
                  onClick={() => {
                    const allResults = document.getElementById('all-results');
                    if (allResults) {
                      allResults.style.display = 'block';
                      (event?.target as HTMLElement)?.parentElement?.parentElement?.remove();
                    }
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl font-semibold shadow-lg transition-all duration-200"
                >
                  Show All Results
                </button>
              </div>
            </motion.div>
          )}
          <div id="all-results" style={{ display: 'none' }} className="space-y-6">
            {results.slice(10).map((result, index) => (
              <ResultCard key={`${result.domain}-${index + 10}`} result={result} />
            ))}
          </div>
        </div>
      </div>
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

      {/* Main Search Form and Results */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-3xl border border-white/20 dark:border-slate-700/20 shadow-2xl shadow-blue-500/10"
      >
        {/* Input Section */}
        <div className="p-8 lg:p-12 space-y-6">
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
            <button
              onClick={handleSearch}
              disabled={!isValid || isLoading}
              className="flex-1 min-w-64 flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 disabled:from-slate-400 disabled:via-slate-500 disabled:to-slate-600 text-white rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 disabled:shadow-none disabled:cursor-not-allowed transform hover:scale-105 disabled:hover:scale-100"
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
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {domainList.length > 0 && (
              <button
                onClick={copyDomains}
                className="flex items-center gap-2 px-4 py-3 bg-purple-100/80 dark:bg-purple-900/30 hover:bg-purple-200/80 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-xl font-medium transition-all duration-300 backdrop-blur-xl border border-purple-200/60 dark:border-purple-700/60"
              >
                <Copy className="w-4 h-4" />
                Copy Domains
              </button>
            )}

            {(domains || results.length > 0) && (
              <button
                onClick={handleClear}
                className="flex items-center gap-2 px-4 py-3 bg-red-100/80 dark:bg-red-900/30 hover:bg-red-200/80 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 rounded-xl font-medium transition-all duration-300 backdrop-blur-xl border border-red-200/60 dark:border-red-700/60"
              >
                <X className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Search Results */}
        {results.length > 0 && (
          <div className="border-t border-gray-200/60 dark:border-gray-700/60">
            <div className="p-8 lg:p-12">
              {SearchResults}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
});

SearchForm.displayName = 'SearchForm';

// Memoized Result Card Component - Ultra Modern Design with Enhanced Colors
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
      console.error('Copy error:', error);
      // Fallback for older browsers or permission issues
      try {
        const textArea = document.createElement('textarea');
        textArea.value = tenantId;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        toast.success('Tenant ID copied to clipboard!', {
          icon: '🆔',
          duration: 2000
        });
      } catch (fallbackError) {
        toast.error('Failed to copy Tenant ID. Please copy manually.');
      }
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
      console.error('Copy error:', error);
      // Fallback for older browsers or permission issues
      try {
        const textArea = document.createElement('textarea');
        textArea.value = domain;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        toast.success(`Domain "${domain}" copied!`, {
          icon: '🌐',
          duration: 2000
        });
      } catch (fallbackError) {
        toast.error('Failed to copy domain. Please copy manually.');
      }
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

  return (
    <div
      className={cn(
        "group relative overflow-hidden",
        "bg-gradient-to-br",
        hasTenant ? "from-emerald-50/50 via-white to-blue-50/50 dark:from-emerald-950/20 dark:via-gray-900 dark:to-blue-950/20" :
        hasError ? "from-red-50/50 via-white to-orange-50/50 dark:from-red-950/20 dark:via-gray-900 dark:to-orange-950/20" :
        "from-gray-50/50 via-white to-slate-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-slate-900",
        "rounded-3xl",
        "shadow-lg hover:shadow-2xl",
        "transition-all duration-300",
        "border-2",
        hasTenant ? "border-emerald-200/50 hover:border-emerald-300/70 dark:border-emerald-800/30 dark:hover:border-emerald-700/50" :
        hasError ? "border-red-200/50 hover:border-red-300/70 dark:border-red-800/30 dark:hover:border-red-700/50" :
        "border-gray-200/50 hover:border-gray-300/70 dark:border-gray-700/30 dark:hover:border-gray-600/50"
      )}
    >
      {/* Premium gradient overlay */}
      <div className={cn(
        "absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700",
        hasTenant ? "bg-gradient-to-br from-emerald-400/10 via-transparent to-blue-400/10" :
        hasError ? "bg-gradient-to-br from-red-400/10 via-transparent to-orange-400/10" :
        "bg-gradient-to-br from-gray-400/5 via-transparent to-slate-400/5"
      )} />
      
      {/* Animated gradient orb */}
      <div className={cn(
        "absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-30 transition-all duration-1000 group-hover:opacity-50",
        hasTenant ? "bg-gradient-to-br from-emerald-400 to-blue-500" :
        hasError ? "bg-gradient-to-br from-red-400 to-orange-500" :
        "bg-gradient-to-br from-gray-400 to-slate-500"
      )} />

      {/* Header Section */}
      <div className="relative p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-5">
            {/* Modern Status Badge */}
            <div className="relative">
              <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl transform rotate-3",
                "ring-4 ring-offset-4 ring-offset-white dark:ring-offset-gray-900",
                hasTenant ? "bg-gradient-to-br from-emerald-400 via-emerald-500 to-green-600 ring-emerald-200/50 dark:ring-emerald-800/50" :
                hasError ? "bg-gradient-to-br from-red-400 via-red-500 to-rose-600 ring-red-200/50 dark:ring-red-800/50" :
                "bg-gradient-to-br from-gray-400 via-gray-500 to-slate-600 ring-gray-200/50 dark:ring-gray-700/50"
              )}>
                {hasTenant ? (
                  <FaCheckCircle className="w-8 h-8 text-white drop-shadow-lg" />
                ) : hasError ? (
                  <BiError className="w-9 h-9 text-white drop-shadow-lg" />
                ) : (
                  <MdError className="w-8 h-8 text-white drop-shadow-lg" />
                )}
              </div>
              
              {/* Status dot with pulse */}
              <div className={cn(
                "absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-3 border-white dark:border-gray-900",
                hasTenant ? "bg-emerald-500" :
                hasError ? "bg-red-500" :
                "bg-gray-500"
              )}>
                <div className={cn(
                  "absolute inset-0 rounded-full animate-ping",
                  hasTenant ? "bg-emerald-400" :
                  hasError ? "bg-red-400" :
                  "bg-gray-400"
                )} />
              </div>
            </div>

            {/* Domain Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <MdDomain className="w-6 h-6 text-gray-400" />
                {result.domain}
              </h3>
              <div className="flex items-center gap-3 mt-2">
                <span className={cn(
                  "inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm",
                  hasTenant ? "bg-emerald-100/80 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60" :
                  hasError ? "bg-red-100/80 text-red-800 dark:bg-red-900/40 dark:text-red-300 border border-red-200/60 dark:border-red-800/60" :
                  "bg-gray-100/80 text-gray-800 dark:bg-gray-800/40 dark:text-gray-300 border border-gray-200/60 dark:border-gray-700/60"
                )}>
                  <div className={cn(
                    "w-2 h-2 rounded-full animate-pulse",
                    hasTenant ? "bg-emerald-500" :
                    hasError ? "bg-red-500" :
                    "bg-gray-500"
                  )} />
                  {hasTenant ? "Microsoft Tenant Verified" :
                   hasError ? "Connection Error" :
                   "No Microsoft Services"}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(result.timestamp).toLocaleDateString()} {new Date(result.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => copyDomain(result.domain)}
              className="p-3.5 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
              title="Copy domain"
              style={{ transition: 'none' }}
            >
              <FaRegCopy className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={copyFullResult}
              className="p-3.5 text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800"
              title="Copy all data"
              style={{ transition: 'none' }}
            >
              <HiOutlineClipboardDocument className="w-5 h-5" />
            </button>
            {hasTenant && (
              <button
                type="button"
                onClick={() => copyTenantId(result.tenantInfo!.tenantId!)}
                className="p-3.5 text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800"
                title="Copy Tenant ID"
                style={{ transition: 'none' }}
              >
                <FaIdCard className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Gradient Divider */}
      <div className="px-8">
        <div className={cn(
          "h-px bg-gradient-to-r",
          hasTenant ? "from-transparent via-emerald-200 to-transparent dark:via-emerald-800" :
          hasError ? "from-transparent via-red-200 to-transparent dark:via-red-800" :
          "from-transparent via-gray-200 to-transparent dark:via-gray-700"
        )} />
      </div>
      
      {/* Content Section */}
      <div className="p-8 pt-4">
        {hasError ? (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-r from-red-50/80 to-rose-50/80 dark:from-red-950/30 dark:to-rose-950/30 rounded-2xl p-5 border-2 border-red-200/50 dark:border-red-800/50 backdrop-blur-sm"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-xl">
                <FaExclamationTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-base font-semibold text-red-900 dark:text-red-100 mb-2 flex items-center gap-2">
                  <BiError className="w-5 h-5" />
                  Connection Error
                </h4>
                <p className="text-sm text-red-700 dark:text-red-300 leading-relaxed">{result.error}</p>
              </div>
            </div>
          </motion.div>
        ) : hasTenant ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="space-y-4"
          >
            <TenantInfoDisplay tenantInfo={result.tenantInfo!} />
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-r from-gray-50/80 to-slate-50/80 dark:from-gray-900/30 dark:to-slate-900/30 rounded-2xl p-5 border-2 border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gray-100 dark:bg-gray-800/50 rounded-xl">
                <MdError className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  No Microsoft Tenant
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">This domain is not associated with Microsoft services.</p>
                <div className="space-y-2 text-sm text-gray-500 dark:text-gray-500">
                  <div className="flex items-start gap-2">
                    <FaTimesCircle className="w-4 h-4 mt-0.5 text-gray-400" />
                    <span>No Microsoft 365 or Azure AD tenant detected</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <FaEnvelope className="w-4 h-4 mt-0.5 text-gray-400" />
                    <span>May use a different email provider</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <FaCloud className="w-4 h-4 mt-0.5 text-gray-400" />
                    <span>Domain not verified with Microsoft</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
         )}
       </div>
    </div>
  );
});

ResultCard.displayName = 'ResultCard';

// Memoized Tenant Info Display Component - Enhanced
const TenantInfoDisplay = memo<{ tenantInfo: NonNullable<MultiDomainResult['tenantInfo']> }>(({ tenantInfo }) => (
  <div className="space-y-4">
    <InfoSection 
      title="Microsoft Tenant Details" 
      icon={FaMicrosoft}
      type="tenant"
      items={[
        { label: 'Tenant ID', value: tenantInfo.tenantId },
        { label: 'Tenant Name', value: tenantInfo.name || 'Not available' }
      ]}
    />
    
    {tenantInfo.mxRecords && tenantInfo.mxRecords.length > 0 && (
      <InfoSection 
        title="Mail Exchange Records" 
        icon={MdEmail}
        type="mx"
        items={tenantInfo.mxRecords.map((record, index) => ({
          label: `MX Record ${index + 1}`,
          value: typeof record === 'string' ? record : record.host || 'Unknown'
        }))}
      />
    )}
    
    {tenantInfo.spfRecord && (
      <InfoSection 
        title="SPF Authentication" 
        icon={FaShieldAlt}
        type="spf"
        items={[{
          label: 'SPF Record',
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
      console.error('Copy error:', error);
      // Fallback for older browsers or permission issues
      try {
        const textArea = document.createElement('textarea');
        textArea.value = value;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        const shortValue = value.length > 30 ? value.substring(0, 30) + '...' : value;
        toast.success(`"${shortValue}" copied!`, {
          icon: '📄',
          duration: 2000
        });
      } catch (fallbackError) {
        toast.error('Failed to copy value. Please copy manually.');
      }
    }
  }, []);

  const getColorScheme = (type: string) => {
    switch (type) {
      case 'tenant':
        return {
          background: 'bg-gray-50 dark:bg-gray-800',
          border: 'border-gray-200 dark:border-gray-700',
          iconBg: 'bg-emerald-500',
          copyBg: '',
          headerGlow: ''
        };
      case 'mx':
        return {
          background: 'bg-gray-50 dark:bg-gray-800',
          border: 'border-gray-200 dark:border-gray-700',
          iconBg: 'bg-orange-500',
          copyBg: '',
          headerGlow: ''
        };
      case 'spf':
        return {
          background: 'bg-gray-50 dark:bg-gray-800',
          border: 'border-gray-200 dark:border-gray-700',
          iconBg: 'bg-purple-500',
          copyBg: '',
          headerGlow: ''
        };
      default:
        return {
          background: 'bg-gray-50 dark:bg-gray-800',
          border: 'border-gray-200 dark:border-gray-700',
          iconBg: 'bg-blue-500',
          copyBg: '',
          headerGlow: ''
        };
    }
  };

  const colors = getColorScheme(type);

  return (
    <div className={cn(
      "bg-white dark:bg-gray-900",
      "rounded-lg border",
      "border-gray-100 dark:border-gray-800",
      "overflow-hidden"
    )}>
      {/* Header */}
      <div className={cn(
        "px-4 py-3 border-b border-gray-100 dark:border-gray-800",
        colors.background
      )}>
        <div className="flex items-center gap-3">
          <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center shadow-lg",
              colors.iconBg || 'bg-gradient-to-br from-gray-500 to-gray-600'
            )}
          >
            <Icon className="w-5 h-5 text-white drop-shadow" />
          </div>
          <h4 className="text-base font-bold text-gray-900 dark:text-white">{title}</h4>
        </div>
      </div>
      
      {/* Items */}
      <div className="p-4 space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">
                {item.label}
              </div>
              <div className="text-sm text-gray-900 dark:text-white font-mono break-all">
                {item.value}
              </div>
            </div>
            <button
              onClick={() => copyValue(item.value)}
              className="flex-shrink-0 p-3 text-gray-600 dark:text-gray-400 rounded-lg bg-gray-100 dark:bg-gray-800"
              title="Copy to clipboard"
              type="button"
              style={{ transition: 'none' }}
            >
              <MdContentCopy className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
});

InfoSection.displayName = 'InfoSection';

export default SearchForm;