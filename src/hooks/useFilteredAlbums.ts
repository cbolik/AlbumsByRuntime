import { useMemo } from 'react';
import { type AlbumData } from '../types/spotify';

const WINDOW_MS = 2.5 * 60 * 1000; // ±2:30 in milliseconds

export function useFilteredAlbums(
  albums: AlbumData[],
  targetMinutes: number | null,
  favoriteIds: Set<string> = new Set(),
): AlbumData[] {
  return useMemo(() => {
    if (targetMinutes === null) return [];

    const targetMs = targetMinutes * 60 * 1000;

    return albums
      .filter((album) => Math.abs(album.durationMs - targetMs) <= WINDOW_MS)
      .sort((a, b) => {
        const aFav = favoriteIds.has(a.id);
        const bFav = favoriteIds.has(b.id);
        if (aFav !== bFav) return aFav ? -1 : 1;
        return Math.abs(a.durationMs - targetMs) - Math.abs(b.durationMs - targetMs);
      });
  }, [albums, targetMinutes, favoriteIds]);
}
