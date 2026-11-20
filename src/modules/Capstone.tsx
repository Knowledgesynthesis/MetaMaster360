import { Link } from 'react-router'
import { RotateCcw } from 'lucide-react'
import { Section, Prose, KeyPoints } from '@/components/learn/Section'
import { Button, Callout, Card, CardBody, Badge, buttonClasses } from '@/components/ui'
import { useProgress } from '@/store/progress'
import { modulePath } from '@/content/modules'
import type { ModuleId } from '@/content/types'
import { cn, seededShuffle } from '@/lib/utils'

interface Decision {
  id: string
  module: ModuleId
  stage: string
  q: string
  options: string[]
  answer: number
  feedback: string
}

export const DECISIONS: Decision[] = [
  { id: 'd1', module: 'question', stage: 'Question', q: 'Which framework structures “exercise vs usual care for depressive symptoms in adults with depression”?', options: ['PCC', 'PICO with study design', 'SPIDER', 'PECO'], answer: 1, feedback: 'An intervention-effect question: PICO plus eligible designs (RCTs).' },
  { id: 'd2', module: 'question', stage: 'Question', q: 'Which comparators are eligible?', options: ['Any control, pooled together', 'Usual care or waiting list; attention controls and active treatments excluded (separate questions)', 'Only placebo', 'Decide after seeing the trials'], answer: 1, feedback: 'Pre-specified comparators keep the question coherent; attention controls answer a different question.' },
  { id: 'd3', module: 'search', stage: 'Search', q: 'Which set of sources?', options: ['PubMed only, English only', 'CENTRAL, MEDLINE, Embase, PsycInfo, CINAHL, ClinicalTrials.gov, WHO ICTRP + citation searching', 'Google Scholar first 200 hits', 'Embase only'], answer: 1, feedback: 'Cochrane minimum plus subject databases, registers and citation searching; no language limits.' },
  { id: 'd4', module: 'records', stage: 'Records', q: '14 exported records include 4 duplicates, a conference abstract, a registry entry and an erratum of included trials. How many records go to screening?', options: ['7 — remove duplicates and companion reports', '10 — remove only the 4 duplicate records; link companion reports', '14 — never deduplicate', '8'], answer: 1, feedback: 'Duplicates are removed; companion reports are kept and linked to their study.' },
  { id: 'd5', module: 'screening', stage: 'Screening', q: 'Full text: cardiac-rehabilitation trial where depression was not an inclusion criterion (mean BDI-II 9). Decision?', options: ['Include — depression measured', 'Exclude: wrong population', 'Exclude: wrong outcome', 'Include in a subgroup'], answer: 1, feedback: 'Participants do not meet the population criterion; one reason recorded.' },
  { id: 'd6', module: 'extraction', stage: 'Extraction', q: 'Fujita reports PHQ-9 9.4 ± 0.44 (mean ± SEM), n = 150. Which SD?', options: ['0.44', '5.39', '0.04', '9.4'], answer: 1, feedback: 'SD = SE × √n = 0.44 × √150 ≈ 5.39.' },
  { id: 'd7', module: 'extraction', stage: 'Extraction', q: 'Dimitrov has aerobic, resistance and usual-care arms. How do you enter it?', options: ['Two rows, each vs the full control group', 'Combine both exercise arms into one group vs usual care', 'Keep the bigger effect', 'Exclude it'], answer: 1, feedback: 'Combining avoids double counting the shared control group.' },
  { id: 'd8', module: 'risk-of-bias', stage: 'Risk of bias', q: 'Brennan allocated participants by alternation. RoB 2 domain 1?', options: ['Low', 'Some concerns', 'High', 'Not applicable'], answer: 2, feedback: 'Alternation is not concealed → high risk in domain 1, so high overall.' },
  { id: 'd9', module: 'effect-measures', stage: 'Effect measure', q: 'Trials used HAM-D, MADRS, BDI-II and PHQ-9. Effect measure?', options: ['Mean difference', 'SMD (Hedges’ g)', 'Odds ratio', 'Hazard ratio'], answer: 1, feedback: 'Different instruments for one construct → SMD; re-express in PHQ-9 points for readers.' },
  { id: 'd10', module: 'meta-analysis', stage: 'Model', q: 'Which analysis plan matches current Cochrane methods?', options: ['Common-effect, because I² is only 34%', 'Random-effects with REML τ², HKSJ CI (τ² > 0, k = 8) and a prediction interval', 'DerSimonian–Laird with Wald CI only', 'No pooling'], answer: 1, feedback: 'Pre-specified random effects; REML; HKSJ when τ² > 0 and k > 2; show the PI. Result: SMD −0.35 (−0.56 to −0.14), PI −0.75 to 0.05.' },
  { id: 'd11', module: 'reporting-bias', stage: 'Missing evidence', q: 'Eight trials; the smallest show the largest effects. What do you do?', options: ['Run Egger’s test and report p', 'No formal test (k < 10); describe the small-study pattern, link to RoB, check registries; ROB-ME', 'Trim-and-fill and report the adjusted estimate as the result', 'Nothing'], answer: 1, feedback: 'Tests are uninformative below 10 studies; registry evidence of two unpublished trials and the small-study pattern support suspected publication bias.' },
  { id: 'd12', module: 'grade', stage: 'Certainty', q: 'GRADE for depressive symptoms (target: any benefit)?', options: ['High', 'Moderate', 'Low — rated down for risk of bias and publication bias', 'Very low'], answer: 2, feedback: 'Start high; −1 risk of bias; −1 publication bias; CI excludes the null so no imprecision downgrade for this target.' },
  { id: 'd13', module: 'sof', stage: 'Conclusion', q: 'Which conclusion would you publish?', options: ['“Exercise is an effective antidepressant treatment.”', '“Exercise may reduce depressive symptoms slightly compared with usual care (SMD −0.35, 95% CI −0.56 to −0.14; ≈ 1.9 PHQ-9 points; low-certainty evidence). Effects were smaller in trials at lower risk of bias.”', '“Exercise does not work.”', '“All patients should exercise.”'], answer: 1, feedback: 'Effect, precision, clinical units, certainty wording and the key limitation — no spin.' },
]

