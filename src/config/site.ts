// Site-wide configuration
export const siteConfig = {
  name: 'Microsoft Tenant Finder',
  shortName: 'TenantFind',
  description: 'Professional Microsoft Azure and Microsoft 365 tenant lookup tool by Microsoft MVP Cengiz YILMAZ.',
  url: 'https://tenant-find.cengizyilmaz.net',
  author: {
    name: 'Cengiz YILMAZ',
    title: 'Microsoft MVP',
    email: 'cengiz@cengizyilmaz.net',
    website: 'https://cengizyilmaz.net'
  },
  // Theme colors
  theme: {
    primary: '#0078D4', // Microsoft Blue
    secondary: '#5E5E5E',
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6'
  },
  // Analytics
  analytics: {
    googleAnalyticsId: 'G-NE1ME14Y58'
  },
  // Features
  features: {
    maxDomainsPerSearch: 100,
    exportFormats: ['json', 'csv', 'txt'],
    supportedDomainExtensions: ['.com', '.net', '.org', '.edu', '.gov', '.io', '.co', '.uk', '.de', '.fr', '.it', '.es', '.nl', '.be', '.ch', '.at', '.se', '.no', '.dk', '.fi', '.pl', '.cz', '.sk', '.hu', '.ro', '.bg', '.hr', '.si', '.lt', '.lv', '.ee', '.ie', '.pt', '.gr', '.cy', '.mt', '.lu']
  },
  // Rate Limiting
  rateLimit: {
    ms: 300,
    timeoutMs: 10000,
    retryAttempts: 2
  },
  // SEO
  seo: {
    keywords: [
      'Microsoft Azure tenant finder',
      'Microsoft 365 tenant lookup',
      'Office 365 tenant search',
      'Azure AD tenant ID',
      'Microsoft tenant discovery',
      'Microsoft Graph API tool',
      'Microsoft MVP tools',
      'Azure Active Directory',
      'Microsoft 365 administration',
      'Enterprise tenant management',
      'Cloud tenant lookup',
      'Microsoft domain search',
      'Azure tenant explorer',
      'Microsoft 365 domain verification',
      'Microsoft tenant ID finder',
      'Cengiz YILMAZ',
      'Azure kiracı bulucu',
      'Microsoft 365 kiracı arama',
      'Office 365 kiracı sorgulama'
    ]
  },
  // Copyright
  copyright: {
    year: new Date().getFullYear(),
    holder: 'Cengiz YILMAZ',
    rights: 'All rights reserved.'
  }
};

