import React from 'react';
import SearchForm from '../components/SearchForm';
import SEO from '../components/SEO';

const HomePage: React.FC = () => {
  return (
    <>
      <SEO 
        path="/" 
        type="website"
        title="Microsoft Tenant Finder - Find Azure & Office 365 Tenant IDs"
        description="Instantly discover Microsoft Azure and Office 365 tenant information for any domain. Get tenant IDs, MX records, and SPF configurations."
        keywords="Microsoft Tenant ID, Azure Tenant, Office 365, Microsoft 365, Tenant Finder, DNS, MX Records, SPF"
      />
      <div className="min-h-screen py-12 px-4">
        <SearchForm />
      </div>
    </>
  );
};

export default HomePage; 