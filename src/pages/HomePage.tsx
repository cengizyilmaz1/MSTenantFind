import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Globe, Download, Search as SearchIcon, Server, Database } from 'lucide-react';
import SearchForm from '../components/SearchForm';
import SEO from '../components/SEO';

// Feature card data
const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Real-time tenant discovery with sub-second response times',
    color: 'from-amber-500 to-orange-500'
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Zero data storage - all queries are processed in your browser',
    color: 'from-emerald-500 to-teal-500'
  },
  {
    icon: Globe,
    title: 'Bulk Search',
    description: 'Analyze up to 100 domains in a single query',
    color: 'from-blue-500 to-indigo-500'
  },
  {
    icon: Download,
    title: 'Export Data',
    description: 'Download results as JSON, CSV, or plain text',
    color: 'from-violet-500 to-purple-500'
  },
  {
    icon: Server,
    title: 'DNS Intelligence',
    description: 'MX records, SPF policies, and mail configuration',
    color: 'from-rose-500 to-pink-500'
  },
  {
    icon: Database,
    title: 'Microsoft APIs',
    description: 'Direct queries to official Microsoft endpoints',
    color: 'from-cyan-500 to-blue-500'
  }
];

const HomePage: React.FC = () => {
  return (
    <>
      <SEO 
        path="/" 
        type="website"
        title="TenantFind | Free Microsoft Tenant ID Finder - Azure & M365 Tenant Lookup Tool"
        description="TenantFind - #1 Free Tenant Finder Tool. Instantly find Azure AD Tenant ID, Microsoft 365 Tenant ID, Office 365 Tenant ID from any domain. Bulk lookup for IT Professionals."
        keywords="tenant find, tenant finder, microsoft tenant finder, find tenant id, azure tenant id, microsoft 365 tenant lookup, office 365 tenant id, entra id tenant finder, azure ad tenant, m365 tenant lookup, bulk tenant finder, free tenant id tool, get tenant id from domain"
      />
      <div className="min-h-screen py-12 px-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          <div className="absolute bottom-40 right-20 w-64 h-64 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-2000"></div>
        </div>
        
        <SearchForm />

        {/* Features Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-6xl mx-auto mt-24"
          aria-labelledby="features-heading"
        >
          <div className="text-center mb-12">
            <h2 
              id="features-heading"
              className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Why Choose <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">TenantFind</span>?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Professional-grade Microsoft tenant discovery with enterprise features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="group relative bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/60 dark:border-slate-700/60 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

      </div>
    </>
  );
};

export default HomePage; 