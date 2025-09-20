import { 
  HiOutlineHome, 
  HiOutlineGlobeAlt, 
  HiOutlineChatBubbleLeftRight,
  HiOutlineDocumentText,
  HiOutlineShieldCheck,
  HiOutlineUser
} from 'react-icons/hi2';
import type { IconType } from 'react-icons';

export interface NavItem {
  label: string;
  path: string;
  icon?: IconType;
  external?: boolean;
  show?: 'header' | 'footer' | 'both';
}

export const navigationLinks: NavItem[] = [
  {
    label: 'Home',
    path: '/',
    icon: HiOutlineHome,
    show: 'both'
  },
  {
    label: 'Cengiz Yılmaz',
    path: 'https://cengizyilmaz.net',
    icon: HiOutlineGlobeAlt,
    external: true,
    show: 'header'
  },
  {
    label: 'Message',
    path: 'https://message.cengizyilmaz.net',
    icon: HiOutlineChatBubbleLeftRight,
    external: true,
    show: 'header'
  },
  {
    label: 'Terms',
    path: '/terms',
    icon: HiOutlineDocumentText,
    show: 'footer'
  },
  {
    label: 'Privacy',
    path: '/privacy',
    icon: HiOutlineShieldCheck,
    show: 'footer'
  },
  {
    label: 'Author',
    path: '/author',
    icon: HiOutlineUser,
    show: 'both'
  }
];

// Quick access links for header
export const headerLinks = navigationLinks.filter(link => 
  link.show === 'header' || link.show === 'both'
);

// Footer navigation links
export const footerLinks = navigationLinks.filter(link => 
  link.show === 'footer' || link.show === 'both'
);

