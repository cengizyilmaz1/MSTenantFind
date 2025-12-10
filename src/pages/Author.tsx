import React from 'react';
import { motion } from 'framer-motion';
import { Award, MapPin, Calendar, Briefcase, Mail, Globe, ExternalLink, Star, Users, Target } from 'lucide-react';
import { siteConfig } from '../constants';

const Author: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="max-w-5xl mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-blue-500/25">
            <Award className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-700 to-indigo-700 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent mb-4">
            Hello, I'm {siteConfig.author.name}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-6">
            Microsoft MVP & Microsoft Certified Trainer
          </p>
          <div className="flex items-center justify-center gap-6 text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>In IT industry since 2015</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>Turkey</span>
            </div>
          </div>
        </motion.div>

        {/* About */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-16"
        >
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-2xl p-8 border border-slate-200/60 dark:border-slate-700/60 shadow-lg">
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              I have been actively working in the IT industry since 2015 and dealing with Microsoft technologies. 
              I have Microsoft MVP (Most Valuable Professional) and Microsoft Certified Trainer (MCT) titles.
            </p>
          </div>
        </motion.section>

        {/* Expertise */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              My Professional Career
            </h2>
            <p className="text-slate-600 dark:text-slate-400">Areas of Expertise</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-2xl p-6 border border-slate-200/60 dark:border-slate-700/60 shadow-lg">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Microsoft Exchange Server & Exchange Online
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Extensive experience in designing, optimizing and managing mail infrastructures.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-2xl p-6 border border-slate-200/60 dark:border-slate-700/60 shadow-lg">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Microsoft 365
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Expert level knowledge in integration and configuration of productivity tools.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-2xl p-6 border border-slate-200/60 dark:border-slate-700/60 shadow-lg">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Active Directory
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Installation and management of reliable user and resource management systems.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-2xl p-6 border border-slate-200/60 dark:border-slate-700/60 shadow-lg">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                PowerShell
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Powerful script writing and system management for automation processes.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Achievements */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Certifications & Achievements
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-r from-orange-50/80 to-red-50/80 dark:from-orange-900/30 dark:to-red-900/30 backdrop-blur-2xl rounded-2xl p-8 border border-orange-200/50 dark:border-orange-700/50">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Microsoft MVP
                  </h3>
                  <p className="text-orange-600 dark:text-orange-400 font-medium">
                    Most Valuable Professional
                  </p>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Prestigious title recognized for community contribution and technical expertise in Microsoft technologies.
              </p>
              <div className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                2020-2024
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-900/30 dark:to-indigo-900/30 backdrop-blur-2xl rounded-2xl p-8 border border-blue-200/50 dark:border-blue-700/50">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Microsoft Certified Trainer
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium">
                    MCT
                  </p>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Certified trainer title authorized to deliver Microsoft official curriculum.
              </p>
              <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                2018-2024
              </div>
            </div>
          </div>
        </motion.section>

        {/* Goals */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-2xl p-8 border border-slate-200/60 dark:border-slate-700/60 shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">My Goal</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              Sharing my technological knowledge and experience to guide organizations and individuals in their digital transformation processes. 
              As someone with Microsoft MVP and Microsoft Certified Trainer (MCT) titles, I continuously follow developments in the technology world and integrate innovations into business processes.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50/80 dark:bg-slate-800/80 rounded-xl p-6 backdrop-blur-xl">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  Digital Transformation Guidance
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Providing strategic consultancy to organizations and individuals in their digital transformation processes.
                </p>
              </div>
              
              <div className="bg-slate-50/80 dark:bg-slate-800/80 rounded-xl p-6 backdrop-blur-xl">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  Technology Integration
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Integrating innovations in the technology world into business processes and increasing efficiency.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl p-8 border border-blue-200/50 dark:border-blue-700/50 backdrop-blur-xl text-center"
        >
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Get in Touch</h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8 max-w-2xl mx-auto">
            Do you have questions about Microsoft technologies or do you need training? Don't hesitate to contact me!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
                                      href={`mailto:${siteConfig.author.email}`}
              className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-blue-500/25"
            >
              <Mail className="w-5 h-5" />
              Send Email
            </a>
            
            <a 
                                      href={siteConfig.author.website} 
              target="_blank" 
              rel="dofollow"
              className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg backdrop-blur-xl border border-slate-200 dark:border-slate-700"
            >
              <ExternalLink className="w-5 h-5" />
              Visit Website
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Author;