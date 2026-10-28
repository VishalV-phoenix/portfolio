/**
 * ============================================================================
 * CONTACT CARD CONTENT
 * ============================================================================
 * Centralized, editable content for the Contact milestone card,
 * including headings, descriptions, button labels, and email subjects.
 * ============================================================================
 */

export interface ContactButtonConfig {
  id: 'github' | 'linkedin' | 'email';
  label: string;
  ariaLabel: string;
}

export interface ContactUiCopy {
  eyebrow: string;
  sectionTitle: string;
  mainHeading: string;
  description: string;
  emailSubjectQuery: string;
  footnoteSymbol: string;
  footnoteText: string;
  buttons: ContactButtonConfig[];
}

export const CONTACT_UI_COPY: ContactUiCopy = {
  eyebrow: '04 / CONNECT',
  sectionTitle: 'Get in Touch',
  mainHeading: "Let's build something meaningful.",
  description:
    "Interested in AI, machine learning, or computational biology? Let's connect, share ideas, and explore what we can build.",
  emailSubjectQuery: 'Portfolio%20Inquiry',
  footnoteSymbol: '✦',
  footnoteText: 'Open to learning, collaboration, and interesting conversations.',
  buttons: [
    {
      id: 'github',
      label: 'GitHub',
      ariaLabel: 'GitHub profile (opens in a new tab)',
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      ariaLabel: 'LinkedIn profile (opens in a new tab)',
    },
    {
      id: 'email',
      label: 'Gmail',
      ariaLabel: 'Send email to Vishal',
    },
  ],
};
