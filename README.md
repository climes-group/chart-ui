# Chart UI

Frontend for the Climes Chart tool

[![PR Tests](https://github.com/climes-group/chart-ui/actions/workflows/pr-tests.yml/badge.svg)](https://github.com/climes-group/chart-ui/actions/workflows/pr-tests.yml)
[![Firebase Deploy](https://github.com/climes-group/chart-ui/actions/workflows/firebase-hosting-merge.yml/badge.svg)](https://github.com/climes-group/chart-ui/actions/workflows/firebase-hosting-merge.yml)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=climes-group_chart-ui&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=climes-group_chart-ui)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=climes-group_chart-ui&metric=sqale_rating)](https://sonarcloud.io/component_measures?id=climes-group_chart-ui&metric=sqale_rating)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=climes-group_chart-ui&metric=reliability_rating)](https://sonarcloud.io/component_measures?id=climes-group_chart-ui&metric=reliability_rating)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=climes-group_chart-ui&metric=security_rating)](https://sonarcloud.io/component_measures?id=climes-group_chart-ui&metric=security_rating)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=climes-group_chart-ui&metric=bugs)](https://sonarcloud.io/component_measures?id=climes-group_chart-ui&metric=bugs)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=climes-group_chart-ui&metric=vulnerabilities)](https://sonarcloud.io/component_measures?id=climes-group_chart-ui&metric=vulnerabilities)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=climes-group_chart-ui&metric=code_smells)](https://sonarcloud.io/component_measures?id=climes-group_chart-ui&metric=code_smells)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=climes-group_chart-ui&metric=sqale_index)](https://sonarcloud.io/component_measures?id=climes-group_chart-ui&metric=sqale_index)
[![Duplicated Lines](https://sonarcloud.io/api/project_badges/measure?project=climes-group_chart-ui&metric=duplicated_lines_density)](https://sonarcloud.io/component_measures?id=climes-group_chart-ui&metric=duplicated_lines_density)

[![Known Vulnerabilities](https://snyk.io/test/github/climes-group/chart-ui/badge.svg)](https://snyk.io/test/github/climes-group/chart-ui)

[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-4-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 24+
- npm 10+
- Git

### Setup

```bash
git clone git@github.com:climes-group/chart-ui.git
cd chart-ui
npm install
npm run dev
```

Dev server runs on `http://localhost:5173` and proxies `/api/*` to
`http://localhost:8080`.

### Environment Variables

Create a `.env.local` at the repo root:

```bash
VITE_API_HOST=http://localhost:8080
VITE_GOOGLE_CLIENT_ID=...
VITE_MICROSOFT_CLIENT_ID=...
VITE_GEO_API_KEY=...
VITE_FF_USE_GEO_API=true
```

## Scripts

| Command             | What it does                            |
| ------------------- | --------------------------------------- |
| `npm run dev`       | Vite dev server (HMR, host bound)       |
| `npm run build`     | Production build → `dist/`              |
| `npm run preview`   | Preview the production build            |
| `npm test`          | Run Vitest in watch mode                |
| `npm run coverage`  | Run tests once with v8 coverage report  |
| `npm run typecheck` | `tsc --noEmit` — strict type checking   |
| `npm run lint`      | ESLint flat config (zero warnings gate) |

## Testing

Vitest runs in jsdom with globals enabled — no need to import `describe`,
`test`, `expect`, `vi`. Tests live in co-located `__tests__/` directories.

```bash
npm test                 # watch mode
npm run coverage         # one-shot with coverage
npm test -- path/to/file # filter
```

Card components include a `jest-axe` accessibility check per visual state.

## Project Structure

```
src/
├── App.tsx, main.tsx                 entry points
├── pages/                            route components (Splash, Chart, Design, SavedReports)
├── components/
│   ├── Auth/                         OIDC sign-in
│   ├── Chart/                        stepper + cards (StepperFlow, StepRenderer, Cards/, geo/)
│   ├── LocaleSwitcher/, Map/
│   ├── TestMode/                     debug panel + its context
│   └── ui/                           shadcn-style primitives (lowercase, by convention)
├── hooks/                            useFlow, useMedia, useIdleTimeout
├── i18n/                             locale provider, dictionaries, format helpers
├── state/                            Redux store, slices, actions
├── steps.ts                          flow step definitions
└── utils/                            cn, validators, geocode, generateReport, testing
```

**Structure rules:**
- Routes live in `src/pages/`.
- Reusable UI primitives in `src/components/ui/` (lowercase, shadcn convention).
- Feature components in `src/components/<Feature>/` (PascalCase).
- All utilities in `src/utils/` (no `lib/` split).
- Contexts co-locate with their primary consumer component, not a top-level
  `context/`. Exception: `LocaleProvider` lives in `src/i18n/` alongside its
  translate/format helpers.

## Deploy

`main` auto-deploys to Firebase Hosting via the
[firebase-hosting-merge](.github/workflows/firebase-hosting-merge.yml) workflow.

For a manual build:

```bash
npm run build
# upload dist/ to your host
```
