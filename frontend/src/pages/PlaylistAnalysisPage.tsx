import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PageHeader from '@/components/ui/PageHeader';
import PlaylistUrlForm from '@/components/music/PlaylistUrlForm';
import PlaylistSelector from '@/components/music/PlaylistSelector';
import MoodResultDisplay from '@/components/music/MoodResultDisplay';
import PlaylistCreationModal from '@/components/music/PlaylistCreationModal';
import { usePlaylistAnalysis } from '@/hooks/usePlaylistAnalysis';


const PlaylistAnalysisPage = () => {
  const navigate = useNavigate();
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  
  const {
    sessionMoodResult,
    selectedPlaylist,
    userPlaylists,
    loadingPlaylists,
    isSpotifyConnected,
    sessionId,
    analysisMutation,
    playlistMutation,
    handleUrlSubmit,
    handlePlaylistSelection,
    handlePlaylistSubmit,
    resetPlaylistModal,
  } = usePlaylistAnalysis();

  const onPlaylistModalClose = () => {
    setIsPlaylistModalOpen(false);
    resetPlaylistModal();
  };

  const onPlaylistSubmit = (request: any) => {
    handlePlaylistSubmit(request);
    setIsPlaylistModalOpen(false);
  };

  return (
    <div className="select-none min-h-screen bg-almond-white flex flex-col items-center justify-center p-2 sm:p-6 overflow-x-hidden overflow-y-auto scrollbar-custom">

      <div className="w-full max-w-8xl space-y-6">

        <PageHeader title="Share A Playlist to See if It Matches Your Vibe" />
        <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 1,
                  type: "spring",
                  stiffness: 100
                }}
                className="space-y-6"
              >
          <PlaylistUrlForm 
            onSubmit={handleUrlSubmit}
            isLoading={analysisMutation.isPending}
          />

          {isSpotifyConnected ? (
            <PlaylistSelector
              playlists={userPlaylists || []}
              selectedPlaylist={selectedPlaylist}
              onPlaylistSelect={handlePlaylistSelection}
              isLoading={loadingPlaylists}
            />
          ) : (
            <div className="space-y-6 max-w-5xl mx-auto mt-5 scrollbar-custom">
              <Card className="bg-tile-green">
              <CardContent className="text-center py-8">
                <p className="font-biorhyme font-semibold text-persian-indigo mb-4">
                  Connect your Spotify account to analyze your playlists
                </p>
                <Button
                  onClick={() => navigate('/')}
                  className="bg-rose-pink hover:bg-rose-pink/90 text-white font-fira-code border-black border-r-4 border-b-4 hover:border-none"
                >
                  Connect Spotify
                </Button>
              </CardContent>
            </Card></div>
          )}
        </motion.div>

        {sessionMoodResult && (
          <MoodResultDisplay
            moodResult={sessionMoodResult.mood_response}
            onCreatePlaylist={() => setIsPlaylistModalOpen(true)}
            canCreatePlaylist={isSpotifyConnected && !!sessionId}
          />
        )}

        <PlaylistCreationModal
          isOpen={isPlaylistModalOpen}
          onClose={onPlaylistModalClose}
          onSubmit={onPlaylistSubmit}
          isLoading={playlistMutation.isPending}
        />
      </div>
    </div>
  );
};

export default PlaylistAnalysisPage;
