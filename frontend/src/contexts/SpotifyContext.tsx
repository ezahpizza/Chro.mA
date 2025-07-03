import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { api } from '@/lib/api';
import { musicApi } from '@/lib/musicApi';

interface SpotifyContextType {
  spotifyUserId: string | null;
  sessionId: string | null;
  setSpotifyUserId: (userId: string | null) => void;
  setSessionId: (sessionId: string | null) => void;
  isSpotifyConnected: boolean;
  connectSpotify: () => void;
  logout: () => void;
}

const SpotifyContext = createContext<SpotifyContextType | undefined>(undefined);

export const useSpotify = (): SpotifyContextType => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};

interface SpotifyProviderProps {
  children: ReactNode;
}

export function SpotifyProvider({ children }: SpotifyProviderProps) {
  const [spotifyUserId, setSpotifyUserIdState] = useState<string | null>(null);
  const [sessionId, setSessionIdState] = useState<string | null>(null);

  useEffect(() => {
    const savedUserId = sessionStorage.getItem('spotify_user_id');
    const savedSessionId = sessionStorage.getItem('session_id');

    if (savedUserId) setSpotifyUserIdState(savedUserId);
    if (savedSessionId) setSessionIdState(savedSessionId);
  }, []);

  const setSpotifyUserId = (userId: string | null) => {
    setSpotifyUserIdState(userId);
    if (userId) {
      sessionStorage.setItem('spotify_user_id', userId);
    } else {
      sessionStorage.removeItem('spotify_user_id');
    }
  };

  const setSessionId = (id: string | null) => {
    setSessionIdState(id);
    if (id) {
      sessionStorage.setItem('session_id', id);
    } else {
      sessionStorage.removeItem('session_id');
    }
  };

  const connectSpotify = () => {
    window.location.href = musicApi.getSpotifyLoginUrl();
  };

  const logout = async () => {
    const userId = sessionStorage.getItem('spotify_user_id');
    try {
      if (userId) {
        await api.post('/logout', null, {
          params: { spotify_user_id: userId },
        });
      }
    } catch (err) {
      console.warn('Logout failed:', err);
    } finally {
      sessionStorage.clear();
      setSpotifyUserIdState(null);
      setSessionIdState(null);
      window.location.href = '/';
    }
  };

  const isSpotifyConnected = !!spotifyUserId;

  return (
    <SpotifyContext.Provider
      value={{
        spotifyUserId,
        sessionId,
        setSpotifyUserId,
        setSessionId,
        isSpotifyConnected,
        connectSpotify,
        logout,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
}
