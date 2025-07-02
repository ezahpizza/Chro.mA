from pydantic import BaseModel
from typing import List

class SongInput(BaseModel):
    title: str
    artist: str

class ManualMoodRequest(BaseModel):
    songs: List[SongInput]

class PlaylistCreateRequest(BaseModel):
    name: str
    description: str = ""
    public: bool = False
    collaborative: bool = False 
    tracks: List[SongInput]

class PlaylistCreateResponse(BaseModel):
    playlist_id: str
    external_url: str
    message: str

class PlaylistSummaryResponse(BaseModel):
    id: str
    name: str
    images: List[dict]

class MoodRecommendation(BaseModel):
    similar_mood: List[SongInput]  
    uplifting_alternatives: List[SongInput]  

class MoodResponse(BaseModel):
    inferred_mood: str
    summary: str
    recommendations: MoodRecommendation
    message: str
