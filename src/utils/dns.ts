import type { SPFRecord, TenantInfo, OpenIdConfig } from '../types';
import { DOMAIN_REGEX, MAX_DOMAIN_LENGTH, siteConfig } from '../constants';

// Simplified MX Record interface - sadece host bilgisi yeterli
export interface MXRecordInfo {
  host: string;
  preference: number;
}

// Rate limiting için basit delay
async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Rate limited fetch function
let lastApiCallTime = 0;
const API_RATE_LIMIT = siteConfig.rateLimit.ms;

async function rateLimitedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const now = Date.now();
  const timeSinceLastCall = now - lastApiCallTime;
  
  if (timeSinceLastCall < API_RATE_LIMIT) {
    await sleep(API_RATE_LIMIT - timeSinceLastCall);
  }
  
  lastApiCallTime = Date.now();
  return fetch(url, options);
}

// Domain validation function
export function validateDomain(domain: string): boolean {
  if (!domain || typeof domain !== 'string') return false;
  
  return DOMAIN_REGEX.test(domain.trim()) && domain.length <= MAX_DOMAIN_LENGTH;
}

// Parse domains from text input
export function parseDomainsFromText(text: string): string[] {
  if (!text || typeof text !== 'string') return [];
  
  // Split by commas, semicolons, spaces, and newlines
  return text
    .split(/[,;\s\n\r]+/)
    .map(domain => domain.trim().toLowerCase())
    .filter(domain => domain.length > 0)
    .filter((domain, index, array) => array.indexOf(domain) === index); // Remove duplicates
}

// Detect tenant region from issuer URL or cloud instance
function detectRegion(issuer: string, cloudInstanceName?: string): string {
  // Check cloud instance name first
  if (cloudInstanceName) {
    if (cloudInstanceName.includes('microsoftonline.us')) return 'US Government (GCC)';
    if (cloudInstanceName.includes('microsoftonline.de')) return 'Germany';
    if (cloudInstanceName.includes('chinacloudapi.cn')) return 'China (21Vianet)';
  }
  
  // Check issuer URL
  if (issuer.includes('login.microsoftonline.us')) return 'US Government (GCC)';
  if (issuer.includes('login.microsoftonline.de')) return 'Germany';
  if (issuer.includes('login.chinacloudapi.cn')) return 'China (21Vianet)';
  if (issuer.includes('login.microsoftonline.com')) return 'Global (Worldwide)';
  
  return 'Global';
}

// Check if MX records indicate Microsoft 365
function hasMicrosoftMxRecords(mxRecords: MXRecordInfo[]): boolean {
  const microsoftMxPatterns = [
    'mail.protection.outlook.com',
    'olc.protection.outlook.com',
    'eo.outlook.com',
    'microsoft-com.mail.protection.outlook.com'
  ];
  
  return mxRecords.some(record => 
    microsoftMxPatterns.some(pattern => 
      record.host.toLowerCase().includes(pattern.toLowerCase())
    )
  );
}

// Find Microsoft tenant information for a domain
export async function findTenantInfo(domain: string): Promise<TenantInfo> {
  if (!validateDomain(domain)) {
    throw new Error('Invalid domain format');
  }

  try {
    // Try to get OpenID configuration
    const response = await rateLimitedFetch(
      `https://login.microsoftonline.com/${domain}/.well-known/openid-configuration`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('No Microsoft tenant found for this domain');
    }

    const data = await response.json();
    
    if (!data.issuer) {
      throw new Error('Invalid tenant response');
    }

    // Extract tenant ID from issuer URL
    const tenantId = data.issuer.split('/')[3];
    
    if (!tenantId) {
      throw new Error('Could not extract tenant ID');
    }

    // Parse OpenID configuration
    const openIdConfig: OpenIdConfig = {
      issuer: data.issuer,
      authorizationEndpoint: data.authorization_endpoint || '',
      tokenEndpoint: data.token_endpoint || '',
      userinfoEndpoint: data.userinfo_endpoint,
      jwksUri: data.jwks_uri,
      endSessionEndpoint: data.end_session_endpoint
    };

    // Detect region from cloud instance or issuer
    const region = detectRegion(data.issuer, data.cloud_instance_name);

    // Get MX and SPF records in parallel, also try to get federation info
    const [mxRecords, spfRecord, federationInfo] = await Promise.all([
      getMXRecords(domain),
      getSPFRecord(domain),
      getFederationInfo(domain).catch(() => null)
    ]);

    // Check if using Microsoft MX
    const hasMicrosoftMx = hasMicrosoftMxRecords(mxRecords);

    return {
      tenantId,
      name: domain,
      region,
      tenantType: tenantId === domain ? 'Consumer' : 'Organization',
      openIdConfig,
      mxRecords,
      spfRecord,
      hasMicrosoftMx,
      federationBrand: federationInfo?.brand
    };

  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to retrieve tenant information');
  }
}

