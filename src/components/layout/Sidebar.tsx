import { Link, useLocation } from 'react-router-dom'
import { X, Home, BookOpen, GraduationCap, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { modules } from '@/data/modules'
import { useAppStore } from '@/stores/appStore'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation()
  const { isModuleComplete } = useAppStore()

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/glossary', icon: BookOpen, label: 'Glossary' },
    { path: '/assessment', icon: GraduationCap, label: 'Assessment' },
    { path: '/about', icon: HelpCircle, label: 'About' },
  ]

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-72 border-r bg-background transition-transform duration-200 md:translate-x-0 overflow-y-auto",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 md:hidden">
          <h2 className="text-lg font-semibold">Menu</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="space-y-1 p-4">
          {/* Main navigation */}
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={cn(
                    "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Modules */}
          <div className="pt-4">
            <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Learning Modules
            </h3>
            <div className="space-y-1">
              {modules.map((module) => {
                const isActive = location.pathname === module.path
                const isComplete = isModuleComplete(module.id)
                return (
                  <Link
                    key={module.id}
                    to={module.path}
                    onClick={onClose}
                    className={cn(
                      "flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{module.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium">{module.title}</div>
                        <div className="text-xs opacity-75">{module.estimatedTime}</div>
                      </div>
                    </div>
                    {isComplete && (
                      <Badge variant="success" className="ml-2">
                        ✓
                      </Badge>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        </nav>
      </aside>
    </>
  )
}
