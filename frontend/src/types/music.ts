
export interface SongInput {
  title: string;
  artist: string;
}

export interface MoodRecommendation {
  similar_mood: SongInput[];
  uplifting_alternatives: SongInput[];
}

export interface MoodResponse {
  inferred_mood: string;
  summary: string;
  recommendations: MoodRecommendation;
  message: string;
}

export interface SessionMoodResponse {
  session_id: string;
  mood_response: MoodResponse;
}

export interface ManualMoodRequest {
  songs: SongInput[];
}

export interface PlaylistCreateRequest {
  name: string;
  description: string;
  public: boolean;
  collaborative: boolean;
  tracks: SongInput[];
}

export interface PlaylistCreateResponse {
  playlist_id: string;
  external_url: string;
  message: string;
}

export interface PlaylistSummary {
  id: string;
  name: string;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
}
