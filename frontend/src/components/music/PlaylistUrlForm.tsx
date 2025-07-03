import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Music } from 'lucide-react';

interface PlaylistUrlFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

const  PlaylistUrlForm = ({ onSubmit, isLoading }: PlaylistUrlFormProps) => {
  const [playlistUrl, setPlaylistUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playlistUrl.trim()) {
      onSubmit(playlistUrl.trim());
    }
  };

  return (
    <Card className="flex items-center border-2 bg-persian-indigo w-full max-w-5xl mx-auto shadow-md rounded-lg overflow-hidden">
      <CardHeader>
        <CardTitle className="font-biorhyme text-tile-green flex items-center gap-2">
          <Music className="h-5 w-5" />
          Paste a Playlist Link Or <br/>Select One Of Your Own
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full py-6">
          <Label htmlFor="playlist-url" className="font-biorhyme text-tile-green">
            Spotify Playlist URL:
          </Label>

          <div className="flex flex-col md:flex-row md:justify-end md:items-center gap-4">
              <Input
                id="playlist-url"
                type="url"
                value={playlistUrl}
                onChange={(e) => setPlaylistUrl(e.target.value)}
                placeholder="https://open.spotify.com/playlist/..."
                className="border-persian-indigo/30 focus:border-pumpkin-orange font-fira-code w-full"
                required
                inputMode="url"
                autoComplete="off"
              />
              <Button
                type="submit"
                disabled={isLoading || !playlistUrl}
                className="bg-tile-green hover:bg-tile-green/90 text-persian-indigo font-fira-code w-full border-red border-r-4 border-b-4 hover:border-none"
              >
                {isLoading ? 'Analyzing...' : 'Analyze Playlist'}
              </Button>
          </div>

        </form>
      </CardContent>
    </Card>
  );
};

export default PlaylistUrlForm;
