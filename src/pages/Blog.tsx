import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Calendar, User, ArrowRight, Search, BookOpen, Sparkles, TrendingUp, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import { getAllPosts, getFeaturedPosts } from '../data/blogPosts';

const Blog: React.FC = () => {
  const { t, i18n } = useTranslation();
  const allPosts = getAllPosts();
  const featuredPosts = getFeaturedPosts();
  const isturkish = i18n.language === 'tr';

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(isturkish ? 'tr-TR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPostTitle = (post: any) => {
    return isturkish && post.titleTr ? post.titleTr : post.title;
  };

  const getPostExcerpt = (post: any) => {
    return isturkish && post.excerptTr ? post.excerptTr : post.excerpt;
  };

  const getPostCategory = (post: any) => {
    return isturkish && post.categoryTr ? post.categoryTr : post.category;
  };

  const getPostSlug = (post: any) => {
    return isturkish && post.slugTr ? post.slugTr : post.slug;
  };

  return (
    <>
      <SEO 
        path="/blog"
        title={t('blog.pageTitle', 'Microsoft Tenant & Azure ID Blog - Expert Guides and Tutorials')}
        description={t('blog.pageDescription', 'Expert guides, tutorials, and insights about Microsoft Azure, Office 365, tenant management, and identity solutions. Get your organization\'s tenant ID and more.')}
        keywords={t('blog.keywords', 'Microsoft tenant blog, Azure AD tutorials, Office 365 guides, tenant ID finder, Microsoft identity management')}
        type="website"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="max-w-8xl mx-auto px-4 py-20">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 dark:from-blue-500/20 dark:via-indigo-500/20 dark:to-purple-500/20 rounded-3xl border border-blue-200/50 dark:border-blue-700/50 mb-10 backdrop-blur-xl">
              <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <span className="text-lg font-bold text-blue-700 dark:text-blue-300 tracking-wide">
                {t('blog.badge', 'Knowledge Hub')}
              </span>
            </div>
            
            <h1 className="text-6xl lg:text-8xl font-black bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent mb-8 leading-tight">
              {t('blog.title', 'Expert Guides & Tutorials')}
            </h1>
            
            <p className="text-2xl lg:text-3xl text-slate-600 dark:text-slate-400 max-w-5xl mx-auto leading-relaxed font-medium">
              {t('blog.subtitle', 'Comprehensive guides about Microsoft Azure, Office 365, tenant management, and identity solutions')}
            </p>
          </motion.div>

          {/* Featured Posts */}
          {featuredPosts.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-20"
            >
              <div className="flex items-center gap-4 mb-12">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-3xl flex items-center justify-center shadow-lg shadow-yellow-500/25">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-4xl font-black text-slate-900 dark:text-white">
                    {t('blog.featured.title', 'Featured Articles')}
                  </h2>
                  <p className="text-xl text-slate-600 dark:text-slate-400 font-medium">
                    {t('blog.featured.subtitle', 'Our most popular and comprehensive guides')}
                  </p>
                </div>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-10">
                {featuredPosts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="group"
                  >
                    <Link to={`/blog/${getPostSlug(post)}`} className="block">
                      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-2xl rounded-3xl p-10 border border-white/40 dark:border-slate-700/40 shadow-2xl shadow-blue-500/5 dark:shadow-blue-500/10 hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 transition-all duration-700 group-hover:scale-[1.02] group-hover:-translate-y-2">
                        <div className="flex items-center gap-6 mb-8">
                          <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                            <Calendar className="w-5 h-5" />
                            <span className="font-medium">{formatDate(post.publishedAt)}</span>
                          </div>
                          <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                            <Clock className="w-5 h-5" />
                            <span className="font-medium">{post.readTime} {t('blog.minRead', 'min read')}</span>
                          </div>
                          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-300 rounded-2xl">
                            <TrendingUp className="w-4 h-4" />
                            <span className="text-sm font-bold">{t('blog.featured.badge', 'Featured')}</span>
                          </div>
                        </div>
                        
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-6 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 leading-tight">
                          {getPostTitle(post)}
                        </h3>
                        
                        <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed text-lg">
                          {getPostExcerpt(post)}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-3">
                            {post.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="px-4 py-2 bg-blue-100/80 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-bold rounded-2xl backdrop-blur-xl"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          
                          <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400 font-bold group-hover:gap-4 transition-all duration-300">
                            <span>{t('blog.readMore', 'Read More')}</span>
                            <ArrowRight className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            </motion.section>
          )}

          {/* All Posts */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center gap-4 mb-12">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Search className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-4xl font-black text-slate-900 dark:text-white">
                  {t('blog.allArticles.title', 'All Articles')}
                </h2>
                <p className="text-xl text-slate-600 dark:text-slate-400 font-medium">
                  {t('blog.allArticles.subtitle', 'Browse our complete collection of guides and tutorials')}
                </p>
              </div>
            </div>
            
            <div className="grid gap-10">
              {allPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  className="group"
                >
                  <Link to={`/blog/${getPostSlug(post)}`} className="block">
                    <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-2xl rounded-3xl p-10 border border-white/40 dark:border-slate-700/40 shadow-xl shadow-blue-500/5 dark:shadow-blue-500/10 hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 transition-all duration-700 group-hover:scale-[1.01] group-hover:-translate-y-1">
                      <div className="flex flex-col xl:flex-row gap-8">
                        <div className="flex-1">
                          <div className="flex items-center gap-6 mb-6">
                            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                              <Calendar className="w-5 h-5" />
                              <span className="font-medium">{formatDate(post.publishedAt)}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                              <Clock className="w-5 h-5" />
                              <span className="font-medium">{post.readTime} {t('blog.minRead', 'min read')}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                              <User className="w-5 h-5" />
                              <span className="font-medium">{post.author}</span>
                            </div>
                            {post.featured && (
                              <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 text-yellow-700 dark:text-yellow-300 rounded-xl">
                                <Star className="w-4 h-4" />
                                <span className="text-sm font-bold">{t('blog.featured.badge', 'Featured')}</span>
                              </div>
                            )}
                          </div>
                          
                          <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 leading-tight">
                            {getPostTitle(post)}
                          </h3>
                          
                          <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed text-lg">
                            {getPostExcerpt(post)}
                          </p>
                          
                          <div className="flex flex-wrap gap-3">
                            {post.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-4 py-2 bg-blue-100/80 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-bold rounded-2xl backdrop-blur-xl"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex xl:flex-col items-center xl:items-end justify-between xl:justify-center gap-6">
                          <div className="px-6 py-3 bg-gradient-to-r from-indigo-100/80 to-purple-100/80 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-700 dark:text-indigo-300 font-bold rounded-2xl backdrop-blur-xl">
                            {getPostCategory(post)}
                          </div>
                          
                          <div className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-blue-500/25">
                            <span>{t('blog.readArticle', 'Read Article')}</span>
                            <ArrowRight className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </motion.section>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-20 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-3xl p-12 border border-blue-200/50 dark:border-blue-700/50 text-center backdrop-blur-xl"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-blue-500/25">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-6">
              {t('blog.cta.title', 'Ready to Find Your Microsoft Tenant ID?')}
            </h3>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed">
              {t('blog.cta.description', 'Try our free Microsoft Tenant Finder Tool to instantly discover your organization\'s tenant ID, MX records, and SPF information.')}
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-4 px-12 py-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white rounded-3xl font-black text-xl transition-all duration-300 hover:scale-105 transform shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40"
            >
              <Search className="w-6 h-6" />
              <span>{t('blog.cta.button', 'Try the Tool Now')}</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Blog; 