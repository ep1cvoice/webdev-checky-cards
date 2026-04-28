# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start dev server
npm run build     # production build
npm run lint      # ESLint
npm run preview   # preview production build
```

## Environment

Requires `.env` with:
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
```

## Architecture

**Stack:** React 19, Vite, Supabase (auth + Postgres), React Router v7, CSS Modules. No TypeScript yet (migration in progress on this branch).

### Auth flow

`AuthProvider` (`src/auth/authProvider/AuthProvider.jsx`) is the top-level gate. It subscribes to `supabase.auth.onAuthStateChange` and exposes `AuthContext` with `{ isAuth, user, hasUserCards, signIn, signUp, signOut, copyCards, deleteAllCards, deleteAccount }`. While resolving, it renders `SplashScreen` (1.5s minimum on first session visit via `sessionStorage`).

Consume auth with `useAuth()` from `src/hooks/useAuth.js`.

### Two-table card system

- `cards` — global read-only deck, visible to everyone (unauthenticated or authenticated without a personal copy)
- `user_cards` — personal copy per user; created via Supabase RPC `copy_global_cards_for_user`

`HomePage` switches between tables based on `isAuth && hasUserCards`. The `completed` sort option only appears for `user_cards`.

### Routing

Defined in `src/components/App.jsx`. Two route wrappers:
- `ProtectedRoute` — redirects to `/login` if not authenticated
- `GuestRoute` — redirects to `/` if already authenticated

All routes render inside `MainLayout` which includes the `Header`.

### Data fetching

`useFetch(callback)` (`src/hooks/useFetch.js`) wraps any async function and returns `[fn, isLoading, error]`. Direct Supabase calls in pages/components are also used for more complex queries.

### Theming

`ThemeContext` stores `'light' | 'dark' | 'system'` in `localStorage` and sets `data-theme` on `<html>`. CSS variables are defined in `src/components/index.css` — always use them (`--main-bg-color`, `--text-color`, etc.) for any new styles to support both themes automatically.

### SVG imports

Uses `vite-plugin-svgr`. Import SVGs as React components with the `?react` suffix:
```js
import TagLogo from '../../assets/html-tag.svg?react';
```
