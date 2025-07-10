<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>XML Sitemap - Microsoft Tenant Finder</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <style type="text/css">
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            font-size: 16px;
            color: #333;
            background: #f5f7fa;
            line-height: 1.6;
            padding: 2rem;
          }
          .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #3b82f6, #6366f1);
            color: white;
            padding: 2rem;
            text-align: center;
          }
          .header h1 {
            font-size: 2rem;
            margin-bottom: 0.5rem;
          }
          .header p {
            opacity: 0.9;
          }
          .content {
            padding: 2rem;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1rem;
            background: white;
            border-radius: 8px;
            overflow: hidden;
          }
          th {
            background: #f8fafc;
            padding: 1rem;
            text-align: left;
            font-weight: 600;
            color: #1e293b;
            border-bottom: 2px solid #e2e8f0;
          }
          td {
            padding: 1rem;
            border-bottom: 1px solid #e2e8f0;
            color: #475569;
          }
          tr:hover td {
            background: #f1f5f9;
          }
          a {
            color: #3b82f6;
            text-decoration: none;
            transition: color 0.2s;
          }
          a:hover {
            color: #2563eb;
            text-decoration: underline;
          }
          .footer {
            text-align: center;
            padding: 2rem;
            color: #64748b;
            border-top: 1px solid #e2e8f0;
          }
          .stats {
            display: flex;
            justify-content: space-around;
            padding: 1rem;
            background: #f8fafc;
            border-radius: 8px;
            margin: 1rem 0;
          }
          .stat-item {
            text-align: center;
          }
          .stat-value {
            font-size: 1.5rem;
            font-weight: 600;
            color: #3b82f6;
          }
          .stat-label {
            color: #64748b;
            font-size: 0.875rem;
          }
          @media (max-width: 768px) {
            body {
              padding: 1rem;
            }
            .header {
              padding: 1.5rem;
            }
            .content {
              padding: 1rem;
            }
            table {
              display: block;
              overflow-x: auto;
            }
            .stats {
              flex-direction: column;
              gap: 1rem;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>XML Sitemap</h1>
            <p>Microsoft Tenant Finder by Cengiz YILMAZ</p>
          </div>
          <div class="content">
            <div class="stats">
              <div class="stat-item">
                <div class="stat-value"><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></div>
                <div class="stat-label">Total URLs</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">
                  <xsl:value-of select="substring(sitemap:urlset/sitemap:url[1]/sitemap:lastmod,1,10)"/>
                </div>
                <div class="stat-label">Last Updated</div>
              </div>
            </div>
            <table>
              <tr>
                <th>URL</th>
                <th>Last Modified</th>
                <th>Change Frequency</th>
              </tr>
              <xsl:for-each select="sitemap:urlset/sitemap:url">
                <tr>
                  <td>
                    <a href="{sitemap:loc}">
                      <xsl:value-of select="sitemap:loc"/>
                    </a>
                  </td>
                  <td><xsl:value-of select="sitemap:lastmod"/></td>
                  <td><xsl:value-of select="sitemap:changefreq"/></td>
                </tr>
              </xsl:for-each>
            </table>
          </div>
          <div class="footer">
            <p>Generated by Microsoft Tenant Finder - © 2024 Cengiz YILMAZ</p>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>