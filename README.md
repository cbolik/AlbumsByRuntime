# Albums by Runtime

A web app that finds albums in your Spotify library matching a desired listening duration. Select a target time (e.g., 45 minutes) and see which albums in your saved library are close to that length — useful for focus sessions, workouts, or any activity where you want music that fits a specific time window.

## Features

- Browse saved Spotify albums filtered by total runtime (10–120 minutes, 5-minute increments)
- Albums within ±2:30 of the selected duration are shown, sorted by closest match
- Per-duration favorites: star albums as go-tos for a specific session length
- Animated grid reordering when starring/unstarring albums
- Click an album tile to open it in the Spotify app (falls back to web player)
- Responsive grid layout with album cover art
- Client-only — no backend required

## Prerequisites

- Node.js 20+
- A [Spotify Developer](https://developer.spotify.com/dashboard) app with a Client ID

## Setup

1. Clone the repo and install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file from the template:
   ```
   cp .env.example .env
   ```

3. Add your Spotify Client ID to `.env`:
   ```
   VITE_SPOTIFY_CLIENT_ID=your_client_id_here
   ```

4. In the Spotify Developer Dashboard, add a redirect URI:
   ```
   http://127.0.0.1:5173/callback
   ```

## Development

```
npm run dev
```

Opens the app at `http://127.0.0.1:5173`. Use this URL (not `localhost`) to match the registered redirect URI.

## Deploying to GitHub Pages

The repo includes a GitHub Actions workflow that deploys to GitHub Pages on every push to `master`.

### One-time setup

1. In your repo's GitHub settings, go to **Settings > Pages** and set Source to **GitHub Actions**
2. Go to **Settings > Secrets and variables > Actions > Variables** and add:
   - `SPOTIFY_CLIENT_ID` — your Spotify app's Client ID
3. In the Spotify Developer Dashboard, add the GitHub Pages redirect URI:
   ```
   https://<username>.github.io/AlbumsByRuntime/callback
   ```

After setup, every push to `master` will automatically build and deploy.

### Manual build for GitHub Pages

```
npm run build:ghpages
```

The output is in `dist/`, configured with the base path `/AlbumsByRuntime/`.

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS 4
- Framer Motion (grid reorder animation)
- Spotify Web API with OAuth 2.0 PKCE (no client secret needed)
