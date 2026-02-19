import { type AlbumFetchProgress } from '../services/spotifyApi';

interface LoadingBarProps {
  progress: AlbumFetchProgress | null;
}

export function LoadingBar({ progress }: LoadingBarProps) {
  const percent = progress && progress.total > 0
    ? Math.round((progress.loaded / progress.total) * 100)
    : 0;

  return (
    <div className="max-w-md mx-auto mt-16 text-center">
      <p className="text-neutral-400 mb-4">
        Loading albums...{' '}
        {progress && (
          <span className="text-white font-medium">
            {progress.loaded} / {progress.total}
          </span>
        )}
      </p>
      <div className="w-full bg-neutral-800 rounded-full h-2">
        <div
          className="bg-[#1ED760] h-2 rounded-full transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
