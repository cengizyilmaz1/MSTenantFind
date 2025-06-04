import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FileText, Scale, AlertTriangle, Users, Shield } from 'lucide-react';
import SEO from '../components/SEO';

const Terms: React.FC = () => {
  const { t } = useTranslation();

  const sections = [
    {
      icon: Scale,
      title: t('terms.usage.title'),
      content: t('terms.usage.content')
    },
    {
      icon: AlertTriangle,
      title: t('terms.limitations.title'),
      content: t('terms.limitations.content')
    },
    {
      icon: Users,
      title: t('terms.responsibility.title'),
      content: t('terms.responsibility.content')
    },
    {
      icon: Shield,
      title: t('terms.liability.title'),
      content: t('terms.liability.content')
    }
  ];

  return (
    <>
      <SEO 
        path="/terms"
        title={t('terms.title')}
        description={t('terms.description')}
        type="article"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-6">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
              {t('terms.title')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('terms.subtitle')}
            </p>
          </motion.div>

          <div className="grid gap-8 md:gap-12">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        {section.title}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                        {section.content}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-8 text-white text-center"
          >
            <h2 className="text-2xl font-bold mb-4">
              {t('terms.important.title')}
            </h2>
            <p className="text-orange-100 mb-6">
              {t('terms.important.description')}
            </p>
            <div className="text-sm text-orange-200">
              {t('terms.lastUpdated')}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Terms;