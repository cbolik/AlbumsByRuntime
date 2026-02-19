import { useCallback } from 'react';
import { type AlbumData } from '../types/spotify';

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

interface AlbumTileProps {
  album: AlbumData;
}

export function AlbumTile({ album }: AlbumTileProps) {
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const spotifyUri = `spotify:album:${album.id}`;
    const webUrl = album.spotifyUrl;

    // Try the native Spotify URI; fall back to web URL after a short delay
    const fallbackTimeout = setTimeout(() => {
      window.open(webUrl, '_blank', 'noopener,noreferrer');
    }, 500);

    // If the page loses focus, the app handled the URI — cancel the fallback
    const onBlur = () => {
      clearTimeout(fallbackTimeout);
      window.removeEventListener('blur', onBlur);
    };
    window.addEventListener('blur', onBlur);

    window.location.href = spotifyUri;
  }, [album.id, album.spotifyUrl]);

  return (
    <a
      href={album.spotifyUrl}
      onClick={handleClick}
      className="group block rounded-lg overflow-hidden bg-neutral-900 hover:bg-neutral-800 transition-all duration-200 hover:scale-[1.03]"
    >
      <div className="aspect-square overflow-hidden p-3 pb-0">
        <img
          src={album.coverArtUrl}
          alt={`${album.name} by ${album.artist}`}
          className="w-full h-full object-cover rounded-lg"
          loading="lazy"
        />
      </div>
      <div className="p-3">
        <p className="text-white text-sm font-medium truncate">{album.name}</p>
        <p className="text-neutral-400 text-xs truncate">{album.artist}</p>
        <p className="text-neutral-500 text-xs mt-1">{formatDuration(album.durationMs)}</p>
      </div>
    </a>
  );
}
