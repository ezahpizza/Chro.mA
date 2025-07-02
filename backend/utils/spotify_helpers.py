from typing import List, Any, Dict
from fastapi import HTTPException
from db.mongodb import mongodb
from app.state.session_memory import create_session_id, store_analysis
from models.mood import MoodResponse, SongInput

async def get_spotify_access_token(spotify_user_id: str) -> str:
    token_doc = await mongodb.get_token_collection().find_one({"spotify_user_id": spotify_user_id})
    if not token_doc:
        raise HTTPException(status_code=404, detail="Spotify user not found")
    return token_doc["access_token"]

def build_gemini_input_from_serp_results(serp_results: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    songs_for_gemini = []
    for item in serp_results:
        song = item.get("song", {})
        snippets = item.get("snippets", [])
        songs_for_gemini.append({
            "title": song.get("title"),
            "artist": song.get("artist"),
            "snippets": snippets
        })
    return songs_for_gemini

async def analyze_songs_pipeline(
    song_inputs: List[SongInput],
    serpapi_client,
    gemini_client
) -> MoodResponse:
    song_dicts = [song.model_dump() for song in song_inputs]
    serp_results = await serpapi_client.get_song_mood(song_dicts)
    songs_for_gemini = build_gemini_input_from_serp_results(serp_results)
    mood_result = await gemini_client.classify_mood_and_generate_response(songs_for_gemini)
    mood_response = MoodResponse(**mood_result)
    return mood_response

async def analyze_and_store_session(
    song_inputs: List[SongInput],
    serpapi_client,
    gemini_client
) -> Dict[str, Any]:
    mood_response = await analyze_songs_pipeline(song_inputs, serpapi_client, gemini_client)
    session_id = create_session_id()
    store_analysis(session_id, mood_response.model_dump())
    return {"session_id": session_id, "mood_response": mood_response.model_dump()}