// Get federation brand info
async function getFederationInfo(domain: string): Promise<{ brand?: string } | null> {
  try {
    const response = await rateLimitedFetch(
      `https://login.microsoftonline.com/getuserrealm.srf?login=user@${domain}&json=1`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    return {
      brand: data.FederationBrandName || data.DomainName
    };
  } catch {
    return null;
  }
}

// SPF Record alma fonksiyonu
export async function getSPFRecord(domain: string): Promise<SPFRecord | null> {
  const dnsProviders = [
    {
      name: "Google DNS",
      url: `https://dns.google/resolve?name=${domain}&type=TXT`
    },
    {
      name: "Cloudflare DNS", 
      url: `https://cloudflare-dns.com/dns-query?name=${domain}&type=TXT`
    }
  ];
  
  for (const provider of dnsProviders) {
    try {
      const response = await rateLimitedFetch(provider.url, {
        headers: {
          'Accept': 'application/dns-json'
        }
      });
      
      if (!response.ok) continue;
      
      const data = await response.json();
      
      if (data.Answer && Array.isArray(data.Answer)) {
        const spfRecord = data.Answer
          .map((record: any) => record.data?.replace(/"/g, '') || '')
          .find((txt: string) => txt.startsWith('v=spf1'));
        
        if (spfRecord) {
          return { record: spfRecord };
        }
      }
    } catch (error) {
      console.warn(`SPF lookup failed for ${provider.name}:`, error);
    }
  }
  
  return null;
}

// MX Records alma fonksiyonu
export async function getMXRecords(domain: string): Promise<MXRecordInfo[]> {
  const dnsProviders = [
    {
      name: "Google DNS",
      url: `https://dns.google/resolve?name=${domain}&type=MX`
    },
    {
      name: "Cloudflare DNS",
      url: `https://cloudflare-dns.com/dns-query?name=${domain}&type=MX`
    }
  ];
  
  for (const provider of dnsProviders) {
    try {
      const response = await rateLimitedFetch(provider.url, {
        headers: {
          'Accept': 'application/dns-json'
        }
      });
      
      if (!response.ok) continue;
      
      const data = await response.json();
      
      if (data.Answer && Array.isArray(data.Answer)) {
        const seenHosts = new Set<string>();
        const mxRecords = data.Answer
          .map((record: any) => {
            const parts = (record.data || '').split(' ');
            const preference = parts.length > 0 ? parseInt(parts[0], 10) || 0 : 0;
            const host = parts.length > 1 ? parts[1].replace(/\.+$/, '') : '';
            
            return { host, preference };
          })
          .filter((record: { host: string; preference: number }) => {
            const { host } = record;
            if (!host) return false;
            
            const normalizedHost = host.toLowerCase();
            if (seenHosts.has(normalizedHost)) {
              return false;
            }
            seenHosts.add(normalizedHost);
            return true;
          })
          .sort((a: { preference: number }, b: { preference: number }) => a.preference - b.preference); // Preference'a göre sırala
          
        if (mxRecords.length > 0) {
          return mxRecords;
        }
      }
    } catch (error) {
      console.warn(`MX lookup failed for ${provider.name}:`, error);
    }
  }
  
  return [];
}