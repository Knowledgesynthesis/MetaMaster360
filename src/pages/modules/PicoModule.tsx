import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useAppStore } from '@/stores/appStore'
import { CheckCircle2, Lightbulb, AlertCircle, BookOpen } from 'lucide-react'

export function PicoModule() {
  const { markModuleComplete, isModuleComplete, showHints } = useAppStore()
  const isComplete = isModuleComplete('pico')

  const [pico, setPico] = useState({
    population: '',
    intervention: '',
    comparison: '',
    outcome: '',
    studyDesign: ''
  })

  const [generatedQuestion, setGeneratedQuestion] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleGenerate = () => {
    const { population, intervention, comparison, outcome, studyDesign } = pico
    if (population && intervention && outcome) {
      let question = `In ${population}, does ${intervention}`
      if (comparison) {
        question += ` compared to ${comparison}`
      }
      question += ` affect ${outcome}?`
      if (studyDesign) {
        question += ` (Study design: ${studyDesign})`
      }
      setGeneratedQuestion(question)
    }
  }

  const handleComplete = () => {
    if (generatedQuestion) {
      markModuleComplete('pico')
    }
  }

  const examplePICOs = [
    {
      population: 'adults with type 2 diabetes',
      intervention: 'metformin',
      comparison: 'placebo',
      outcome: 'HbA1c levels',
      studyDesign: 'RCT',
      context: 'Intervention question about medication effectiveness'
    },
    {
      population: 'patients with major depressive disorder',
      intervention: 'cognitive behavioral therapy',
      comparison: 'usual care',
      outcome: 'depression symptoms',
      studyDesign: 'RCT',
      context: 'Intervention question about psychotherapy'
    },
    {
      population: 'elderly patients with hip fractures',
      intervention: 'early mobilization',
      comparison: 'standard care',
      outcome: 'functional recovery',
      studyDesign: 'cohort',
      context: 'Rehabilitation intervention effectiveness'
    },
    {
      population: 'pregnant women',
      intervention: 'folic acid supplementation',
      comparison: 'no supplementation',
      outcome: 'neural tube defects',
      studyDesign: 'RCT',
      context: 'Prevention question'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Framing the Research Question</h1>
          {isComplete && (
            <Badge variant="success" className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" />
              Completed
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground text-lg">
          Learn to construct clear, focused research questions using the PICO/PEO framework - the foundation of every systematic review
        </p>
      </div>

      {/* Learning Objectives */}
      <Card className="border-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Learning Objectives
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="mr-2 text-primary">•</span>
              <span>Understand the components of PICO (Population, Intervention, Comparison, Outcome) and when to use it</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-primary">•</span>
              <span>Apply PICO framework to formulate answerable, focused clinical questions</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-primary">•</span>
              <span>Recognize when to use PEO (Population, Exposure, Outcome) for observational studies</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-primary">•</span>
              <span>Define clear, specific eligibility criteria based on PICO elements</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-primary">•</span>
              <span>Avoid common pitfalls in research question formulation</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Why PICO Matters */}
      <Card>
        <CardHeader>
          <CardTitle>Why PICO Matters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            A well-formulated research question is the cornerstone of a successful systematic review.
            The PICO framework ensures your question is:
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="p-4 border rounded-lg bg-muted/50">
              <h3 className="font-semibold mb-2">✓ Focused</h3>
              <p className="text-sm text-muted-foreground">
                Clearly defined parameters prevent scope creep and ensure reviewability
              </p>
            </div>
            <div className="p-4 border rounded-lg bg-muted/50">
              <h3 className="font-semibold mb-2">✓ Answerable</h3>
              <p className="text-sm text-muted-foreground">
                Structured to be addressed through systematic literature search
              </p>
            </div>
            <div className="p-4 border rounded-lg bg-muted/50">
              <h3 className="font-semibold mb-2">✓ Searchable</h3>
              <p className="text-sm text-muted-foreground">
                Each component translates directly into search terms
              </p>
            </div>
            <div className="p-4 border rounded-lg bg-muted/50">
              <h3 className="font-semibold mb-2">✓ Reproducible</h3>
              <p className="text-sm text-muted-foreground">
                Clear definitions enable independent reviewers to apply criteria consistently
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed PICO Theory */}
      <Card>
        <CardHeader>
          <CardTitle>Understanding Each PICO Component</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                P
              </div>
              <h3 className="text-lg font-semibold">Population</h3>
            </div>
            <p className="text-muted-foreground">
              Who are the patients or subjects of interest? Be as specific as necessary:
            </p>
            <ul className="ml-6 space-y-1 text-sm">
              <li>• <strong>Demographics:</strong> Age, gender, ethnicity</li>
              <li>• <strong>Condition:</strong> Specific disease, diagnosis criteria, severity</li>
              <li>• <strong>Setting:</strong> Hospital, community, primary care</li>
              <li>• <strong>Exclude:</strong> Specify who is NOT included</li>
            </ul>
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-sm">
                <strong>Example:</strong> "Adults aged 18-65 with diagnosed major depressive disorder
                (DSM-5 criteria), currently untreated, excluding those with bipolar disorder or active psychosis"
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                I
              </div>
              <h3 className="text-lg font-semibold">Intervention (or Exposure)</h3>
            </div>
            <p className="text-muted-foreground">
              What is the treatment, diagnostic test, exposure, or prognostic factor?
            </p>
            <ul className="ml-6 space-y-1 text-sm">
              <li>• <strong>Interventions:</strong> Drugs, procedures, programs, devices</li>
              <li>• <strong>Exposures:</strong> Risk factors, environmental factors</li>
              <li>• <strong>Diagnostic tests:</strong> Screening tools, imaging</li>
              <li>• <strong>Specificity:</strong> Dose, duration, delivery method</li>
            </ul>
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-sm">
                <strong>Example:</strong> "Cognitive behavioral therapy (CBT), delivered in 12 weekly
                sessions of 60 minutes each, by licensed therapists"
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                C
              </div>
              <h3 className="text-lg font-semibold">Comparison</h3>
            </div>
            <p className="text-muted-foreground">
              What is the alternative? (This may be absent in some questions)
            </p>
            <ul className="ml-6 space-y-1 text-sm">
              <li>• <strong>Placebo:</strong> Inert control</li>
              <li>• <strong>Standard care:</strong> Current treatment practice</li>
              <li>• <strong>Alternative intervention:</strong> Another active treatment</li>
              <li>• <strong>No intervention:</strong> Watchful waiting</li>
            </ul>
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-sm">
                <strong>Example:</strong> "Standard care (medication management with psychiatrist visits
                every 4 weeks)"
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                O
              </div>
              <h3 className="text-lg font-semibold">Outcome</h3>
            </div>
            <p className="text-muted-foreground">
              What are you trying to measure or achieve? Should be specific and measurable.
            </p>
            <ul className="ml-6 space-y-1 text-sm">
              <li>• <strong>Primary outcomes:</strong> Main endpoints of interest</li>
              <li>• <strong>Secondary outcomes:</strong> Additional measures</li>
              <li>• <strong>Measurement:</strong> Validated scales, objective measures</li>
              <li>• <strong>Timing:</strong> When measured (e.g., at 6 months)</li>
            </ul>
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-sm">
                <strong>Example:</strong> "Change in depressive symptoms measured by Beck Depression
                Inventory-II (BDI-II) at 12 weeks post-intervention"
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PICO vs PEO */}
      <Card>
        <CardHeader>
          <CardTitle>PICO vs PEO: When to Use Which?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 border-2 border-primary rounded-lg">
              <h3 className="font-semibold mb-2">Use PICO for:</h3>
              <ul className="space-y-1 text-sm">
                <li>✓ Intervention studies</li>
                <li>✓ Randomized controlled trials</li>
                <li>✓ Treatment effectiveness questions</li>
                <li>✓ Comparative studies</li>
              </ul>
            </div>
            <div className="p-4 border-2 border-secondary rounded-lg">
              <h3 className="font-semibold mb-2">Use PEO for:</h3>
              <ul className="space-y-1 text-sm">
                <li>✓ Observational studies</li>
                <li>✓ Prognosis questions</li>
                <li>✓ Etiology/causation</li>
                <li>✓ Qualitative research</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive PICO Builder */}
      <Card className="border-2 border-primary">
        <CardHeader>
          <CardTitle>Interactive PICO Builder</CardTitle>
          <CardDescription>
            Fill in each component below to generate a well-structured research question
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                P
              </div>
              Population <span className="text-destructive">*</span>
            </label>
            <Input
              placeholder="e.g., adults aged 40-75 with hypertension"
              value={pico.population}
              onChange={(e) => setPico({ ...pico, population: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Tip: Include age, condition, and any important characteristics
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                I
              </div>
              Intervention <span className="text-destructive">*</span>
            </label>
            <Input
              placeholder="e.g., mindfulness-based stress reduction program"
              value={pico.intervention}
              onChange={(e) => setPico({ ...pico, intervention: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Tip: Be specific about dose, duration, or delivery method
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                C
              </div>
              Comparison (optional)
            </label>
            <Input
              placeholder="e.g., standard care"
              value={pico.comparison}
              onChange={(e) => setPico({ ...pico, comparison: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Tip: Specify placebo, usual care, or alternative treatment
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                O
              </div>
              Outcome <span className="text-destructive">*</span>
            </label>
            <Input
              placeholder="e.g., reduction in systolic blood pressure"
              value={pico.outcome}
              onChange={(e) => setPico({ ...pico, outcome: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Tip: Include how it's measured and when
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Study Design (optional)</label>
            <Select
              value={pico.studyDesign}
              onChange={(e) => setPico({ ...pico, studyDesign: e.target.value })}
            >
              <option value="">Any study design</option>
              <option value="RCT">Randomized Controlled Trials</option>
              <option value="cohort">Cohort Studies</option>
              <option value="case-control">Case-Control Studies</option>
              <option value="cross-sectional">Cross-Sectional Studies</option>
              <option value="qualitative">Qualitative Studies</option>
            </Select>
          </div>

          <Button onClick={handleGenerate} className="w-full" size="lg">
            Generate Research Question
          </Button>

          {generatedQuestion && (
            <div className="p-4 bg-primary/10 rounded-lg border-2 border-primary">
              <p className="font-medium mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Your Research Question:
              </p>
              <p className="text-lg">{generatedQuestion}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Common Pitfalls */}
      <Card className="border-orange-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            Common Pitfalls to Avoid
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <h4 className="font-semibold text-sm mb-1">❌ Too Broad</h4>
              <p className="text-sm text-muted-foreground">
                "Does exercise help people?" → Too vague, undefined population and outcome
              </p>
            </div>
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <h4 className="font-semibold text-sm mb-1">❌ Too Narrow</h4>
              <p className="text-sm text-muted-foreground">
                "Does 150mg sertraline improve HAM-D scores by exactly 5 points in 45-year-old males?"
                → Unrealistically specific
              </p>
            </div>
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <h4 className="font-semibold text-sm mb-1">❌ Vague Outcomes</h4>
              <p className="text-sm text-muted-foreground">
                "...improve quality of life" → How measured? Need specific instruments
              </p>
            </div>
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <h4 className="font-semibold text-sm mb-1">❌ Multiple Questions</h4>
              <p className="text-sm text-muted-foreground">
                "Does intervention X affect outcome Y and also prevent complication Z?"
                → Should be separate questions
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Example PICOs */}
      {showHints && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Example PICO Questions
            </CardTitle>
            <CardDescription>
              Click to load an example and see how PICO components work together
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {examplePICOs.map((example, index) => (
              <div key={index} className="p-4 bg-muted rounded-lg space-y-3 border">
                <div className="flex items-start justify-between">
                  <div>
                    <Badge variant="outline" className="mb-2">{example.context}</Badge>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-semibold">P:</span> {example.population}
                      </div>
                      <div>
                        <span className="font-semibold">I:</span> {example.intervention}
                      </div>
                      <div>
                        <span className="font-semibold">C:</span> {example.comparison}
                      </div>
                      <div>
                        <span className="font-semibold">O:</span> {example.outcome}
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPico(example)}
                  className="w-full"
                >
                  Load This Example
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Advanced Tips */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Button
              variant="ghost"
              className="w-full justify-between"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              Advanced Tips for Expert Reviews
              <span>{showAdvanced ? '▼' : '▶'}</span>
            </Button>
          </CardTitle>
        </CardHeader>
        {showAdvanced && (
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">1. Consider Multiple Outcomes</h4>
              <p className="text-sm text-muted-foreground">
                Systematic reviews typically include both primary (efficacy) and secondary
                (safety, quality of life) outcomes. Define all upfront in your protocol.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">2. Time Considerations</h4>
              <p className="text-sm text-muted-foreground">
                Specify when outcomes should be measured (e.g., "at 6 months follow-up").
                This affects both eligibility and synthesis.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">3. Nested Comparisons</h4>
              <p className="text-sm text-muted-foreground">
                For network meta-analyses, you may compare multiple interventions.
                Start with a clear primary comparison.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">4. Prognostic Questions</h4>
              <p className="text-sm text-muted-foreground">
                For prognosis reviews, "I" becomes prognostic factor, and you may not need "C".
                Example: "In stroke patients (P), does diabetes (I) predict mortality (O)?"
              </p>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Complete Module */}
      {generatedQuestion && !isComplete && (
        <Card className="border-primary">
          <CardContent className="pt-6">
            <Button onClick={handleComplete} className="w-full" size="lg">
              <CheckCircle2 className="mr-2 h-5 w-5" />
              Mark Module as Complete
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
