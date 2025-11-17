import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useAppStore } from '@/stores/appStore'
import { CheckCircle2, Lightbulb } from 'lucide-react'

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

  const handleGenerate = () => {
    const { population, intervention, comparison, outcome } = pico
    if (population && intervention && outcome) {
      let question = `In ${population}, does ${intervention}`
      if (comparison) {
        question += ` compared to ${comparison}`
      }
      question += ` affect ${outcome}?`
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
      studyDesign: 'RCT'
    },
    {
      population: 'patients with major depressive disorder',
      intervention: 'cognitive behavioral therapy',
      comparison: 'usual care',
      outcome: 'depression symptoms',
      studyDesign: 'RCT'
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
        <p className="text-muted-foreground">
          Learn to construct clear, focused research questions using the PICO framework
        </p>
      </div>

      {/* Learning Objectives */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Objectives</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              Understand the components of PICO (Population, Intervention, Comparison, Outcome)
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              Apply PICO framework to formulate answerable clinical questions
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              Recognize when to use PEO (Population, Exposure, Outcome) instead
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              Define clear eligibility criteria based on PICO elements
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Theory */}
      <Card>
        <CardHeader>
          <CardTitle>What is PICO?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            PICO is a framework that helps researchers formulate focused, answerable
            clinical questions for systematic reviews. Each letter represents a key
            component:
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="font-semibold">P - Population</h3>
              <p className="text-sm text-muted-foreground">
                Who are the patients or subjects? Define age, gender, condition,
                severity, etc.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">I - Intervention</h3>
              <p className="text-sm text-muted-foreground">
                What is the treatment, diagnostic test, exposure, or prognostic
                factor of interest?
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">C - Comparison</h3>
              <p className="text-sm text-muted-foreground">
                What is the alternative or control? May be placebo, usual care, or
                another intervention.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">O - Outcome</h3>
              <p className="text-sm text-muted-foreground">
                What are you trying to measure or achieve? Should be specific and
                measurable.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive PICO Builder */}
      <Card>
        <CardHeader>
          <CardTitle>Build Your PICO Question</CardTitle>
          <CardDescription>
            Fill in each component to generate a well-structured research question
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Population <span className="text-destructive">*</span>
            </label>
            <Input
              placeholder="e.g., adults with hypertension"
              value={pico.population}
              onChange={(e) => setPico({ ...pico, population: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Intervention <span className="text-destructive">*</span>
            </label>
            <Input
              placeholder="e.g., mindfulness meditation"
              value={pico.intervention}
              onChange={(e) => setPico({ ...pico, intervention: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Comparison (optional)</label>
            <Input
              placeholder="e.g., usual care"
              value={pico.comparison}
              onChange={(e) => setPico({ ...pico, comparison: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Outcome <span className="text-destructive">*</span>
            </label>
            <Input
              placeholder="e.g., systolic blood pressure"
              value={pico.outcome}
              onChange={(e) => setPico({ ...pico, outcome: e.target.value })}
            />
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
            </Select>
          </div>

          <Button onClick={handleGenerate} className="w-full">
            Generate Research Question
          </Button>

          {generatedQuestion && (
            <div className="p-4 bg-primary/10 rounded-lg border-2 border-primary">
              <p className="font-medium mb-2">Your Research Question:</p>
              <p className="text-lg">{generatedQuestion}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Examples */}
      {showHints && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Example PICO Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {examplePICOs.map((example, index) => (
              <div key={index} className="p-4 bg-muted rounded-lg space-y-2">
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPico(example)}
                >
                  Load This Example
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Complete Module */}
      {generatedQuestion && !isComplete && (
        <Card className="border-primary">
          <CardContent className="pt-6">
            <Button onClick={handleComplete} className="w-full" size="lg">
              Mark Module as Complete
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
