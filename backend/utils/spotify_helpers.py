import time
from typing import List, Any, Dict
from fastapi import HTTPException
from db.mongodb import mongodb
from app.state.session_memory import create_session_id, store_analysis
from models.mood import MoodResponse, SongInput
from utils.auth_utils import AuthUtils

async def get_spotify_access_token(spotify_user_id: str) -> str:
    token_collection = mongodb.get_token_collection()
    token_doc = await token_collection.find_one({"spotify_user_id": spotify_user_id})

    if not token_doc:
        raise HTTPException(status_code=404, detail="Spotify user not found")

    # Check if access token is still valid
    if token_doc.get("expires_at", 0) > int(time.time()):
        return token_doc["access_token"]

    # Access token expired — refresh it
    refresh_token = token_doc.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token not available")

    new_token_data = await AuthUtils.refresh_token(refresh_token)
    if not new_token_data or "access_token" not in new_token_data:
        raise HTTPException(status_code=401, detail="Failed to refresh token")

    # Calculate new expiry
    expires_in = new_token_data.get("expires_in")
    new_expires_at = int(time.time()) + expires_in if expires_in else 0

    # Update tokens in DB
    update_data = {
        "access_token": new_token_data["access_token"],
        "expires_at": new_expires_at,
    }

    if "refresh_token" in new_token_data:
        update_data["refresh_token"] = new_token_data["refresh_token"]

    await token_collection.update_one(
        {"spotify_user_id": spotify_user_id},
        {"$set": update_data}
    )

    return new_token_data["access_token"]


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
