import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, Cookie } from 'lucide-react';
import SEO from '../components/SEO';

const Privacy: React.FC = () => {
  const { t } = useTranslation();

  const sections = [
    {
      icon: Database,
      title: t('privacy.dataCollection.title'),
      content: t('privacy.dataCollection.content')
    },
    {
      icon: Cookie,
      title: t('privacy.cookies.title'),
      content: t('privacy.cookies.content')
    },
    {
      icon: Eye,
      title: t('privacy.analytics.title'),
      content: t('privacy.analytics.content')
    },
    {
      icon: Lock,
      title: t('privacy.security.title'),
      content: t('privacy.security.content')
    }
  ];

  return (
    <>
      <SEO 
        path="/privacy"
        title={t('privacy.title')}
        description={t('privacy.description')}
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
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
              {t('privacy.title')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('privacy.subtitle')}
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
            className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white text-center"
          >
            <h2 className="text-2xl font-bold mb-4">
              {t('privacy.contact.title')}
            </h2>
            <p className="text-blue-100 mb-6">
              {t('privacy.contact.description')}
            </p>
            <a
              href="mailto:cengiz@cengizyilmaz.net"
              rel="dofollow"
              className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl font-medium transition-all duration-200"
            >
              {t('privacy.contact.button')}
            </a>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Privacy;