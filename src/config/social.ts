import { 
  FaLinkedin, 
  FaGithub
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import type { IconType } from 'react-icons';

export interface SocialLink {
  name: string;
  url: string;
  icon: IconType;
  color: string;
  hoverColor: string;
  ariaLabel: string;
}

export const socialLinks: SocialLink[] = [
  {
    name: 'X (Twitter)',
    url: 'https://x.com/cengizyilmaz_',
    icon: FaXTwitter,
    color: 'text-gray-700 dark:text-gray-300',
    hoverColor: 'hover:text-gray-900 dark:hover:text-white',
    ariaLabel: 'Follow on X (Twitter)'
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/cengizyilmazz',
    icon: FaLinkedin,
    color: 'text-gray-700 dark:text-gray-300',
    hoverColor: 'hover:text-blue-600 dark:hover:text-blue-400',
    ariaLabel: 'Connect on LinkedIn'
  },
  {
    name: 'GitHub',
    url: 'https://github.com/cengizyilmaz1',
    icon: FaGithub,
    color: 'text-gray-700 dark:text-gray-300',
    hoverColor: 'hover:text-gray-900 dark:hover:text-white',
    ariaLabel: 'View GitHub Profile'
  }
];

// Get social link by platform name
export const getSocialLink = (platform: string): SocialLink | undefined => {
  return socialLinks.find(link => 
    link.name.toLowerCase().includes(platform.toLowerCase())
  );
};

// Get primary social links (for header)
export const primarySocialLinks = socialLinks.slice(0, 3);

// Get all social links (for footer)
export const allSocialLinks = socialLinks;

