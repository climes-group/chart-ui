# Chart UI Architecture

This document maps the current frontend architecture for the CHART tool.

## Purpose

`chart-ui` is the React frontend for the CHART tool. It collects building, site, and intake data; guides the user through a multi-step flow; requests analysis and reports from `clime-api`; and displays saved reports.

## Application Entry and Routing

- `src/main.tsx` creates the Redux store and persistence layer, initializes Microsoft MSAL, configures providers, and registers the browser router.
- `src/App.tsx` provides the application shell and route outlet.
- Routes are defined in `src/main.tsx` for the splash screen, design flow, chart flow, saved reports, and fallback navigation.
- `src/pages/` contains route-level components.

## Feature Organization

- `src/components/Chart/` contains the stepper flow, step rendering, cards, and chart-specific interactions.
- `src/components/Auth/` contains Google and Microsoft OIDC flows.
- `src/components/Map/` and `src/utils/geocode.ts` support location selection and geocoding.
- `src/components/TestMode/` contains test-mode behavior and context.
- `src/components/ui/` contains reusable UI primitives.
- `src/i18n/` contains locale state, dictionaries, translation, and formatting helpers.
- `src/hooks/` contains reusable flow, media, and idle-timeout behavior.

## State and Data Flow

- Redux Toolkit owns application state under `src/state/`.
- `redux-persist` restores selected state across sessions.
- `src/steps.ts` defines the chart workflow steps; page and feature components render the corresponding inputs and results.
- API requests use the configured API host and include the authentication and user-timezone headers expected by the backend.

## Authentication

- The frontend authenticates users with OIDC; only authenticated users can access the app.
- Google sign-in is handled through `@react-oauth/google`.
- Microsoft sign-in is handled through MSAL and `@azure/msal-react`.
- Identity claims are forwarded to the backend in request headers; identity will be used to manage saved reports
- Client IDs and API configuration are supplied through Vite environment variables; see the repository README and `docs/OIDC.md`.

## API and Hosting

- Local development uses Vite and proxies `/api/*` to the local API service.
- Production builds generate `dist/` and deploy through Firebase Hosting.
- `firebase.json` configures hosting and the `/api/**` rewrite toward the Cloud Run API service.
- The frontend consumes report, reference-data, and analysis endpoints exposed by `clime-api`.

## Testing and Quality

- Vitest runs in jsdom with React Testing Library and co-located `__tests__/` directories.
- Accessibility checks use axe tooling for applicable component states.

## Related Documentation

- [Project README](../README.md)
- [Hosting](HOSTING.md)
- [OIDC configuration](OIDC.md)
