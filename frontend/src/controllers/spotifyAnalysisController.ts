import { musicApi } from '@/lib/musicApi';

export class SpotifyAnalysisController {
  static async analyzeSpotifyTracks(spotifyUserId: string, count: number) {
    return await musicApi.analyzeSpotifyMood(spotifyUserId, count);
  }
}
