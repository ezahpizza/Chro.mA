from fastapi import APIRouter, Query, Body, HTTPException
from typing import Optional, List
from models.mood import SongInput, PlaylistCreateResponse, PlaylistSummaryResponse, PlaylistCreateRequest
from models.session import SessionMoodResponse
from app.state.session_memory import get_analysis, delete_analysis
from services.serpapi_client import SerpClient
from services.gemini_client import GeminiClient
from services.spotify_client import SpotifyClient
from utils.spotify_helpers import get_spotify_access_token, analyze_and_store_session


router = APIRouter()

serpapi_client = SerpClient()
gemini_client = GeminiClient()
spotify_client = SpotifyClient()

@router.get("/analyze/{playlist_id}", response_model=SessionMoodResponse)
async def analyze_playlist(
    playlist_id: str,
    spotify_user_id: str = Query(...)
    ):

    # retrieve access token
    access_token = await get_spotify_access_token(spotify_user_id)
    
    #  get tracks from Spotify
    tracks = await spotify_client.get_playlist_tracks(access_token, playlist_id)
    song_inputs = [SongInput(title=t["name"], artist=t["artists"][0]["name"]) for t in tracks if t.get("name") and t.get("artists")]

    result = await analyze_and_store_session(song_inputs, serpapi_client, gemini_client)
    return SessionMoodResponse(session_id=result["session_id"], mood_response=result["mood_response"])

@router.get("/user", response_model=List[PlaylistSummaryResponse])
async def get_user_playlists(
    spotify_user_id: str = Query(...),
    limit: int = Query(20, ge=1, le=50),
    offset: int = Query(0, ge=0)
):

    access_token = await get_spotify_access_token(spotify_user_id)

    playlists = await spotify_client.get_user_playlists(access_token, spotify_user_id, limit, offset)
    if playlists is None:
        raise HTTPException(status_code=400, detail="Failed to fetch playlists from Spotify")

    summaries = []
    for item in playlists.get("items", []):
        summaries.append({
            "id": item.get("id"),
            "name": item.get("name"),
            "images": item.get("images", [])
        })
    return summaries

@router.post("/create", response_model=PlaylistCreateResponse)
async def create_playlist(
    req: PlaylistCreateRequest = Body(...),
    spotify_user_id: str = Query(...),
    session_id: Optional[str] = Query(None),
    delete_after_use: Optional[bool] = Query(False)
):
    
    access_token = await get_spotify_access_token(spotify_user_id)

    # if session_id is provided, use session cache for tracks
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

    user_id = await spotify_client.get_user_id(access_token)
    if not user_id:
        raise HTTPException(status_code=400, detail="Failed to fetch Spotify user id")

    uris = await spotify_client.get_uris_for_tracks(access_token, tracks_to_add)
    if not uris:
        raise HTTPException(status_code=400, detail="No valid Spotify URIs found for provided tracks")

    playlist = await spotify_client.create_playlist(
        access_token=access_token,
        user_id=user_id,
        name=req.name,
        description=req.description,
        public=req.public,
        collaborative=getattr(req, "collaborative", False)
    )
    if not playlist or "id" not in playlist:
        raise HTTPException(status_code=400, detail="Failed to create playlist")

    playlist_id = playlist["id"]

    success = await spotify_client.add_tracks_to_playlist(access_token, playlist_id, uris)
    if not success:
        raise HTTPException(status_code=400, detail="Failed to add tracks to playlist")

    if session_id and delete_after_use:
        delete_analysis(session_id)

    return PlaylistCreateResponse(
        playlist_id=playlist_id,
        external_url=playlist.get("external_urls", {}).get("spotify", ""),
        message="Playlist created and tracks added successfully"
    )