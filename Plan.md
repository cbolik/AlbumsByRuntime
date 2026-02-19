# AlbumsByRuntime — Design & Implementation Plan

## Purpose

A single-page web app that helps Spotify users find albums from their library matching a desired listening duration. The core use case is focus/activity sessions: pick how long you want to listen (e.g., 45 minutes), and the app shows you albums from your library that are close to that length, so you can put one on and focus until it ends.

## Design Decisions

### Stack
- **React + Vite + TypeScript** — modern SPA, fast dev server
- **Tailwind CSS** — utility-first styling, rapid prototyping
- **No backend** — pure client-side app using OAuth 2.0 PKCE flow

### Authentication
- Spotify OAuth 2.0 Authorization Code with PKCE (client-only, no secret)
- Scopes: `user-library-read`
- Token stored in memory (not localStorage) for security
- Requires a registered Spotify Developer App with a Client ID
- Redirect URI: `http://127.0.0.1:5173/callback` (dev), configurable for production

### Data Loading Strategy
- Fetch all saved albums upfront after login, with a progress indicator
- The `/me/albums` endpoint returns track details including `duration_ms`, so no separate track-fetching calls are needed
- Album data (id, name, artist, cover art URL, total duration, Spotify URI) cached in React state
- Subsequent duration selections filter the cached data — instant, no API calls
- Rate limit handling: respect `429` responses with `Retry-After` backoff

### Duration Selection
- Dropdown with 5-minute increments from 10 to 120 minutes
- Matching window: ±2 minutes 30 seconds from selected duration
- Results sorted by absolute deviation from target (closest match first)

### Album Display
- Responsive CSS Grid of square album cover art tiles (~200px)
- Each tile shows: cover art, album name, artist name, formatted total duration
- Hover effect: subtle scale-up
- Click: opens the album in Spotify Web Player (`https://open.spotify.com/album/{id}`) in a new tab
- Empty state message when no albums match

### Visual Design
- Dark theme (dark gray/black background, white text) — Spotify-esque aesthetic
- Spotify green (#1DB954) for accent/CTA elements
- Login page: centered card with app name and "Log in with Spotify" button
- Main page: header with user info + logout, duration picker, album grid

## Component Architecture

```
App
├── LoginPage          — Spotify login button, initiates OAuth PKCE flow
├── CallbackHandler    — Handles OAuth redirect, extracts auth code, exchanges for token
├── MainPage           — Shown after auth
│   ├── Header         — App title, user avatar/name, logout button
│   ├── DurationPicker — Dropdown: 10–120 min in 5-min steps
│   ├── LoadingBar     — Progress bar during initial album fetch
│   ├── AlbumGrid      — Responsive CSS grid of AlbumTile components
│   │   └── AlbumTile  — Cover art + name + artist + duration
│   └── EmptyState     — "No albums match" message
└── (v2) PlayerBar     — Playback controls + countdown timer
```

### State Management
- React Context + `useReducer` for auth state (token, user profile)
- `useAlbums` custom hook for fetching and caching album data with progress
- `useMemo` for filtering/sorting albums by selected duration — derived state, no separate store needed

### Key Types
```typescript
interface AlbumData {
  id: string;
  name: string;
  artist: string;        // primary artist name
  coverArtUrl: string;   // from images array, pick 300px size
  durationMs: number;    // sum of all track durations
  spotifyUrl: string;    // external_urls.spotify
}
```

## v1b — Playlist Support (Future)

- Add user's playlists alongside albums, separated by tabs (Albums | Playlists)
- Additional scopes: `playlist-read-private`, `playlist-read-collaborative`
- Fetch playlists via `GET /me/playlists`, then `GET /playlists/{id}/tracks` per playlist to compute total duration
- Same duration picker, matching window (±2:30), and sort-by-deviation logic applies
- Reuse the tile grid layout; playlist tiles show playlist cover art (auto-generated mosaic or user-uploaded)
- Each tile shows: cover art, playlist name, creator name, formatted total duration
- Click: opens playlist in Spotify Web Player
- **API load note:** one extra API call per playlist to get tracks — parallelize with a concurrency limit (e.g., 5 concurrent) and respect rate limits
- **Data types:** add `PlaylistData` type mirroring `AlbumData`, plus a `usePlaylists` hook similar to `useAlbums`
- **UI:** tab bar between duration picker and grid; both tabs share the same duration selection

## v2 — Playback & Focus Timer (Future)

- Integrate Spotify Web Playback SDK to play albums directly in the app
- Additional scopes: `streaming`, `user-modify-playback-state`
- Premium-only feature; non-Premium users fall back to "Open in Spotify"
- Countdown timer showing remaining album duration
- Use case: click an album, it starts playing, timer counts down to zero

## Implementation Plan

### Step 1: Project Scaffolding
- Initialize Vite + React + TypeScript project
- Install and configure Tailwind CSS
- Set up project structure: `src/components/`, `src/hooks/`, `src/services/`, `src/types/`
- Configure environment variable for Spotify Client ID (`VITE_SPOTIFY_CLIENT_ID`)

### Step 2: Spotify OAuth PKCE Flow
- Implement PKCE utilities: code verifier/challenge generation
- Create `SpotifyAuth` service with `login()`, `handleCallback()`, `getToken()`, `logout()`
- Build `LoginPage` component with "Log in with Spotify" button
- Build `CallbackHandler` route component to process OAuth redirect
- Set up React Context for auth state (token, user info)
- Add route handling (React Router or simple state-based routing)

### Step 3: Album Data Fetching
- Implement `SpotifyApi` service for authenticated API calls with rate-limit retry
- Build `useAlbums` hook:
  - Paginate through `GET /me/albums` (50 per page)
  - For each album, sum `track.duration_ms` across all tracks in the response
  - Report progress (albums loaded / total)
  - Return array of `AlbumData` objects
- Build `LoadingBar` component to show fetch progress

### Step 4: Duration Picker & Filtering
- Build `DurationPicker` component (dropdown, 10–120 min, 5-min steps)
- Implement filtering logic: keep albums within ±2:30 of target
- Implement sorting: by absolute deviation from target (ascending)
- Wire up to cached album data via `useMemo`

### Step 5: Album Grid Display
- Build `AlbumTile` component: cover art, name, artist, formatted duration
- Build `AlbumGrid` component: responsive CSS Grid layout
- Build `EmptyState` component for no-match scenarios
- Add hover effects and click-to-open-in-Spotify behavior

### Step 6: Main Page Assembly & Header
- Build `Header` component with app title, user info (avatar + name), logout button
- Fetch user profile (`GET /me`) for display name and avatar
- Assemble `MainPage` with Header, DurationPicker, LoadingBar/AlbumGrid/EmptyState

### Step 7: Polish & Edge Cases
- Handle token expiry (prompt re-login)
- Handle API errors gracefully (show error messages)
- Responsive design testing (mobile, tablet, desktop)
- Empty library handling
- Add favicon and page title
