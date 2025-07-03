import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Headphones, Minus, Plus } from 'lucide-react';

interface SpotifyTrackFormProps {
  onSubmit: (count: number) => void;
  isLoading: boolean;
}

function SpotifyTrackForm({ onSubmit, isLoading }: SpotifyTrackFormProps) {
  const [count, setCount] = useState(1);

  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setCount(Math.min(10, Math.max(1, value)));
    }
  };

  const increment = () => setCount((prev) => Math.min(10, prev + 1));
  const decrement = () => setCount((prev) => Math.max(1, prev - 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(count);
  };

  return (
    <Card className="flex flex-col border-2 bg-persian-indigo w-full max-w-5xl mx-auto shadow-md rounded-lg overflow-hidden">
      <CardHeader>
        <CardTitle className="font-biorhyme text-rose-pink flex items-center gap-2">
          <Headphones className="h-5 w-5" />
              One Look At Your Recent Tracks And New Recs In Seconds
        </CardTitle>
      </CardHeader>

      <CardContent className="w-full">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full py-6">
          <Label htmlFor="track-count" className="font-biorhyme text-rose-pink">
                How Far Do You Want To Go Back ? (We Can Do 10:)):
          </Label>

          <div className="flex flex-col md:flex-row md:justify-end md:items-center gap-4">
            {/* Stepper Group */}
            <div className="flex w-full md:w-[20rem] items-center gap-2">
              <button
                type="button"
                onClick={decrement}
                aria-label="Decrease track count"
                className="w-10 h-10 rounded-md bg-rose-pink/70 hover:bg-rose-pink text-white transition "
              >
                <Minus className="w-4 h-4 mx-auto" />
              </button>

              <Input
                id="track-count"
                type="number"
                value={count}
                onChange={handleCountChange}
                min="1"
                max="10"
                required
                className="w-full text-center bg-white text-persian-indigo border border-persian-indigo/40 focus:border-pumpkin-orange focus:ring-2 focus:ring-pumpkin-orange/50 font-fira-code rounded-lg appearance-none transition-all [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />

              <button
                type="button"
                onClick={increment}
                aria-label="Increase track count"
                className="w-10 h-10 rounded-md bg-rose-pink/70 hover:bg-rose-pink text-white transition"
              >
                <Plus className="w-4 h-4 mx-auto" />
              </button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full md:w-[20rem] bg-rose-pink hover:bg-rose-pink/90 text-white font-fira-code rounded-lg border-black border-r-4 border-b-4 hover:border-none"
            >
              {isLoading ? 'Analyzing...' : 'Analyze My Spotify Tracks'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default SpotifyTrackForm;
