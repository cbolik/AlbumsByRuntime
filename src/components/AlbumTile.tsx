import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { type AlbumData } from '../types/spotify';

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

interface AlbumTileProps {
  album: AlbumData;
  starred?: boolean;
  onToggleStar?: () => void;
}

export function AlbumTile({ album, starred = false, onToggleStar }: AlbumTileProps) {
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const spotifyUri = `spotify:album:${album.id}`;
    const webUrl = album.spotifyUrl;

    const fallbackTimeout = setTimeout(() => {
      window.open(webUrl, '_blank', 'noopener,noreferrer');
    }, 500);

    const onBlur = () => {
      clearTimeout(fallbackTimeout);
      window.removeEventListener('blur', onBlur);
    };
    window.addEventListener('blur', onBlur);

    window.location.href = spotifyUri;
  }, [album.id, album.spotifyUrl]);

  const handleStarClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleStar?.();
  }, [onToggleStar]);

  return (
    <motion.div layout transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
      <a
        href={album.spotifyUrl}
        onClick={handleClick}
        className="group block rounded-lg overflow-hidden bg-neutral-900 hover:bg-neutral-800 transition-colors duration-200 hover:scale-[1.03]"
      >
        <div className="relative aspect-square p-3 pb-0">
          <img
            src={album.coverArtUrl}
            alt={`${album.name} by ${album.artist}`}
            className="w-full h-full object-cover rounded-lg"
            loading="lazy"
          />
          {onToggleStar && (
            <button
              onClick={handleStarClick}
              className={`absolute top-5 right-5 p-1 rounded-full bg-black/50 backdrop-blur-sm transition-opacity cursor-pointer ${
                starred ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}
              aria-label={starred ? 'Remove from favorites' : 'Add to favorites'}
            >
              {starred ? (
                <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
              )}
            </button>
          )}
        </div>
        <div className="p-3">
          <p className="text-white text-sm font-medium truncate">{album.name}</p>
          <p className="text-neutral-400 text-xs truncate">{album.artist}</p>
          <p className="text-neutral-500 text-xs mt-1">{formatDuration(album.durationMs)}</p>
        </div>
      </a>
    </motion.div>
  );
}
