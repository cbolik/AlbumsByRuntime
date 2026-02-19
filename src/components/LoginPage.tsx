import { login } from '../services/spotifyAuth';

export function LoginPage() {
  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
      <div className="bg-neutral-900 rounded-2xl p-10 max-w-md w-full text-center shadow-xl">
        <h1 className="text-3xl font-bold text-white mb-3">Albums by Runtime</h1>
        <p className="text-neutral-400 mb-8">
          Find albums in your Spotify library that match a desired listening duration.
        </p>
        <button
          onClick={login}
          className="bg-[#1ED760] hover:bg-[#1fdf64] text-black font-semibold py-3 px-8 rounded-full transition-colors cursor-pointer"
        >
          Log in with Spotify
        </button>
      </div>
    </div>
  );
}
