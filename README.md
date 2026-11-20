# MetaMaster360

**Learn systematic reviews and meta-analysis by doing one.** Seventeen interactive modules take a single review from question to Summary of findings, each with working labs and a mastery check. The labs double as a toolkit for real reviews.

Content is current to the Cochrane Handbook v6.5, Cochrane's current RevMan random-effects methods (REML, HKSJ, prediction intervals), PRISMA 2020 and its extensions (PRISMA-S, PRISMA-LSR 2024, PRISMA-C 2026), RoB 2, ROBINS-I V2 (draft, Nov 2025), ROB-ME, the Core GRADE series (BMJ 2025), and the 2025 joint position on AI in evidence synthesis. Last reviewed November 2026.

## What's inside

| Phase | Modules | Labs |
|---|---|---|
| Plan | 1 Question · 2 Protocol & registration | Question builder & critic, review-type selector, PRISMA-P protocol generator (Markdown export) |
| Find | 3 Search · 4 Records & deduplication · 5 Study selection | Search builder with PubMed/Ovid syntax and linter, deduplication lab, screening simulator, κ calculator, PRISMA 2020 flow builder with arithmetic checks |
| Extract & appraise | 6 Data extraction · 7 Risk of bias | Extraction exercise with traps (SE vs SD, medians, multi-arm, cluster trials), conversion calculators, RoB 2 domain-1 algorithm, trial appraisal vs expert key, traffic-light plots |
| Synthesize | 8 Effect measures · 9 Meta-analysis · 10 Heterogeneity · 11 Missing evidence · 12 Synthesis without meta-analysis | Effect-size calculator, OR vs RR explorer, **meta-analysis engine**, weight explorer, I² vs τ² explorer, sensitivity and subgroup credibility, publication-bias simulator, vote counting with sign test |
| Conclude & report | 13 GRADE · 14 Summary of findings · 15 Reporting | GRADE rater, imprecision assistant (Core GRADE), SoF builder (Markdown/CSV), PRISMA 2020 checklist audit, spin spotter |
| Go further | 16 Beyond the standard review · 17 Capstone | Indirect comparison (Bucher), AI-use scenarios, 13-decision capstone |

There are 122 explained questions in total. A module counts as mastered at ≥ 80% on its check. The mastery exam draws 30 questions across all modules, and questions you miss go into a review queue.

## Statistics engine

The engine (`src/lib/stats`) handles:

- **Effect sizes:** MD, Hedges' g, RR, OR, RD, NNT, and estimate + SE from a CI or p-value.
- **Conversions:** SE/CI/t → SD, median/IQR → mean/SD (Luo 2018; Wan 2014), combining groups, change-score SD, design effect.
- **Pooling:** common-effect inverse variance and random-effects models with REML or DerSimonian–Laird τ², Wald or HKSJ intervals, prediction interval, Q-profile CI for τ², I², subgroup tests and leave-one-out.
- **Bias and agreement:** Egger's test, sign test, Wilson interval, κ, and optimal information size.

The tests reproduce the published `metafor` results for the BCG vaccine dataset: REML τ² = 0.3132, pooled log RR = −0.7145, I² = 92.2%, τ² CI 0.120–1.111. They also cross-check every distribution function against SciPy. Content-integrity tests fail the build if a number quoted in the lessons stops matching what the engine computes.

## Development

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # 58 unit + content-integrity tests
npm run lint
npm run build      # type-check + production build (PWA, offline-capable)
```

Stack: React 19, React Router 7, Vite 8, Tailwind CSS 4, TypeScript 6, Zustand 5, Vitest 5, and vite-plugin-pwa. Plots are hand-written SVG, and no data leaves the browser: progress is kept in local storage and can be exported or imported from **About & settings**.

```
src/
  lib/stats/         statistics engine + tests
  content/           module registry, quiz bank, glossary, references, running case, datasets
  modules/           one lesson per module (lazy-loaded)
  labs/              interactive tools (shared by modules and the Toolkit)
  components/        UI primitives, layout, learning components, plots
  pages/             Home, ModulePage, Toolkit, Exam, Glossary, Sources, About
docs/                original specification documents
```

## Contributing

Corrections need a source. Every factual statement should trace to an entry in `src/content/references.ts` (all DOIs are checked against Crossref). When you change the running-case data, run `npm test`: the content tests will name every lesson sentence whose numbers no longer match.

The running case uses synthetic studies. The BCG dataset is real (Colditz et al., 1994).
