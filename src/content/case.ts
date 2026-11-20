/**
 * The running case used across modules. All studies, authors and numbers are invented for training.
 * Question: In adults with a major depressive episode, does a structured exercise programme (≥ 8 weeks)
 * compared with usual care reduce depressive symptoms at end of treatment?
 * Lower symptom scores are better, so negative SMDs favour exercise.
 */
import type { RobJudgement } from '@/components/plots/RobPlots'

export const CASE_QUESTION = {
  P: 'Adults (≥ 18 y) with a current major depressive episode (DSM-5 or ICD-11 criteria, or validated cut-off)',
  I: 'Structured exercise programme of ≥ 8 weeks (aerobic, resistance, mixed or yoga-based), supervised or home-based',
  C: 'Usual care or waiting list (not attention controls or active treatments)',
  O: 'Primary: depressive symptoms at end of treatment (any validated scale). Secondary: response (≥ 50% symptom reduction), adverse events, dropout',
  S: 'Randomized controlled trials (individually or cluster randomized)',
}

export interface CaseStudy {
  id: string
  label: string
  scale: string
  delivery: 'Supervised' | 'Home-based'
  /** experimental arm */
  n1: number
  m1: number
  sd1: number
  /** usual care */
  n2: number
  m2: number
  sd2: number
  /** response (≥50% reduction) */
  r1: number
  r2: number
  rob: RobJudgement[]
  robOverall: RobJudgement
  note?: string
}

// Values are as analysed after data preparation (see the extraction module for how they were derived).
export const CASE_STUDIES: CaseStudy[] = [
  { id: 'alv', label: 'Alvarez 2016', scale: 'HAM-D', delivery: 'Supervised', n1: 42, m1: 11.2, sd1: 5.9, n2: 40, m2: 14.1, sd2: 6.3, r1: 18, r2: 10, rob: ['low', 'some', 'low', 'low', 'some'], robOverall: 'some' },
  { id: 'bre', label: 'Brennan 2017', scale: 'BDI-II', delivery: 'Supervised', n1: 25, m1: 13.5, sd1: 8.8, n2: 24, m2: 21.0, sd2: 9.4, r1: 12, r2: 5, rob: ['high', 'some', 'some', 'some', 'some'], robOverall: 'high', note: 'Alternation used to allocate participants.' },
  { id: 'cho', label: 'Chowdhury 2018', scale: 'PHQ-9', delivery: 'Home-based', n1: 85, m1: 8.9, sd1: 5.0, n2: 83, m2: 10.1, sd2: 5.2, r1: 32, r2: 25, rob: ['low', 'low', 'low', 'some', 'low'], robOverall: 'some', note: 'Cluster RCT (20 practices); sample sizes are effective sizes after a design effect of 1.3.' },
  { id: 'dim', label: 'Dimitrov 2019', scale: 'HAM-D', delivery: 'Supervised', n1: 64, m1: 12.0, sd1: 6.1, n2: 66, m2: 13.4, sd2: 6.0, r1: 27, r2: 21, rob: ['low', 'low', 'low', 'low', 'low'], robOverall: 'low', note: 'Three-arm trial: aerobic and resistance arms combined.' },
  { id: 'eze', label: 'Eze 2020', scale: 'BDI-II', delivery: 'Supervised', n1: 30, m1: 15.8, sd1: 9.9, n2: 29, m2: 22.6, sd2: 10.4, r1: 13, r2: 6, rob: ['some', 'some', 'high', 'some', 'some'], robOverall: 'high', note: '31% missing outcome data, mainly in the control arm.' },
  { id: 'fuj', label: 'Fujita 2021', scale: 'PHQ-9', delivery: 'Home-based', n1: 150, m1: 9.4, sd1: 5.4, n2: 148, m2: 10.0, sd2: 5.6, r1: 52, r2: 46, rob: ['low', 'low', 'low', 'some', 'low'], robOverall: 'some', note: 'SD derived from a reported SE.' },
  { id: 'gal', label: 'Gallagher 2022', scale: 'MADRS', delivery: 'Supervised', n1: 55, m1: 16.2, sd1: 8.0, n2: 57, m2: 19.0, sd2: 8.4, r1: 24, r2: 15, rob: ['low', 'low', 'low', 'low', 'some'], robOverall: 'some', note: 'Mean/SD estimated from median and IQR.' },
  { id: 'had', label: 'Haddad 2023', scale: 'PHQ-9', delivery: 'Supervised', n1: 18, m1: 7.1, sd1: 4.6, n2: 18, m2: 11.3, sd2: 5.1, r1: 9, r2: 3, rob: ['some', 'some', 'low', 'some', 'high'], robOverall: 'high', note: 'Outcome scale changed from the registered protocol.' },
]

export const CASE_OUTCOME_LABELS = { left: 'Favours exercise', right: 'Favours usual care' }
