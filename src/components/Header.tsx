import { type UserProfile } from '../types/spotify';
import { logout } from '../services/spotifyAuth';
import { SpotifyLogo } from './SpotifyLogo';

interface HeaderProps {
  user: UserProfile;
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-white">Albums by Runtime</h1>
        <SpotifyLogo className="h-5 opacity-70" />
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.displayName}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center text-sm font-medium">
              {user.displayName.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="text-neutral-300 text-sm hidden sm:inline">{user.displayName}</span>
        </div>
        <button
          onClick={logout}
          className="text-neutral-500 hover:text-white text-sm transition-colors cursor-pointer"
        >
          Log out
        </button>
      </div>
    </header>
  );
}
