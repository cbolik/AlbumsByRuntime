import { useEffect, useRef, useState } from 'react';
import { handleCallback } from '../services/spotifyAuth';
import { useAuth } from '../services/AuthContext';
import { fetchUserProfile } from '../services/spotifyApi';

interface CallbackHandlerProps {
  code: string;
  onDone: () => void;
}

export function CallbackHandler({ code, onDone }: CallbackHandlerProps) {
  const { setAuth } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);

  useEffect(() => {
    // Prevent StrictMode double-execution — the first run consumes the code verifier
    if (started.current) return;
    started.current = true;

    handleCallback(code)
      .then(async (token) => {
        const user = await fetchUserProfile(token.accessToken);
        setAuth(token, user);
        onDone();
      })
      .catch((err) => setError(err.message));
  }, [code, setAuth, onDone]);

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="bg-neutral-900 rounded-2xl p-10 max-w-md text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <a href={import.meta.env.BASE_URL} className="text-[#1ED760] hover:underline">Try again</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
      <p className="text-neutral-400">Logging in...</p>
    </div>
  );
}
