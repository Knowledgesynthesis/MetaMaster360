import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

export function About() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">About MetaMaster360</h1>
        <p className="text-xl text-muted-foreground">
          Your comprehensive platform for learning systematic review and meta-analysis
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mission</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            MetaMaster360 is designed to teach clinicians, researchers, and students
            everything they need to know to perform rigorous systematic reviews and
            meta-analyses. From question formulation to manuscript preparation, we
            provide a complete, interactive learning experience.
          </p>
          <p>
            Our platform supports learners at all levels—from medical students to
            faculty—with evidence-based, methodologically sound content aligned with
            international standards.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Key Features</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="mr-2">🎯</span>
              <div>
                <strong>Evidence-Based Content:</strong> Aligned with PRISMA 2020,
                Cochrane Handbook, and GRADE guidelines
              </div>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🧮</span>
              <div>
                <strong>Interactive Tools:</strong> PICO builders, forest plots,
                funnel plots, and meta-analysis calculators
              </div>
            </li>
            <li className="flex items-start">
              <span className="mr-2">📚</span>
              <div>
                <strong>Synthetic Data:</strong> Safe, educationally-focused datasets
                that never use real patient data
              </div>
            </li>
            <li className="flex items-start">
              <span className="mr-2">📱</span>
              <div>
                <strong>Mobile-First Design:</strong> Learn on any device with
                offline capability
              </div>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🌙</span>
              <div>
                <strong>Dark Mode:</strong> Comfortable learning in any lighting
                condition
              </div>
            </li>
            <li className="flex items-start">
              <span className="mr-2">♿</span>
              <div>
                <strong>Accessibility:</strong> WCAG 2.2 AA compliant for all learners
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Learning Path</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            The platform covers the complete systematic review workflow:
          </p>
          <ol className="space-y-2 list-decimal list-inside">
            <li>Framing research questions with PICO/PEO</li>
            <li>Protocol development and PROSPERO registration</li>
            <li>Building comprehensive search strategies</li>
            <li>Citation management and deduplication</li>
            <li>Screening and PRISMA flow diagrams</li>
            <li>Data extraction and table building</li>
            <li>Risk of bias assessment (RoB 2, ROBINS-I, etc.)</li>
            <li>Effect size calculation</li>
            <li>Meta-analysis with forest plots</li>
            <li>Publication bias detection</li>
            <li>GRADE certainty assessment</li>
            <li>Summary of findings tables</li>
            <li>Manuscript preparation and reporting</li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Standards & Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            MetaMaster360 adheres to internationally recognized standards:
          </p>
          <ul className="space-y-2">
            <li><strong>PRISMA 2020:</strong> Preferred Reporting Items for Systematic Reviews and Meta-Analyses</li>
            <li><strong>Cochrane Handbook:</strong> Gold standard for systematic review methodology</li>
            <li><strong>GRADE:</strong> Grading of Recommendations Assessment, Development and Evaluation</li>
            <li><strong>RoB 2:</strong> Revised Cochrane risk-of-bias tool for randomized trials</li>
            <li><strong>ROBINS-I:</strong> Risk Of Bias In Non-randomized Studies of Interventions</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Educational Philosophy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            We believe in learning by doing. Each module combines theoretical
            knowledge with hands-on practice using interactive tools and synthetic
            datasets.
          </p>
          <p>
            Our approach emphasizes:
          </p>
          <ul className="space-y-2 list-disc list-inside">
            <li>Active learning through interactive exercises</li>
            <li>Progressive complexity from basics to advanced topics</li>
            <li>Immediate feedback and guided practice</li>
            <li>Real-world applicability with methodological rigor</li>
            <li>Self-paced learning with clear learning objectives</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
