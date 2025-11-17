import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { CheckCircle2, XCircle, ArrowRight, RefreshCw } from 'lucide-react'
import { mcqQuestions, matchingActivities, screeningScenarios, effectSizeCalculations } from '@/data/assessments'

type AssessmentSection = 'overview' | 'mcq' | 'matching' | 'screening' | 'calculations' | 'plots' | 'grade'

export function Assessment() {
  const [currentSection, setCurrentSection] = useState<AssessmentSection>('overview')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0 })

  // Matching activity state
  const [currentMatchingIndex] = useState(0)
  const [matches, setMatches] = useState<Record<string, string>>({})
  const [showMatchingResult, setShowMatchingResult] = useState(false)

  // Screening state
  const [currentScreeningIndex] = useState(0)
  const [screeningDecision, setScreeningDecision] = useState<'include' | 'exclude' | null>(null)
  const [screeningReason, setScreeningReason] = useState('')
  const [showScreeningResult, setShowScreeningResult] = useState(false)

  // Calculation state
  const [calculationAnswer, setCalculationAnswer] = useState('')
  const [showCalculationResult, setShowCalculationResult] = useState(false)

  const currentQuestion = mcqQuestions[currentQuestionIndex]
  const currentMatching = matchingActivities[currentMatchingIndex]
  const currentScreening = screeningScenarios[currentScreeningIndex]
  const currentCalculation = effectSizeCalculations[0]

  const handleMCQSubmit = () => {
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }))
    setShowResult(true)
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < mcqQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer('')
      setShowResult(false)
    }
  }

  const handleMatchingSubmit = () => {
    setShowMatchingResult(true)
  }

  const checkMatching = () => {
    let correct = 0
    currentMatching.rightColumn.forEach(item => {
      if (matches[item.id] === item.matchId) correct++
    })
    return { correct, total: currentMatching.rightColumn.length }
  }

  const handleScreeningSubmit = () => {
    setShowScreeningResult(true)
  }

  const handleCalculationSubmit = () => {
    setShowCalculationResult(true)
  }

  const resetSection = () => {
    setCurrentQuestionIndex(0)
    setSelectedAnswer('')
    setShowResult(false)
    setScore({ correct: 0, total: 0 })
    setMatches({})
    setShowMatchingResult(false)
    setScreeningDecision(null)
    setScreeningReason('')
    setShowScreeningResult(false)
    setCalculationAnswer('')
    setShowCalculationResult(false)
  }

  if (currentSection === 'overview') {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Assessment Hub</h1>
          <p className="text-muted-foreground text-lg">
            Test your knowledge and mastery of systematic review methodology through interactive exercises
          </p>
        </div>

        {score.total > 0 && (
          <Card className="border-primary">
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {score.correct} / {score.total} correct
                <span className="text-lg font-normal text-muted-foreground ml-2">
                  ({Math.round((score.correct / score.total) * 100)}%)
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => {resetSection(); setCurrentSection('mcq')}}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">📝</span>
                Knowledge Checks
              </CardTitle>
              <CardDescription>
                Multiple-choice questions on key concepts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary">{mcqQuestions.length} Questions Available</Badge>
              <p className="text-sm text-muted-foreground mt-2">
                Test your understanding of PICO, RoB tools, meta-analysis, GRADE, and more
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => {resetSection(); setCurrentSection('matching')}}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🔄</span>
                Matching Activities
              </CardTitle>
              <CardDescription>
                Match study designs to appropriate RoB tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary">{matchingActivities.length} Activities Available</Badge>
              <p className="text-sm text-muted-foreground mt-2">
                Practice pairing concepts, tools, and methodological elements
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => {resetSection(); setCurrentSection('screening')}}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🎭</span>
                Screening Scenarios
              </CardTitle>
              <CardDescription>
                Practice making inclusion/exclusion decisions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary">{screeningScenarios.length} Scenarios Available</Badge>
              <p className="text-sm text-muted-foreground mt-2">
                Apply PICO criteria to make screening decisions with rationale
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => {resetSection(); setCurrentSection('calculations')}}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🧮</span>
                Effect Size Calculations
              </CardTitle>
              <CardDescription>
                Calculate and interpret effect sizes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary">Practice Problems</Badge>
              <p className="text-sm text-muted-foreground mt-2">
                Work through MD, SMD, RR, OR calculations step-by-step
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setCurrentSection('plots')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">📊</span>
                Plot Interpretation
              </CardTitle>
              <CardDescription>
                Interpret forest and funnel plots
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary">Interactive Examples</Badge>
              <p className="text-sm text-muted-foreground mt-2">
                Learn to read heterogeneity, effect sizes, and publication bias
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setCurrentSection('grade')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">⭐</span>
                GRADE Exercises
              </CardTitle>
              <CardDescription>
                Practice certainty of evidence ratings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary">Guided Practice</Badge>
              <p className="text-sm text-muted-foreground mt-2">
                Apply GRADE domains to rate evidence certainty
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (currentSection === 'mcq') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Button variant="ghost" onClick={() => setCurrentSection('overview')}>
              ← Back to Assessment Hub
            </Button>
            <h1 className="text-3xl font-bold mt-2">Knowledge Check</h1>
          </div>
          <Badge variant="outline">
            Question {currentQuestionIndex + 1} of {mcqQuestions.length}
          </Badge>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="secondary">{currentQuestion.module}</Badge>
              <Badge variant={
                currentQuestion.difficulty === 'beginner' ? 'outline' :
                currentQuestion.difficulty === 'intermediate' ? 'secondary' : 'default'
              }>
                {currentQuestion.difficulty}
              </Badge>
            </div>
            <CardTitle className="mt-4">{currentQuestion.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentQuestion.options?.map((option, index) => (
              <div
                key={index}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedAnswer === option
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                } ${
                  showResult && option === currentQuestion.correctAnswer
                    ? 'border-green-500 bg-green-500/10'
                    : showResult && selectedAnswer === option && option !== currentQuestion.correctAnswer
                    ? 'border-red-500 bg-red-500/10'
                    : ''
                }`}
                onClick={() => !showResult && setSelectedAnswer(option)}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {showResult && option === currentQuestion.correctAnswer && (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  )}
                  {showResult && selectedAnswer === option && option !== currentQuestion.correctAnswer && (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
              </div>
            ))}

            {!showResult && selectedAnswer && (
              <Button onClick={handleMCQSubmit} className="w-full" size="lg">
                Submit Answer
              </Button>
            )}

            {showResult && (
              <div className="space-y-4">
                <Card className={selectedAnswer === currentQuestion.correctAnswer ? 'border-green-500' : 'border-orange-500'}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {selectedAnswer === currentQuestion.correctAnswer ? (
                        <>
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                          Correct!
                        </>
                      ) : (
                        <>
                          <XCircle className="h-5 w-5 text-orange-500" />
                          Incorrect
                        </>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{currentQuestion.rationale}</p>
                  </CardContent>
                </Card>

                {currentQuestionIndex < mcqQuestions.length - 1 ? (
                  <Button onClick={handleNextQuestion} className="w-full" size="lg">
                    Next Question <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Card className="border-primary">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <h3 className="text-2xl font-bold mb-2">Quiz Complete!</h3>
                          <p className="text-xl">
                            Final Score: {score.correct} / {score.total}
                            ({Math.round((score.correct / score.total) * 100)}%)
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    <Button onClick={resetSection} variant="outline" className="w-full">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Restart Quiz
                    </Button>
                    <Button onClick={() => setCurrentSection('overview')} className="w-full">
                      Return to Assessment Hub
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (currentSection === 'matching') {
    const matchingScore = showMatchingResult ? checkMatching() : null

    return (
      <div className="space-y-6">
        <div>
          <Button variant="ghost" onClick={() => setCurrentSection('overview')}>
            ← Back to Assessment Hub
          </Button>
          <h1 className="text-3xl font-bold mt-2">Matching Activity</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{currentMatching.title}</CardTitle>
            <CardDescription>
              Click items on the left, then click the matching item on the right
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                {currentMatching.leftColumn.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 border-2 rounded-lg bg-muted"
                  >
                    {item.text}
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                {currentMatching.rightColumn.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      showMatchingResult
                        ? matches[item.id] === item.matchId
                          ? 'border-green-500 bg-green-500/10'
                          : 'border-red-500 bg-red-500/10'
                        : 'border-border hover:border-primary bg-background'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{item.text}</span>
                      {showMatchingResult && (
                        matches[item.id] === item.matchId ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {!showMatchingResult && (
                <Button onClick={handleMatchingSubmit} className="w-full" size="lg">
                  Check Answers
                </Button>
              )}

              {showMatchingResult && matchingScore && (
                <div className="space-y-2">
                  <Card className={matchingScore.correct === matchingScore.total ? 'border-green-500' : 'border-orange-500'}>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <h3 className="text-xl font-bold mb-2">
                          Score: {matchingScore.correct} / {matchingScore.total}
                        </h3>
                        {matchingScore.correct === matchingScore.total && (
                          <p className="text-green-600">Perfect! All matches correct.</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  <Button onClick={resetSection} variant="outline" className="w-full">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                  </Button>
                  <Button onClick={() => setCurrentSection('overview')} className="w-full">
                    Return to Assessment Hub
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (currentSection === 'screening') {
    const isCorrect = showScreeningResult &&
      screeningDecision === currentScreening.correctDecision

    return (
      <div className="space-y-6">
        <div>
          <Button variant="ghost" onClick={() => setCurrentSection('overview')}>
            ← Back to Assessment Hub
          </Button>
          <h1 className="text-3xl font-bold mt-2">Screening Scenario</h1>
        </div>

        <Card className="border-primary">
          <CardHeader>
            <CardTitle>PICO Criteria for This Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <span className="font-semibold">Population:</span> {currentScreening.picoCriteria.population}
              </div>
              <div>
                <span className="font-semibold">Intervention:</span> {currentScreening.picoCriteria.intervention}
              </div>
              <div>
                <span className="font-semibold">Comparison:</span> {currentScreening.picoCriteria.comparison}
              </div>
              <div>
                <span className="font-semibold">Outcome:</span> {currentScreening.picoCriteria.outcome}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Citation to Screen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{currentScreening.citation.title}</h3>
              <p className="text-sm text-muted-foreground">
                {currentScreening.citation.authors} ({currentScreening.citation.year})
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Abstract:</h4>
              <p className="text-sm">{currentScreening.citation.abstract}</p>
            </div>

            <div className="space-y-4 pt-4">
              <h4 className="font-semibold">Your Decision:</h4>
              <div className="flex gap-4">
                <Button
                  variant={screeningDecision === 'include' ? 'default' : 'outline'}
                  onClick={() => setScreeningDecision('include')}
                  disabled={showScreeningResult}
                  className="flex-1"
                >
                  Include
                </Button>
                <Button
                  variant={screeningDecision === 'exclude' ? 'default' : 'outline'}
                  onClick={() => setScreeningDecision('exclude')}
                  disabled={showScreeningResult}
                  className="flex-1"
                >
                  Exclude
                </Button>
              </div>

              {screeningDecision === 'exclude' && !showScreeningResult && (
                <div>
                  <label className="text-sm font-medium">Reason for Exclusion:</label>
                  <Input
                    placeholder="e.g., Wrong population"
                    value={screeningReason}
                    onChange={(e) => setScreeningReason(e.target.value)}
                    className="mt-2"
                  />
                </div>
              )}

              {!showScreeningResult && screeningDecision && (
                <Button onClick={handleScreeningSubmit} className="w-full" size="lg">
                  Submit Decision
                </Button>
              )}

              {showScreeningResult && (
                <div className="space-y-4">
                  <Card className={isCorrect ? 'border-green-500' : 'border-orange-500'}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {isCorrect ? (
                          <>
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                            Correct Decision!
                          </>
                        ) : (
                          <>
                            <XCircle className="h-5 w-5 text-orange-500" />
                            Incorrect Decision
                          </>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="font-semibold mb-2">
                        Correct Decision: {currentScreening.correctDecision}
                      </p>
                      <p className="font-semibold mb-2">
                        Reason: {currentScreening.correctReason}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {currentScreening.explanation}
                      </p>
                    </CardContent>
                  </Card>
                  <Button onClick={() => setCurrentSection('overview')} className="w-full">
                    Return to Assessment Hub
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (currentSection === 'calculations') {
    const isCorrect = showCalculationResult &&
      Math.abs(parseFloat(calculationAnswer) - parseFloat(currentCalculation.correctAnswer)) < 0.01

    return (
      <div className="space-y-6">
        <div>
          <Button variant="ghost" onClick={() => setCurrentSection('overview')}>
            ← Back to Assessment Hub
          </Button>
          <h1 className="text-3xl font-bold mt-2">Effect Size Calculation</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{currentCalculation.scenario}</CardTitle>
            <CardDescription>{currentCalculation.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Intervention Group:</h4>
                  <ul className="text-sm space-y-1">
                    <li>Mean: {currentCalculation.data.intervention.mean}</li>
                    <li>SD: {currentCalculation.data.intervention.sd}</li>
                    <li>n: {currentCalculation.data.intervention.n}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Control Group:</h4>
                  <ul className="text-sm space-y-1">
                    <li>Mean: {currentCalculation.data.control.mean}</li>
                    <li>SD: {currentCalculation.data.control.sd}</li>
                    <li>n: {currentCalculation.data.control.n}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">{currentCalculation.question}</label>
              <div className="flex gap-2 mt-2">
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Enter your answer"
                  value={calculationAnswer}
                  onChange={(e) => setCalculationAnswer(e.target.value)}
                  disabled={showCalculationResult}
                />
                <span className="flex items-center text-sm text-muted-foreground">
                  {currentCalculation.unit}
                </span>
              </div>
            </div>

            {!showCalculationResult && calculationAnswer && (
              <Button onClick={handleCalculationSubmit} className="w-full" size="lg">
                Check Answer
              </Button>
            )}

            {showCalculationResult && (
              <div className="space-y-4">
                <Card className={isCorrect ? 'border-green-500' : 'border-orange-500'}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                          Correct!
                        </>
                      ) : (
                        <>
                          <XCircle className="h-5 w-5 text-orange-500" />
                          Not Quite
                        </>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-semibold mb-2">
                      Correct Answer: {currentCalculation.correctAnswer} {currentCalculation.unit}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {currentCalculation.explanation}
                    </p>
                  </CardContent>
                </Card>
                <Button onClick={() => setCurrentSection('overview')} className="w-full">
                  Return to Assessment Hub
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (currentSection === 'plots') {
    return (
      <div className="space-y-6">
        <div>
          <Button variant="ghost" onClick={() => setCurrentSection('overview')}>
            ← Back to Assessment Hub
          </Button>
          <h1 className="text-3xl font-bold mt-2">Plot Interpretation</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Forest Plot Interpretation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Forest plots are visual displays of meta-analysis results. Key elements to interpret:
            </p>
            <ul className="space-y-2">
              <li>• <strong>Effect size:</strong> The position of the square (point estimate)</li>
              <li>• <strong>Confidence interval:</strong> The horizontal line through the square</li>
              <li>• <strong>Study weight:</strong> Size of the square indicates relative weight</li>
              <li>• <strong>Line of no effect:</strong> Vertical line at 0 (for differences) or 1 (for ratios)</li>
              <li>• <strong>Diamond:</strong> Pooled effect with 95% CI</li>
              <li>• <strong>Heterogeneity:</strong> I² and τ² statistics show variation between studies</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Funnel Plot Interpretation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Funnel plots assess publication bias by plotting effect size vs. precision:
            </p>
            <ul className="space-y-2">
              <li>• <strong>Symmetry:</strong> Symmetric inverted funnel suggests no publication bias</li>
              <li>• <strong>Asymmetry:</strong> Missing small negative studies may indicate bias</li>
              <li>• <strong>Precision:</strong> Y-axis shows standard error (larger studies at top)</li>
              <li>• <strong>Caution:</strong> Asymmetry can also result from heterogeneity or chance</li>
              <li>• <strong>Egger test:</strong> Statistical test for funnel plot asymmetry</li>
            </ul>
          </CardContent>
        </Card>

        <Button onClick={() => setCurrentSection('overview')} className="w-full">
          Return to Assessment Hub
        </Button>
      </div>
    )
  }

  if (currentSection === 'grade') {
    return (
      <div className="space-y-6">
        <div>
          <Button variant="ghost" onClick={() => setCurrentSection('overview')}>
            ← Back to Assessment Hub
          </Button>
          <h1 className="text-3xl font-bold mt-2">GRADE Exercise</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>GRADE Certainty Assessment Practice</CardTitle>
            <CardDescription>
              Rate the certainty of evidence considering all GRADE domains
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Scenario:</h3>
              <p className="text-sm">
                You are assessing evidence for the effect of exercise on depression. You have included
                5 randomized controlled trials (n=850 total participants). The pooled effect shows
                a significant reduction in depression scores (SMD = -0.62, 95% CI: -0.85 to -0.39).
                However, I² = 68%, indicating substantial heterogeneity. Two studies had high risk
                of bias due to lack of blinding.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">1. Starting Rating</h4>
                <p className="text-sm text-muted-foreground">
                  RCTs start at: <Badge variant="default">High</Badge>
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">2. Risk of Bias</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Two studies have high risk of bias due to lack of blinding
                </p>
                <Badge variant="destructive">Downgrade by 1 level</Badge>
                <p className="text-sm text-muted-foreground mt-2">
                  Rating now: <Badge>Moderate</Badge>
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">3. Inconsistency</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  I² = 68% indicates substantial heterogeneity
                </p>
                <Badge variant="destructive">Downgrade by 1 level</Badge>
                <p className="text-sm text-muted-foreground mt-2">
                  Rating now: <Badge>Low</Badge>
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">4. Other Domains</h4>
                <ul className="text-sm space-y-1">
                  <li>• <strong>Indirectness:</strong> No concerns</li>
                  <li>• <strong>Imprecision:</strong> No concerns (CI excludes no effect)</li>
                  <li>• <strong>Publication bias:</strong> Suspected but not confirmed</li>
                </ul>
              </div>

              <Card className="border-primary">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-2">Final GRADE Rating:</h3>
                  <Badge variant="secondary" className="text-lg px-4 py-2">Low Certainty</Badge>
                  <p className="text-sm text-muted-foreground mt-4">
                    Interpretation: We have low confidence that the true effect is close to the
                    estimated effect. Further research is likely to change the estimate.
                  </p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Button onClick={() => setCurrentSection('overview')} className="w-full">
          Return to Assessment Hub
        </Button>
      </div>
    )
  }

  return null
}
