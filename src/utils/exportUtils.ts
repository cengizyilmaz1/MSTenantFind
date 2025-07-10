interface TenantResult {
  domain: string;
  tenantId?: string;
  tenantName?: string;
  mxRecords?: any[];
  spfRecord?: any;
  status: 'found' | 'not_found' | 'error';
  timestamp: string;
}

// Export data to JSON format
export const exportToJSON = (data: TenantResult[], filename?: string): void => {
  try {
    const jsonData = {
      exportDate: new Date().toISOString(),
      totalResults: data.length,
      results: data
    };

    const jsonString = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `tenant-results-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting JSON:', error);
    throw new Error('Failed to export JSON file');
  }
};

// Helper function to format MX records for CSV
const formatMXRecords = (mxRecords: any[]): string => {
  if (!Array.isArray(mxRecords) || mxRecords.length === 0) {
    return '';
  }
  
  return mxRecords.map(record => {
    if (typeof record === 'string') {
      return record;
    }
    if (record && record.host) {
      return record.host;
    }
    return String(record);
  }).join('; ');
};

// Helper function to format SPF record for CSV
const formatSPFRecord = (spfRecord: any): string => {
  if (!spfRecord) {
    return '';
  }
  
  if (typeof spfRecord === 'string') {
    return spfRecord;
  }
  
  if (spfRecord && spfRecord.record) {
    return spfRecord.record;
  }
  
  return String(spfRecord);
};

// Export data to CSV format
export const exportToCSV = (data: TenantResult[], filename?: string): void => {
  try {
    const headers = ['Domain', 'Tenant ID', 'Tenant Name', 'MX Records', 'SPF Record', 'Status', 'Timestamp'];
    
    const csvRows = [
      headers.join(','),
      ...data.map(result => [
        escapeCSVField(result.domain || ''),
        escapeCSVField(result.tenantId || ''),
        escapeCSVField(result.tenantName || result.domain || ''),
        escapeCSVField(formatMXRecords(result.mxRecords || [])),
        escapeCSVField(formatSPFRecord(result.spfRecord)),
        escapeCSVField(result.status || 'unknown'),
        escapeCSVField(result.timestamp || new Date().toISOString())
      ].join(','))
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `tenant-results-${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting CSV:', error);
    throw new Error('Failed to export CSV file');
  }
};

// Helper function to escape CSV fields
const escapeCSVField = (field: string): string => {
  if (!field) return '';
  
  const fieldStr = String(field);
  if (fieldStr.includes(',') || fieldStr.includes('"') || fieldStr.includes('\n')) {
    return `"${fieldStr.replace(/"/g, '""')}"`;
  }
  return fieldStr;
};

// Copy data to clipboard as JSON or CSV
export const copyToClipboard = async (data: TenantResult[], format: 'json' | 'csv' = 'json'): Promise<void> => {
  try {
    let textData: string;

    if (format === 'json') {
      textData = JSON.stringify(data, null, 2);
    } else {
      const headers = ['Domain', 'Tenant ID', 'Tenant Name', 'MX Records', 'SPF Record', 'Status', 'Timestamp'];
      const csvRows = [
        headers.join(','),
        ...data.map(result => [
          escapeCSVField(result.domain || ''),
          escapeCSVField(result.tenantId || ''),
          escapeCSVField(result.tenantName || result.domain || ''),
          escapeCSVField(formatMXRecords(result.mxRecords || [])),
          escapeCSVField(formatSPFRecord(result.spfRecord)),
          escapeCSVField(result.status || 'unknown'),
          escapeCSVField(result.timestamp || new Date().toISOString())
        ].join(','))
      ];
      textData = csvRows.join('\n');
    }

    await navigator.clipboard.writeText(textData);
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    throw new Error('Failed to copy to clipboard');
  }
};

// Format data for display and export
export const formatTenantData = (result: any): TenantResult => {
  const formatted: TenantResult = {
    domain: result.domain || '',
    tenantId: result.tenantInfo?.tenantId || result.tenantId || result.tenant_id || '',
    tenantName: result.tenantInfo?.name || result.tenantName || result.tenant_name || result.domain || '',
    mxRecords: [],
    spfRecord: null,
    status: 'not_found',
    timestamp: new Date().toISOString()
  };

  // Handle MX Records
  if (result.tenantInfo?.mxRecords && Array.isArray(result.tenantInfo.mxRecords)) {
    formatted.mxRecords = result.tenantInfo.mxRecords;
  } else if (result.mxRecords && Array.isArray(result.mxRecords)) {
    formatted.mxRecords = result.mxRecords;
  }

  // Handle SPF Record
  if (result.tenantInfo?.spfRecord) {
    formatted.spfRecord = result.tenantInfo.spfRecord;
  } else if (result.spfRecord) {
    formatted.spfRecord = result.spfRecord;
  }

  // Determine status
  if (result.tenantInfo?.tenantId || result.tenantId) {
    formatted.status = 'found';
  } else if (result.error) {
    formatted.status = 'error';
  } else {
    formatted.status = 'not_found';
  }

  return formatted;
};

// Validate export data
export const validateExportData = (data: any[]): boolean => {
  if (!Array.isArray(data) || data.length === 0) {
    return false;
  }

  return data.every(item => 
    typeof item === 'object' && 
    item !== null && 
    (typeof item.domain === 'string' || (item.tenantInfo && typeof item.tenantInfo === 'object'))
  );
};

export type { TenantResult }; 