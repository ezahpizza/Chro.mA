import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import { SongInput } from '@/types/music';

interface SongAnalysisFormProps {
  onSubmit: (songs: SongInput[]) => void;
  isLoading: boolean;
}

const SongAnalysisForm = ({ onSubmit, isLoading }: SongAnalysisFormProps) => {
  const [songs, setSongs] = useState<SongInput[]>([{ title: '', artist: '' }]);

  const addSong = () => {
    setSongs([...songs, { title: '', artist: '' }]);
  };

  const removeSong = (index: number) => {
    if (songs.length > 1) {
      setSongs(songs.filter((_, i) => i !== index));
    }
  };

  const updateSong = (index: number, field: keyof SongInput, value: string) => {
    const updatedSongs = songs.map((song, i) => 
      i === index ? { ...song, [field]: value } : song
    );
    setSongs(updatedSongs);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validSongs = songs.filter(song => song.title.trim() && song.artist.trim());
    if (validSongs.length > 0) {
      onSubmit(validSongs);
    }
  };

  return (
    <Card className="flex items-center border-2 bg-persian-indigo w-full max-w-5xl mx-auto shadow-md rounded-lg overflow-hidden">
      <CardHeader>
        <CardTitle className="font-biorhyme text-pumpkin-orange">We Can Find Some More For You</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full py-6">
          {songs.map((song, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-2 items-end w-full">
              <div className="flex-1 space-y-2">
                <Label htmlFor={`title-${index}`} className="font-biorhyme text-pumpkin-orange">Song Title</Label>
                <Input
                  id={`title-${index}`}
                  placeholder="Enter song title"
                  value={song.title}
                  onChange={(e) => updateSong(index, 'title', e.target.value)}
                  className="bg-almond-white border-persian-indigo/30 focus:border-pumpkin-orange font-fira-code w-full"
                  required
                />
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor={`artist-${index}`} className="font-biorhyme text-pumpkin-orange">Artist</Label>
                <Input
                  id={`artist-${index}`}
                  placeholder="Enter artist name"
                  value={song.artist}
                  onChange={(e) => updateSong(index, 'artist', e.target.value)}
                  className="bg-almond-white border-persian-indigo/30 focus:border-pumpkin-orange font-fira-code w-full"
                  required
                />
              </div>
              <Button
                type="button"
                size="icon"
                onClick={() => removeSong(index)}
                disabled={songs.length === 1}
                className="bg-red hover:bg-red/50 border-black border-r-4 border-b-4 hover:border-none"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          <div className="flex flex-col md:flex-row gap-2 w-auto">
            <div className="w-full md:w-auto">
              <Button
                type="button"
                onClick={addSong}
                className="bg-red hover:bg-red/70 font-fira-code w-full shadow-[4px_4px_0px_0px_black] hover:shadow-none"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Song
              </Button>
            </div>
            <div className="w-full md:w-auto">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-pumpkin-orange hover:bg-pumpkin-orange/90 text-white font-fira-code w-full shadow-[4px_4px_0px_0px_black] hover:shadow-none"
              >
                {isLoading ? 'Analyzing...' : 'Analyze'}
              </Button>
            </div>
          </div>

        </form>
      </CardContent>
    </Card>
  );
};

export default SongAnalysisForm;
