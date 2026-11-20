import type { QuizQuestion } from '../types'

export const search: QuizQuestion[] = [
  {
    id: 's-1', level: 1,
    stem: 'For an intervention review, which concepts are usually combined in the search?',
    options: ['Population AND Intervention AND Comparator AND Outcome', 'Population AND Intervention (plus a study-design filter if appropriate)', 'Outcome only', 'Intervention AND Outcome'],
    answer: 1,
    explain: 'Outcomes and comparators are often missing from titles and abstracts, so adding them reduces sensitivity. Screening handles them instead.',
  },
  {
    id: 's-2', level: 1,
    stem: 'Why combine subject headings with free-text terms within a concept?',
    options: [
      'To make the search more precise',
      'Because recent records are not yet indexed, indexing is inconsistent, and some concepts have no heading',
      'Because PubMed requires both',
      'To avoid using truncation',
    ],
    answer: 1,
    explain: 'Headings capture synonyms systematically but miss unindexed and poorly indexed records; free text fills those gaps.',
  },
  {
    id: 's-3', level: 2,
    stem: 'A strategy ends with “… AND exercise NOT review”. What is the main risk?',
    options: ['None; it removes reviews', 'Eligible trials whose abstracts mention the word “review” are removed', 'It increases sensitivity', 'It makes the search non-reproducible'],
    answer: 1,
    explain: 'NOT removes any record containing the term, including eligible ones. Use NOT sparingly and only in validated constructions such as the animal-only exclusion.',
  },
  {
    id: 's-4', level: 1,
    stem: 'Which set is the minimum bibliographic database set for a Cochrane intervention review?',
    options: ['PubMed only', 'CENTRAL, MEDLINE and Embase (plus trial registers)', 'Google Scholar and Scopus', 'Web of Science only'],
    answer: 1,
    explain: 'Cochrane standards require CENTRAL, MEDLINE and Embase, and searching trial registers such as ClinicalTrials.gov and WHO ICTRP.',
  },
  {
    id: 's-5', level: 2,
    stem: 'Besides finding unpublished trials, why search trial registers?',
    options: ['They contain full texts of all trials', 'To compare registered outcomes with those reported, revealing selective outcome reporting', 'To avoid citation searching', 'They replace Embase'],
    answer: 1,
    explain: 'Registry records show what was planned. Discrepancies with publications signal reporting bias and feed RoB 2 domain 5 and ROB-ME.',
  },
  {
    id: 's-6', level: 2,
    stem: 'An LLM proposes the heading "Exercise Therapy for Depression"[Mesh]. What should you do?',
    options: ['Use it; LLMs know MeSH', 'Check it in the MeSH database — it may not exist — and test the strategy against known eligible studies', 'Replace all headings with LLM suggestions', 'Remove all subject headings'],
    answer: 1,
    explain: 'Generated strategies often contain non-existent headings. Under the 2025 joint position on AI, humans verify outputs and remain accountable.',
  },
  {
    id: 's-7', level: 2,
    stem: 'What does PRISMA-S require you to report?',
    options: ['Only the number of records', 'Each source and platform, full strategies, limits/filters, search dates, other methods and deduplication', 'Only the MEDLINE strategy', 'The names of the librarians'],
    answer: 1,
    explain: 'PRISMA-S makes searches reproducible: every source, the complete strategies, dates, limits and other methods must be reported.',
  },
  {
    id: 's-8', level: 3,
    stem: 'Your final search was run 15 months before the planned publication date. What is the appropriate action?',
    options: ['Publish; searches never expire', 'Rerun the searches, screen new records with the same methods, and incorporate eligible studies', 'Mention it as a limitation only', 'Add a date limit'],
    answer: 1,
    explain: 'Cochrane expects searches to be rerun within 12 months of publication; new eligible studies can change conclusions.',
  },
]
