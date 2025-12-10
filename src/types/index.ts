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

export interface OpenIdConfig {
  issuer: string;
  authorizationEndpoint: string;
  tokenEndpoint: string;
  userinfoEndpoint?: string;
  jwksUri?: string;
  endSessionEndpoint?: string;
}

export interface TenantInfo {
  tenantId: string;
  name: string;
  region?: string;
  tenantType?: string;
  openIdConfig?: OpenIdConfig;
  mxRecords: MXRecordInfo[];
  spfRecord: SPFRecord | null;
  hasMicrosoftMx?: boolean;
  federationBrand?: string;
}

export interface MultiDomainResult {
  domain: string;
  tenantInfo: TenantInfo | null;
  error?: string;
  timestamp: string;
}