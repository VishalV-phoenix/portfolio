/**
 * ============================================================================
 * ABOUT CARD & BIOGRAPHY CONTENT
 * ============================================================================
 * Centralized, editable content for the About Me milestone card,
 * including story headlines, structured biography paragraphs with highlighted
 * keyword tokens, and domain focus tags.
 * ============================================================================
 */

export interface AboutParagraphSegment {
  text: string;
  isHighlight?: boolean;
}

export interface AboutParagraph {
  id: string;
  segments: AboutParagraphSegment[];
}

export interface AboutUiCopy {
  eyebrow: string;
  sectionTitle: string;
  mainHeading: string;
  tags: string[];
}

export const ABOUT_UI_COPY: AboutUiCopy = {
  eyebrow: '03 / THE STORY',
  sectionTitle: 'About Me',
  mainHeading: 'Curious by nature. Building with purpose.',
  tags: [
    'Curiosity-driven learning',
    'Machine Learning',
    'AI Systems',
    'Computational Biology',
  ],
};

/** Compatibility alias */
export const ABOUT_TAGS: string[] = ABOUT_UI_COPY.tags;

export const ABOUT_BIOGRAPHY_PARAGRAPHS: AboutParagraph[] = [
  {
    id: 'bio-p1',
    segments: [
      { text: "I'm a " },
      { text: 'Computer Science and Engineering student', isHighlight: true },
      { text: ' interested in understanding how intelligent systems work — from the fundamentals of machine learning to the systems that bring AI applications to life.' },
    ],
  },
  {
    id: 'bio-p2',
    segments: [
      { text: 'My interests lie at the intersection of ' },
      { text: 'AI & Biology', isHighlight: true },
      { text: ', where computation can help us explore complex biological systems and uncover patterns that are difficult to see otherwise.' },
    ],
  },
  {
    id: 'bio-p3',
    segments: [
      { text: "I enjoy learning by building, experimenting with ideas, and understanding the principles behind the tools I use. Whether I'm exploring " },
      { text: 'Machine Learning', isHighlight: true },
      { text: ', designing ' },
      { text: 'AI Systems', isHighlight: true },
      { text: ', or exploring new technologies, I value curiosity over shortcuts and understanding over simply making things work.' },
    ],
  },
  {
    id: 'bio-p4',
    segments: [
      { text: 'My long-term goal is to explore ' },
      { text: 'Computational Biology', isHighlight: true },
      { text: ' and contribute to projects where AI helps us understand life at a deeper level.' },
    ],
  },
];
