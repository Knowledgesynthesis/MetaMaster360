import { Module } from '@/types'

export const modules: Module[] = [
  {
    id: 'pico',
    title: 'Framing the Research Question',
    description: 'Learn to use PICO/PEO frameworks to construct clear, focused research questions',
    icon: '🎯',
    order: 1,
    estimatedTime: '20 min',
    bloomLevel: 'Apply',
    path: '/modules/pico'
  },
  {
    id: 'protocol',
    title: 'Protocol Writing & Registration',
    description: 'Develop systematic review protocols and understand PROSPERO registration',
    icon: '📋',
    order: 2,
    prerequisites: ['pico'],
    estimatedTime: '30 min',
    bloomLevel: 'Create',
    path: '/modules/protocol'
  },
  {
    id: 'search',
    title: 'Search Strategy Development',
    description: 'Build comprehensive Boolean search queries with MeSH terms and keywords',
    icon: '🔍',
    order: 3,
    prerequisites: ['protocol'],
    estimatedTime: '40 min',
    bloomLevel: 'Create',
    path: '/modules/search'
  },
  {
    id: 'citations',
    title: 'Citation Management',
    description: 'Import, organize, and deduplicate references efficiently',
    icon: '📚',
    order: 4,
    prerequisites: ['search'],
    estimatedTime: '25 min',
    bloomLevel: 'Apply',
    path: '/modules/citations'
  },
  {
    id: 'screening',
    title: 'Screening Workflow',
    description: 'Master title/abstract and full-text screening with PRISMA flow diagrams',
    icon: '✓',
    order: 5,
    prerequisites: ['citations'],
    estimatedTime: '45 min',
    bloomLevel: 'Evaluate',
    path: '/modules/screening'
  },
  {
    id: 'extraction',
    title: 'Data Extraction Lab',
    description: 'Create extraction tables and systematically extract study data',
    icon: '📊',
    order: 6,
    prerequisites: ['screening'],
    estimatedTime: '35 min',
    bloomLevel: 'Apply',
    path: '/modules/extraction'
  },
  {
    id: 'rob',
    title: 'Risk of Bias Assessment',
    description: 'Apply RoB 2, ROBINS-I, and other critical appraisal tools',
    icon: '⚖️',
    order: 7,
    prerequisites: ['extraction'],
    estimatedTime: '50 min',
    bloomLevel: 'Evaluate',
    path: '/modules/rob'
  },
  {
    id: 'effect-size',
    title: 'Effect Size Calculation',
    description: 'Calculate MD, SMD, RR, OR, and HR from study data',
    icon: '🧮',
    order: 8,
    prerequisites: ['extraction'],
    estimatedTime: '30 min',
    bloomLevel: 'Apply',
    path: '/modules/effect-size'
  },
  {
    id: 'meta-analysis',
    title: 'Meta-Analysis Engine',
    description: 'Perform fixed and random-effects meta-analysis with forest plots',
    icon: '📈',
    order: 9,
    prerequisites: ['effect-size', 'rob'],
    estimatedTime: '60 min',
    bloomLevel: 'Analyze',
    path: '/modules/meta-analysis'
  },
  {
    id: 'publication-bias',
    title: 'Publication Bias Detection',
    description: 'Create funnel plots and assess small-study effects',
    icon: '🎪',
    order: 10,
    prerequisites: ['meta-analysis'],
    estimatedTime: '30 min',
    bloomLevel: 'Evaluate',
    path: '/modules/publication-bias'
  },
  {
    id: 'grade',
    title: 'GRADE: Certainty of Evidence',
    description: 'Assess certainty using GRADE methodology',
    icon: '⭐',
    order: 11,
    prerequisites: ['meta-analysis', 'rob'],
    estimatedTime: '40 min',
    bloomLevel: 'Evaluate',
    path: '/modules/grade'
  },
  {
    id: 'sof',
    title: 'Summary of Findings Tables',
    description: 'Create publication-ready SoF tables',
    icon: '📄',
    order: 12,
    prerequisites: ['grade'],
    estimatedTime: '25 min',
    bloomLevel: 'Create',
    path: '/modules/sof'
  },
  {
    id: 'manuscript',
    title: 'Manuscript Preparation',
    description: 'Learn PRISMA reporting and write transparent methods/results',
    icon: '✍️',
    order: 13,
    prerequisites: ['sof'],
    estimatedTime: '35 min',
    bloomLevel: 'Create',
    path: '/modules/manuscript'
  },
  {
    id: 'sandbox',
    title: 'Integrated SR/MA Sandbox',
    description: 'Complete a full systematic review from start to finish',
    icon: '🧪',
    order: 14,
    prerequisites: ['manuscript'],
    estimatedTime: '120 min',
    bloomLevel: 'Create',
    path: '/modules/sandbox'
  }
]
