import React, { memo } from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  path?: string;
  type?: 'website' | 'article' | 'profile';
  image?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  canonicalUrl?: string;
}

const SEO: React.FC<SEOProps> = memo(({
  title = 'Microsoft Tenant Finder - Find Azure & Office 365 Tenant IDs',
  description = 'Instantly discover Microsoft Azure and Office 365 tenant information for any domain. Get tenant IDs, MX records, and SPF configurations with our professional tool.',
  keywords = 'Microsoft Tenant ID, Azure Tenant, Office 365, Microsoft 365, Tenant Finder, DNS, MX Records, SPF, Azure AD, Microsoft Graph',
  path = '/',
  type = 'website',
  image = 'https://tenant-find.cengizyilmaz.org/logo.svg',
  author = 'Cengiz Yılmaz',
  publishedTime,
  modifiedTime,
  canonicalUrl
}) => {
  const siteUrl = 'https://tenant-find.cengizyilmaz.org';
  const fullUrl = `${siteUrl}${path}`;
  const canonical = canonicalUrl || fullUrl;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="TenantFind" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:creator" content="@cengizyilmaz" />
      <meta name="twitter:site" content="@cengizyilmaz" />

      {/* Article specific meta tags */}
      {type === 'article' && (
        <>
          <meta property="article:author" content={author} />
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          <meta property="article:section" content="Technology" />
          <meta property="article:tag" content="Microsoft" />
          <meta property="article:tag" content="Azure" />
          <meta property="article:tag" content="Office 365" />
        </>
      )}

      {/* Favicon and Icons */}
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="apple-touch-icon" href="/logo.svg" />
      <link rel="manifest" href="/manifest.json" />

      {/* Additional Meta Tags for SEO */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="Global" />
      <meta name="rating" content="General" />

      {/* Performance and Security */}
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="theme-color" content="#3b82f6" />
      <meta name="msapplication-TileColor" content="#3b82f6" />

      {/* Accessibility */}
      <meta name="color-scheme" content="light dark" />
      
      {/* Structured Data for Rich Snippets */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": type === 'article' ? "Article" : "WebSite",
          "name": title,
          "description": description,
          "url": fullUrl,
          "image": image,
          "author": {
            "@type": "Person",
            "name": author,
            "url": "https://cengizyilmaz.org"
          },
          "publisher": {
            "@type": "Organization",
            "name": "TenantFind",
            "logo": {
              "@type": "ImageObject",
              "url": `${siteUrl}/logo.svg`
            }
          },
          ...(type === 'article' && publishedTime && {
            "datePublished": publishedTime,
            "dateModified": modifiedTime || publishedTime
          }),
          ...(type === 'website' && {
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": `${siteUrl}/?domain={search_term_string}`
              },
              "query-input": "required name=search_term_string"
            }
          })
        })}
      </script>

      {/* DNS Prefetch for Performance */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//login.microsoftonline.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    </Helmet>
  );
});

SEO.displayName = 'SEO';

export default SEO; 