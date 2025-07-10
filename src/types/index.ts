export interface IPInfo {
  ip: string;
  country: string;
  countryCode: string;
  city: string;
  region: string;
  isp: string;
}

export interface MXRecordInfo {
  host: string;
  preference: number;
}

export interface SPFRecord {
  record: string;
}

export interface TenantInfo {
  tenantId: string;
  name: string;
  mxRecords: MXRecordInfo[];
  spfRecord: SPFRecord | null;
}

export interface MultiDomainResult {
  domain: string;
  tenantInfo: TenantInfo | null;
  error?: string;
  timestamp: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  tags: string[];
  category: string;
  readTime: number;
  featured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}