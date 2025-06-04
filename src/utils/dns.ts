import type { SPFRecord } from '../types';

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
const API_RATE_LIMIT = 300; // ms

async function rateLimitedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const now = Date.now();
  const timeSinceLastCall = now - lastApiCallTime;
  
  if (timeSinceLastCall < API_RATE_LIMIT) {
    await sleep(API_RATE_LIMIT - timeSinceLastCall);
  }
  
  lastApiCallTime = Date.now();
  return fetch(url, options);
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