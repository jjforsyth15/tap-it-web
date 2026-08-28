# AGENTS.md — tap-it-web

## What this is

React frontend for TapIt (NFC-powered digital profile/card platform). React 19 + TypeScript + Vite + React Router 7. Deployed to Firebase Hosting. Talks to `tap-it-server` over REST only — no shared code between them.

See the root `tap-it/AGENTS.md` (one directory up) for overall project context, current phase, and how I prefer to work together. This file is frontend-specific.

## Layout and conventions

- `src/pages/` → `src/components/` → `src/api/` (one fetch-wrapper module per backend resource) → `src/types/` (hand-written TS types mirroring backend Pydantic schemas — these can drift, see Known issues below).
- `src/layouts/`: `MainLayout` wraps the authenticated app; `PublicLayout` wraps public profile/card pages (`/public/:profileId`, `/cards/:card_code`) which must work without authentication.
- Styling is CSS Modules, one file per page/component in `src/styles/` — no global CSS framework. Follow this pattern rather than introducing styled-components, Tailwind, etc.
- Drag-and-drop uses `@dnd-kit` (see `SortableProfileCards`, `SortableLinkCard`) for dashboard profile reordering and profile link reordering. Reuse this pattern for any new reorderable list rather than adding a different DnD library.

## Auth flow

- Token lives in `utils/authStorage.tsx`. `context/authContext.tsx` loads the current user on mount whenever a token is present, and exposes `login`/`logout`/`isLoggedIn`/`isAuthLoading`/`user`.
- `api/client.ts`'s `apiRequest<T>()` is the single place that builds headers and handles errors — use it instead of raw `fetch`. A 401 response clears the token and dispatches a custom `auth_expired` window event; `authContext` listens for that event to log the user out. If you add new auth-sensitive behavior, wire it through this event rather than duplicating 401-handling logic elsewhere.
- `ProtectedRoute` / `PublicOnlyRoute` in `src/routes/` gate access by `isLoggedIn` — don't add ad hoc auth checks inside page components.

## Current focus (Phase 2A — Administration)

The Admin Dashboard frontend is implemented on `develop` but not yet released through `main`. It provides an admin-only route/layout, consumes the backend summary/action-items/health endpoints, and includes placeholder routes for the remaining administration modules. Admin User Management is the next planned feature. New admin pages/components should continue the existing `pages/` + `components/` + CSS Modules structure.

## Known contract issues (flag for the `tapit-ai` contract reviewer, don't silently "fix" without checking both sides)

- On `develop`, `types/user.ts` includes `user_type` for admin authorization but is still missing `created_at`; both are present on the backend's `UserResponse`. The currently released `main` branch is also missing `user_type` until the Admin Dashboard is released.
- `types/beta.ts`'s `BetaFeedbackResponse.feedback` is typed as `BetaFeedbackRequest` (the input shape), but the backend actually returns a full `FeedbackResponse` (`feedback_id`, `feedback_status`, `created_at`, etc.) from feedback-submission endpoints.
- Several `BetaFeedback` fields (`contact_info`, `browser_info`, `screen_size`, `version`) are typed as required strings in TS but are optional/nullable in the backend Pydantic schema.

## Testing

No automated test suite. Quality gates today are `npm run lint` and `npm run build` (must pass `tsc` with no errors); both pass on `develop` as of 2026-08-26. `docs/TESTING.md` is the manual regression checklist — keep it updated when you change user-facing behavior.
