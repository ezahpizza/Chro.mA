import { SongInput } from '@/types/music';
import { musicApi } from '@/lib/musicApi';

export class SongAnalysisController {
  static async analyzeSongs(songs: SongInput[]) {
    const request = { songs };
    return await musicApi.analyzeMood(request);
  }
}
