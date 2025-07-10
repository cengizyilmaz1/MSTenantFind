import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Calendar, User, ArrowRight, Search, BookOpen, Sparkles, TrendingUp, Star } from 'lucide-react';
import SEO from '../components/SEO';
import { getAllPosts, getFeaturedPosts } from '../data/blogPosts';

const Blog: React.FC = () => {
  const allPosts = getAllPosts();
  const featuredPosts = getFeaturedPosts();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <SEO 
        path="/blog"
        title="Microsoft Tenant & Azure ID Blog - Expert Guides and Tutorials"
        description="Expert guides, tutorials, and insights about Microsoft Azure, Office 365, tenant management, and identity solutions. Get your organization's tenant ID and more."
        keywords="Microsoft tenant blog, Azure AD tutorials, Office 365 guides, tenant ID finder, Microsoft identity management"
        type="website"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 py-16">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 dark:from-blue-500/20 dark:via-indigo-500/20 dark:to-purple-500/20 rounded-2xl border border-blue-200/50 dark:border-blue-700/50 mb-8 backdrop-blur-xl">
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-base font-bold text-blue-700 dark:text-blue-300">
                Knowledge Hub
              </span>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-black bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent mb-6 leading-tight">
              Expert Guides & Tutorials
            </h1>
            
            <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-400 max-w-4xl mx-auto leading-relaxed">
              Comprehensive guides about Microsoft Azure, Office 365, tenant management, and identity solutions
            </p>
          </motion.div>



          {/* All Posts */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Search className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                  All Articles
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Browse our complete collection of guides and tutorials
                </p>
              </div>
            </div>
            
            <div className="grid gap-6">
              {allPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  className="group"
                >
                  <Link to={`/blog/${post.slug}`} className="block">
                    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl rounded-2xl p-8 border border-white/40 dark:border-slate-700/40 shadow-lg shadow-blue-500/5 dark:shadow-blue-500/10 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 transition-all duration-500 group-hover:scale-[1.01] group-hover:-translate-y-1">
                      <div className="flex flex-col xl:flex-row gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-4 text-sm">
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(post.publishedAt)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                              <Clock className="w-4 h-4" />
                              <span>{post.readTime} min read</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                              <User className="w-4 h-4" />
                              <span>{post.author}</span>
                            </div>
                            {post.featured && (
                              <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 text-yellow-700 dark:text-yellow-300 rounded-xl">
                                <Star className="w-3 h-3" />
                                <span className="text-xs font-bold">Featured</span>
                              </div>
                            )}
                          </div>
                          
                          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 leading-tight">
                            {post.title}
                          </h3>
                          
                          <p className="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                            {post.excerpt}
                          </p>
                          
                          <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-3 py-1 bg-blue-100/80 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-xl backdrop-blur-xl"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex xl:flex-col items-center xl:items-end justify-between xl:justify-center gap-4">
                          <div className="px-4 py-2 bg-gradient-to-r from-indigo-100/80 to-purple-100/80 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-700 dark:text-indigo-300 font-medium rounded-xl backdrop-blur-xl text-sm">
                            {post.category}
                          </div>
                          
                          <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-blue-500/25">
                            <span>Read Article</span>
                            <ArrowRight className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
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
            className="mt-16 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl p-10 border border-blue-200/50 dark:border-blue-700/50 text-center backdrop-blur-xl"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/25">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4">
              Ready to Find Your Microsoft Tenant ID?
            </h3>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              Try our free Microsoft Tenant Finder Tool to instantly discover your organization's tenant ID, MX records, and SPF information.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 transform shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40"
            >
              <Search className="w-5 h-5" />
              <span>Try the Tool Now</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Blog; 