import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useAppStore } from '@/stores/appStore'
import { CheckCircle2 } from 'lucide-react'

interface ModuleTemplateProps {
  moduleId: string
  title: string
  description: string
  objectives: string[]
  content: React.ReactNode
}

export function ModuleTemplate({
  moduleId,
  title,
  description,
  objectives,
  content
}: ModuleTemplateProps) {
  const { markModuleComplete, isModuleComplete } = useAppStore()
  const isComplete = isModuleComplete(moduleId)

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{title}</h1>
          {isComplete && (
            <Badge variant="success" className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" />
              Completed
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Learning Objectives</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {objectives.map((objective, index) => (
              <li key={index}>• {objective}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {content}

      {!isComplete && (
        <Card className="border-primary">
          <CardContent className="pt-6">
            <Button
              onClick={() => markModuleComplete(moduleId)}
              className="w-full"
              size="lg"
            >
              Mark Module as Complete
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
