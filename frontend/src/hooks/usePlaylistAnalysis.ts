import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { PlaylistAnalysisController } from '@/controllers/playlistAnalysisController';
import { musicApi } from '@/lib/musicApi';
import { useSpotify } from '@/contexts/SpotifyContext';
import { SessionMoodResponse, PlaylistCreateRequest, PlaylistSummary } from '@/types/music';

export const usePlaylistAnalysis = () => {
  const { spotifyUserId, sessionId, setSessionId, isSpotifyConnected } = useSpotify();
  const [sessionMoodResult, setSessionMoodResult] = useState<SessionMoodResponse | null>(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistSummary | null>(null);

  // Fetch user playlists
  const { data: userPlaylists, isLoading: loadingPlaylists } = useQuery({
    queryKey: ['userPlaylists', spotifyUserId],
    queryFn: () => PlaylistAnalysisController.getUserPlaylists(spotifyUserId!),
    enabled: !!spotifyUserId && isSpotifyConnected,
  });

  const analysisMutation = useMutation({
    mutationFn: ({ playlistId, userId }: { playlistId: string; userId: string }) => 
      PlaylistAnalysisController.analyzePlaylistById(playlistId, userId),
    onSuccess: (data) => {
      console.log('Playlist analysis response:', data);
      setSessionMoodResult(data);
      if (data.session_id) {
        setSessionId(data.session_id);
      }
      toast.success('We analysed your playlist, \n hope you enjoy the recs!!');
    },
    onError: (error) => {
      console.error('Playlist analysis failed:', error);
      toast.error('Failed to analyze playlist. Please try again.');
    }
  });

  const playlistMutation = useMutation({
    mutationFn: async (request: PlaylistCreateRequest) => {
      if (!spotifyUserId || !sessionId) {
        throw new Error('Missing Spotify user ID or session ID');
      }
      return musicApi.createPlaylist(spotifyUserId, request, sessionId, true);
    },
    onSuccess: (data) => {
      toast.success('Playlist created successfully!');
    },
    onError: (error) => {
      console.error('Playlist creation failed:', error);
      toast.error('Failed to create playlist. Please try again.');
    }
  });

  const handleUrlSubmit = (url: string) => {
    if (!spotifyUserId) {
      toast.error('Please connect your Spotify account first.');
      return;
    }

    const playlistId = PlaylistAnalysisController.extractPlaylistId(url);
    if (!playlistId) {
      toast.error('Invalid Spotify playlist URL. Please check the format.');
      return;
    }

    analysisMutation.mutate({ playlistId, userId: spotifyUserId });
  };

  const handlePlaylistSelection = (playlist: PlaylistSummary) => {
    setSelectedPlaylist(playlist);
    if (!spotifyUserId) {
      toast.error('Please connect your Spotify account first.');
      return;
    }

    analysisMutation.mutate({ playlistId: playlist.id, userId: spotifyUserId });
  };

  const handlePlaylistSubmit = (request: PlaylistCreateRequest) => {
    if (!isSpotifyConnected) {
      toast.error('Please connect your Spotify account first');
      return;
    }
    
    if (sessionMoodResult?.mood_response) {
      const allTracks = [
        ...sessionMoodResult.mood_response.recommendations.similar_mood,
        ...sessionMoodResult.mood_response.recommendations.uplifting_alternatives
      ];
      request.tracks = allTracks;
    }
    
    playlistMutation.mutate(request);
  };

  const resetPlaylistModal = () => {
    setSessionId(null);
  };

  return {
    // State
    sessionMoodResult,
    selectedPlaylist,
    userPlaylists,
    loadingPlaylists,
    isSpotifyConnected,
    sessionId,
    
    // Mutations
    analysisMutation,
    playlistMutation,
    
    // Handlers
    handleUrlSubmit,
    handlePlaylistSelection,
    handlePlaylistSubmit,
    resetPlaylistModal,
  };
};
