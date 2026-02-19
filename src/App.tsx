import { useState, useCallback, useEffect } from 'react';
import { AuthProvider, useAuth } from './services/AuthContext';
import { LoginPage } from './components/LoginPage';
import { CallbackHandler } from './components/CallbackHandler';
import { MainPage } from './components/MainPage';

function getAuthCode(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get('code');
}

function getAuthError(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get('error');
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  const [pendingCode, setPendingCode] = useState<string | null>(getAuthCode);
  const [authError] = useState<string | null>(getAuthError);

  // Clear URL params once we've captured the code
  useEffect(() => {
    if (pendingCode || authError) {
      window.history.replaceState({}, '', import.meta.env.BASE_URL);
    }
  }, [pendingCode, authError]);

  const onCallbackDone = useCallback(() => setPendingCode(null), []);

  if (authError) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="bg-neutral-900 rounded-2xl p-10 max-w-md text-center">
          <p className="text-red-400 mb-4">Spotify authorization failed: {authError}</p>
          <a href={import.meta.env.BASE_URL} className="text-[#1ED760] hover:underline">Try again</a>
        </div>
      </div>
    );
  }

  if (pendingCode) {
    return <CallbackHandler code={pendingCode} onDone={onCallbackDone} />;
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <MainPage />;
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
