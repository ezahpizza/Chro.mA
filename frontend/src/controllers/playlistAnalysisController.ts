import { musicApi } from '@/lib/musicApi';

export class PlaylistAnalysisController {
  static async analyzePlaylistById(playlistId: string, spotifyUserId: string) {
    return await musicApi.analyzePlaylist(playlistId, spotifyUserId);
  }

  static async getUserPlaylists(spotifyUserId: string, limit: number = 20, offset: number = 0) {
    return await musicApi.getUserPlaylists(spotifyUserId, limit, offset);
  }

  static extractPlaylistId(url: string): string | null {
    const match = url.match(/playlist\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
  }
}
