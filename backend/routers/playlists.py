import httpx
from fastapi import APIRouter, Query, Body, HTTPException
from models.mood import PlaylistAnalysisResponse, SongInput, MoodResponse, PlaylistCreateResponse, PlaylistCreateRequest
from models.session import SessionMoodResponse
from app.state.session_memory import create_session_id, store_analysis, get_analysis, delete_analysis
from services.serpapi_client import SerpClient
from services.gemini_client import GeminiClient
from services.spotify_client import SpotifyClient
from db.mongodb import mongodb

router = APIRouter()

serpapi_client = SerpClient()
gemini_client = GeminiClient()
spotify_client = SpotifyClient()

def build_gemini_input_from_serp_results(serp_results):
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


@router.get("/analyze/{playlist_id}", response_model=SessionMoodResponse)
async def analyze_playlist(
    playlist_id: str,
    spotify_user_id: str = Query(...)
    ):
    # retrieve access token
    token_doc = await mongodb.get_token_collection().find_one({"spotify_user_id": spotify_user_id})
    if not token_doc:
        raise HTTPException(status_code=404, detail="Spotify user not found")
    # Fetch playlist tracks from Spotify
    tracks = await spotify_client.get_playlist_tracks(token_doc["access_token"], playlist_id)
    song_inputs = [SongInput(title=t["name"], artist=t["artists"][0]["name"]) for t in tracks if t.get("name") and t.get("artists")]
    song_dicts = [song.model_dump() for song in song_inputs]
    serp_results = await serpapi_client.get_song_mood(song_dicts)
    songs_for_gemini = build_gemini_input_from_serp_results(serp_results)
    mood_result = await gemini_client.classify_mood_and_generate_response(songs_for_gemini)
    mood_response = MoodResponse(**mood_result)
    session_id = create_session_id()
    store_analysis(session_id, mood_response.model_dump())
    return SessionMoodResponse(session_id=session_id, mood_response=mood_response.model_dump())


from fastapi import Request
from fastapi import status
from fastapi.responses import JSONResponse
from typing import Optional

@router.post("/create", response_model=PlaylistCreateResponse)
async def create_playlist(
    req: PlaylistCreateRequest = Body(...),
    spotify_user_id: str = Query(...),
    session_id: Optional[str] = Query(None),
    delete_after_use: Optional[bool] = Query(False)
):
    # retrieve access token
    token_doc = await mongodb.get_token_collection().find_one({"spotify_user_id": spotify_user_id})
    if not token_doc:
        raise HTTPException(status_code=404, detail="Spotify user not found")

    # If session_id is provided, use session cache for tracks
    tracks_to_add = []
    if session_id:
        mood_data = get_analysis(session_id)
        if not mood_data:
            raise HTTPException(status_code=400, detail="No mood analysis found for the given session_id")
        recommendations = mood_data.get("recommendations", {})
        similar = recommendations.get("similar_mood", [])
        uplifting = recommendations.get("uplifting_alternatives", [])
        tracks_to_add = similar + uplifting
        if not tracks_to_add:
            raise HTTPException(status_code=400, detail="No recommended tracks found in session mood analysis")
    else:
        tracks_to_add = [track.model_dump() for track in req.tracks]

    user_id = await spotify_client.get_user_id(token_doc["access_token"])
    if not user_id:
        raise HTTPException(status_code=400, detail="Failed to fetch Spotify user id")

    uris = await spotify_client.get_uris_for_tracks(token_doc["access_token"], tracks_to_add)
    if not uris:
        raise HTTPException(status_code=400, detail="No valid Spotify URIs found for provided tracks")

    playlist = await spotify_client.create_playlist(
        access_token=token_doc["access_token"],
        user_id=user_id,
        name=req.name,
        description=req.description,
        public=req.public,
        collaborative=getattr(req, "collaborative", False)
    )
    if not playlist or "id" not in playlist:
        raise HTTPException(status_code=400, detail="Failed to create playlist")

    playlist_id = playlist["id"]

    success = await spotify_client.add_tracks_to_playlist(token_doc["access_token"], playlist_id, uris)
    if not success:
        raise HTTPException(status_code=400, detail="Failed to add tracks to playlist")

    if session_id and delete_after_use:
        delete_analysis(session_id)

    return PlaylistCreateResponse(
        playlist_id=playlist_id,
        external_url=playlist.get("external_urls", {}).get("spotify", ""),
        message="Playlist created and tracks added successfully"
    )