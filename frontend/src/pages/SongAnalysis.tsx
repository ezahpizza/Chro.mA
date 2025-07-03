import { useState } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import SongAnalysisForm from '@/components/music/SongAnalysisForm';
import MoodResultDisplay from '@/components/music/MoodResultDisplay';
import { useSongAnalysis } from '@/hooks/useSongAnalysis';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';
import PlaylistCreationModal from '@/components/music/PlaylistCreationModal';


const SongAnalysis = () => {

  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const {
    sessionMoodResult,
    isSpotifyConnected,
    sessionId,
    analysisMutation,
    playlistMutation,
    handleSongAnalysis,
    handlePlaylistSubmit,
  } = useSongAnalysis();

  const handleCreatePlaylist = () => {
    if (!isSpotifyConnected) {
      toast({
        title: 'Spotify Not Connected',
        description: 'Please connect your Spotify account to create a playlist.',
        variant: 'destructive',
      });
      return;
    }
    setIsPlaylistModalOpen(true);
  };

  return (
    <div className="select-none min-h-screen bg-almond-white flex flex-col items-center justify-center p-2 sm:p-6 overflow-x-hidden overflow-y-auto">
      <div className="w-full max-w-8xl space-y-6">
        <PageHeader title="Pick a Song You've Been Listening To" />
        <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 1,
                  type: "spring",
                  stiffness: 100
                }} 
                className="space-y-6">
          <SongAnalysisForm
            onSubmit={handleSongAnalysis}
            isLoading={analysisMutation.isPending}
          />
          {sessionMoodResult && (
            <MoodResultDisplay
              moodResult={sessionMoodResult.mood_response}
              onCreatePlaylist={handleCreatePlaylist}
              canCreatePlaylist={!!sessionId}
            />
          )}
        </motion.div>
        <PlaylistCreationModal
          isOpen={isPlaylistModalOpen}
          onClose={() => setIsPlaylistModalOpen(false)}
          onSubmit={handlePlaylistSubmit}
          isLoading={playlistMutation?.isPending}
        />
      </div>
    </div>
  );
};

export default SongAnalysis;
