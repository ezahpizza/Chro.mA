import { api } from '@/lib/api';
import { 
  ManualMoodRequest, 
  SessionMoodResponse, 
  PlaylistCreateRequest, 
  PlaylistCreateResponse,
  PlaylistSummary
} from '@/types/music';

export const musicApi = {
  // Analyze mood from manual song input
  analyzeMood: async (request: ManualMoodRequest): Promise<SessionMoodResponse> => {
    const response = await api.post<SessionMoodResponse>('/songs/manual', request);
    return response.data;
  },

  // Analyze mood from Spotify recent tracks
  analyzeSpotifyMood: async (spotifyUserId: string, count: number = 1): Promise<SessionMoodResponse> => {
    const response = await api.get<SessionMoodResponse>('/songs/spotify', {
      params: { spotify_user_id: spotifyUserId, count }
    });
    return response.data;
  },

  // Analyze playlist mood
  analyzePlaylist: async (playlistId: string, spotifyUserId: string): Promise<SessionMoodResponse> => {
    const response = await api.get<SessionMoodResponse>(`/playlist/analyze/${playlistId}`, {
      params: { spotify_user_id: spotifyUserId }
    });
    return response.data;
  },

  // Get user playlists
  getUserPlaylists: async (spotifyUserId: string, limit: number = 20, offset: number = 0): Promise<PlaylistSummary[]> => {
    const response = await api.get<PlaylistSummary[]>('/playlist/user', {
      params: { spotify_user_id: spotifyUserId, limit, offset }
    });
    return response.data;
  },

  // Create Spotify playlist
  createPlaylist: async (
    spotifyUserId: string, 
    request: PlaylistCreateRequest,
    sessionId?: string,
    deleteAfterUse: boolean = true
  ): Promise<PlaylistCreateResponse> => {
    const params: any = { spotify_user_id: spotifyUserId };
    if (sessionId) {
      params.session_id = sessionId;
      params.delete_after_use = deleteAfterUse;
    }

    const response = await api.post<PlaylistCreateResponse>('/playlist/create', request, {
      params
    });
    return response.data;
  },

  // Spotify auth URLs
  getSpotifyLoginUrl: () => {
    return `${api.defaults.baseURL}/login`;
  }
};
