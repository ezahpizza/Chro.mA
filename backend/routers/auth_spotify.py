import time
from fastapi import APIRouter, HTTPException
from fastapi.responses import RedirectResponse
from config import settings
from db.mongodb import mongodb
import urllib.parse
from utils.auth_utils import AuthUtils

router = APIRouter()

@router.get("/login")
async def spotify_login():

    params = {
        "client_id": settings.SPOTIFY_CLIENT_ID,
        "response_type": "code",
        "redirect_uri": settings.SPOTIFY_REDIRECT_URI,
        "scope": "user-read-currently-playing user-read-recently-played playlist-read-private playlist-modify-private playlist-modify-public",
    }
    
    url = f"https://accounts.spotify.com/authorize?{urllib.parse.urlencode(params)}"
    return RedirectResponse(url)

@router.get("/callback")
async def spotify_callback(code: str):

    token_data = await AuthUtils.exchange_token(code)
    if not token_data or "access_token" not in token_data:
        raise HTTPException(status_code=400, detail="Spotify token exchange failed")


    user_data = await AuthUtils.get_spotify_user_profile(token_data["access_token"])
    if not user_data:
        raise HTTPException(status_code=400, detail="Failed to fetch Spotify user profile")

    
    expires_in = token_data.get("expires_in") 
    expires_at = int(time.time()) + expires_in if expires_in else 0

    tokens = {
        "spotify_user_id": user_data["id"],
        "access_token": token_data["access_token"],
        "refresh_token": token_data.get("refresh_token"),
        "expires_at": expires_at,
    }

    await mongodb.get_token_collection().update_one(
        {"spotify_user_id": user_data["id"]},
        {"$set": tokens},
        upsert=True
    )

    FRONTEND_REDIRECT_BASE = f"{settings.CORS_ORIGINS}/after-auth" 

    redirect_url = f"{FRONTEND_REDIRECT_BASE}?spotify_user_id={user_data['id']}"
    return RedirectResponse(url=redirect_url)
