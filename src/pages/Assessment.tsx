import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export function Assessment() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Assessment Hub</h1>
        <p className="text-muted-foreground">
          Test your knowledge and mastery of systematic review methodology
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
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
            <Badge variant="outline">Coming Soon</Badge>
          </CardContent>
        </Card>

        <Card>
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
            <Badge variant="outline">Coming Soon</Badge>
          </CardContent>
        </Card>

        <Card>
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
            <Badge variant="outline">Coming Soon</Badge>
          </CardContent>
        </Card>

        <Card>
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
            <Badge variant="outline">Coming Soon</Badge>
          </CardContent>
        </Card>

        <Card>
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
            <Badge variant="outline">Coming Soon</Badge>
          </CardContent>
        </Card>

        <Card>
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
            <Badge variant="outline">Coming Soon</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
