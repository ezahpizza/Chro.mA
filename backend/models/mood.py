from pydantic import BaseModel
from typing import List

class SongInput(BaseModel):
    title: str
    artist: str

class ManualMoodRequest(BaseModel):
    songs: List[SongInput]

class MoodRecommendation(BaseModel):
    similar_mood: List[str]  
    uplifting_alternatives: List[str]  

class MoodResponse(BaseModel):
    inferred_mood: str
    summary: str
    recommendations: MoodRecommendation
    message: str
