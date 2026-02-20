import { useState, useCallback } from 'react';

const STORAGE_KEY = 'albums_by_runtime_favorites';

type FavoritesMap = Record<number, string[]>;

function loadFavorites(): FavoritesMap {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveFavorites(favorites: FavoritesMap): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

interface UseFavoritesResult {
  isFavorite: (albumId: string) => boolean;
  toggleFavorite: (albumId: string) => void;
  favoriteIds: Set<string>;
}

export function useFavorites(targetMinutes: number | null): UseFavoritesResult {
  const [favorites, setFavorites] = useState<FavoritesMap>(loadFavorites);

  const ids = targetMinutes !== null
    ? new Set(favorites[targetMinutes] ?? [])
    : new Set<string>();

  const isFavorite = useCallback(
    (albumId: string) => ids.has(albumId),
    [ids],
  );

  const toggleFavorite = useCallback(
    (albumId: string) => {
      if (targetMinutes === null) return;

      setFavorites((prev) => {
        const current = prev[targetMinutes] ?? [];
        const next = current.includes(albumId)
          ? current.filter((id) => id !== albumId)
          : [...current, albumId];

        const updated = { ...prev, [targetMinutes]: next };
        saveFavorites(updated);
        return updated;
      });
    },
    [targetMinutes],
  );

  return { isFavorite, toggleFavorite, favoriteIds: ids };
}
