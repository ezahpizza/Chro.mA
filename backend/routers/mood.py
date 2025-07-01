from fastapi import APIRouter, Query, HTTPException
from models.mood import ManualMoodRequest, MoodResponse
from services.serpapi_client import SerpClient
from services.gemini_client import GeminiClient
from services.spotify_client import SpotifyClient
from db.mongodb import mongodb

router = APIRouter()

serpapi_client = SerpClient()
gemini_client = GeminiClient()
spotify_client = SpotifyClient()

#helper fucntion for gemini input
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

@router.post("/songs/manual", response_model=MoodResponse)
async def analyze_manual_songs(request: ManualMoodRequest):
    # get mood snippets
    song_dicts = [song.model_dump() for song in request.songs]
    serp_results = await serpapi_client.get_song_mood(song_dicts)
    # classify mood and generate response
    songs_for_gemini = build_gemini_input_from_serp_results(serp_results)
    mood_result = await gemini_client.classify_mood_and_generate_response(songs_for_gemini)
    # save MoodResponse to MongoDB 
    mood_response = MoodResponse(**mood_result)
    if request.userid:
        mood_doc = mood_response.model_dump()
        mood_doc["userid"] = request.userid
        await mongodb.db["user_moods"].insert_one(mood_doc)
    return mood_response


@router.get("/songs/spotify", response_model=MoodResponse)
async def analyze_spotify_songs(spotify_user_id: str = Query(...), count: int = Query(1, ge=1, le=10)):
    # retrieve access token
    token_doc = await mongodb.get_token_collection().find_one({"spotify_user_id": spotify_user_id})
    if not token_doc:
        raise HTTPException(status_code=404, detail="Spotify user not found")
    # get recent tracks
    tracks = await spotify_client.get_recent_tracks(token_doc["access_token"], count)

    song_dicts = [{"title": t["name"], "artist": t["artists"][0]["name"]} for t in tracks]
    serp_results = await serpapi_client.get_song_mood(song_dicts)
    songs_for_gemini = build_gemini_input_from_serp_results(serp_results)
    mood_result = await gemini_client.classify_mood_and_generate_response(songs_for_gemini)
    # using spotify_user_id as userid
    mood_response = MoodResponse(**mood_result)
    mood_doc = mood_response.model_dump()
    mood_doc["userid"] = spotify_user_id
    await mongodb.db["user_moods"].insert_one(mood_doc)
    return mood_response
