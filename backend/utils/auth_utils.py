# spotify token exchange and validation
import httpx
import time
from config import settings

class AuthUtils:
    @staticmethod
    async def exchange_token(code: str):
        url = "https://accounts.spotify.com/api/token"
        data = {
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": settings.SPOTIFY_REDIRECT_URI,
            "client_id": settings.SPOTIFY_CLIENT_ID,
            "client_secret": settings.SPOTIFY_CLIENT_SECRET
        }
        headers = {"Content-Type": "application/x-www-form-urlencoded"}
        async with httpx.AsyncClient() as client:
            resp = await client.post(url, data=data, headers=headers)
            if resp.status_code != 200:
                return None
            return resp.json()

    @staticmethod
    async def refresh_token(refresh_token: str):
        token_url = "https://accounts.spotify.com/api/token"
        data = {
            "grant_type": "refresh_token",
            "refresh_token": refresh_token,
            "client_id": settings.SPOTIFY_CLIENT_ID,
            "client_secret": settings.SPOTIFY_CLIENT_SECRET,
        }
        async with httpx.AsyncClient() as client:
            resp = await client.post(token_url, data=data)
            if resp.status_code != 200:
                return None
            return resp.json()

    @staticmethod
    def validate_token(token_data: dict):
        return token_data and token_data.get("expires_at", 0) > int(time.time())

    @staticmethod
    async def get_spotify_user_profile(access_token: str):
        async with httpx.AsyncClient() as client:
            headers = {"Authorization": f"Bearer {access_token}"}
            resp = await client.get("https://api.spotify.com/v1/me", headers=headers)
            if resp.status_code != 200:
                return None
            return resp.json()
        

