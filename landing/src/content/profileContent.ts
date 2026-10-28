/**
 * ============================================================================
 * PORTFOLIO IDENTITY & NAVIGATION CONTENT
 * ============================================================================
 * Centralized, editable content for personal profile details, contact URLs,
 * and top-level navigation items.
 * ============================================================================
 */

export interface SocialLink {
  id: 'email' | 'linkedin' | 'github';
  name: string;
  url: string;
  iconSvg: string;
  ariaLabel?: string;
}

export interface NavItem {
  id: 'home' | 'projects' | 'skills' | 'about' | 'contact';
  label: string;
}

export interface ProfileContent {
  name: string;
  introGreeting: string;
  introSuffix: string;
  tagline: string;
  location: string;
  socials: SocialLink[];
  navItems: readonly NavItem[];
}

export const PROFILE_CONTENT: ProfileContent = {
  name: 'Vishal V',
  introGreeting: 'Hi there,',
  introSuffix: 'here',
  tagline: 'Building AI applications and exploring AI for biology.',
  location: 'Nagercoil, Tamil Nadu',

  // Contact and Social Links
  socials: [
    {
      id: 'email',
      name: 'Email',
      url: 'mailto:vishalv6010@gmail.com',
      iconSvg: '/assets/icons/email.svg',
      ariaLabel: 'Send email to Vishal',
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/vishal-v-821996387/',
      iconSvg: '/assets/icons/linkedin.svg',
      ariaLabel: 'LinkedIn profile (opens in a new tab)',
    },
    {
      id: 'github',
      name: 'GitHub',
      url: 'https://github.com/VishalV-phoenix',
      iconSvg: '/assets/icons/github.svg',
      ariaLabel: 'GitHub profile (opens in a new tab)',
    },
  ],

  // 5 Individual Navigation Items
  navItems: [
    { id: 'home', label: 'Home' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ] as const,
};

/** Compatibility alias */
export const PROFILE_CONFIG = PROFILE_CONTENT;
