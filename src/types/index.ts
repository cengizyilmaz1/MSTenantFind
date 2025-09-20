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