import React from 'react';

/**
 * ============================================================================
 * SKILLS CARD & CATEGORIES CONTENT
 * ============================================================================
 * Centralized, editable content for the Skills milestone card,
 * including categories, technology items, icon nodes, and UI labels.
 * ============================================================================
 */

export interface SkillItem {
  name: string;
  shortLabel?: string;
  icon: React.ReactNode;
}

export interface SkillCategory {
  id: string;
  eyebrow: string;
  title: string;
  tabLabel: string;
  skills: SkillItem[];
}

export interface SkillsUiCopy {
  eyebrow: string;
  sectionTitle: string;
  summarySubtitle: string;
  allTabLabel: string;
  itemsSuffix: string;
  footerFootnote: string;
}

export const SKILLS_UI_COPY: SkillsUiCopy = {
  eyebrow: '02 / Expertise',
  sectionTitle: 'Technical Domains & Skills',
  summarySubtitle: '28 Technologies • 5 Categories',
  allTabLabel: 'All (28)',
  itemsSuffix: 'items',
  footerFootnote: 'Curated computational & AI toolstack',
};

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'languages',
    eyebrow: '01 / LANGUAGES',
    title: 'Programming Languages',
    tabLabel: '01 Languages',
    skills: [
      {
        name: 'Python',
        icon: (
          <svg viewBox="0 0 24 24" className="w-4 h-4">
            <path d="M11.914 0C5.82 0 6.2 2.656 6.2 2.656l.006 2.753h5.814v.826H3.896S0 5.78 0 11.902c0 6.12 3.4 5.92 3.4 5.92h2.03v-2.85s-.11-3.4 3.342-3.4h5.757s3.23.053 3.23-3.136V2.656S18.313 0 11.914 0zm-3.23 1.765a1.05 1.05 0 1 1 0 2.1 1.05 1.05 0 0 1 0-2.1z" fill="#387EB8" />
            <path d="M12.086 24c6.094 0 5.714-2.656 5.714-2.656l-.006-2.753H11.98v-.826h8.124S24 18.22 24 12.098c0-6.12-3.4-5.92-3.4-5.92h-2.03v2.85s.11 3.4-3.342 3.4H9.47s-3.23-.053-3.23 3.136v5.782S5.687 24 12.086 24zm3.23-1.765a1.05 1.05 0 1 1 0-2.1 1.05 1.05 0 0 1 0 2.1z" fill="#FFE052" />
          </svg>
        ),
      },
      {
        name: 'C',
        icon: (
          <svg viewBox="0 0 24 24" className="w-4 h-4">
            <path d="M22.062 16.924a11.942 11.942 0 0 1-7.07 6.42c-4.467 1.487-9.427-.132-12.28-3.99C-.14 15.498-.75 10.373 1.157 5.86 3.064 1.347 7.747-1.127 12.602.404a11.99 11.99 0 0 1 7.158 5.612l-4.512 2.603a6.83 6.83 0 0 0-4.08-3.193c-2.775-.873-5.45.54-6.537 3.084-1.088 2.544-.242 5.485 1.954 6.969 2.195 1.485 5.257 1.15 7.126-.745l4.351 2.19z" fill="#659AD2" />
          </svg>
        ),
      },
      {
        name: 'Java',
        icon: (
          <svg viewBox="0 0 24 24" className="w-4 h-4">
            <path d="M8.85 16.84c0 .03.02.04.05.04.3 0 .73-.1 1.25-.33 1.76-.78 3.75-.43 3.75-.43s-1.89.9-3.79 1.48c-1.63.5-3.35.48-3.96.22-.38-.17-.4-.36-.4-.39 0-.25.54-.53 1.5-.78.58-.15 1.15-.31 1.6-.47 0 .04.05.06.05.06zm-.64-2.85c.27 0 .66-.08 1.14-.28 1.62-.68 3.44-.37 3.44-.37s-1.73.78-3.48 1.29c-1.5.43-3.08.41-3.64.19-.35-.14-.37-.31-.37-.34 0-.21.5-.46 1.38-.68.53-.13 1.06-.27 1.47-.41.03.03.06.05.06.05zm3.76-6.42s1.39 1.44-.35 3.65c-2.09 2.65-.63 4.12-.63 4.12s.91-1.04-.42-2.36c-1.07-1.06-1.12-2.13.4-3.43 1.05-.9 1-1.98 1-1.98zm-2.04 12.16c-1.32.25-2.72.16-3.48-.12-.34-.13-.42-.3-.42-.33 0-.17.43-.37 1.18-.55.45-.11.9-.22 1.25-.33 0 .03.02.04.04.04.25 0 .62-.08 1.06-.27 1.46-.62 3.1-.34 3.1-.34s-1.56.7-3.13 1.16c-.4.12-.83.24-1.3.36-.05.03-.09.05-.09.05zm5.72-3.81s.75.52.28 1.04c-.46.51-1.52.88-2.67 1.19 1.04-.38 2.01-.89 2.39-1.23z" fill="#EA2D2E" />
            <path d="M12.9 2.5s2.4 2.4-1.8 6.1c-3.3 2.9-1.4 4.5-1.4 4.5s.8-1.2-.4-2.4C8.1 9.4 8.2 8.3 10.6 6.3c1.6-1.4 2.3-3.8 2.3-3.8z" fill="#5382A1" />
          </svg>
        ),
      },
      {
        name: 'JavaScript',
        icon: (
          <svg viewBox="0 0 24 24" className="w-4 h-4">
            <rect width="24" height="24" rx="3" fill="#F7DF1E" />
            <path d="M6.5 18.5l1.8-1.1c.4.7.8 1.2 1.6 1.2.8 0 1.3-.3 1.3-1.4V11H13v6.3c0 2.2-1.3 3.2-3.1 3.2-1.7 0-2.8-.9-3.4-2zm8.3-0.2l1.8-1c.5.8 1.1 1.3 2.1 1.3.9 0 1.5-.5 1.5-1.1 0-.8-.6-1.1-1.9-1.7-1.7-.7-2.8-1.6-2.8-3.4 0-1.7 1.3-3 3.3-3 1.5 0 2.6.5 3.3 1.8l-1.7 1.1c-.4-.7-.9-1-1.6-1-.8 0-1.2.4-1.2 1 0 .7.5 1 1.7 1.5 1.9.8 3 1.7 3 3.5 0 2-1.6 3.2-3.7 3.2-2.1 0-3.3-1-3.8-2.2z" fill="#000000" />
          </svg>
        ),
      },
      {
        name: 'SQL',
        icon: (
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
            <ellipse cx="12" cy="6" rx="8" ry="3" stroke="#F59E0B" strokeWidth="1.8" />
            <path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6" stroke="#F59E0B" strokeWidth="1.8" />
            <path d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" stroke="#F59E0B" strokeWidth="1.8" />
          </svg>
        ),
      },
      {
        name: 'HTML',
        icon: (
          <svg viewBox="0 0 24 24" className="w-4 h-4">
            <path d="M3 2l1.8 20.2L12 24l7.2-1.8L21 2H3zm14.8 6.5h-8l.2 2.2h7.6l-.6 6.9-4.8 1.3-4.8-1.3-.3-3.6h2.2l.2 1.8 2.7.7 2.7-.7.3-3H6.8L6.2 4.2h12l-.4 4.3z" fill="#E34F26" />
          </svg>
        ),
      },
      {
        name: 'CSS',
        icon: (
          <svg viewBox="0 0 24 24" className="w-4 h-4">
            <path d="M3 2l1.8 20.2L12 24l7.2-1.8L21 2H3zm14.9 6.5h-8l.2 2.2h7.6l-.6 6.9-4.8 1.3-4.8-1.3-.3-3.6h2.2l.2 1.8 2.7.7 2.7-.7.3-3H6.8L6.2 4.2h12.1l-.4 4.3z" fill="#1572B6" />
          </svg>
        ),
      },
    ],
  },
  {
    id: 'ai-ml',
    eyebrow: '02 / AI & MACHINE LEARNING',
    title: 'Machine Learning & Data Science',
    tabLabel: '02 AI & ML',
    skills: [
      {
        name: 'scikit-learn',
        icon: (
          <svg viewBox="0 0 24 24" className="w-4 h-4">
            <path d="M14.7 3.6a7.5 7.5 0 0 0-8.2 2.8l2.9 2a4.2 4.2 0 0 1 4.5-1.5l.8-3.3zm-8.8 4a7.5 7.5 0 0 0-1.7 8.6l3-1.8a4.2 4.2 0 0 1 .9-4.7l-2.2-2.1zm2.3 9.4a7.5 7.5 0 0 0 8.3 1.5l-1.3-3.2a4.2 4.2 0 0 1-4.6-.8l-2.4 2.5zm9.8-1.5a7.5 7.5 0 0 0 1.6-8.6l-3 1.8a4.2 4.2 0 0 1-.9 4.7l2.3 2.1z" fill="#F7931E" />
            <circle cx="12" cy="12" r="2.5" fill="#3499CD" />
          </svg>
        ),
      },
      {
        name: 'NumPy',
        icon: (
          <svg viewBox="0 0 24 24" className="w-4 h-4">
            <path d="M21.1 6.5l-8.6-5a1 1 0 0 0-1 0l-8.6 5a1 1 0 0 0-.5.9v9.8a1 1 0 0 0 .5.9l8.6 5a1 1 0 0 0 1 0l8.6-5a1 1 0 0 0 .5-.9V7.4a1 1 0 0 0-.5-.9zm-9.1-3.6l7 4.1-3.2 1.9-7-4.1 3.2-1.9zm-7.6 5.5l7 4.1v7.6l-7-4.1V8.4zm9.2 11.7v-7.6l3.2-1.8v7.6l-3.2 1.8zm4.4-2.5v-7.6l2.6-1.5v7.6l-2.6 1.5z" fill="#4DABCF" />
          </svg>
        ),
      },
      {
        name: 'pandas',
        icon: (
          <svg viewBox="0 0 24 24" className="w-4 h-4">
            <rect x="3" y="10" width="3.5" height="11" rx="1" fill="#150458" />
            <rect x="8.5" y="4" width="3.5" height="17" rx="1" fill="#E70488" />
            <rect x="14" y="8" width="3.5" height="13" rx="1" fill="#150458" />
            <rect x="19.5" y="13" width="3.5" height="8" rx="1" fill="#FFCC00" />
          </svg>
        ),
      },
      {
        name: 'Matplotlib',
        icon: (
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
            <circle cx="12" cy="12" r="9" stroke="#11557C" strokeWidth="2" />
            <path d="M6 14l4-5 4 4 4-6" stroke="#4DABCF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ),
      },
    ],
  },
  {
    id: 'ai-systems',
    eyebrow: '03 / AI SYSTEMS',
    title: 'AI Architectures & Protocols',
    tabLabel: '03 AI Systems',
    skills: [
      {
        name: 'Retrieval-Augmented Generation (RAG)',
        shortLabel: 'RAG',
        icon: (
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.35-4.35" />
            <path d="M8 11h6" />
            <path d="M11 8v6" />
          </svg>
        ),
      },
      {
        name: 'Embeddings',
        icon: (
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="#A78BFA" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="6" cy="6" r="2" fill="#A78BFA" />
            <circle cx="18" cy="6" r="2" fill="#A78BFA" />
            <circle cx="6" cy="18" r="2" fill="#A78BFA" />
            <circle cx="18" cy="18" r="2" fill="#A78BFA" />
            <circle cx="12" cy="12" r="2.5" fill="#C084FC" />
            <path d="m6 6 6 6m0 0 6-6m-6 6-6 6m6-6 6 6" />
          </svg>
        ),
      },
      {
        name: 'Model Context Protocol (MCP)',
        shortLabel: 'MCP',
        icon: (
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="6" height="6" rx="1.5" />
            <rect x="15" y="3" width="6" height="6" rx="1.5" />
            <rect x="9" y="15" width="6" height="6" rx="1.5" />
            <path d="M6 9v3a2 2 0 0 0 2 2h4m6-5v3a2 2 0 0 1-2 2h-4" />
          </svg>
        ),
      },
      {
        name: 'LLM APIs',
        icon: (
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="#FB7185" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 3-1.9 4.8L5.3 9.7l3.8 3.7-.9 5.3 4.8-2.5 4.8 2.5-.9-5.3 3.8-3.7-4.8-1.9z" fill="#FB7185" fillOpacity="0.2" />
            <circle cx="12" cy="12" r="1.5" fill="#FB7185" />
          </svg>
        ),
      },
      {
        name: 'Document ingestion and retrieval',
        shortLabel: 'Doc Ingestion',
        icon: (
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6" />
            <path d="m9 15 3 3 3-3" />
            <path d="M12 11v7" />
          </svg>
        ),
      },
      {
        name: 'Tool calling',
        shortLabel: 'Tool Calling',
        icon: (
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
        ),
      },
    ],
  },
  {
    id: 'tools',
    eyebrow: '04 / TOOLS & DEVELOPMENT',
    title: 'Developer Tooling & Workflows',
    tabLabel: '04 Tools & Dev',
    skills: [
      {
        name: 'Git',
        icon: (
          <svg viewBox="0 0 24 24" className="w-4 h-4">
            <path d="M23.546 10.93L13.067.452a1.505 1.505 0 0 0-2.128 0L8.88 2.51l2.684 2.683a1.782 1.782 0 0 1 2.25 2.257l2.583 2.583a1.777 1.777 0 1 1-1.066 1.066l-2.417-2.417v5.52a1.784 1.784 0 1 1-1.5 0V8.52a1.786 1.786 0 0 1-.96-2.336L7.75 3.468.455 10.763a1.503 1.503 0 0 0 0 2.125l10.478 10.48a1.505 1.505 0 0 0 2.128 0l10.485-10.312a1.505 1.505 0 0 0 0-2.126z" fill="#F05032" />
          </svg>
        ),
      },
      {
        name: 'GitHub',
        icon: (
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
        ),
      },
      {
        name: 'Visual Studio Code',
        shortLabel: 'VS Code',
        icon: (
          <svg viewBox="0 0 24 24" className="w-4 h-4">
            <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.27a.999.999 0 0 0-.005 1.503l3.81 3.225-3.81 3.226a.999.999 0 0 0 .005 1.503l1.322 1.212a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z" fill="#007ACC" />
          </svg>
        ),
      },
      {
        name: 'Jupyter Notebook',
        shortLabel: 'Jupyter',
        icon: (
          <svg viewBox="0 0 24 24" className="w-4 h-4">
            <path d="M12 0a4.34 4.34 0 0 0-4.34 4.34 4.34 4.34 0 0 0 4.34 4.34A4.34 4.34 0 0 0 16.34 4.34 4.34 4.34 0 0 0 12 0zm0 15.32a4.34 4.34 0 0 0-4.34 4.34A4.34 4.34 0 0 0 12 24a4.34 4.34 0 0 0 4.34-4.34 4.34 4.34 0 0 0-4.34-4.34zM3.44 8.78a3.22 3.22 0 1 0 0 6.44 3.22 3.22 0 0 0 0-6.44zm17.12 0a3.22 3.22 0 1 0 0 6.44 3.22 3.22 0 0 0 0-6.44z" fill="#F37626" />
          </svg>
        ),
      },
      {
        name: 'FastAPI',
        icon: (
          <svg viewBox="0 0 24 24" className="w-4 h-4">
            <path d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24zm-.8 4.2h2.2l-2.4 6.8h2.6L8.8 19.8l1.6-6.6H7.8l3.4-9z" fill="#009688" />
          </svg>
        ),
      },
      {
        name: 'Streamlit',
        icon: (
          <svg viewBox="0 0 24 24" className="w-4 h-4">
            <path d="M16.5 7.5L24 16.5H9L16.5 7.5z" fill="#FF4B4B" />
            <path d="M7.5 12L12 16.5H3L7.5 12z" fill="#FF4B4B" opacity="0.8" />
            <path d="M12 3L15 7.5H9L12 3z" fill="#FF4B4B" opacity="0.9" />
          </svg>
        ),
      },
    ],
  },
  {
    id: 'app-data',
    eyebrow: '05 / APP DEVELOPMENT & DATA',
    title: 'Client Apps & Storage',
    tabLabel: '05 App & Data',
    skills: [
      {
        name: 'Flutter',
        icon: (
          <svg viewBox="0 0 24 24" className="w-4 h-4">
            <path d="M14.314 0L2.3 12 6 15.7 21.684 0h-7.37z" fill="#02569B" />
            <path d="M14.286 11.086L7.743 17.629l3.7 3.7 6.543-6.543z" fill="#0175C2" />
            <path d="M14.286 24h7.4L15.143 17.457l-3.7 3.7z" fill="#29B6F6" />
          </svg>
        ),
      },
      {
        name: 'Dart',
        icon: (
          <svg viewBox="0 0 24 24" className="w-4 h-4">
            <path d="M4.1 3.2L0 7.3l8.6 15.5 8.2-8.2z" fill="#0175C2" />
            <path d="M24 11.5L12.5 0H4.1l11.7 11.7z" fill="#00B4AB" />
            <path d="M15.8 11.7L4.1 0v8.2l7.6 7.6z" fill="#01579B" />
          </svg>
        ),
      },
      {
        name: 'SQLite',
        icon: (
          <svg viewBox="0 0 24 24" className="w-4 h-4">
            <path d="M12 2C6.48 2 2 4.02 2 6.5v11C2 19.98 6.48 22 12 22s10-2.02 10-4.5v-11C22 4.02 17.52 2 12 2zm0 2.5c4.69 0 8 1.48 8 2s-3.31 2-8 2-8-1.48-8-2 3.31-2 8-2zm0 6.5c-4.69 0-8-1.48-8-2v3.1c1.88 1.18 5.02 1.9 8 1.9s6.12-.72 8-1.9V11c0 .52-3.31 2-8 2zm0 5.5c-4.69 0-8-1.48-8-2v3.1c1.88 1.18 5.02 1.9 8 1.9s6.12-.72 8-1.9V16c0 .52-3.31 2-8 2z" fill="#003B57" />
          </svg>
        ),
      },
      {
        name: 'MongoDB',
        icon: (
          <svg viewBox="0 0 24 24" className="w-4 h-4">
            <path d="M12 0C11.6 0 11.2.2 11 .5 9.4 3 6.5 8.2 6.5 12.8c0 4.2 2.7 7.7 5.5 10.7.3.3.7.5 1 .5s.7-.2 1-.5c2.8-3 5.5-6.5 5.5-10.7 0-4.6-2.9-9.8-4.5-12.3-.2-.3-.6-.5-1-.5zm0 2.5c1.2 2 3.8 6.5 3.8 10.3 0 3.3-2.1 6.2-3.8 8.4V2.5z" fill="#47A248" />
          </svg>
        ),
      },
    ],
  },
];
