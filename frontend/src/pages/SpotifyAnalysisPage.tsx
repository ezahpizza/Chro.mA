import { useState } from 'react';
import { motion } from 'framer-motion';
import PageHeader from '@/components/ui/PageHeader';
import SpotifyTrackForm from '@/components/music/SpotifyTrackForm';
import MoodResultDisplay from '@/components/music/MoodResultDisplay';
import PlaylistCreationModal from '@/components/music/PlaylistCreationModal';
import { useSpotifyAnalysis } from '@/hooks/useSpotifyAnalysis';

const SpotifyAnalysisPage = () => {
    const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
    const {
        sessionMoodResult,
        isSpotifyConnected,
        sessionId,
        analysisMutation,
        playlistMutation,
        handleAnalyzeSpotify,
        handlePlaylistSubmit,
    } = useSpotifyAnalysis();

    return (
        <div className="select-none min-h-screen bg-almond-white flex flex-col items-center justify-center p-2 sm:p-6 overflow-x-hidden overflow-y-auto">
            <div className="w-full max-w-8xl space-y-6">
                <PageHeader title="Let Us In On Your Jams" />
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
                    <SpotifyTrackForm
                    onSubmit={handleAnalyzeSpotify}
                    isLoading={analysisMutation.isPending}
                    />
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
                    onClose={() => setIsPlaylistModalOpen(false)}
                    onSubmit={handlePlaylistSubmit}
                    isLoading={playlistMutation.isPending}
                />
            </div>
        </div>
    );
};

export default SpotifyAnalysisPage;
