# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

AlbumsByRuntime is a client-only React SPA that helps Spotify users find albums from their library matching a desired listening duration (e.g., "show me albums around 45 minutes long"). No backend — pure browser app using Spotify OAuth 2.0 PKCE.

## Commands

- `npm run dev` — Start Vite dev server (http://127.0.0.1:5173)
- `npm run build` — TypeScript compile + Vite production build
- `npm run lint` — ESLint
- `npm run preview` — Preview production build

## Environment

Requires a `.env` file (see `.env.example`):
- `VITE_SPOTIFY_CLIENT_ID` — Required. From Spotify Developer Dashboard.
- `VITE_SPOTIFY_REDIRECT_URI` — Optional. Defaults to `{origin}/callback`.

Spotify Dashboard redirect URI must use `127.0.0.1`, not `localhost`.

## Architecture

**Auth flow:** `LoginPage` → Spotify OAuth redirect → `CallbackHandler` exchanges code for token → token + user profile stored in `AuthContext` (in-memory only, lost on reload). Uses PKCE so no client secret needed. `CallbackHandler` uses a `useRef` guard to prevent StrictMode double-execution from consuming the code verifier twice.

**Data flow:** `useAlbums` hook fetches all saved albums from `/me/albums` (paginated, 50/page) on login, summing `track.duration_ms` per album. Albums with >50 tracks trigger additional `/albums/{id}/tracks` calls. Progress reported via callback. Rate limits handled by retrying on 429 with `Retry-After`. All album data cached in React state — filtering is instant after initial load.

**Filtering:** `useFilteredAlbums` hook filters cached albums within ±2:30 of selected target, sorted by absolute deviation. `DurationPicker` disables options with no matching albums.

**Album tiles:** Click tries `spotify:album:{id}` URI to open native app; falls back to web URL after 500ms if browser doesn't lose focus (indicating no app handled the URI).

## Key Types

`AlbumData` (id, name, artist, coverArtUrl, durationMs, spotifyUrl), `UserProfile`, `TokenData` — all in `src/types/spotify.ts`.

## Spotify Design Compliance

- Must display Spotify logo when showing Spotify metadata (white logo on dark bg)
- Album art: rounded corners (8px), no cropping/overlays/distortion
- Spotify Green: `#1ED760` (not `#1DB954`)
- App name must not include "Spotify"; "for Spotify" is acceptable

## Roadmap

See `Plan.md` for v1b (playlist support with tabs) and v2 (Web Playback SDK + countdown timer).
