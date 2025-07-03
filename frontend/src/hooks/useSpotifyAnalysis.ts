import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { SpotifyAnalysisController } from '@/controllers/spotifyAnalysisController';
import { musicApi } from '@/lib/musicApi';
import { useSpotify } from '@/contexts/SpotifyContext';
import { SessionMoodResponse, PlaylistCreateRequest } from '@/types/music';

export const useSpotifyAnalysis = () => {
  const { spotifyUserId, sessionId, setSessionId, isSpotifyConnected } = useSpotify();
  const [sessionMoodResult, setSessionMoodResult] = useState<SessionMoodResponse | null>(null);

  const analysisMutation = useMutation({
    mutationFn: ({ userId, count }: { userId: string; count: number }) => 
      SpotifyAnalysisController.analyzeSpotifyTracks(userId, count),
    onSuccess: (data) => {
      setSessionMoodResult(data);
      if (data.session_id) {
        setSessionId(data.session_id);
      }
      toast.success('We analysed your Spotify history and \n found some more tracks! Enjoy!!');
    },
    onError: (error) => {
      toast.error('Failed to analyze Spotify tracks. Please try again.');
    }
  });

  const playlistMutation = useMutation({
    mutationFn: async (request: PlaylistCreateRequest) => {
      if (!spotifyUserId || !sessionId) {
        throw new Error('Missing Spotify user ID or session ID');
      }
      return musicApi.createPlaylist(spotifyUserId, request, sessionId, true);
    },
    onSuccess: () => {
      toast.success('Playlist created successfully!');
    },
    onError: (error) => {
      toast.error('Failed to create playlist. Please try again.');
    }
  });

  const handleAnalyzeSpotify = (count: number) => {
    if (!spotifyUserId) {
      toast.error('Please connect your Spotify account first.');
      return;
    }
    analysisMutation.mutate({ userId: spotifyUserId, count });
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

  return {
    sessionMoodResult,
    isSpotifyConnected,
    sessionId,
    analysisMutation,
    playlistMutation,
    handleAnalyzeSpotify,
    handlePlaylistSubmit,
  };
};
