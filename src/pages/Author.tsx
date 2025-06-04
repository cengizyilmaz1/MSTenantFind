import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Award, MapPin, Calendar, Mail, ExternalLink, Github, Linkedin, Twitter, Code, Server, Shield, Users, Zap, Target } from 'lucide-react';
import SEO from '../components/SEO';

const Author: React.FC = () => {
  const { t } = useTranslation();

  const expertiseAreas = [
    {
      icon: Server,
      title: t('about.expertise.exchangeServer.title'),
      description: t('about.expertise.exchangeServer.description'),
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Users,
      title: t('about.expertise.microsoft365.title'),
      description: t('about.expertise.microsoft365.description'),
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Shield,
      title: t('about.expertise.activeDirectory.title'),
      description: t('about.expertise.activeDirectory.description'),
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Code,
      title: t('about.expertise.powershell.title'),
      description: t('about.expertise.powershell.description'),
      color: 'from-orange-500 to-red-500'
    }
  ];

  const achievements = [
    {
      icon: Award,
      title: t('about.achievements.mvp.title'),
      subtitle: t('about.achievements.mvp.subtitle'),
      description: t('about.achievements.mvp.description'),
      year: t('about.achievements.mvp.year'),
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Award,
      title: t('about.achievements.mct.title'),
      subtitle: t('about.achievements.mct.subtitle'),
      description: t('about.achievements.mct.description'),
      year: t('about.achievements.mct.year'),
      color: 'from-blue-500 to-indigo-500'
    }
  ];

  const goals = [
    {
      icon: Target,
      title: t('about.goals.digitalTransformation.title'),
      description: t('about.goals.digitalTransformation.description')
    },
    {
      icon: Zap,
      title: t('about.goals.technologyIntegration.title'),
      description: t('about.goals.technologyIntegration.description')
    }
  ];

  const socialLinks = [
    {
      icon: Github,
      label: 'GitHub',
      url: 'https://github.com/cengizyilmaz1',
      color: 'hover:text-gray-900 dark:hover:text-white'
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      url: 'https://linkedin.com/in/cengizyilmazz',
      color: 'hover:text-blue-600'
    },
    {
      icon: Twitter,
      label: 'X (Twitter)',
      url: 'https://twitter.com/cengizyilmaz_',
      color: 'hover:text-blue-400'
    },
    {
      icon: ExternalLink,
      label: 'Website',
      url: 'https://cengizyilmaz.net',
      color: 'hover:text-indigo-600'
    }
  ];

  return (
    <>
      <SEO 
        path="/cengizyilmazkimdir"
        title={t('about.pageTitle')}
        description={t('about.pageDescription')}
        type="profile"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-16">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <div className="relative inline-block mb-8">
              <div className="w-40 h-40 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-5xl font-bold shadow-2xl">
                CY
              </div>
              <div className="absolute -bottom-3 -right-3 w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-xl">
                <Award className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-6">
              Cengiz YILMAZ
            </h1>
            
            <p className="text-2xl font-medium text-blue-600 dark:text-blue-400 mb-8">
              {t('about.title')}
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-8 text-lg text-gray-600 dark:text-gray-400 mb-8">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-orange-500" />
                <span>{t('about.achievements.mvp.title')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-500" />
                <span>{t('about.achievements.mct.title')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-500" />
                <span>{t('about.experience')}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-purple-500" />
                <span>{t('about.location')}</span>
              </div>
            </div>

            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed">
              {t('about.description')}
            </p>

            {/* Social Links */}
            <div className="flex justify-center gap-4 mt-10">
              {socialLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <motion.a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="dofollow"
                    className={`p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 text-gray-600 dark:text-gray-400 ${link.color} transition-all duration-200 hover:scale-110 hover:shadow-lg`}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={link.label}
                  >
                    <Icon className="w-6 h-6" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Professional Career - Expertise Areas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {t('about.expertise.title')}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                {t('about.expertise.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {expertiseAreas.map((area, index) => {
                const Icon = area.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0">
                        <div className={`w-16 h-16 bg-gradient-to-r ${area.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                          {area.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {area.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {t('about.achievements.title')}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0">
                        <div className={`w-20 h-20 bg-gradient-to-r ${achievement.color} rounded-3xl flex items-center justify-center shadow-lg`}>
                          <Icon className="w-10 h-10 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {achievement.title}
                          </h3>
                          <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full font-medium">
                            {achievement.year}
                          </span>
                        </div>
                        <p className="text-lg font-medium text-blue-600 dark:text-blue-400 mb-3">
                          {achievement.subtitle}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Goals Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {t('about.goals.title')}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed">
                {t('about.goals.description')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {goals.map((goal, index) => {
                const Icon = goal.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 backdrop-blur-xl rounded-3xl p-8 border border-indigo-200/50 dark:border-indigo-700/50 shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                          {goal.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {goal.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-10 text-white text-center shadow-2xl"
          >
            <h2 className="text-4xl font-bold mb-6">
              {t('about.contact.title')}
            </h2>
            <p className="text-blue-100 mb-8 text-xl max-w-2xl mx-auto leading-relaxed">
              {t('about.contact.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.a
                href="mailto:cengiz@cengizyilmaz.net"
                className="inline-flex items-center gap-3 bg-white/20 hover:bg-white/30 px-8 py-4 rounded-2xl font-semibold transition-all duration-200 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail className="w-6 h-6" />
                {t('about.contact.sendEmail')}
              </motion.a>
              <motion.a
                href="https://cengizyilmaz.net"
                target="_blank"
                rel="dofollow"
                className="inline-flex items-center gap-3 bg-white/20 hover:bg-white/30 px-8 py-4 rounded-2xl font-semibold transition-all duration-200 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ExternalLink className="w-6 h-6" />
                {t('about.contact.visitWebsite')}
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Author;