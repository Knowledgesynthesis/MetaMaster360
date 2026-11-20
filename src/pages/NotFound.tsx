import { Link } from 'react-router'
import { buttonClasses } from '@/components/ui'

export function NotFound() {
  return (
    <div className="mx-auto max-w-md py-20 text-center">
      <div className="text-5xl font-bold text-primary">404</div>
      <h1 className="mt-3 text-xl font-semibold">Page not found</h1>
      <p className="mt-2 text-muted">That page is not in this review. Excluded with reason: does not exist.</p>
      <Link to="/" className={buttonClasses('primary', 'md', 'mt-6')}>Back to the learning path</Link>
    </div>
  )
}