export default function Capstone() {
  const answers = useProgress((s) => s.capstone)
  const set = useProgress((s) => s.setCapstone)
  const reset = useProgress((s) => s.resetCapstone)
  const answered = DECISIONS.filter((d) => answers[d.id] !== undefined)
  const correct = DECISIONS.filter((d) => answers[d.id] === d.answer).length
  return (
    <>
      <Section id="brief" title="The brief">
        <Prose>
          <p>A guideline panel asks: <em>in adults with depression, does structured exercise reduce depressive symptoms compared with usual care?</em> You have the synthetic evidence used throughout this course. Make each decision; feedback appears immediately and your answers are saved on this device. Every decision links to the module that teaches it.</p>
        </Prose>
      </Section>

      <Section id="decisions" title="Thirteen decisions">
        <div className="space-y-3">
          {DECISIONS.map((d, i) => {
            const a = answers[d.id]
            const done = a !== undefined
            return (
              <Card key={d.id} className={cn(done && (a === d.answer ? 'border-good/50' : 'border-bad/50'))}>
                <CardBody className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <Badge tone="primary">{i + 1}. {d.stage}</Badge>
                    <Link to={modulePath(d.module)} className="text-muted underline underline-offset-2 hover:text-fg">review module</Link>
                  </div>
                  <div className="font-medium">{d.q}</div>
                  <div className="grid gap-2">
                    {seededShuffle(d.options.map((o, j) => [o, j] as const), i * 7 + 3).map(([o, j]) => (
                      <button key={j} type="button" onClick={() => set(d.id, j)} aria-pressed={a === j}
                        className={cn('rounded-lg border p-2.5 text-left text-sm transition-colors', a === j ? (j === d.answer ? 'border-good bg-good-soft/60' : 'border-bad bg-bad-soft/60') : done && j === d.answer ? 'border-good/60' : 'border-border hover:border-primary hover:bg-primary-soft/30')}>
                        {o}
                      </button>
                    ))}
                  </div>
                  {done && <div className="text-sm text-fg/85"><span className={cn('font-semibold', a === d.answer ? 'text-good' : 'text-bad')}>{a === d.answer ? 'Correct.' : 'Not quite.'}</span> {d.feedback}</div>}
                </CardBody>
              </Card>
            )
          })}
        </div>
      </Section>

      <Section id="result" title="Your review">
        <Card>
          <CardBody className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-3xl font-bold tabular">{correct} / {DECISIONS.length}</span>
              <span className="text-sm text-muted">{answered.length < DECISIONS.length ? `${DECISIONS.length - answered.length} decisions left` : correct === DECISIONS.length ? 'Every decision defensible — this review would survive peer review.' : 'Revisit the linked modules for the decisions marked in red.'}</span>
            </div>
            {answered.length === DECISIONS.length && (
              <Callout kind="good" title="Abstract you could submit">
                Eight randomized trials (934 participants after adjustment for clustering) compared structured exercise with usual care in adults with
                depression. Exercise may reduce depressive symptoms slightly (SMD −0.35, 95% CI −0.56 to −0.14; 95% prediction interval −0.75 to 0.05;
                low-certainty evidence) and may increase response (RR 1.41, 1.13 to 1.76; 116 more responders per 1000). Effects were smaller in trials
                at lower risk of bias (SMD −0.22), and two completed trials remain unpublished. The evidence is very uncertain about injuries.
              </Callout>
            )}
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={reset}><RotateCcw className="h-4 w-4" />Reset capstone</Button>
              <Link to="/exam" className={buttonClasses('primary', 'md')}>Take the mastery exam</Link>
            </div>
          </CardBody>
        </Card>
      </Section>

      <KeyPoints title="What the capstone tests" items={[
        'Coherence: each decision constrains the next — the question fixes eligibility, eligibility fixes data, data fix the model.',
        'Defensibility: every choice traceable to current guidance.',
        'Honesty: conclusions that match effect size, precision and certainty.',
      ]} />
    </>
  )
}
