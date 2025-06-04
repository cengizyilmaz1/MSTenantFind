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
}

export interface BlogPost {
  id: string;
  title: string;
  titleTr?: string;
  slug: string;
  slugTr?: string;
  excerpt: string;
  excerptTr?: string;
  content: string;
  contentTr?: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  tags: string[];
  category: string;
  categoryTr?: string;
  readTime: number;
  featured?: boolean;
  seoTitle?: string;
  seoTitleTr?: string;
  seoDescription?: string;
  seoDescriptionTr?: string;
  seoKeywords?: string[];
}