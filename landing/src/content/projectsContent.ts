/**
 * ============================================================================
 * PROJECTS CARD & GALLERY CONTENT
 * ============================================================================
 * Centralized, editable content for the Projects milestone card,
 * including project records, descriptions, tags, and action copy.
 * ============================================================================
 */

export interface ProjectTechnicalDetail {
  label: string;
  value: string;
}

export interface ProjectItem {
  id: 'algoquest' | 'llm-system-design';
  eyebrow: string;
  title: string;
  shortDescription: string;
  tags: string[];
  collapsedImage: string;
  expandedImage: string;
  overview: string;
  keyFeatures: string[];
  technicalDetails: ProjectTechnicalDetail[];
  githubUrl: string;
}

export interface ProjectsUiCopy {
  eyebrow: string;
  sectionTitle: string;
  instructions: string;
  backButtonText: string;
  closeAriaLabel: string;
  githubButtonText: string;
  featuresHeader: string;
  techDetailsHeader: string;
}

export const PROJECTS_UI_COPY: ProjectsUiCopy = {
  eyebrow: '01 / Focus',
  sectionTitle: 'Featured Projects',
  instructions: 'Click a project to expand details',
  backButtonText: '← Back to Projects',
  closeAriaLabel: 'Close project details',
  githubButtonText: 'View on GitHub ↗',
  featuresHeader: '✦ Key Features',
  techDetailsHeader: '⚙ Technical Details',
};

export const PROJECTS_GALLERY: ProjectItem[] = [
  {
    id: 'algoquest',
    eyebrow: '01 / ALGORITHMS',
    title: 'AlgoQuest',
    shortDescription:
      'An interactive platform for learning and comparing algorithms through visualizations.',
    tags: ['Flutter', 'Dart', 'FL Chart'],
    collapsedImage: '/assets/projects/Algoquest/home2.jpg',
    expandedImage: '/assets/projects/Algoquest/visuals.jpg',
    overview:
      'An interactive cross-platform application designed to make computer science algorithms intuitive and engaging. AlgoQuest visualizes step-by-step state transitions, computational complexities, and runtime benchmarks through live interactive graphics.',
    keyFeatures: [
      'Interactive searching and sorting algorithm visualizations with step-by-step controls.',
      'Theoretical Big-O analysis and experimental performance graphs.',
      'Side-by-side algorithm comparison for runtime evaluation.',
      'Executable code walkthroughs with multi-language examples (Python & C).',
    ],
    technicalDetails: [
      { label: 'Framework & Core', value: 'Flutter & Dart (cross-platform reactive UI)' },
      { label: 'Visualization & Charts', value: 'Custom canvas step renderer & FL Chart' },
      { label: 'Complexity Modeling', value: 'Big-O theoretical curves vs. experimental empirical benchmarks' },
    ],
    githubUrl: 'https://github.com/VishalV-phoenix/algorithm-playground',
  },
  {
    id: 'llm-system-design',
    eyebrow: '02 / AI SYSTEMS',
    title: 'AI System Design',
    shortDescription:
      'A modular CLI chatbot exploring document retrieval, embeddings, and MCP tool calling.',
    tags: ['Python', 'RAG', 'Embeddings', 'MCP'],
    collapsedImage: '/assets/projects/ai%20system%20design/startup.png',
    expandedImage: '/assets/projects/ai%20system%20design/help.png',
    overview:
      'A modular AI system design and CLI conversational assistant focused on modern RAG pipelines, configurable vector retrieval methods, and extensible Model Context Protocol (MCP) tool execution.',
    keyFeatures: [
      'PDF and document ingestion with structured text extraction (/ingest).',
      'Four modular retrieval architectures: character chunk, line-based, sliding window, and vector embeddings.',
      'Model Context Protocol (MCP) server integration for dynamic tool calling (/tools).',
      'Persistent conversation memory with automated summarization (/summarize) and dev inspection mode (/dev).',
    ],
    technicalDetails: [
      { label: 'Architecture', value: 'Python modular CLI architecture with config-driven pipeline' },
      { label: 'RAG & Retrieval', value: 'Sliding window chunking, dense vector embeddings, top-k semantic search' },
      { label: 'Agent Protocol', value: 'Model Context Protocol (MCP) client-tool communication' },
    ],
    githubUrl: 'https://github.com/VishalV-phoenix/LLM-System-Design',
  },
];
