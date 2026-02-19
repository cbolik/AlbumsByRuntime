import { useState } from 'react';
import { useAuth } from '../services/AuthContext';
import { useAlbums } from '../hooks/useAlbums';
import { useFilteredAlbums } from '../hooks/useFilteredAlbums';
import { Header } from './Header';
import { DurationPicker } from './DurationPicker';
import { LoadingBar } from './LoadingBar';
import { AlbumGrid } from './AlbumGrid';
import { EmptyState } from './EmptyState';

export function MainPage() {
  const { token, user } = useAuth();
  const { albums, loading, progress, error, retry } = useAlbums(token?.accessToken ?? null);
  const [targetMinutes, setTargetMinutes] = useState<number | null>(null);
  const filtered = useFilteredAlbums(albums, targetMinutes);

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {user && <Header user={user} />}

      <main className="max-w-7xl mx-auto px-6 py-6">
        {loading ? (
          <LoadingBar progress={progress} />
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={retry}
              className="text-[#1ED760] hover:underline cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <DurationPicker value={targetMinutes} onChange={setTargetMinutes} albums={albums} />
              {targetMinutes !== null && (
                <p className="text-neutral-500 text-sm">
                  {filtered.length} album{filtered.length !== 1 ? 's' : ''} found
                </p>
              )}
            </div>

            {targetMinutes === null ? (
              <div className="text-center py-16">
                <p className="text-neutral-500 text-lg">
                  Select a target duration to find matching albums from your library.
                </p>
                <p className="text-neutral-600 text-sm mt-2">
                  {albums.length} album{albums.length !== 1 ? 's' : ''} loaded.
                </p>
              </div>
            ) : filtered.length > 0 ? (
              <AlbumGrid albums={filtered} />
            ) : (
              <EmptyState targetMinutes={targetMinutes} />
            )}
          </>
        )}
      </main>
    </div>
  );
}
