import { type AlbumData, type UserProfile } from '../types/spotify';

const API_BASE = 'https://api.spotify.com/v1';

async function apiFetch(path: string, token: string): Promise<Response> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.status === 429) {
    const retryAfter = parseInt(response.headers.get('Retry-After') || '1', 10);
    await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
    return apiFetch(path, token);
  }

  if (response.status === 401) {
    throw new Error('Session expired — please log in again.');
  }

  if (!response.ok) {
    throw new Error(`Spotify API error: ${response.status} on ${path}`);
  }

  return response;
}

export async function fetchUserProfile(token: string): Promise<UserProfile> {
  const res = await apiFetch('/me', token);
  const data = await res.json();
  return {
    id: data.id,
    displayName: data.display_name ?? data.id,
    avatarUrl: data.images?.[0]?.url ?? null,
  };
}

export interface AlbumFetchProgress {
  loaded: number;
  total: number;
}

export async function fetchAllAlbums(
  token: string,
  onProgress?: (progress: AlbumFetchProgress) => void,
): Promise<AlbumData[]> {
  const albums: AlbumData[] = [];
  let offset = 0;
  const limit = 50;
  let total = 0;

  do {
    const res = await apiFetch(`/me/albums?limit=${limit}&offset=${offset}`, token);
    const data = await res.json();
    total = data.total;

    for (const item of data.items) {
      const album = item.album;
      let durationMs = album.tracks.items.reduce(
        (sum: number, track: { duration_ms: number }) => sum + track.duration_ms,
        0,
      );

      // Handle albums with >50 tracks (paginated track listing)
      if (album.tracks.total > album.tracks.items.length) {
        let trackOffset = album.tracks.items.length;
        while (trackOffset < album.tracks.total) {
          const trackRes = await apiFetch(
            `/albums/${album.id}/tracks?limit=50&offset=${trackOffset}`,
            token,
          );
          const trackData = await trackRes.json();
          durationMs += trackData.items.reduce(
            (sum: number, track: { duration_ms: number }) => sum + track.duration_ms,
            0,
          );
          trackOffset += trackData.items.length;
        }
      }

      albums.push({
        id: album.id,
        name: album.name,
        artist: album.artists.map((a: { name: string }) => a.name).join(', '),
        coverArtUrl: album.images?.[1]?.url ?? album.images?.[0]?.url ?? '',
        durationMs,
        spotifyUrl: album.external_urls.spotify,
      });
    }

    offset += limit;
    onProgress?.({ loaded: albums.length, total });
  } while (offset < total);

  return albums;
}
