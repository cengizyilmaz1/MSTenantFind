import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, Globe, MessageSquare } from 'lucide-react';

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/25">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-green-700 to-emerald-700 dark:from-white dark:via-green-200 dark:to-emerald-200 bg-clip-text text-transparent mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Your privacy is important to us. Learn how we handle your data.
          </p>
        </motion.div>

        {/* Content */}
        <div className="space-y-8">
          
          {/* Data Collection */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-2xl p-8 border border-slate-200/60 dark:border-slate-700/60 shadow-lg"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <Database className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Data Collection</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              We do not collect personal data. All searches are performed client-side in your browser. Domain queries are sent directly to public Microsoft endpoints and DNS providers without storing or logging the information on our servers.
            </p>
          </motion.section>

          {/* Cookies */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-2xl p-8 border border-slate-200/60 dark:border-slate-700/60 shadow-lg"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Cookies</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              We use essential cookies for language and theme preferences only. These cookies are stored locally in your browser and are not transmitted to our servers. No tracking cookies or third-party cookies are used.
            </p>
          </motion.section>

          {/* Analytics */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-2xl p-8 border border-slate-200/60 dark:border-slate-700/60 shadow-lg"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              We use Google Analytics with anonymized IPs to understand usage patterns and improve our service. No personally identifiable information is collected. You can opt-out of analytics by using browser settings or ad blockers.
            </p>
          </motion.section>

          {/* Security */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-2xl p-8 border border-slate-200/60 dark:border-slate-700/60 shadow-lg"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Security</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              All connections are encrypted using HTTPS. We follow security best practices and the tool operates entirely client-side to minimize data exposure. No sensitive information is transmitted to or stored on our servers.
            </p>
          </motion.section>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl p-8 border border-blue-200/50 dark:border-blue-700/50 backdrop-blur-xl text-center"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Questions?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              If you have any questions about this privacy policy, please contact us through our website or social media channels.
            </p>
            <a 
                              href="https://cengizyilmaz.net" 
              target="_blank" 
              rel="dofollow"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-blue-500/25"
            >
              <MessageSquare className="w-4 h-4" />
              Contact Us
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;