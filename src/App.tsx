import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { Home } from './pages/Home'
import { Glossary } from './pages/Glossary'
import { Assessment } from './pages/Assessment'
import { About } from './pages/About'
import { PicoModule, SearchModule, ModuleTemplate } from './pages/modules'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/Card'
import { syntheticCitations } from './data/citations'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="glossary" element={<Glossary />} />
          <Route path="assessment" element={<Assessment />} />
          <Route path="about" element={<About />} />

          {/* Module Routes */}
          <Route path="modules/pico" element={<PicoModule />} />
          <Route path="modules/search" element={<SearchModule />} />

          <Route
            path="modules/protocol"
            element={
              <ModuleTemplate
                moduleId="protocol"
                title="Protocol Writing & Registration"
                description="Learn to develop systematic review protocols and register with PROSPERO"
                objectives={[
                  'Understand the purpose of protocol registration',
                  'Write clear research questions and objectives',
                  'Define eligibility criteria',
                  'Plan data extraction and analysis methods',
                  'Register protocol with PROSPERO'
                ]}
                content={
                  <Card>
                    <CardHeader>
                      <CardTitle>Protocol Components</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p>A systematic review protocol should include:</p>
                      <ul className="space-y-2">
                        <li>• Background and rationale</li>
                        <li>• Research question (PICO)</li>
                        <li>• Eligibility criteria</li>
                        <li>• Search strategy</li>
                        <li>• Screening process</li>
                        <li>• Data extraction plan</li>
                        <li>• Risk of bias assessment</li>
                        <li>• Data synthesis methods</li>
                      </ul>
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="font-semibold mb-2">PROSPERO Registration</p>
                        <p className="text-sm">
                          PROSPERO is the international register for systematic review protocols.
                          Registration helps reduce publication bias and prevents duplicate reviews.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                }
              />
            }
          />

          <Route
            path="modules/citations"
            element={
              <ModuleTemplate
                moduleId="citations"
                title="Citation Management"
                description="Import, organize, and deduplicate references efficiently"
                objectives={[
                  'Import citations from database searches',
                  'Identify and remove duplicate citations',
                  'Organize references systematically',
                  'Export citation libraries'
                ]}
                content={
                  <Card>
                    <CardHeader>
                      <CardTitle>Sample Citations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {syntheticCitations.slice(0, 3).map((citation) => (
                          <div key={citation.id} className="p-4 border rounded-lg">
                            <h3 className="font-semibold">{citation.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {citation.authors.join(', ')} ({citation.year})
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {citation.journal}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                }
              />
            }
          />

          <Route
            path="modules/screening"
            element={
              <ModuleTemplate
                moduleId="screening"
                title="Screening Workflow"
                description="Master title/abstract and full-text screening"
                objectives={[
                  'Perform title and abstract screening',
                  'Conduct full-text screening',
                  'Document exclusion reasons',
                  'Create PRISMA flow diagrams'
                ]}
                content={
                  <Card>
                    <CardHeader>
                      <CardTitle>Screening Process</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <h3 className="font-semibold">Phase 1: Title/Abstract Screening</h3>
                        <p className="text-sm">
                          Quickly review titles and abstracts to exclude obviously irrelevant studies.
                        </p>
                        <h3 className="font-semibold">Phase 2: Full-Text Screening</h3>
                        <p className="text-sm">
                          Obtain and review full texts of potentially eligible studies against
                          detailed eligibility criteria.
                        </p>
                        <div className="p-4 bg-muted rounded-lg">
                          <p className="font-semibold">Best Practices:</p>
                          <ul className="text-sm space-y-1 mt-2">
                            <li>• Use two independent reviewers</li>
                            <li>• Document specific reasons for exclusion</li>
                            <li>• Resolve disagreements by consensus or third reviewer</li>
                            <li>• Track all decisions in PRISMA flow diagram</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                }
              />
            }
          />

          <Route
            path="modules/extraction"
            element={
              <ModuleTemplate
                moduleId="extraction"
                title="Data Extraction"
                description="Create extraction tables and systematically extract study data"
                objectives={[
                  'Design data extraction forms',
                  'Extract study characteristics',
                  'Extract outcome data',
                  'Handle missing data appropriately'
                ]}
                content={
                  <Card>
                    <CardHeader>
                      <CardTitle>Data Extraction Elements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li>• Study identification (authors, year, title)</li>
                        <li>• Study design and methods</li>
                        <li>• Participant characteristics</li>
                        <li>• Interventions and comparisons</li>
                        <li>• Outcome measures and results</li>
                        <li>• Risk of bias elements</li>
                      </ul>
                    </CardContent>
                  </Card>
                }
              />
            }
          />

          <Route
            path="modules/rob"
            element={
              <ModuleTemplate
                moduleId="rob"
                title="Risk of Bias Assessment"
                description="Apply RoB 2, ROBINS-I, and other critical appraisal tools"
                objectives={[
                  'Understand sources of bias in research',
                  'Apply RoB 2 tool for randomized trials',
                  'Apply ROBINS-I for non-randomized studies',
                  'Interpret and visualize bias assessments'
                ]}
                content={
                  <Card>
                    <CardHeader>
                      <CardTitle>RoB 2 Domains</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="p-3 border rounded">
                          <h3 className="font-semibold">1. Randomization Process</h3>
                          <p className="text-sm text-muted-foreground">
                            Allocation sequence, concealment
                          </p>
                        </div>
                        <div className="p-3 border rounded">
                          <h3 className="font-semibold">2. Deviations from Interventions</h3>
                          <p className="text-sm text-muted-foreground">
                            Adherence, blinding
                          </p>
                        </div>
                        <div className="p-3 border rounded">
                          <h3 className="font-semibold">3. Missing Outcome Data</h3>
                          <p className="text-sm text-muted-foreground">
                            Attrition, completeness
                          </p>
                        </div>
                        <div className="p-3 border rounded">
                          <h3 className="font-semibold">4. Outcome Measurement</h3>
                          <p className="text-sm text-muted-foreground">
                            Measurement methods, blinding of assessors
                          </p>
                        </div>
                        <div className="p-3 border rounded">
                          <h3 className="font-semibold">5. Selection of Reported Result</h3>
                          <p className="text-sm text-muted-foreground">
                            Selective reporting
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                }
              />
            }
          />

          <Route
            path="modules/effect-size"
            element={
              <ModuleTemplate
                moduleId="effect-size"
                title="Effect Size Calculation"
                description="Calculate MD, SMD, RR, OR, and HR from study data"
                objectives={[
                  'Calculate mean differences and standardized mean differences',
                  'Calculate risk ratios and odds ratios',
                  'Calculate hazard ratios',
                  'Understand confidence intervals and standard errors'
                ]}
                content={
                  <Card>
                    <CardHeader>
                      <CardTitle>Effect Size Measures</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold">Continuous Outcomes</h3>
                          <p className="text-sm text-muted-foreground">
                            MD (same scale) or SMD (different scales)
                          </p>
                        </div>
                        <div>
                          <h3 className="font-semibold">Dichotomous Outcomes</h3>
                          <p className="text-sm text-muted-foreground">
                            RR, OR, or Risk Difference
                          </p>
                        </div>
                        <div>
                          <h3 className="font-semibold">Time-to-Event</h3>
                          <p className="text-sm text-muted-foreground">
                            Hazard Ratio (HR)
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                }
              />
            }
          />

          <Route
            path="modules/meta-analysis"
            element={
              <ModuleTemplate
                moduleId="meta-analysis"
                title="Meta-Analysis Engine"
                description="Perform fixed and random-effects meta-analysis"
                objectives={[
                  'Understand fixed vs random effects models',
                  'Interpret forest plots',
                  'Assess heterogeneity (I², τ²)',
                  'Perform subgroup and sensitivity analyses'
                ]}
                content={
                  <Card>
                    <CardHeader>
                      <CardTitle>Meta-Analysis Concepts</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="font-semibold">Fixed-Effect Model</h3>
                        <p className="text-sm text-muted-foreground">
                          Assumes all studies estimate the same true effect
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold">Random-Effects Model</h3>
                        <p className="text-sm text-muted-foreground">
                          Assumes true effects vary between studies
                        </p>
                      </div>
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="font-semibold">Heterogeneity Assessment:</p>
                        <ul className="text-sm mt-2 space-y-1">
                          <li>• I² = 0-40%: might not be important</li>
                          <li>• I² = 30-60%: moderate heterogeneity</li>
                          <li>• I² = 50-90%: substantial heterogeneity</li>
                          <li>• I² = 75-100%: considerable heterogeneity</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                }
              />
            }
          />

          <Route
            path="modules/publication-bias"
            element={
              <ModuleTemplate
                moduleId="publication-bias"
                title="Publication Bias Detection"
                description="Create funnel plots and assess small-study effects"
                objectives={[
                  'Understand publication bias',
                  'Create and interpret funnel plots',
                  'Apply Egger\'s test',
                  'Consider implications for conclusions'
                ]}
                content={
                  <Card>
                    <CardHeader>
                      <CardTitle>Publication Bias</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p>
                        Publication bias occurs when studies with positive or statistically
                        significant results are more likely to be published than those with
                        negative or null findings.
                      </p>
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="font-semibold">Detection Methods:</p>
                        <ul className="text-sm mt-2 space-y-1">
                          <li>• Funnel plot visual inspection</li>
                          <li>• Egger's regression test</li>
                          <li>• Trim and fill analysis</li>
                          <li>• Comprehensive database searching</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                }
              />
            }
          />

          <Route
            path="modules/grade"
            element={
              <ModuleTemplate
                moduleId="grade"
                title="GRADE Assessment"
                description="Assess certainty of evidence using GRADE methodology"
                objectives={[
                  'Understand GRADE domains',
                  'Assess risk of bias',
                  'Evaluate inconsistency, indirectness, imprecision',
                  'Rate overall certainty of evidence'
                ]}
                content={
                  <Card>
                    <CardHeader>
                      <CardTitle>GRADE Domains</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="p-3 border rounded">
                          <h3 className="font-semibold">Risk of Bias</h3>
                          <p className="text-sm text-muted-foreground">
                            Study limitations
                          </p>
                        </div>
                        <div className="p-3 border rounded">
                          <h3 className="font-semibold">Inconsistency</h3>
                          <p className="text-sm text-muted-foreground">
                            Unexplained heterogeneity
                          </p>
                        </div>
                        <div className="p-3 border rounded">
                          <h3 className="font-semibold">Indirectness</h3>
                          <p className="text-sm text-muted-foreground">
                            Generalizability concerns
                          </p>
                        </div>
                        <div className="p-3 border rounded">
                          <h3 className="font-semibold">Imprecision</h3>
                          <p className="text-sm text-muted-foreground">
                            Wide confidence intervals
                          </p>
                        </div>
                        <div className="p-3 border rounded">
                          <h3 className="font-semibold">Publication Bias</h3>
                          <p className="text-sm text-muted-foreground">
                            Selective reporting
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                }
              />
            }
          />

          <Route
            path="modules/sof"
            element={
              <ModuleTemplate
                moduleId="sof"
                title="Summary of Findings Tables"
                description="Create publication-ready SoF tables"
                objectives={[
                  'Understand SoF table structure',
                  'Present key outcomes clearly',
                  'Include GRADE certainty ratings',
                  'Write clear interpretation statements'
                ]}
                content={
                  <Card>
                    <CardHeader>
                      <CardTitle>SoF Table Components</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li>• Outcomes</li>
                        <li>• Effect estimates with confidence intervals</li>
                        <li>• Number of participants and studies</li>
                        <li>• Certainty of evidence (GRADE)</li>
                        <li>• Comments and plain language summary</li>
                      </ul>
                    </CardContent>
                  </Card>
                }
              />
            }
          />

          <Route
            path="modules/manuscript"
            element={
              <ModuleTemplate
                moduleId="manuscript"
                title="Manuscript Preparation"
                description="Learn PRISMA reporting and write transparent methods/results"
                objectives={[
                  'Follow PRISMA 2020 reporting guidelines',
                  'Write clear methods section',
                  'Present results transparently',
                  'Discuss limitations appropriately'
                ]}
                content={
                  <Card>
                    <CardHeader>
                      <CardTitle>PRISMA 2020</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p>
                        PRISMA (Preferred Reporting Items for Systematic Reviews and
                        Meta-Analyses) provides a checklist of items to include when
                        reporting systematic reviews.
                      </p>
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="font-semibold">Key Sections:</p>
                        <ul className="text-sm mt-2 space-y-1">
                          <li>• Title and abstract</li>
                          <li>• Introduction (rationale, objectives)</li>
                          <li>• Methods (eligibility, search, selection, data collection)</li>
                          <li>• Results (study selection, characteristics, synthesis)</li>
                          <li>• Discussion (summary, limitations, conclusions)</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                }
              />
            }
          />

          <Route
            path="modules/sandbox"
            element={
              <ModuleTemplate
                moduleId="sandbox"
                title="Integrated SR/MA Sandbox"
                description="Complete a full systematic review from start to finish"
                objectives={[
                  'Apply all learned concepts',
                  'Complete end-to-end workflow',
                  'Make methodological decisions',
                  'Produce complete systematic review'
                ]}
                content={
                  <Card>
                    <CardHeader>
                      <CardTitle>Full Workflow Practice</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p>
                        This sandbox allows you to practice the complete systematic review
                        workflow using synthetic data.
                      </p>
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="font-semibold">Workflow Steps:</p>
                        <ol className="text-sm mt-2 space-y-1 list-decimal list-inside">
                          <li>Formulate PICO question</li>
                          <li>Develop protocol</li>
                          <li>Build search strategy</li>
                          <li>Screen citations</li>
                          <li>Extract data</li>
                          <li>Assess risk of bias</li>
                          <li>Perform meta-analysis</li>
                          <li>Assess publication bias</li>
                          <li>Apply GRADE</li>
                          <li>Create SoF table</li>
                          <li>Write manuscript</li>
                        </ol>
                      </div>
                    </CardContent>
                  </Card>
                }
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
