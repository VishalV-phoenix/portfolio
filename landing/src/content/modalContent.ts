/**
 * ============================================================================
 * SECTION MODALS CONTENT
 * ============================================================================
 * Centralized, editable content for the interactive Section Modals
 * (Projects, About, Achievements, and Contact).
 * ============================================================================
 */

export interface ModalSectionItem {
  id: 'projects' | 'about' | 'achievements' | 'contact';
  title: string;
  subtitle: string;
  description: string;
  cardEyebrow: string;
  cardTitle: string;
  cardDescription: string;
  directEmail?: string;
  contactHelperText?: string;
}

export interface ModalUiCopy {
  closeButtonLabel: string;
  closeAriaLabel: string;
  sections: Record<'projects' | 'about' | 'achievements' | 'contact', ModalSectionItem>;
}

export const MODAL_UI_COPY: ModalUiCopy = {
  closeButtonLabel: 'Close',
  closeAriaLabel: 'Close modal',
  sections: {
    projects: {
      id: 'projects',
      title: 'Projects',
      subtitle: 'AI Applications & Biology Tooling',
      description:
        'Exploration and development of modern AI systems, with an emphasis on applied generative models and machine learning for biological data.',
      cardEyebrow: 'Featured Focus',
      cardTitle: 'Machine Learning for Biology & Generative AI',
      cardDescription:
        'Selected case studies and open-source models are currently being curated for portfolio release.',
    },
    about: {
      id: 'about',
      title: 'About Vishal',
      subtitle: 'Background & Mission',
      description:
        'Driven by a deep curiosity at the convergence of computation and natural sciences, focusing on artificial intelligence systems, generative architectures, and computational biology.',
      cardEyebrow: 'Core Focus',
      cardTitle: 'Applied AI & Biological Sequence Modeling',
      cardDescription:
        'Dedicated to engineering open computational tools that bridge modern machine learning frameworks with biological data analysis.',
    },
    achievements: {
      id: 'achievements',
      title: 'Achievements',
      subtitle: 'Milestones & Key Initiatives',
      description:
        'Key academic, technical, and open-source milestones achieved in artificial intelligence applications and bio-computational modeling.',
      cardEyebrow: 'Portfolio Milestone',
      cardTitle: 'Applied AI & Bioinformatics Exploration',
      cardDescription:
        'Ongoing research initiatives and published prototypes. Additional honors and awards will be detailed here.',
    },
    contact: {
      id: 'contact',
      title: 'Contact',
      subtitle: 'Get In Touch',
      description:
        'I am always open to discussing new projects, AI research opportunities, or collaborations at the intersection of AI and biology.',
      cardEyebrow: 'Direct Email',
      cardTitle: 'vishalv6010@gmail.com',
      cardDescription:
        'You can also connect on LinkedIn or check out public repositories on GitHub.',
      directEmail: 'vishalv6010@gmail.com',
      contactHelperText:
        'You can also connect on LinkedIn or check out public repositories on GitHub.',
    },
  },
};
