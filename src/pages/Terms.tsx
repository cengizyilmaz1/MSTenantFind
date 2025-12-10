import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Shield, AlertTriangle, Calendar, Users, Globe } from 'lucide-react';

const Terms: React.FC = () => {
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
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/25">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-700 to-indigo-700 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Please read these terms carefully before using our service.
          </p>
        </motion.div>

        {/* Content */}
        <div className="space-y-8">
          {/* Last Updated */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center gap-3 text-slate-600 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-800/80 rounded-xl p-4 backdrop-blur-xl"
          >
            <Calendar className="w-5 h-5" />
            <span className="font-medium">Last updated: December 2024</span>
          </motion.div>

          {/* Usage Terms */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-2xl p-8 border border-slate-200/60 dark:border-slate-700/60 shadow-lg"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Usage Terms</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              This tool is provided free of charge for legitimate business purposes only. Users must have proper authorization to query domain information and must comply with all applicable laws and regulations when using this service.
            </p>
          </motion.section>

          {/* Limitations */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-2xl p-8 border border-slate-200/60 dark:border-slate-700/60 shadow-lg"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Limitations</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              We are not responsible for the accuracy of results or any misuse of the information provided by this tool. The service queries publicly available Microsoft endpoints and DNS records. Users are responsible for verifying the accuracy of any information obtained.
            </p>
          </motion.section>

          {/* User Responsibility */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-2xl p-8 border border-slate-200/60 dark:border-slate-700/60 shadow-lg"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">User Responsibility</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Users must comply with Microsoft's terms of service and applicable laws when using information obtained from this tool. This includes respecting rate limits, not using the service for malicious purposes, and ensuring proper authorization before querying domain information.
            </p>
          </motion.section>

          {/* Liability */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-2xl p-8 border border-slate-200/60 dark:border-slate-700/60 shadow-lg"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Liability</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              This service is provided "as is" without warranties of any kind, either express or implied. We disclaim all warranties, including but not limited to, implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
            </p>
          </motion.section>

          {/* Important Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl p-8 border border-blue-200/50 dark:border-blue-700/50 backdrop-blur-xl"
          >
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Important Notice</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              By using this service, you agree to these terms. If you do not agree with any part of these terms, please do not use the service. We reserve the right to modify these terms at any time, and continued use of the service constitutes acceptance of any changes.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Terms;