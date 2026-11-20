import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { Download, Upload, RotateCcw } from 'lucide-react'
import { useProgress, type Theme } from '@/store/progress'
import { Button, Callout, Card, CardBody, Segmented } from '@/components/ui'
import { downloadText } from '@/lib/utils'

export default function About() {
  const theme = useProgress((s) => s.theme)
  const setTheme = useProgress((s) => s.setTheme)
  const reset = useProgress((s) => s.reset)
  const fileRef = useRef<HTMLInputElement>(null)
  const [msg, setMsg] = useState('')
  const [confirm, setConfirm] = useState(false)
  useEffect(() => { document.title = 'About & settings — MetaMaster360' }, [])

  const exportProgress = () => {
    const { theme, scores, missed, visited, lastModule, exams, capstone } = useProgress.getState()
    downloadText(JSON.stringify({ app: 'metamaster360', version: 2, theme, scores, missed, visited, lastModule, exams, capstone }, null, 2), 'metamaster360-progress.json', 'application/json')
  }
  const importProgress = async (f: File) => {
    try {
      const data = JSON.parse(await f.text())
      if (data.app !== 'metamaster360') throw new Error('Not a MetaMaster360 progress file.')
      const { scores = {}, missed = {}, visited = {}, lastModule, exams = [], capstone = {} } = data
      useProgress.setState({ scores, missed, visited, lastModule, exams, capstone })
      setMsg('Progress imported.')
    } catch (e) {
      setMsg((e as Error).message)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">About & settings</h1>
        <p className="text-muted">MetaMaster360 teaches the full systematic review and meta-analysis workflow through one running case, working tools and retrieval practice.</p>
      </header>

      <Card>
        <CardBody className="space-y-4">
          <h2 className="font-semibold">Settings</h2>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm">Theme</span>
            <Segmented value={theme} onChange={(t: Theme) => setTheme(t)} label="Theme" options={[{ value: 'system', label: 'System' }, { value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }]} />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm">Progress (stored only in this browser)</span>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={exportProgress}><Download className="h-4 w-4" />Export</Button>
              <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()}><Upload className="h-4 w-4" />Import</Button>
              <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={(e) => e.target.files?.[0] && importProgress(e.target.files[0])} />
              {confirm ? (
                <Button size="sm" variant="danger" onClick={() => { reset(); setConfirm(false); setMsg('Progress reset.') }}>Confirm reset</Button>
              ) : (
                <Button size="sm" variant="ghost" onClick={() => setConfirm(true)}><RotateCcw className="h-4 w-4" />Reset</Button>
              )}
            </div>
          </div>
          {msg && <p className="text-sm text-muted" role="status">{msg}</p>}
        </CardBody>
      </Card>

      <section className="lesson space-y-3 text-[0.95rem]">
        <h2 className="text-xl font-semibold">How the content is kept accurate</h2>
        <ul>
          <li>Methods follow the Cochrane Handbook v6.5, Cochrane’s current RevMan random-effects methods, PRISMA 2020 and its extensions, RoB 2 / ROBINS-I V2 / ROB-ME, and the 2025 Core GRADE series — see <Link to="/references">Sources</Link>.</li>
          <li>The statistics engine is unit-tested against published metafor results for the BCG vaccine dataset (REML τ² = 0.3132, pooled log RR = −0.7145, Q-profile CI for τ², HKSJ, prediction interval, Egger’s test) and against SciPy for every distribution function.</li>
          <li>Every DOI is checked against Crossref; numerical claims from studies (e.g., single-reviewer screening missing 13% of studies) are checked against the original abstracts.</li>
          <li>Content was last reviewed in November 2026. Draft tools (ROBINS-I V2) are labelled as such.</li>
        </ul>
        <h2 className="text-xl font-semibold">Privacy</h2>
        <p>Everything runs in your browser. There is no account, tracking or upload; progress lives in local storage and can be exported. The app works offline once loaded.</p>
        <h2 className="text-xl font-semibold">Use</h2>
        <p>The running case uses synthetic studies. For a real review, use the tools here alongside the linked guidance documents and your team’s statistician or information specialist.</p>
      </section>

      <Callout kind="tip" title="Found an error or outdated guidance?">Open an issue on the project’s GitHub repository with the source that supports the correction.</Callout>
    </div>
  )
}
