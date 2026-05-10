# Project rules for Claude

## Directory layout

- **Routes** → `src/pages/`. Each route file or folder is exactly one entry in
  the router table in `src/main.tsx`.
- **Reusable UI primitives** → `src/components/ui/`. Lowercase filenames
  (`button.tsx`, `card.tsx`) — shadcn convention.
- **Feature components** → `src/components/<Feature>/`. PascalCase folders.
  Sub-features fold in (e.g. `Chart/Cards/IntakeCard/SignatureSection.tsx`).
- **Utilities** → `src/utils/` only. No `lib/` split.
- **Contexts** co-locate with the primary consumer component (e.g.
  `components/TestMode/TestModeContext.tsx`). Exception: `LocaleProvider` lives
  in `src/i18n/` next to translate/format.
- **Tests** co-locate in `__tests__/` next to the file under test.

## Files & naming

- Components: PascalCase, default export.
- Hooks/utilities: camelCase, named export.
- A component folder uses `index.tsx` only when it has sub-components or
  helpers; standalone components stay flat (e.g. `Cards/ReportCard.tsx` vs
  `Cards/IntakeCard/index.tsx`).

## Imports

- Siblings in same folder: relative `./X`.
- Anything else: `@/` alias.
- Type-only imports: `import type` always.

## Verification

After non-trivial changes run all three:

```bash
npx tsc --noEmit     # types
npx vitest run       # tests
npm run build        # build
```
