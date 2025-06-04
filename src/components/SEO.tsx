import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  path?: string;
  type?: 'website' | 'article' | 'profile' | 'application';
  image?: string;
  schema?: Record<string, any>;
  noIndex?: boolean;
  canonical?: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  path = '/',
  type = 'website',
  image,
  schema,
  noIndex = false,
  canonical,
  breadcrumbs,
  article
}) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  // Base URLs
  const siteUrl = 'https://tenant-find.cengizyilmaz.net';
  const fullUrl = `${siteUrl}${path}`;
  const canonicalUrl = canonical || fullUrl;

  // Default values with language support
  const defaultTitle = currentLang === 'tr' 
    ? 'Microsoft Azure ve Office 365 Tenant ID Bulma - Tenant ID\'m Nedir?'
    : 'Find your Microsoft Azure and Office 365 tenant ID - What is my tenant ID?';
  
  const defaultDescription = currentLang === 'tr'
    ? 'Domain adıyla organizasyonunuzun Microsoft Azure ve Office 365 tenant ID\'sini bulun. Azure AD ve Microsoft 365 için profesyonel tenant bulucu aracı.'
    : 'Get your organization\'s Microsoft Azure and Office 365 tenant ID by domain name. Professional tenant finder tool for Azure AD and Microsoft 365.';
  
  const defaultKeywords = currentLang === 'tr'
    ? 'Microsoft Azure, Office 365, tenant ID, tenant ID bulma, tenant ID\'m nedir, domain ile tenant ID alma, organizasyon tenant ID, Azure AD tenant, Microsoft 365 tenant, Office 365 tenant ID, Azure tenant keşfi'
    : 'Microsoft Azure, Office 365, tenant ID, find tenant ID, what is my tenant ID, get tenant ID by domain name, organization tenant ID, Azure AD tenant, Microsoft 365 tenant, Office 365 tenant ID, Azure tenant discovery';
  
  const defaultImage = `${siteUrl}/og-image.jpg`;

  // Final values
  const finalTitle = title ? `${title} | Microsoft Tenant Finder` : defaultTitle;
  const finalDescription = description || defaultDescription;
  const finalKeywords = keywords || defaultKeywords;
  const finalImage = image || defaultImage;

  // Generate breadcrumb schema
  const generateBreadcrumbSchema = () => {
    if (!breadcrumbs || breadcrumbs.length === 0) return null;

    return {
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: `${siteUrl}${crumb.url}`
      }))
    };
  };

  // Generate article schema
  const generateArticleSchema = () => {
    if (type !== 'article' || !article) return null;

    return {
      '@type': 'Article',
      headline: finalTitle,
      description: finalDescription,
      image: finalImage,
      datePublished: article.publishedTime,
      dateModified: article.modifiedTime || article.publishedTime,
      author: {
        '@type': 'Person',
        name: article.author || 'Cengiz YILMAZ',
        url: 'https://cengizyilmaz.net'
      },
      publisher: {
        '@type': 'Organization',
        name: 'Microsoft Tenant Finder',
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/logo.png`
        }
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': fullUrl
      },
      articleSection: article.section || 'Technology',
      keywords: article.tags?.join(', ') || finalKeywords,
      inLanguage: currentLang
    };
  };

  // Generate SoftwareApplication schema for better tool recognition
  const generateSoftwareApplicationSchema = () => ({
    '@type': 'SoftwareApplication',
    name: 'Microsoft Tenant Finder',
    description: finalDescription,
    url: siteUrl,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: ['Windows', 'macOS', 'Linux', 'iOS', 'Android'],
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    permissions: 'No special permissions required',
    softwareVersion: '2.0.0',
    datePublished: '2024-01-01',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock'
    },
    author: {
      '@type': 'Person',
      name: 'Cengiz YILMAZ',
      url: 'https://cengizyilmaz.net'
    },
    keywords: finalKeywords,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '127',
      bestRating: '5',
      worstRating: '1'
    },
    screenshot: `${siteUrl}/screenshots/app-screenshot.png`,
    featureList: [
      'Bulk domain search',
      'Real-time tenant discovery',
      'Export results in multiple formats',
      'Multi-language support',
      'Free to use'
    ]
  });

  // Generate HowTo schema for better search appearance
  const generateHowToSchema = () => {
    if (path !== '/') return null;

    const steps = currentLang === 'tr' ? [
      {
        name: 'Domain adını girin',
        text: 'Tenant ID\'sini bulmak istediğiniz domain adını arama kutusuna yazın. Örnek: company.com'
      },
      {
        name: 'Arama butonuna tıklayın',
        text: 'Search butonuna tıklayarak arama işlemini başlatın. Sistem otomatik olarak tenant bilgilerini arayacak.'
      },
      {
        name: 'Sonuçları görüntüleyin',
        text: 'Tenant ID, MX kayıtları ve SPF bilgileri dahil olmak üzere tüm sonuçlar görüntülenecek.'
      },
      {
        name: 'Sonuçları kopyalayın veya indirin',
        text: 'İhtiyacınız olan bilgileri kopyalayabilir veya tüm sonuçları JSON/CSV formatında indirebilirsiniz.'
      }
    ] : [
      {
        name: 'Enter domain name',
        text: 'Type the domain name you want to find the tenant ID for in the search box. Example: company.com'
      },
      {
        name: 'Click search button',
        text: 'Click the Search button to start the lookup process. The system will automatically search for tenant information.'
      },
      {
        name: 'View results',
        text: 'All results including Tenant ID, MX records, and SPF information will be displayed.'
      },
      {
        name: 'Copy or download results',
        text: 'You can copy the information you need or download all results in JSON/CSV format.'
      }
    ];

    return {
      '@type': 'HowTo',
      name: currentLang === 'tr' ? 'Microsoft Tenant ID Nasıl Bulunur' : 'How to Find Microsoft Tenant ID',
      description: finalDescription,
      image: finalImage,
      step: steps.map((step, index) => ({
        '@type': 'HowToStep',
        position: index + 1,
        name: step.name,
        text: step.text
      })),
      totalTime: 'PT2M',
      estimatedCost: {
        '@type': 'MonetaryAmount',
        currency: 'USD',
        value: '0'
      },
      tool: [{
        '@type': 'HowToTool',
        name: 'Web Browser'
      }],
      supply: [{
        '@type': 'HowToSupply',
        name: 'Domain Name'
      }]
    };
  };

  // Generate Person schema for author
  const generatePersonSchema = () => ({
    '@type': 'Person',
    name: 'Cengiz YILMAZ',
    url: 'https://cengizyilmaz.net',
    image: 'https://cengizyilmaz.net/avatar.jpg',
    jobTitle: 'Microsoft MVP',
    worksFor: {
      '@type': 'Organization',
      name: 'Microsoft MVP Program'
    },
    alumniOf: {
      '@type': 'Organization',
      name: 'Microsoft Certified Trainer'
    },
    knowsAbout: [
      'Microsoft Azure',
      'Microsoft 365',
      'Exchange Server',
      'Active Directory',
      'PowerShell',
      'Microsoft Graph API'
    ],
    sameAs: [
      'https://twitter.com/cengizyilmaz_',
      'https://linkedin.com/in/cengizyilmazz',
      'https://github.com/cengizyilmaz1'
    ],
    award: 'Microsoft MVP'
  });

  // Generate enhanced FAQ schema with more questions
  const generateEnhancedFAQSchema = () => {
    if (path !== '/' && !path.includes('blog')) return null;

    const faqs = currentLang === 'tr' ? [
      {
        question: 'Microsoft Tenant ID nedir?',
        answer: 'Microsoft Tenant ID, organizasyonunuzun Azure Active Directory örneğini temsil eden benzersiz bir tanımlayıcıdır (GUID). Her Microsoft bulut hizmeti aboneliği için otomatik olarak oluşturulur ve organizasyonunuzun kimliğini Microsoft ekosistemine özgü olarak tanımlar.'
      },
      {
        question: 'Tenant ID\'mi nasıl bulabilirim?',
        answer: 'Tenant ID\'nizi Azure Portal\'dan, PowerShell komutlarıyla, Microsoft Graph API\'si kullanarak veya bizim ücretsiz Tenant Finder aracımızla bulabilirsiniz. En kolay yöntem domain adınızı arama kutumuzza yazmaktır.'
      },
      {
        question: 'Office 365 ve Azure tenant ID\'leri aynı mı?',
        answer: 'Evet, Microsoft birleşik kimlik sistemi kullanır. Office 365, Azure AD, Microsoft 365 ve tüm Microsoft bulut hizmetleri için tenant ID\'niz aynıdır.'
      },
      {
        question: 'Bu araç ücretsiz mi?',
        answer: 'Evet, Microsoft Tenant Finder tamamen ücretsizdir. Herhangi bir kayıt veya ödeme gerektirmez. Sınırsız arama yapabilir ve sonuçları indirebilirsiniz.'
      },
      {
        question: 'Toplu domain arama yapabilir miyim?',
        answer: 'Evet, aynı anda birden fazla domain arayabilirsiniz. Her satıra bir domain yazın veya virgülle ayırın. Sistem tüm domainleri aynı anda işleyecektir.'
      },
      {
        question: 'MX ve SPF kayıtları neden görünür?',
        answer: 'MX kayıtları mail sunucu bilgilerini, SPF kayıtları ise e-posta güvenlik ayarlarını gösterir. Bu bilgiler Microsoft 365 kullanımını doğrulamaya yardımcı olur.'
      }
    ] : [
      {
        question: 'What is a Microsoft Tenant ID?',
        answer: 'A Microsoft Tenant ID is a unique identifier (GUID) that represents your organization\'s instance of Azure Active Directory. It\'s automatically created when you sign up for Microsoft cloud services and uniquely identifies your organization within the Microsoft ecosystem.'
      },
      {
        question: 'How can I find my Tenant ID?',
        answer: 'You can find your Tenant ID through Azure Portal, PowerShell commands, Microsoft Graph API, or using our free Tenant Finder tool. The easiest method is to simply type your domain name in our search box.'
      },
      {
        question: 'Are Office 365 and Azure tenant IDs the same?',
        answer: 'Yes, Microsoft uses a unified identity system. Your tenant ID is the same across Office 365, Azure AD, Microsoft 365, and all Microsoft cloud services.'
      },
      {
        question: 'Is this tool free to use?',
        answer: 'Yes, Microsoft Tenant Finder is completely free to use. No registration or payment required. You can perform unlimited searches and download results.'
      },
      {
        question: 'Can I search multiple domains at once?',
        answer: 'Yes, you can search multiple domains simultaneously. Simply enter one domain per line or separate them with commas. The system will process all domains at the same time.'
      },
      {
        question: 'Why do I see MX and SPF records?',
        answer: 'MX records show mail server information, while SPF records show email security settings. This information helps verify Microsoft 365 usage and configuration.'
      }
    ];

    return {
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    };
  };

  // Generate organization schema
  const generateOrganizationSchema = () => ({
    '@type': 'Organization',
    name: 'Microsoft Tenant Finder',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description: finalDescription,
    founder: {
      '@type': 'Person',
      name: 'Cengiz YILMAZ',
      url: 'https://cengizyilmaz.net'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'creator',
      url: 'https://cengizyilmaz.net/contact'
    },
    sameAs: [
      'https://github.com/cengizyilmaz1',
      'https://linkedin.com/in/cengizyilmazz',
      'https://twitter.com/cengizyilmaz_'
    ]
  });

  // Generate main website schema
  const generateWebsiteSchema = () => ({
    '@type': 'WebSite',
    name: 'Microsoft Tenant Finder',
    alternateName: 'MS Tenant Finder',
    url: siteUrl,
    description: finalDescription,
    inLanguage: [currentLang, currentLang === 'tr' ? 'en' : 'tr'],
    potentialAction: [
      {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${siteUrl}/?domain={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      },
      {
        '@type': 'ReadAction',
        target: `${siteUrl}/blog`
      }
    ],
    creator: {
      '@type': 'Person',
      name: 'Cengiz YILMAZ'
    },
    about: [
      'Microsoft Azure',
      'Microsoft 365',
      'Tenant ID Discovery',
      'Azure Active Directory',
      'Office 365'
    ],
    keywords: finalKeywords
  });

  // Generate structured data
  const generateSchema = () => {
    const schemas: any[] = [
      generateOrganizationSchema(),
      generateWebsiteSchema(),
      generateSoftwareApplicationSchema(),
      generatePersonSchema()
    ];

    // Add conditional schemas
    const breadcrumbSchema = generateBreadcrumbSchema();
    if (breadcrumbSchema) schemas.push(breadcrumbSchema);

    const articleSchema = generateArticleSchema();
    if (articleSchema) schemas.push(articleSchema);

    const faqSchema = generateEnhancedFAQSchema();
    if (faqSchema) schemas.push(faqSchema);

    const howToSchema = generateHowToSchema();
    if (howToSchema) schemas.push(howToSchema);

    // Add custom schema if provided
    if (schema) schemas.push(schema);

    return {
      '@context': 'https://schema.org',
      '@graph': schemas
    };
  };

  const structuredData = generateSchema();

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="author" content="Cengiz YILMAZ" />
      <meta name="creator" content="Cengiz YILMAZ" />
      <meta name="publisher" content="Microsoft Tenant Finder" />
      <meta name="robots" content={noIndex ? 'noindex,nofollow' : 'index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1'} />
      <meta name="googlebot" content={noIndex ? 'noindex,nofollow' : 'index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1'} />
      <meta name="language" content={currentLang} />
      <meta name="revisit-after" content="3 days" />
      <meta name="rating" content="general" />
      <meta name="distribution" content="global" />
      <meta name="classification" content="business" />
      <meta name="category" content="technology" />
      
      {/* Enhanced SEO Meta Tags */}
      <meta name="subject" content="Microsoft Tenant ID Discovery Tool" />
      <meta name="topic" content="Microsoft Azure, Office 365, Tenant Management" />
      <meta name="summary" content={finalDescription} />
      <meta name="abstract" content={finalDescription} />
      <meta name="url" content={fullUrl} />
      <meta name="identifier-URL" content={fullUrl} />
      <meta name="directory" content="submission" />
      <meta name="coverage" content="Worldwide" />
      <meta name="distribution" content="Global" />
      <meta name="target" content="all" />
      <meta name="audience" content="IT Professionals, System Administrators, Microsoft Partners" />
      <meta name="pagename" content={finalTitle} />
      <meta name="subtitle" content="Professional Microsoft Tenant Discovery" />
      <meta name="reply-to" content="cengiz@cengizyilmaz.net" />
      <meta name="owner" content="Cengiz YILMAZ" />
      <meta name="designer" content="Cengiz YILMAZ" />
      <meta name="copyright" content="© 2024 Cengiz YILMAZ" />
      <meta name="doc-type" content="Web Page" />
      <meta name="doc-rights" content="Public" />
      <meta name="doc-class" content="Published" />
      
      {/* Content-specific meta tags */}
      <meta name="content-language" content={currentLang} />
      <meta name="geo.region" content="TR" />
      <meta name="geo.country" content="Turkey" />
      <meta name="geo.placename" content="Turkey" />
      <meta name="ICBM" content="39.9334, 32.8597" />
      <meta name="DC.title" content={finalTitle} />
      <meta name="DC.creator" content="Cengiz YILMAZ" />
      <meta name="DC.subject" content="Microsoft Tenant ID, Azure AD, Office 365" />
      <meta name="DC.description" content={finalDescription} />
      <meta name="DC.publisher" content="Microsoft Tenant Finder" />
      <meta name="DC.contributor" content="Cengiz YILMAZ" />
      <meta name="DC.date" content={new Date().toISOString().split('T')[0]} />
      <meta name="DC.type" content="Text" />
      <meta name="DC.format" content="text/html" />
      <meta name="DC.identifier" content={fullUrl} />
      <meta name="DC.language" content={currentLang} />
      <meta name="DC.coverage" content="World" />
      <meta name="DC.rights" content="© 2024 Cengiz YILMAZ" />
      
      {/* Security and Privacy */}
      <meta name="referrer" content="strict-origin-when-cross-origin" />
      <meta name="cross-origin-embedder-policy" content="unsafe-none" />
      <meta name="cross-origin-opener-policy" content="same-origin-allow-popups" />
      <meta name="cross-origin-resource-policy" content="cross-origin" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Enhanced Language Alternates */}
      <link rel="alternate" hrefLang="en" href={`${siteUrl}${path}`} />
      <link rel="alternate" hrefLang="tr" href={`${siteUrl}${path}${path.includes('?') ? '&' : '?'}lang=tr`} />
      <link rel="alternate" hrefLang="x-default" href={`${siteUrl}${path}`} />
      
      {/* RSS/Atom feeds */}
      <link rel="alternate" type="application/rss+xml" title="Microsoft Tenant Finder Blog RSS" href={`${siteUrl}/rss.xml`} />
      <link rel="alternate" type="application/atom+xml" title="Microsoft Tenant Finder Blog Atom" href={`${siteUrl}/atom.xml`} />
      
      {/* Search Engine Verification */}
      <meta name="google-site-verification" content="GSTV_12345_VERIFICATION_CODE" />
      <meta name="msvalidate.01" content="BING_12345_VERIFICATION_CODE" />
      <meta name="yandex-verification" content="YANDEX_12345_VERIFICATION_CODE" />
      <meta name="baidu-site-verification" content="BAIDU_12345_VERIFICATION_CODE" />
      <meta name="p:domain_verify" content="PINTEREST_12345_VERIFICATION_CODE" />
      <meta name="norton-safeweb-site-verification" content="NORTON_12345_VERIFICATION_CODE" />
      
      {/* Performance and Resource Hints */}
      <link rel="preconnect" href="https://login.microsoftonline.com" />
      <link rel="preconnect" href="https://graph.microsoft.com" />
      <link rel="preconnect" href="https://dns.google" />
      <link rel="preconnect" href="https://cloudflare-dns.com" />
      <link rel="dns-prefetch" href="//login.microsoftonline.com" />
      <link rel="dns-prefetch" href="//graph.microsoft.com" />
      <link rel="dns-prefetch" href="//dns.google" />
      <link rel="dns-prefetch" href="//cloudflare-dns.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      <link rel="dns-prefetch" href="//cdn.jsdelivr.net" />
      
      {/* Preload critical resources */}
      <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      <link rel="preload" href="/favicon.ico" as="image" type="image/x-icon" />
      <link rel="preload" href={`${siteUrl}/og-image.jpg`} as="image" type="image/jpeg" />
      
      {/* Prefetch important pages */}
      <link rel="prefetch" href="/blog" />
      <link rel="prefetch" href="/privacy" />
      <link rel="prefetch" href="/terms" />
      <link rel="prefetch" href="/cengizyilmazkimdir" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={finalTitle} />
      <meta property="og:locale" content={currentLang === 'tr' ? 'tr_TR' : 'en_US'} />
      <meta property="og:site_name" content="Microsoft Tenant Finder" />
      <meta property="fb:app_id" content="YOUR_FACEBOOK_APP_ID" />
      
      {/* Article specific Open Graph */}
      {type === 'article' && article && (
        <>
          <meta property="article:published_time" content={article.publishedTime} />
          <meta property="article:modified_time" content={article.modifiedTime || article.publishedTime} />
          <meta property="article:author" content={article.author || 'Cengiz YILMAZ'} />
          <meta property="article:section" content={article.section || 'Technology'} />
          {article.tags?.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content="@cengizyilmaz_" />
      <meta name="twitter:site" content="@cengizyilmaz_" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />
      <meta name="twitter:image:alt" content={finalTitle} />
      
      {/* LinkedIn */}
      <meta property="linkedin:owner" content="cengizyilmazz" />
      
      {/* Microsoft/Bing */}
      <meta name="msapplication-TileColor" content="#0284c7" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
      
      {/* Google */}
      <meta name="google" content="notranslate" />
      
      {/* App-specific */}
      <meta name="application-name" content="MS Tenant Finder" />
      <meta name="apple-mobile-web-app-title" content="MS Tenant Finder" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="theme-color" content="#0284c7" />
      <meta name="color-scheme" content="light dark" />
      <meta name="mobile-web-app-capable" content="yes" />
      
      {/* Performance & Security */}
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="format-detection" content="telephone=no,email=no,address=no" />
      <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
      
      {/* Favicon and Icons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Additional Performance Optimizations */}
      <link rel="preconnect" href="https://www.google-analytics.com" />
      <link rel="preconnect" href="https://www.googletagmanager.com" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://cdn.jsdelivr.net" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData, null, 2)}
      </script>
      
      {/* Google Analytics 4 */}
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-E6HR73GY9H"></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-E6HR73GY9H', {
              page_title: ${JSON.stringify(finalTitle)},
              page_location: ${JSON.stringify(fullUrl)},
              content_language: ${JSON.stringify(currentLang)},
              custom_map: {
                'custom_parameter_1': 'tenant_search'
              }
            });
          `
        }}
      />
    </Helmet>
  );
};

export default SEO; 