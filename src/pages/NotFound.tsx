import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, ArrowLeft, AlertCircle } from 'lucide-react';
import SEO from '../components/SEO';

const NotFound: React.FC = () => {
  return (
    <>
      <SEO 
        title="404 - Page Not Found | TenantFind"
        description="The page you're looking for doesn't exist or has been moved."
        path="/404"
        noIndex={true}
      />
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full text-center">
          {/* Animated 404 */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="mb-8"
          >
            <div className="text-9xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              404
            </div>
          </motion.div>

          {/* Error Icon */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center mb-6"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
              <AlertCircle className="w-8 h-8 text-white" aria-hidden="true" />
            </div>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Page Not Found
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              Oops! The page you're looking for doesn't exist or has been moved. 
              Let's get you back on track.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <Home className="w-5 h-5" aria-hidden="true" />
              Go to Homepage
            </Link>
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 px-6 py-3 bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold transition-all duration-300 border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg"
            >
              <ArrowLeft className="w-5 h-5" aria-hidden="true" />
              Go Back
            </button>
          </motion.div>

          {/* Helpful Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 pt-8 border-t border-slate-200/60 dark:border-slate-700/60"
          >
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Looking for something specific?
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/"
                className="flex items-center gap-1.5 px-4 py-2 text-sm bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors"
              >
                <Search className="w-4 h-4" aria-hidden="true" />
                Search Tenants
              </Link>
              <Link
                to="/author"
                className="px-4 py-2 text-sm bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors"
              >
                About Author
              </Link>
              <Link
                to="/terms"
                className="px-4 py-2 text-sm bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
