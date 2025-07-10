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
fabrikam.com
tailwindcorp.com
microsoft.com
adatum.com
wingtiptoys.com
fourthcoffee.com
proseware.com
nwtraders.com
woodgrove.com`;
    
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
      toast.success('Domains copied to clipboard!');
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
      toast.success('All results copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy results');
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

        {/* Action Bar */}
        <div className="flex flex-wrap gap-4 justify-between items-center bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-white/30 dark:border-slate-700/30 shadow-xl relative z-10 overflow-visible">
          <div className="flex items-center gap-3">
            <motion.button
              onClick={copyAllResults}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-xl hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors duration-200 font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Copy className="w-4 h-4" />
              Copy All Results
            </motion.button>
          </div>
          
          <div className="relative z-20">
            <ExportButton data={results} variant="secondary" />
          </div>
        </div>

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
                placeholder="Enter domain names (one per line):\ncontoso.com\nfabrikam.com\ntailwindcorp.com\n\nPress Enter to search, Shift+Enter for new line"
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

              {/* Keyboard Shortcuts Info */}
              <div className="absolute bottom-4 right-4 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1">
                  <Keyboard className="w-3 h-3" />
                  <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded font-mono">Enter</kbd>
                  <span>Search</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded font-mono">Shift+Enter</kbd>
                  <span>New line</span>
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

// Memoized Stats Card Component
const StatsCard = memo<{
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  color: 'blue' | 'green' | 'yellow' | 'red';
}>(({ icon: Icon, label, value, color }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-cyan-500 shadow-blue-500/25',
    green: 'from-green-500 to-emerald-500 shadow-green-500/25',
    yellow: 'from-yellow-500 to-orange-500 shadow-yellow-500/25',
    red: 'from-red-500 to-pink-500 shadow-red-500/25'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/20 shadow-xl"
    >
      <div className="flex items-center gap-4">
        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-r shadow-lg", colorClasses[color])}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        <div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">{value}</div>
          <div className="text-sm font-medium text-slate-600 dark:text-slate-400">{label}</div>
        </div>
      </div>
    </motion.div>
  );
});

StatsCard.displayName = 'StatsCard';

// Memoized Result Card Component - Modern Design
const ResultCard = memo<{ result: MultiDomainResult }>(({ result }) => {
  const hasError = !!result.error;
  const hasTenant = !!result.tenantInfo?.tenantId;

  const copyTenantId = useCallback(async (tenantId: string) => {
    try {
      await navigator.clipboard.writeText(tenantId);
      toast.success('Tenant ID copied!');
    } catch (error) {
      toast.error('Failed to copy');
    }
  }, []);

  const copyDomain = useCallback(async (domain: string) => {
    try {
      await navigator.clipboard.writeText(domain);
      toast.success('Domain copied!');
    } catch (error) {
      toast.error('Failed to copy');
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
      toast.success('Result copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy');
    }
  }, [result, hasTenant, hasError]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className="group bg-gradient-to-br from-white/95 via-white/90 to-white/80 dark:from-slate-800/95 dark:via-slate-800/90 dark:to-slate-800/80 backdrop-blur-2xl rounded-3xl p-8 border border-white/40 dark:border-slate-700/40 shadow-2xl hover:shadow-3xl transition-all duration-500"
    >
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-6">
          <div className={cn(
            "relative w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl overflow-hidden",
            hasTenant 
              ? "bg-gradient-to-br from-green-400 via-green-500 to-emerald-600" 
              : hasError 
                ? "bg-gradient-to-br from-red-400 via-red-500 to-rose-600"
                : "bg-gradient-to-br from-slate-400 via-slate-500 to-slate-600"
          )}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            {hasTenant ? (
              <Check className="w-10 h-10 text-white relative z-10" />
            ) : hasError ? (
              <AlertCircle className="w-10 h-10 text-white relative z-10" />
            ) : (
              <X className="w-10 h-10 text-white relative z-10" />
            )}
            {hasTenant && (
              <motion.div
                className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Star className="w-3 h-3 text-yellow-800" />
              </motion.div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">{result.domain}</h3>
              <motion.button
                onClick={() => copyDomain(result.domain)}
                className="opacity-0 group-hover:opacity-100 p-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Copy className="w-4 h-4" />
              </motion.button>
            </div>
            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">{new Date(result.timestamp).toLocaleString()}</span>
              <div className={cn(
                "px-3 py-1 rounded-full text-xs font-bold",
                hasTenant 
                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                  : hasError 
                    ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              )}>
                {hasTenant ? 'FOUND' : hasError ? 'ERROR' : 'NOT FOUND'}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <motion.button
            onClick={copyFullResult}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-xl hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors duration-200 font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Copy className="w-4 h-4" />
            Copy All
          </motion.button>
          
          {hasTenant && (
            <motion.button
              onClick={() => copyTenantId(result.tenantInfo!.tenantId!)}
              className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-xl hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors duration-200 font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Shield className="w-4 h-4" />
              Copy ID
            </motion.button>
          )}
        </div>
      </div>

      {hasError ? (
        <div className="bg-gradient-to-r from-red-50/80 via-red-50/60 to-red-50/40 dark:from-red-900/20 dark:via-red-900/15 dark:to-red-900/10 border border-red-200/60 dark:border-red-700/60 rounded-2xl p-6">
          <div className="flex items-center gap-3 text-red-700 dark:text-red-300">
            <AlertCircle className="w-5 h-5" />
            <span className="font-semibold">Error: {result.error}</span>
          </div>
        </div>
      ) : hasTenant ? (
        <div className="space-y-6">
          <TenantInfoDisplay tenantInfo={result.tenantInfo!} />
        </div>
      ) : (
        <div className="bg-gradient-to-r from-slate-50/80 via-slate-50/60 to-slate-50/40 dark:from-slate-800/80 dark:via-slate-800/60 dark:to-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-6">
          <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
            <Info className="w-5 h-5" />
            <span className="font-semibold">No Microsoft tenant found for this domain</span>
          </div>
        </div>
      )}
    </motion.div>
  );
});

ResultCard.displayName = 'ResultCard';

// Memoized Tenant Info Display Component
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
        icon={Shield}
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

// Memoized Info Section Component
const InfoSection = memo<{
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  type?: 'tenant' | 'mx' | 'spf';
  items: Array<{ label: string; value: string }>;
}>(({ title, icon: Icon, type = 'default', items }) => {
  const copyValue = useCallback(async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success('Copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy');
    }
  }, []);

  const getColorScheme = (type: string) => {
    switch (type) {
      case 'tenant':
        return {
          background: 'bg-gradient-to-br from-emerald-50/90 via-green-50/70 to-emerald-50/50 dark:from-emerald-900/20 dark:via-green-900/15 dark:to-emerald-900/10',
          border: 'border-emerald-200/60 dark:border-emerald-700/60',
          iconBg: 'bg-gradient-to-r from-emerald-500 to-green-500',
          copyBg: 'from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600'
        };
      case 'mx':
        return {
          background: 'bg-gradient-to-br from-orange-50/90 via-amber-50/70 to-orange-50/50 dark:from-orange-900/20 dark:via-amber-900/15 dark:to-orange-900/10',
          border: 'border-orange-200/60 dark:border-orange-700/60',
          iconBg: 'bg-gradient-to-r from-orange-500 to-amber-500',
          copyBg: 'from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600'
        };
      case 'spf':
        return {
          background: 'bg-gradient-to-br from-purple-50/90 via-violet-50/70 to-purple-50/50 dark:from-purple-900/20 dark:via-violet-900/15 dark:to-purple-900/10',
          border: 'border-purple-200/60 dark:border-purple-700/60',
          iconBg: 'bg-gradient-to-r from-purple-500 to-violet-500',
          copyBg: 'from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600'
        };
      default:
        return {
          background: 'bg-gradient-to-br from-slate-50/90 via-slate-50/70 to-slate-50/50 dark:from-slate-800/90 dark:via-slate-800/70 dark:to-slate-800/50',
          border: 'border-slate-200/60 dark:border-slate-700/60',
          iconBg: 'bg-gradient-to-r from-blue-500 to-indigo-500',
          copyBg: 'from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600'
        };
    }
  };

  const colors = getColorScheme(type);

  return (
    <div className={`${colors.background} ${colors.border} rounded-2xl p-6 border backdrop-blur-sm`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 ${colors.iconBg} rounded-xl flex items-center justify-center shadow-lg`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <h4 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h4>
      </div>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="group flex flex-col gap-1">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{item.label}</span>
            <div className="relative">
              <span className="text-slate-900 dark:text-white font-mono text-sm bg-white/80 dark:bg-slate-900/80 px-3 py-2 pr-10 rounded-lg border border-slate-200/60 dark:border-slate-700/60 break-all block">
                {item.value}
              </span>
              <motion.button
                onClick={() => copyValue(item.value)}
                className={`absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-2 bg-gradient-to-r ${colors.copyBg} text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ transform: 'translateY(-50%)' }}
                title="Copy to clipboard"
              >
                <Copy className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

InfoSection.displayName = 'InfoSection';

export default SearchForm;