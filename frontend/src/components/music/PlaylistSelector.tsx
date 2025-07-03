import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Music, ChevronDown } from 'lucide-react';
import { PlaylistSummary } from '@/types/music';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PlaylistSelectorProps {
  playlists: PlaylistSummary[];
  selectedPlaylist: PlaylistSummary | null;
  onPlaylistSelect: (playlist: PlaylistSummary) => void;
  isLoading: boolean;
}

const PlaylistSelector = ({
  playlists,
  selectedPlaylist,
  onPlaylistSelect,
  isLoading
}: PlaylistSelectorProps) => {

  const renderCardContent = () => {
    if (isLoading) {
      return (
        <div className="text-center py-4 font-biorhyme text-persian-indigo">
          Loading your playlists...
        </div>
      );
    }

    if (!playlists || playlists.length === 0) {
      return (
        <div className="text-center py-4 font-biorhyme text-persian-indigo/70">
          No playlists found
        </div>
      );
    }

    return (
      <div className="relative w-full">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between border-persian-indigo/30 hover:bg-persian-indigo/10 font-biorhyme"
            >
              {selectedPlaylist ? selectedPlaylist.name : 'Select a playlist...'}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side="bottom"
            align="start"
            sideOffset={4}
            className="w-[var(--radix-dropdown-menu-trigger-width)] max-w-none bg-tile-green border-persian-indigo/30 max-h-80 overflow-y-auto scrollbar-custom"
          >
            {playlists.map((playlist) => (
              <DropdownMenuItem
                key={playlist.id}
                onClick={() => onPlaylistSelect(playlist)}
                className="cursor-pointer hover:bg-persian-indigo/10 font-biorhyme"
              >
                <div className="flex items-center gap-3">
                  {playlist.images.length > 0 && (
                    <img
                      src={playlist.images[0].url}
                      alt={playlist.name}
                      className="w-10 h-10 rounded object-cover"
                    />
                  )}
                  <span className="text-persian-indigo">{playlist.name}</span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto mt-5 scrollbar-custom">
      <Card className="bg-tile-green">
        <CardHeader>
          <CardTitle className="font-biorhyme text-persian-indigo flex items-center gap-2">
            <Music className="h-5 w-5" />
            Your Playlists
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderCardContent()}
        </CardContent>
      </Card>
    </div>
  );
};

export default PlaylistSelector;