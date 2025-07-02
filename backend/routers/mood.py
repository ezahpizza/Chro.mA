from fastapi import APIRouter, Query
from models.mood import ManualMoodRequest, SongInput
from models.session import SessionMoodResponse
from services.serpapi_client import SerpClient
from services.gemini_client import GeminiClient
from services.spotify_client import SpotifyClient
from utils.spotify_helpers import get_spotify_access_token, analyze_and_store_session

router = APIRouter()

serpapi_client = SerpClient()
gemini_client = GeminiClient()
spotify_client = SpotifyClient()

@router.post("/manual", response_model=SessionMoodResponse)
async def analyze_manual_songs(request: ManualMoodRequest):
    song_inputs = request.songs
    result = await analyze_and_store_session(song_inputs, serpapi_client, gemini_client)
    return SessionMoodResponse(session_id=result["session_id"], mood_response=result["mood_response"])

@router.get("/spotify", response_model=SessionMoodResponse)
async def analyze_spotify_songs(spotify_user_id: str = Query(...), count: int = Query(1, ge=1, le=10)):
    access_token = await get_spotify_access_token(spotify_user_id)
    tracks = await spotify_client.get_recent_tracks(access_token, count)
    song_inputs = [SongInput(title=t["name"], artist=t["artists"][0]["name"]) for t in tracks if t.get("name") and t.get("artists")]
    result = await analyze_and_store_session(song_inputs, serpapi_client, gemini_client)
    return SessionMoodResponse(session_id=result["session_id"], mood_response=result["mood_response"])


