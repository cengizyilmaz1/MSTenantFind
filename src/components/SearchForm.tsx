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
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent mb-6 leading-tight">
            {t('title')}
          </h1>
          
          <p className="text-xl lg:text-2xl text-slate-600 dark:text-slate-400 max-w-4xl mx-auto leading-relaxed mb-6 font-medium">
            {t('subtitle')}
          </p>

          {/* Compact Features */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 dark:from-yellow-500/20 dark:to-orange-500/20 rounded-full border border-yellow-200/50 dark:border-yellow-700/50 backdrop-blur-xl">
              <Zap className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-300">Bulk Search</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20 rounded-full border border-green-200/50 dark:border-green-700/50 backdrop-blur-xl">
              <Target className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-semibold text-green-700 dark:text-green-300">Export Results</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 rounded-full border border-purple-200/50 dark:border-purple-700/50 backdrop-blur-xl">
              <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">Real-time Results</span>
            </div>
          </div>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-6xl mx-auto mb-12"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-2xl rounded-3xl p-10 border border-white/40 dark:border-slate-700/40 shadow-2xl shadow-blue-500/5 dark:shadow-blue-500/10 hover:shadow-2xl transition-all duration-500">
              {/* Info Banner */}
              <div className="flex items-start gap-6 p-8 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-3xl border border-blue-200/50 dark:border-blue-700/50 mb-10 backdrop-blur-xl">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Info className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-4 text-xl">
                    {t('howTo.title')}
                  </h4>
                  <div className="text-blue-700 dark:text-blue-300 space-y-2">
                    <p className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      {t('howTo.step1')}
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      {t('howTo.step2')}
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      {t('howTo.step3')}
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      {t('howTo.description')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Textarea */}
              <div className="relative mb-10">
                <label className="block text-2xl font-bold text-slate-900 dark:text-white mb-6">
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
                    className="w-full px-8 py-6 h-52 rounded-3xl border-2 border-slate-200/50 dark:border-slate-600/50 bg-white/80 dark:bg-slate-900/80 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 outline-none resize-none transition-all duration-500 text-lg leading-relaxed placeholder-slate-400 dark:placeholder-slate-500 font-mono backdrop-blur-xl shadow-inner"
                  />
                  <div className="absolute bottom-6 right-6 flex items-center gap-3">
                    <span className="text-sm text-slate-500 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-800/80 px-4 py-2 rounded-2xl backdrop-blur-xl font-medium">
                      <kbd className="font-semibold">Shift + Enter</kbd> for new line
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col lg:flex-row gap-6">
                <motion.button
                  type="submit"
                  disabled={loading || !domains.trim()}
                  className="flex-1 px-10 py-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-500 text-white rounded-3xl flex items-center justify-center gap-4 font-bold text-xl shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 disabled:cursor-not-allowed transition-all duration-500 border border-blue-500/20"
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
                      <Search className="w-7 h-7" />
                      <span>{t('search')}</span>
                    </>
                  )}
                </motion.button>

                {results.length > 0 && (
                  <ExportButton 
                    data={results} 
                    filename="tenant-results"
                    variant="secondary"
                    className="lg:w-auto px-10 py-6 rounded-3xl font-bold text-xl"
                  />
                )}
              </div>

              {/* Quick Stats */}
              {results.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-4 justify-center">
                  <div className="flex items-center gap-3 px-6 py-3 bg-green-100/80 dark:bg-green-900/40 rounded-2xl backdrop-blur-xl border border-green-200/50 dark:border-green-700/50">
                    <div className="w-4 h-4 bg-green-500 rounded-full shadow-lg"></div>
                    <span className="font-semibold text-green-700 dark:text-green-300">
                      {results.filter(r => r.tenantInfo).length} {t('status.found')}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 px-6 py-3 bg-red-100/80 dark:bg-red-900/40 rounded-2xl backdrop-blur-xl border border-red-200/50 dark:border-red-700/50">
                    <div className="w-4 h-4 bg-red-500 rounded-full shadow-lg"></div>
                    <span className="font-semibold text-red-700 dark:text-red-300">
                      {results.filter(r => !r.tenantInfo).length} {t('status.notFound')}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </form>
        </motion.div>

        {/* Results Section */}
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-7xl mx-auto"
          >
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
                Search Results
              </h2>
              <StatusBadge 
                status="success" 
                text={`${results.length} domains processed`}
                size="lg"
              />
            </div>

            <div className="grid gap-10">
              {results.map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-2xl rounded-3xl p-10 border border-white/40 dark:border-slate-700/40 shadow-2xl shadow-blue-500/5 dark:shadow-blue-500/10 hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 transition-all duration-500 group"
                >
                  {/* Domain Header */}
                  <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-blue-500/25">
                        <Globe className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                          {result.domain}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 font-semibold text-lg">
                          Microsoft Tenant Information
                        </p>
                      </div>
                    </div>
                    <StatusBadge 
                      status={result.tenantInfo ? 'success' : 'error'}
                      text={result.tenantInfo ? t('status.found') : t('status.notFound')}
                      size="lg"
                    />
                  </div>

                  {result.tenantInfo ? (
                    <div className="space-y-8">
                      {/* Tenant ID */}
                      <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-3xl p-8 border border-blue-200/50 dark:border-blue-700/50 backdrop-blur-xl">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center">
                            <Shield className="w-6 h-6 text-white" />
                          </div>
                          <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                            {t('tenantInfo.tenantId')}
                          </h4>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex-1 bg-white/80 dark:bg-slate-800/80 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-600/50 backdrop-blur-xl">
                            <code className="text-lg font-mono text-slate-900 dark:text-slate-100 break-all">
                              {result.tenantInfo.tenantId}
                            </code>
                          </div>
                          <motion.button
                            onClick={() => copyToClipboard(result.tenantInfo!.tenantId, 'tenant_id')}
                            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {t('copy')}
                          </motion.button>
                        </div>
                      </div>

                      {/* MX Records */}
                      {result.tenantInfo.mxRecords.length > 0 && (
                        <div className="bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-900/30 dark:to-emerald-900/30 rounded-3xl p-8 border border-green-200/50 dark:border-green-700/50 backdrop-blur-xl">
                          <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                              <Clock className="w-6 h-6 text-white" />
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                              {t('tenantInfo.mxRecords')} ({result.tenantInfo.mxRecords.length})
                            </h4>
                          </div>
                          <div className="space-y-4">
                            {result.tenantInfo.mxRecords.map((record, idx) => (
                              <div key={idx} className="flex items-center gap-4">
                                <div className="flex-1 bg-white/80 dark:bg-slate-800/80 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-600/50 backdrop-blur-xl">
                                  <code className="text-lg font-mono text-slate-900 dark:text-slate-100">
                                    {record.host}
                                  </code>
                                </div>
                                <motion.button
                                  onClick={() => copyToClipboard(record.host, 'mx_record')}
                                  className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-2xl font-bold transition-all duration-300 shadow-lg shadow-green-500/25 hover:shadow-green-500/40"
                                  whileHover={{ scale: 1.05, y: -2 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  {t('copy')}
                                </motion.button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* SPF Record */}
                      {result.tenantInfo.spfRecord && (
                        <div className="bg-gradient-to-r from-purple-50/80 to-pink-50/80 dark:from-purple-900/30 dark:to-pink-900/30 rounded-3xl p-8 border border-purple-200/50 dark:border-purple-700/50 backdrop-blur-xl">
                          <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                              <Shield className="w-6 h-6 text-white" />
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                              {t('tenantInfo.spfRecord')}
                            </h4>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex-1 bg-white/80 dark:bg-slate-800/80 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-600/50 backdrop-blur-xl">
                              <code className="text-lg font-mono text-slate-900 dark:text-slate-100 break-all">
                                {result.tenantInfo.spfRecord.record}
                              </code>
                            </div>
                            <motion.button
                              onClick={() => copyToClipboard(result.tenantInfo!.spfRecord!.record, 'spf_record')}
                              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl font-bold transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
                              whileHover={{ scale: 1.05, y: -2 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {t('copy')}
                            </motion.button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-red-500/25">
                        <Globe className="w-12 h-12 text-white" />
                      </div>
                      <h4 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                        {t('status.notFound')}
                      </h4>
                      <p className="text-slate-600 dark:text-slate-400 text-xl">
                        No Microsoft tenant found for this domain
                      </p>
                    </div>
                  )}
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