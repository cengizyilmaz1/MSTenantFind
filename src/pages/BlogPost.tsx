import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, ArrowLeft, Tag, Share2, BookOpen, Search, Star, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import { getPostBySlug, getAllPosts } from '../data/blogPosts';

const BlogPost: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : null;
  const allPosts = getAllPosts();
  const relatedPosts = allPosts
    .filter(p => p.id !== post?.id && p.tags.some(tag => post?.tags.includes(tag)))
    .slice(0, 3);
  const isturkish = i18n.language === 'tr';

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

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

  const getPostContent = (post: any) => {
    return isturkish && post.contentTr ? post.contentTr : post.content;
  };

  const getPostSlug = (post: any) => {
    return isturkish && post.slugTr ? post.slugTr : post.slug;
  };

  const getPostSeoTitle = (post: any) => {
    return isturkish && post.seoTitleTr ? post.seoTitleTr : (post.seoTitle || post.title);
  };

  const getPostSeoDescription = (post: any) => {
    return isturkish && post.seoDescriptionTr ? post.seoDescriptionTr : (post.seoDescription || post.excerpt);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(t('copied', 'URL copied to clipboard!'));
    } catch (error) {
      toast.error(t('copyError', 'Failed to copy URL'));
    }
  };

  const sharePost = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: url,
        });
      } catch (error) {
        copyToClipboard(url);
      }
    } else {
      copyToClipboard(url);
    }
  };

  const customComponents = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          style={tomorrow}
          language={match[1]}
          PreTag="div"
          className="rounded-2xl my-6 shadow-lg"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg text-sm font-mono border border-slate-200 dark:border-slate-700" {...props}>
          {children}
        </code>
      );
    },
    h1: ({ children }: any) => (
      <h1 className="text-5xl font-black text-slate-900 dark:text-white mb-8 mt-12 leading-tight">
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-6 mt-10 leading-tight">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 mt-8 leading-tight">
        {children}
      </h3>
    ),
    p: ({ children }: any) => (
      <p className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed text-lg">
        {children}
      </p>
    ),
    ul: ({ children }: any) => (
      <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 mb-6 space-y-3 pl-4">
        {children}
      </ul>
    ),
    ol: ({ children }: any) => (
      <ol className="list-decimal list-inside text-slate-700 dark:text-slate-300 mb-6 space-y-3 pl-4">
        {children}
      </ol>
    ),
    li: ({ children }: any) => (
      <li className="ml-6 leading-relaxed">{children}</li>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-blue-500 pl-8 py-4 my-8 bg-blue-50/80 dark:bg-blue-900/20 rounded-r-2xl backdrop-blur-xl italic text-lg">
        {children}
      </blockquote>
    ),
    a: ({ children, href }: any) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold underline decoration-2 underline-offset-2 hover:decoration-blue-500 transition-all duration-200"
      >
        {children}
      </a>
    ),
  };

  return (
    <>
      <SEO 
        path={`/blog/${getPostSlug(post)}`}
        title={getPostSeoTitle(post)}
        description={getPostSeoDescription(post)}
        keywords={post.seoKeywords?.join(', ') || post.tags.join(', ')}
        type="article"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="max-w-6xl mx-auto px-4 py-20">
          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-12"
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-3 px-6 py-3 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-white/40 dark:border-slate-700/40 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-300 hover:scale-105 font-semibold shadow-lg shadow-blue-500/5"
            >
              <ArrowLeft className="w-5 h-5" />
              {t('blog.backToBlog', 'Back to Blog')}
            </Link>
          </motion.div>

          {/* Article Header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="flex flex-wrap gap-3 mb-8">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 bg-blue-100/80 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold rounded-2xl backdrop-blur-xl border border-blue-200/50 dark:border-blue-700/50"
                >
                  {tag}
                </span>
              ))}
              {post.featured && (
                <span className="px-4 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 text-yellow-700 dark:text-yellow-300 font-bold rounded-2xl border border-yellow-200/50 dark:border-yellow-700/50 flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  {t('blog.featured.badge', 'Featured')}
                </span>
              )}
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-8 leading-tight">
              {getPostTitle(post)}
            </h1>
            
            <p className="text-2xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed font-medium">
              {getPostExcerpt(post)}
            </p>
            
            <div className="flex flex-wrap items-center gap-8 text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">{post.author}</span>
                  <span className="text-sm">{t('blog.author', 'Author')}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6" />
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">{formatDate(post.publishedAt)}</span>
                  <span className="text-sm">{t('blog.published', 'Published')}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6" />
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">{post.readTime} {t('blog.minRead', 'min read')}</span>
                  <span className="text-sm">{t('blog.readTime', 'Read time')}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Tag className="w-6 h-6" />
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">{getPostCategory(post)}</span>
                  <span className="text-sm">{t('blog.category', 'Category')}</span>
                </div>
              </div>
              <button
                onClick={sharePost}
                className="flex items-center gap-3 px-6 py-3 bg-blue-100/80 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-2xl hover:bg-blue-200/80 dark:hover:bg-blue-900/50 transition-all duration-300 font-bold backdrop-blur-xl border border-blue-200/50 dark:border-blue-700/50 hover:scale-105"
              >
                <Share2 className="w-5 h-5" />
                {t('blog.share', 'Share')}
              </button>
            </div>
          </motion.header>

          {/* Article Content */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-2xl rounded-3xl p-12 lg:p-16 border border-white/40 dark:border-slate-700/40 shadow-2xl shadow-blue-500/5 dark:shadow-blue-500/10 mb-16"
          >
            <div className="prose prose-xl dark:prose-invert max-w-none prose-slate">
              <ReactMarkdown components={customComponents}>
                {getPostContent(post)}
              </ReactMarkdown>
            </div>
          </motion.article>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-20"
            >
              <div className="flex items-center gap-4 mb-12">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-4xl font-black text-slate-900 dark:text-white">
                    {t('blog.relatedArticles', 'Related Articles')}
                  </h2>
                  <p className="text-xl text-slate-600 dark:text-slate-400 font-medium">
                    {t('blog.relatedSubtitle', 'Continue exploring these topics')}
                  </p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost, index) => (
                  <motion.article
                    key={relatedPost.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="group"
                  >
                    <Link to={`/blog/${getPostSlug(relatedPost)}`} className="block">
                      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-2xl rounded-3xl p-8 border border-white/40 dark:border-slate-700/40 shadow-xl shadow-blue-500/5 dark:shadow-blue-500/10 hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-2">
                        <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 mb-4">
                          <Calendar className="w-4 h-4" />
                          <span className="font-medium">{formatDate(relatedPost.publishedAt)}</span>
                          {relatedPost.featured && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-lg">
                              <Star className="w-3 h-3" />
                              <span className="text-xs font-bold">{t('blog.featured.badge', 'Featured')}</span>
                            </div>
                          )}
                        </div>
                        
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 leading-tight">
                          {getPostTitle(relatedPost)}
                        </h3>
                        
                        <p className="text-slate-600 dark:text-slate-300 mb-6 line-clamp-3 leading-relaxed">
                          {getPostExcerpt(relatedPost)}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-6">
                          {relatedPost.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1 bg-blue-100/80 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-xl backdrop-blur-xl"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold group-hover:gap-3 transition-all duration-300">
                          <span>{t('blog.readMore', 'Read More')}</span>
                          <ArrowLeft className="w-4 h-4 rotate-180 group-hover:scale-110 transition-transform duration-300" />
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            </motion.section>
          )}

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

export default BlogPost; 