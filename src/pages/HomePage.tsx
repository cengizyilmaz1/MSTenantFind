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
      <div className="min-h-screen py-12 px-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        <SearchForm />
      </div>
    </>
  );
};

export default HomePage; 