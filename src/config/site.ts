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
      'tenant find',
      'tenant finder',
      'microsoft tenant finder',
      'find tenant id',
      'azure tenant finder',
      'microsoft 365 tenant lookup',
      'office 365 tenant id',
      'azure ad tenant id',
      'entra id tenant finder',
      'tenant id lookup',
      'm365 tenant finder',
      'get tenant id from domain',
      'bulk tenant lookup',
      'free tenant finder tool',
      'microsoft tenant id finder',
      'azure tenant lookup',
      'microsoft tenant search',
      'tenant discovery tool',
      'find azure tenant id',
      'office 365 tenant lookup',
      'Cengiz YILMAZ Microsoft MVP'
    ]
  },
  // Copyright
  copyright: {
    year: new Date().getFullYear(),
    holder: 'Cengiz YILMAZ',
    rights: 'All rights reserved.'
  }
};

