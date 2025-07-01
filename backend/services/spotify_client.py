# spotify API client 
import httpx


class SpotifyClient:

    async def get_user_id(self, access_token: str):
        url = "https://api.spotify.com/v1/me"
        headers = {"Authorization": f"Bearer {access_token}"}
        async with httpx.AsyncClient() as client:
            resp = await client.get(url, headers=headers)
            if resp.status_code != 200:
                return None
            return resp.json().get("id")
        
    async def get_recent_tracks(self, access_token: str, count: int = 1):
        url = f"https://api.spotify.com/v1/me/player/recently-played?limit={count}"
        headers = {"Authorization": f"Bearer {access_token}"}
        async with httpx.AsyncClient() as client:
            resp = await client.get(url, headers=headers)
            if resp.status_code != 200:
                return []
            data = resp.json()
            return [item["track"] for item in data.get("items", [])]

    async def get_playlist_tracks(self, access_token: str, playlist_id: str):
        url = f"https://api.spotify.com/v1/playlists/{playlist_id}/tracks"
        headers = {"Authorization": f"Bearer {access_token}"}
        async with httpx.AsyncClient() as client:
            resp = await client.get(url, headers=headers)
            if resp.status_code != 200:
                return []
            data = resp.json()
            tracks = []
            for item in data.get("items", []):
                track = item.get("track")
                if track:
                    tracks.append(track)
            return tracks
        
    async def search_track_uri(self, access_token: str, title: str, artist: str):
        url = f"https://api.spotify.com/v1/search"
        headers = {"Authorization": f"Bearer {access_token}"}
        query = f"track:{title} artist:{artist}"
        params = {"q": query, "type": "track", "limit": 1}
        async with httpx.AsyncClient() as client:
            resp = await client.get(url, headers=headers, params=params)
            if resp.status_code != 200:
                return None
            data = resp.json()
            items = data.get("tracks", {}).get("items", [])
            if not items:
                return None
            return items[0].get("uri")

    async def get_uris_for_tracks(self, access_token: str, tracks: list):
        uris = []
        for track in tracks:
            uri = await self.search_track_uri(access_token, track["title"], track["artist"])
            if uri:
                uris.append(uri)
        return uris

    async def create_playlist(self, access_token: str, user_id: str, name: str, description: str = "", public: bool = False, collaborative: bool = False):
        url = f"https://api.spotify.com/v1/users/{user_id}/playlists"
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        payload = {
            "name": name,
            "description": description,
            "public": public,
            "collaborative": collaborative
        }
        async with httpx.AsyncClient() as client:
            resp = await client.post(url, headers=headers, json=payload)
            if resp.status_code not in (200, 201):
                return None
            return resp.json()

    async def add_tracks_to_playlist(self, access_token: str, playlist_id: str, track_uris: list):
        url = f"https://api.spotify.com/v1/playlists/{playlist_id}/tracks"
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        payload = {"uris": track_uris}
        async with httpx.AsyncClient() as client:
            resp = await client.post(url, headers=headers, json=payload)
            return resp.status_code in (200, 201)

