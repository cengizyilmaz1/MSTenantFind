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
  noIndex?: boolean;
}

const SEO: React.FC<SEOProps> = memo(({
  title = 'Microsoft Tenant Finder - Find Azure & Office 365 Tenant IDs',
  description = 'Instantly discover Microsoft Azure and Office 365 tenant information for any domain. Get tenant IDs, MX records, and SPF configurations with our professional tool.',
  keywords = 'Microsoft Tenant ID, Azure Tenant, Office 365, Microsoft 365, Tenant Finder, DNS, MX Records, SPF, Azure AD, Microsoft Graph, Entra ID',
  path = '/',
  type = 'website',
  image = 'https://tenant-find.cengizyilmaz.net/og-image.jpg',
  author = 'Cengiz Yılmaz',
  publishedTime,
  modifiedTime,
  canonicalUrl,
  noIndex = false
}) => {
  const siteUrl = 'https://tenant-find.cengizyilmaz.net';
  const fullUrl = `${siteUrl}${path}`;
  const canonical = canonicalUrl || fullUrl;
  const currentYear = new Date().getFullYear();

  // Generate breadcrumb structured data
  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteUrl
      },
      ...(path !== '/' ? [{
        "@type": "ListItem",
        "position": 2,
        "name": title.split(' - ')[0],
        "item": fullUrl
      }] : [])
    ]
  };

  // FAQ structured data for homepage
  const faqData = path === '/' ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is a Microsoft Tenant ID?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A Microsoft Tenant ID is a unique identifier (GUID) assigned to each Azure AD/Entra ID tenant. It's used to identify your organization's Microsoft 365 or Azure environment."
        }
      },
      {
        "@type": "Question",
        "name": "How do I find my Microsoft 365 Tenant ID?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can find your Microsoft 365 Tenant ID by entering your domain name in TenantFind. Our tool queries Microsoft's OpenID configuration endpoint to retrieve your tenant information instantly."
        }
      },
      {
        "@type": "Question",
        "name": "Is TenantFind free to use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, TenantFind is completely free to use. You can look up tenant IDs for multiple domains and export the results in various formats."
        }
      }
    ]
  } : null;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={canonical} />
      
      {/* Robots */}
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"} />
      <meta name="googlebot" content={noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large"} />
      <meta name="bingbot" content={noIndex ? "noindex, nofollow" : "index, follow"} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="TenantFind" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:locale:alternate" content="tr_TR" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={title} />
      <meta name="twitter:creator" content="@cengizyilmazz" />
      <meta name="twitter:site" content="@cengizyilmazz" />

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
          <meta property="article:tag" content="Entra ID" />
        </>
      )}

      {/* Favicon and Icons */}
      <link rel="icon" type="image/svg+xml" href="/owl-favicon.svg" />
      <link rel="apple-touch-icon" href="/owl-favicon.svg" />
      <link rel="manifest" href="/manifest.json" />

      {/* Additional Meta Tags for SEO */}
      <meta name="language" content="English" />
      <meta name="revisit-after" content="3 days" />
      <meta name="distribution" content="Global" />
      <meta name="rating" content="General" />
      <meta name="copyright" content={`© ${currentYear} Cengiz Yılmaz`} />

      {/* Performance and Security */}
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="TenantFind" />
      <meta name="application-name" content="TenantFind" />
      <meta name="theme-color" content="#4F46E5" media="(prefers-color-scheme: light)" />
      <meta name="theme-color" content="#1e1b4b" media="(prefers-color-scheme: dark)" />
      <meta name="msapplication-TileColor" content="#4F46E5" />
      <meta name="msapplication-navbutton-color" content="#4F46E5" />

      {/* Accessibility */}
      <meta name="color-scheme" content="light dark" />
      
      {/* Breadcrumb Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbList)}
      </script>

      {/* FAQ Structured Data (Homepage only) */}
      {faqData && (
        <script type="application/ld+json">
          {JSON.stringify(faqData)}
        </script>
      )}
      
      {/* Main Structured Data for Rich Snippets */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": type === 'article' ? "Article" : "WebApplication",
          "name": title,
          "description": description,
          "url": fullUrl,
          "image": {
            "@type": "ImageObject",
            "url": image,
            "width": 1200,
            "height": 630
          },
          "author": {
            "@type": "Person",
            "name": author,
            "url": "https://cengizyilmaz.net",
            "sameAs": [
              "https://x.com/cengizyilmazz",
              "https://www.linkedin.com/in/cengizyilmazz/",
              "https://github.com/cengizyilmaz"
            ]
          },
          "publisher": {
            "@type": "Organization",
            "name": "TenantFind",
            "logo": {
              "@type": "ImageObject",
              "url": `${siteUrl}/owl-favicon.svg`,
              "width": 512,
              "height": 512
            }
          },
          "applicationCategory": "DeveloperApplication",
          "operatingSystem": "Any",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "ratingCount": "150",
            "bestRating": "5",
            "worstRating": "1"
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

      {/* Organization Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "TenantFind",
          "url": siteUrl,
          "logo": `${siteUrl}/owl-favicon.svg`,
          "description": "Professional Microsoft Azure and Microsoft 365 tenant lookup tool",
          "founder": {
            "@type": "Person",
            "name": "Cengiz Yılmaz",
            "jobTitle": "Microsoft MVP"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "email": "cengiz@cengizyilmaz.net",
            "contactType": "customer support"
          }
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