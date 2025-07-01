# spotify API client 
import httpx

class SpotifyClient:
    async def get_recent_tracks(self, access_token: str, count: int = 1):
        url = f"https://api.spotify.com/v1/me/player/recently-played?limit={count}"
        headers = {"Authorization": f"Bearer {access_token}"}
        async with httpx.AsyncClient() as client:
            resp = await client.get(url, headers=headers)
            if resp.status_code != 200:
                return []
            data = resp.json()
            return [item["track"] for item in data.get("items", [])]
