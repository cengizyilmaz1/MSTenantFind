import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Globe, Info, Zap, Target, Shield, Clock, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import LoadingSpinner from './LoadingSpinner';
import ExportButton from './ExportButton';
import StatusBadge from './StatusBadge';
import type { MultiDomainResult } from '../types';
import { getMXRecords, getSPFRecord } from '../utils/dns';
import { trackSearch, trackCopy, trackFormInteraction, trackConversion, trackPerformance, trackFeatureUsage } from '../utils/analytics';

const SearchForm: React.FC = () => {
  const { t } = useTranslation();
  const [domains, setDomains] = useState('');
  const [results, setResults] = useState<MultiDomainResult[]>([]);
  const [loading, setLoading] = useState(false);

  // Track component mount and feature usage
  useEffect(() => {
    trackFeatureUsage('search_form_viewed');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    trackFormInteraction('submit', 'tenant_search_form');
    
    if (!domains.trim()) {
      toast.error(t('enterDomain'));
      return;
    }

    const domainList = domains
      .split(/[\n,]/)
      .map(d => d.trim())
      .filter(Boolean)
      .filter((d, i, arr) => arr.indexOf(d) === i);

    setLoading(true);
    const newResults: MultiDomainResult[] = [];

    try {
      await Promise.all(
        domainList.map(async (domain) => {
          try {
            const [tenantResponse, mxRecords, spfRecord] = await Promise.all([
              fetch(`https://login.microsoftonline.com/${domain}/.well-known/openid-configuration`),
              getMXRecords(domain),
              getSPFRecord(domain)
            ]);

            if (!tenantResponse.ok) {
              newResults.push({ domain, tenantInfo: null, error: t('error') });
              return;
            }

            const data = await tenantResponse.json();
            const tenantId = data.issuer.split('/')[3];
            
            newResults.push({
              domain,
              tenantInfo: {
                tenantId,
                name: domain,
                mxRecords,
                spfRecord
              }
            });
          } catch (err) {
            newResults.push({ domain, tenantInfo: null, error: t('error') });
          }
        })
      );
      
      setResults(newResults);
      toast.success(t('searchCompleteDetails', { count: newResults.length }));
      
      // Enhanced analytics tracking
      const successCount = newResults.filter(r => r.tenantInfo).length;
      const searchType = domainList.length > 1 ? 'bulk' : 'single';
      
      trackSearch(domainList.join(','), successCount, searchType);
      trackConversion('search_success', successCount);
      trackFeatureUsage('tenant_search');
      
      if (successCount > 0) {
        trackPerformance('search_success_rate', (successCount / domainList.length) * 100, 'count');
      }
    } catch (error) {
      toast.error(t('searchError'));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const copyToClipboard = async (text: string, contentType: 'tenant_id' | 'mx_record' | 'spf_record' | 'other' = 'other') => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(t('copied'));
      trackCopy(text, contentType);
    } catch (error) {
      toast.error(t('copyError'));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Ultra-Modern Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="relative">
            {/* Background Glow Effect */}
            <div className="absolute inset-0 -m-4">
              <div className="w-full h-full bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-indigo-400/10 rounded-3xl blur-3xl"></div>
            </div>
            
            <div className="relative">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100/80 dark:bg-blue-900/30 backdrop-blur-xl rounded-full border border-blue-200/60 dark:border-blue-700/60 mb-6"
              >
                <Star className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">Professional Microsoft Tool</span>
              </motion.div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-slate-900 via-blue-700 to-indigo-700 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                  {t('title')}
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8 font-light">
                {t('subtitle')}
              </p>

              {/* Compact Feature Pills */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap justify-center gap-3 mb-8"
              >
                <div className="group flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                    <Zap className="w-3 h-3 text-white" />
                  </div>
                  <span className="font-semibold text-sm text-slate-700 dark:text-slate-300">Bulk Search</span>
                </div>
                <div className="group flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
                    <Target className="w-3 h-3 text-white" />
                  </div>
                  <span className="font-semibold text-sm text-slate-700 dark:text-slate-300">Export Results</span>
                </div>
                <div className="group flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-lg flex items-center justify-center">
                    <Shield className="w-3 h-3 text-white" />
                  </div>
                  <span className="font-semibold text-sm text-slate-700 dark:text-slate-300">Real-time</span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Ultra-Modern Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-12"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20 rounded-2xl blur opacity-30"></div>
              
              <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-2xl p-6">
                
                {/* Compact Info Section */}
                <div className="mb-6">
                  <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50/80 via-indigo-50/80 to-purple-50/80 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200/40 dark:border-blue-700/40 backdrop-blur-xl">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Info className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                        {t('howTo.title')}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-600 dark:text-slate-400">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">1</span>
                          </div>
                          <span className="text-sm">{t('howTo.step1')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">2</span>
                          </div>
                          <span className="text-sm">{t('howTo.step2')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">3</span>
                          </div>
                          <span className="text-sm">{t('howTo.step3')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">4</span>
                          </div>
                          <span className="text-sm">{t('howTo.description')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Compact Input Section */}
                <div className="mb-6">
                  <label className="block text-xl font-bold text-slate-900 dark:text-white mb-4">
                    {t('domainPlaceholder').split('\n')[0]}
                  </label>
                  
                  <div className="relative">
                    <textarea
                      value={domains}
                      onChange={(e) => setDomains(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onFocus={() => trackFormInteraction('focus', 'tenant_search_form')}
                      onBlur={() => trackFormInteraction('blur', 'tenant_search_form')}
                      placeholder={t('domainPlaceholder')}
                      className="w-full px-4 py-4 h-32 bg-slate-50/80 dark:bg-slate-800/80 border-2 border-slate-200/60 dark:border-slate-700/60 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 outline-none resize-none transition-all duration-300 font-mono text-sm leading-relaxed backdrop-blur-xl shadow-inner"
                    />
                    <div className="absolute bottom-3 right-3">
                      <span className="text-xs text-slate-500 dark:text-slate-400 bg-white/90 dark:bg-slate-800/90 px-2 py-1 rounded-lg backdrop-blur-xl font-medium border border-slate-200/50 dark:border-slate-700/50">
                        <kbd className="font-mono">Shift + Enter</kbd> for new line
                      </span>
                    </div>
                  </div>
                </div>

                {/* Compact Action Section */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <motion.button
                      type="submit"
                      disabled={loading || !domains.trim()}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-500 text-white rounded-xl flex items-center justify-center gap-2 font-bold shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 disabled:cursor-not-allowed transition-all duration-300 border border-blue-500/20"
                      whileHover={!loading && domains.trim() ? { scale: 1.02, y: -2 } : {}}
                      whileTap={!loading && domains.trim() ? { scale: 0.98 } : {}}
                    >
                      {loading ? (
                        <>
                          <LoadingSpinner size="sm" color="white" />
                          <span>{t('searching')}</span>
                        </>
                      ) : (
                        <>
                          <Search className="w-5 h-5" />
                          <span>{t('search')}</span>
                        </>
                      )}
                    </motion.button>

                    {results.length > 0 && (
                      <ExportButton 
                        data={results} 
                        filename="tenant-results"
                        variant="secondary"
                        className="sm:w-auto px-6 py-3 rounded-xl font-bold"
                      />
                    )}
                  </div>

                  {/* Compact Stats */}
                  {results.length > 0 && (
                    <div className="flex gap-4 justify-center relative z-10">
                      <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50/80 dark:bg-emerald-900/30 rounded-xl backdrop-blur-xl border border-emerald-200/50 dark:border-emerald-700/50">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-lg"></div>
                        <span className="font-bold text-sm text-emerald-700 dark:text-emerald-300">
                          {results.filter(r => r.tenantInfo).length} Found
                        </span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-red-50/80 dark:bg-red-900/30 rounded-xl backdrop-blur-xl border border-red-200/50 dark:border-red-700/50">
                        <div className="w-3 h-3 bg-red-500 rounded-full shadow-lg"></div>
                        <span className="font-bold text-sm text-red-700 dark:text-red-300">
                          {results.filter(r => !r.tenantInfo).length} Not Found
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        </motion.div>

        {/* Compact Results Section */}
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-6xl mx-auto"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-700 to-indigo-700 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent mb-2">
                  Search Results
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Microsoft tenant information discovered
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-lg relative z-10">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Search className="w-3 h-3 text-white" />
                </div>
                <span className="font-bold text-sm text-slate-700 dark:text-slate-300">
                  {results.length} domains processed
                </span>
              </div>
            </div>

            <div className="space-y-6">
              {results.map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group relative"
                >
                  {/* Card Glow Effect */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20 rounded-2xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
                  
                  <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 overflow-hidden">
                    
                    {/* Compact Domain Header */}
                    <div className="relative p-6 bg-gradient-to-r from-slate-50/80 via-white/80 to-blue-50/40 dark:from-slate-800/80 dark:via-slate-900/80 dark:to-slate-800/40 border-b border-slate-200/60 dark:border-slate-700/60">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-xl shadow-blue-500/25">
                              <Globe className="w-6 h-6 text-white" />
                            </div>
                            <div className="absolute -inset-1 bg-gradient-to-br from-blue-500/20 via-indigo-500/20 to-purple-600/20 rounded-xl blur opacity-50"></div>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                              {result.domain}
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                              Microsoft Tenant Information
                            </p>
                          </div>
                        </div>
                        
                        {/* Compact Status Badge */}
                        <div className={`relative px-4 py-2 rounded-xl backdrop-blur-xl border font-bold text-sm flex items-center gap-2 shadow-lg ${
                          result.tenantInfo 
                            ? 'bg-emerald-50/90 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-700/60'
                            : 'bg-red-50/90 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200/60 dark:border-red-700/60'
                        }`}>
                          <div className={`w-2 h-2 rounded-full shadow-lg ${result.tenantInfo ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                          {result.tenantInfo ? 'Found' : 'Not Found'}
                        </div>
                      </div>
                    </div>

                    {result.tenantInfo ? (
                      <div className="p-6 space-y-6">
                        {/* Compact Tenant ID Section */}
                        <div className="relative">
                          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 rounded-xl blur"></div>
                          <div className="relative bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-xl p-4 border border-slate-200/60 dark:border-slate-700/60">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                                <Shield className="w-4 h-4 text-white" />
                              </div>
                              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                                Tenant ID
                              </h4>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex-1 p-4 bg-white/90 dark:bg-slate-900/90 rounded-xl border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-xl shadow-inner">
                                <code className="text-sm font-mono text-slate-900 dark:text-slate-100 break-all leading-relaxed">
                                  {result.tenantInfo.tenantId}
                                </code>
                              </div>
                              <motion.button
                                onClick={() => copyToClipboard(result.tenantInfo!.tenantId, 'tenant_id')}
                                className="px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold shadow-xl hover:shadow-blue-500/25 transition-all duration-300"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                Copy
                              </motion.button>
                            </div>
                          </div>
                        </div>

                        {/* Compact MX Records Section */}
                        {result.tenantInfo.mxRecords.length > 0 && (
                          <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-green-500/10 rounded-xl blur"></div>
                            <div className="relative bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-xl p-4 border border-slate-200/60 dark:border-slate-700/60">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 via-teal-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                                  <Clock className="w-4 h-4 text-white" />
                                </div>
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                                  MX Records ({result.tenantInfo.mxRecords.length})
                                </h4>
                              </div>
                              <div className="space-y-3">
                                {result.tenantInfo.mxRecords.map((record, idx) => (
                                  <div key={idx} className="flex items-center gap-3">
                                    <div className="flex-1 p-4 bg-white/90 dark:bg-slate-900/90 rounded-xl border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-xl shadow-inner">
                                      <code className="text-sm font-mono text-slate-900 dark:text-slate-100 leading-relaxed">
                                        {record.host}
                                      </code>
                                    </div>
                                    <motion.button
                                      onClick={() => copyToClipboard(record.host, 'mx_record')}
                                      className="px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-bold shadow-xl hover:shadow-emerald-500/25 transition-all duration-300"
                                      whileHover={{ scale: 1.05, y: -2 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      Copy
                                    </motion.button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Compact SPF Record Section */}
                        {result.tenantInfo.spfRecord && (
                          <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-pink-500/10 rounded-xl blur"></div>
                            <div className="relative bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-xl p-4 border border-slate-200/60 dark:border-slate-700/60">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 via-indigo-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                                  <Shield className="w-4 h-4 text-white" />
                                </div>
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                                  SPF Record
                                </h4>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="flex-1 p-4 bg-white/90 dark:bg-slate-900/90 rounded-xl border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-xl shadow-inner">
                                  <code className="text-sm font-mono text-slate-900 dark:text-slate-100 break-all leading-relaxed">
                                    {result.tenantInfo.spfRecord.record}
                                  </code>
                                </div>
                                <motion.button
                                  onClick={() => copyToClipboard(result.tenantInfo!.spfRecord!.record, 'spf_record')}
                                  className="px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-bold shadow-xl hover:shadow-purple-500/25 transition-all duration-300"
                                  whileHover={{ scale: 1.05, y: -2 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  Copy
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-12 text-center">
                        <div className="relative mb-6">
                          <div className="w-16 h-16 bg-gradient-to-br from-red-500 via-rose-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto shadow-2xl shadow-red-500/25">
                            <Globe className="w-8 h-8 text-white" />
                          </div>
                          <div className="absolute -inset-1 bg-gradient-to-br from-red-500/20 via-rose-500/20 to-pink-500/20 rounded-2xl blur opacity-50"></div>
                        </div>
                        <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                          No Tenant Found
                        </h4>
                        <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                          No Microsoft tenant information was found for this domain. It may not be using Microsoft services.
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SearchForm;