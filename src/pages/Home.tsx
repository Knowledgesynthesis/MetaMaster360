import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/Progress'
import { modules } from '@/data/modules'
import { useAppStore } from '@/stores/appStore'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

export function Home() {
  const { completedModules } = useAppStore()
  const completionPercentage = (completedModules.size / modules.length) * 100

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to MetaMaster360
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Master the complete systematic review and meta-analysis workflow through
          interactive learning. From PICO to publication, become proficient in
          evidence synthesis methodology.
        </p>
      </div>

      {/* Progress Card */}
      <Card>
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
          <CardDescription>
            {completedModules.size} of {modules.length} modules completed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={completionPercentage} className="mb-2" />
          <p className="text-sm text-muted-foreground">
            {Math.round(completionPercentage)}% complete
          </p>
        </CardContent>
      </Card>

      {/* Learning Path */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Learning Path</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => {
            const isComplete = completedModules.has(module.id)
            const hasPrerequisites = module.prerequisites && module.prerequisites.length > 0
            const prerequisitesMet = !hasPrerequisites ||
              module.prerequisites!.every((prereq) => completedModules.has(prereq))

            return (
              <Card
                key={module.id}
                className={isComplete ? 'border-green-500' : ''}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-3xl">{module.icon}</span>
                      <div>
                        <CardTitle className="text-lg">{module.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {module.estimatedTime}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {module.bloomLevel}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    {isComplete && (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="line-clamp-2">
                    {module.description}
                  </CardDescription>
                  {hasPrerequisites && (
                    <div className="text-xs text-muted-foreground">
                      Prerequisites:{' '}
                      {module.prerequisites!.map((prereqId) => {
                        const prereq = modules.find((m) => m.id === prereqId)
                        return prereq?.title
                      }).join(', ')}
                    </div>
                  )}
                  <Link to={module.path}>
                    <Button
                      className="w-full"
                      variant={isComplete ? 'secondary' : 'default'}
                      disabled={!prerequisitesMet}
                    >
                      {isComplete ? 'Review' : 'Start Module'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Key Features */}
      <div className="grid gap-6 md:grid-cols-3 mt-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              Evidence-Based
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Aligned with PRISMA, Cochrane, and GRADE standards. Learn methodologically
              rigorous systematic review techniques.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">📱</span>
              Mobile-First
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Learn anywhere, anytime. Fully responsive design with offline capability
              for uninterrupted learning.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🧮</span>
              Interactive Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Hands-on practice with PICO builders, forest plots, funnel plots,
              and comprehensive meta-analysis calculators.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
