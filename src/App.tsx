import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router'
import { AppShell } from './components/layout/AppShell'
import { Home } from './pages/Home'
import { ModulePage } from './pages/ModulePage'
import { NotFound } from './pages/NotFound'
import { LEGACY_ROUTES, modulePath } from './content/modules'

const Tools = lazy(() => import('./pages/Tools'))
const Exam = lazy(() => import('./pages/Exam'))
const Glossary = lazy(() => import('./pages/Glossary'))
const References = lazy(() => import('./pages/References'))
const About = lazy(() => import('./pages/About'))

function Legacy() {
  const { old } = useParams()
  const target = old ? LEGACY_ROUTES[old] : undefined
  return <Navigate to={target ? modulePath(target) : '/'} replace />
}

const Fallback = () => <div className="h-64 animate-pulse rounded-xl bg-surface-2" aria-label="Loading" />

export function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Fallback />}>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<Home />} />
            <Route path="learn/:id" element={<ModulePage />} />
            <Route path="tools" element={<Suspense fallback={<Fallback />}><Tools /></Suspense>} />
            <Route path="tools/:tool" element={<Suspense fallback={<Fallback />}><Tools /></Suspense>} />
            <Route path="exam" element={<Suspense fallback={<Fallback />}><Exam /></Suspense>} />
            <Route path="glossary" element={<Suspense fallback={<Fallback />}><Glossary /></Suspense>} />
            <Route path="references" element={<Suspense fallback={<Fallback />}><References /></Suspense>} />
            <Route path="about" element={<Suspense fallback={<Fallback />}><About /></Suspense>} />
            <Route path="assessment" element={<Navigate to="/exam" replace />} />
            <Route path="modules/:old" element={<Legacy />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
