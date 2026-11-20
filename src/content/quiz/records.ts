import type { QuizQuestion } from '../types'

export const records: QuizQuestion[] = [
  {
    id: 'r-1', level: 1,
    stem: 'What is the unit of synthesis in a systematic review?',
    options: ['The record', 'The report', 'The study', 'The database'],
    answer: 2,
    explain: 'Studies are synthesised. Several reports may describe one study; several records may represent one report.',
  },
  {
    id: 'r-2', level: 2,
    stem: 'A trial has a full journal article and an earlier conference abstract with an extra 6-month outcome. What do you do with the abstract?',
    options: ['Delete it as a duplicate', 'Treat it as a second study', 'Keep it, link it to the same study, and extract the additional data', 'Exclude it because abstracts are low quality'],
    answer: 2,
    explain: 'It is a companion report, not a duplicate record. Linking avoids double counting while capturing all available data.',
  },
  {
    id: 'r-3', level: 2,
    stem: 'Why is title-only exact matching insufficient for deduplication?',
    options: [
      'Titles are always unique',
      'Typos, punctuation, spelling variants and translated titles hide true duplicates, while errata and corrections share titles with originals',
      'DOIs are never exported',
      'Exact matching is too slow',
    ],
    answer: 1,
    explain: 'Combine identifiers, normalised metadata and fuzzy matching, then check borderline pairs manually.',
  },
  {
    id: 'r-4', level: 2,
    stem: 'What is the main consequence of including the same participants twice (covert duplicate publication) in a meta-analysis?',
    options: ['No effect if the results agree', 'Overstated precision and potentially biased pooled effects', 'It only affects the funnel plot', 'It reduces heterogeneity'],
    answer: 1,
    explain: 'Duplicate data artificially increase weight and precision; Tramèr et al. showed covert duplicates exaggerated the benefit of ondansetron.',
  },
  {
    id: 'r-5', level: 1,
    stem: '2,140 records were identified; 512 duplicates were removed and nothing else was removed before screening. How many records are screened?',
    options: ['2,140', '1,628', '2,652', '512'],
    answer: 1,
    explain: 'Records screened = identified − removed before screening = 2,140 − 512 = 1,628.',
  },
  {
    id: 'r-6', level: 1,
    stem: 'A record is an erratum correcting a table in an included trial. How should it be handled?',
    options: ['Removed as a duplicate', 'Linked to the study; check whether the correction changes extracted data', 'Treated as a new study', 'Ignored'],
    answer: 1,
    explain: 'Errata are reports about the same study and can change the numbers you extract.',
  },
]
