import { useState, useEffect, useCallback } from 'react';
import { type AlbumData } from '../types/spotify';
import { fetchAllAlbums, type AlbumFetchProgress } from '../services/spotifyApi';

interface UseAlbumsResult {
  albums: AlbumData[];
  loading: boolean;
  progress: AlbumFetchProgress | null;
  error: string | null;
  retry: () => void;
}

export function useAlbums(accessToken: string | null): UseAlbumsResult {
  const [albums, setAlbums] = useState<AlbumData[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<AlbumFetchProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  useEffect(() => {
    if (!accessToken) return;

    let cancelled = false;
    setLoading(true);
    setError(null);
    setProgress(null);

    fetchAllAlbums(accessToken, (p) => {
      if (!cancelled) setProgress(p);
    })
      .then((result) => {
        if (!cancelled) {
          setAlbums(result);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [accessToken, attempt]);

  return { albums, loading, progress, error, retry };
}
