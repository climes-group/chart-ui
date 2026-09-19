# Agent Guidance

This file governs work in the `chart-ui` repository. Read it together with the closest README and relevant documentation before changing behavior.

## Workflow

- Prefer simplicity and easily readable code
- Inspect the owning code path, nearby tests, and relevant docs before editing.
- Form a small, falsifiable hypothesis about the requested behavior before making a change.
- Prefer the smallest focused change that preserves existing public APIs and local patterns.
- Keep unrelated user changes intact. Do not reset, revert, stage, or commit work unless explicitly requested.
- Add or update tests when behavior changes. Avoid speculative refactors and unrelated formatting.
- Update `docs/` or the README when setup, API contracts, deployment, or architecture changes.

## Structure and Naming

- Routes live in `src/pages/`; each route entry is registered in `src/main.tsx`.
- Reusable UI primitives live in `src/components/ui/` and use lowercase filenames in the shadcn style.
- Feature components live in `src/components/<Feature>/` with PascalCase feature folders.
- Keep utilities in `src/utils/`; do not introduce a separate `lib/` directory.
- Co-locate contexts with their primary consumer. `LocaleProvider` is the exception and belongs in `src/i18n/` with translation and formatting helpers.
- Components use PascalCase filenames and default exports. Hooks and utilities use camelCase filenames and named exports.
- Use `index.tsx` for component folders that contain subcomponents or helpers; standalone components stay in a flat file.
- Use relative imports for siblings, `@/` imports for other project modules, and `import type` for type-only imports.

## Testing

- Tests are co-located in `__tests__/` directories.
- Vitest globals are enabled; do not import `describe`, `test`, `expect`, or `vi` solely to use them.
- Prefer React Testing Library integration-style tests and `userEvent` over implementation-detail assertions or snapshots.
- Cover user-visible behavior, meaningful loading/error/empty states, and key interactions.
- Avoid using `data-testid`; interact with the UI as a user would, using accessible or visible labels
- Include an axe accessibility check for each meaningful visual state of card components where applicable.

## Verification

For non-trivial changes, run the applicable checks, normally:

```bash
npm run typecheck
npm run lint
npm run coverage
npm run build
```

For focused work, run the narrowest relevant test or typecheck first. Documentation-only changes need a focused Markdown and link review rather than an application build.

## Architecture References

- Application entry, providers, and routing: `src/main.tsx`
- Application shell: `src/App.tsx`
- Route components: `src/pages/`
- Feature components: `src/components/`
- Redux state and persistence: `src/state/`
- Flow definitions: `src/steps.ts`
- Locale support: `src/i18n/`
- [Architecture overview](docs/ARCHITECTURE.md)
- [Project README](README.md)
