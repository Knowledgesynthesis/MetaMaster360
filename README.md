# MetaMaster360

**Complete Systematic Review & Meta-Analysis Workflow Simulator**

An interactive, mobile-first educational platform that teaches clinicians and researchers everything they need to know to perform rigorous systematic reviews and meta-analyses—from question formulation to manuscript preparation.

## Features

### 🎯 Evidence-Based Learning
- Aligned with **PRISMA 2020**, **Cochrane Handbook**, and **GRADE** guidelines
- Methodologically rigorous content reviewed by evidence synthesis experts
- Safe, synthetic datasets—never using real patient data

### 📱 Mobile-First Design
- Fully responsive interface optimized for all devices
- **Offline-capable PWA** with service worker
- **Dark mode** for comfortable learning in any environment
- WCAG 2.2 AA accessible

### 🧮 Interactive Tools
- **PICO Builder**: Formulate focused research questions
- **Search Strategy Composer**: Build Boolean queries with MeSH terms
- **Citation Manager**: Import and deduplicate references
- **Screening Simulator**: Practice title/abstract and full-text screening
- **Risk of Bias Tools**: Apply RoB 2, ROBINS-I, QUADAS-2, JBI
- **Effect Size Calculator**: Calculate MD, SMD, RR, OR, HR
- **Meta-Analysis Engine**: Create forest plots with heterogeneity assessment
- **Funnel Plots**: Detect publication bias
- **GRADE Dashboard**: Rate certainty of evidence
- **SoF Table Generator**: Create publication-ready summaries

## Learning Modules

1. **Framing the Research Question** - PICO/PEO frameworks
2. **Protocol Writing & Registration** - PROSPERO registration
3. **Search Strategy Development** - Boolean logic and database searching
4. **Citation Management** - Import, organize, deduplicate
5. **Screening Workflow** - Title/abstract and full-text screening
6. **Data Extraction** - Build extraction tables
7. **Risk of Bias Assessment** - Apply critical appraisal tools
8. **Effect Size Calculation** - Compute standardized measures
9. **Meta-Analysis Engine** - Fixed and random-effects models
10. **Publication Bias Detection** - Funnel plots and small-study effects
11. **GRADE Assessment** - Certainty of evidence rating
12. **Summary of Findings** - Create SoF tables
13. **Manuscript Preparation** - PRISMA reporting
14. **Integrated SR/MA Sandbox** - Complete workflow practice

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Routing**: React Router v6
- **State Management**: Zustand with localStorage persistence
- **Data Storage**: IndexedDB for offline capability
- **Visualization**: Recharts for forest and funnel plots
- **PWA**: Vite PWA plugin with Workbox

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development

The app will be available at `http://localhost:5173`

### Production Build

The production build is optimized and includes:
- Code splitting and tree shaking
- Service worker for offline functionality
- Compressed assets (gzip)
- PWA manifest for installability

## Project Structure

```
MetaMaster360/
├── src/
│   ├── components/
│   │   ├── layout/          # Header, Sidebar, Layout
│   │   ├── ui/              # Reusable UI components
│   │   └── modules/         # Module-specific components
│   ├── pages/
│   │   ├── modules/         # Learning module pages
│   │   ├── Home.tsx
│   │   ├── Glossary.tsx
│   │   ├── Assessment.tsx
│   │   └── About.tsx
│   ├── data/
│   │   ├── modules.ts       # Module metadata
│   │   ├── citations.ts     # Synthetic citations
│   │   └── glossary.ts      # Term definitions
│   ├── lib/
│   │   ├── db.ts            # IndexedDB utilities
│   │   └── utils.ts         # Helper functions
│   ├── stores/
│   │   └── appStore.ts      # Zustand state management
│   ├── types/
│   │   └── index.ts         # TypeScript definitions
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

## Key Features in Detail

### Progress Tracking
- Automatically saves module completion status
- Visual progress indicators on home page
- Prerequisites enforced for sequential learning

### Offline Functionality
- Service worker caches all assets
- IndexedDB stores user progress and work
- Full functionality available without internet

### Accessibility
- Keyboard navigation support
- Screen reader compatible
- ARIA labels and semantic HTML
- Color contrast meets WCAG 2.2 AA standards

### Educational Philosophy
- Active learning through interactive exercises
- Progressive complexity from basics to advanced
- Immediate feedback and guided practice
- Real-world applicability with methodological rigor

## Educational Standards

MetaMaster360 adheres to:
- **PRISMA 2020**: Systematic review reporting guidelines
- **Cochrane Handbook**: Gold standard SR methodology
- **GRADE**: Certainty of evidence assessment
- **RoB 2**: Risk of bias in randomized trials
- **ROBINS-I**: Risk of bias in non-randomized studies

## Contributing

This is an educational platform. Contributions should maintain:
- Methodological accuracy per international standards
- Use of synthetic data only
- Accessibility compliance
- Clear learning objectives

## License

Educational use only. All content aligned with published systematic review standards.

## Acknowledgments

Built according to specifications in `plan.md` and `ultrathink.md`, emphasizing:
- Evidence-based methodology
- Interactive, hands-on learning
- Mobile-first, accessible design
- Complete workflow coverage from PICO to publication

---

**MetaMaster360** - Master systematic reviews and meta-analyses through interactive, evidence-based learning.
