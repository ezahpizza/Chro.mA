import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoodResponse } from '@/types/music';
import { Heart, TrendingUp, Music } from 'lucide-react';

interface MoodResultDisplayProps {
  moodResult: MoodResponse;
  onCreatePlaylist: () => void;
  canCreatePlaylist: boolean;
}

const MoodResultDisplay = ({
  moodResult,
  onCreatePlaylist,
  canCreatePlaylist,
}: MoodResultDisplayProps) => {

  const recommendations = moodResult?.recommendations;
  const similarMood = recommendations?.similar_mood || [];
  const upliftingAlternatives = recommendations?.uplifting_alternatives || [];

  console.log('MoodResult:', moodResult);
  console.log('Recommendations:', recommendations);
  console.log('Similar mood tracks:', similarMood);
  console.log('Uplifting alternatives:', upliftingAlternatives);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Card className='border-2 border-persian-indigo/20 shadow-md rounded-lg overflow-hidden'>
        <CardHeader>
          <CardTitle className="font-biorhyme flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Mood Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Badge variant="secondary" className="font-biorhyme-expanded text-lg px-3 py-1">
              {moodResult.inferred_mood}
            </Badge>
          </div>
          <p className="font-fira-code font-semibold text-persian-indigo">{moodResult.summary}</p>
          <p className="font-fira-code text-sm text-persian-indigo italic">{moodResult.message}</p>
          
          {canCreatePlaylist && (
            <Button onClick={onCreatePlaylist} className="text-tile-green border-rose-pink border-r-4 border-b-4 hover:border-none w-full mt-4 bg-persian-indigo hover:bg-persian-ingigo/80">
              <Music className="h-4 w-4 mr-2" />
              Create a Playlist With These Songs
            </Button>
          )}
        </CardContent>
      </Card>

      {similarMood.length > 0 && (
        <Card className='bg-rose-pink border-2 border-persian-indigo/20 shadow-md rounded-lg overflow-hidden'>
          <CardHeader>
            <CardTitle className="font-biorhyme flex items-center gap-2">
              <Music className="h-5 w-5 text-blue-500" />
              Similar Mood Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {similarMood.map((song, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-almond-white rounded">
                  <span className="font-fira-code font-semibold">{song.title}</span>
                  <span className="font-fira-code text-gray-600">{song.artist}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {upliftingAlternatives.length > 0 && (
        <Card className='bg-pumpkin-orange border-2 border-persian-indigo/20 shadow-md rounded-lg overflow-hidden'>
          <CardHeader>
            <CardTitle className="font-biorhyme flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Uplifting Alternatives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {upliftingAlternatives.map((song, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-almond-white rounded">
                  <span className="font-fira-code font-semibold">{song.title}</span>
                  <span className="font-fira-code text-gray-600">{song.artist}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MoodResultDisplay;
