
# Chro.mA Backend

This is a production-ready FastAPI backend for Chro.mA, an AI-powered music mood analysis application. It integrates with Google Gemini, SerpAPI, Spotify, and MongoDB to provide intelligent music mood analysis and song recommendations. It also integrates with Spotify to analyze user history, playlists, and create/add playlists for the user.

---

## Features
- Music mood analysis from manual or Spotify song input
- Song recommendations (similar mood, uplifting alternatives)
- MongoDB-based caching and history
- Modular, extensible, and fully async
- Spotify authentication (login, logout, token refresh)
- Session-based in-memory caching for mood analysis

---

## Authentication Endpoints (`/`)

### **GET `/login`**
- Redirects the user to Spotify's OAuth login page.
- **Response:** Redirect to Spotify authorization URL.

### **GET `/callback`**
- Handles Spotify OAuth callback, exchanges code for tokens, fetches user profile, and stores tokens in MongoDB.
- **Query Parameters:**
  - `code` (str, required): Spotify authorization code
- **Response:** Redirect to frontend with `spotify_user_id` as a query parameter.

### **POST `/logout`**
- Logs out the user by deleting their token from MongoDB.
- **Request Body:**
  - `spotify_user_id` (str, required)
- **Response:**
  ```json
  { "message": "Logged out successfully" }
  ```

---

## Music Mood Analysis Endpoints (`/songs`)

### **POST `/songs/manual`**
- Analyze the mood of a list of songs provided manually.
- **Request Body:**
  ```json
  {
    "songs": [
      { "title": "string", "artist": "string" }
    ]
  }
  ```
- **Response:**
  ```json
  {
    "session_id": "string",
    "mood_response": {
      "inferred_mood": "string",
      "summary": "string",
      "recommendations": {
        "similar_mood": [ { "title": "string", "artist": "string" } ],
        "uplifting_alternatives": [ { "title": "string", "artist": "string" } ]
      },
      "message": "string"
    }
  }
  ```

### **GET `/songs/spotify`**
- Analyze the mood of a user's recent Spotify tracks.
- **Query Parameters:**
  - `spotify_user_id` (str, required): Spotify user ID
  - `count` (int, optional, default: 1, min: 1, max: 10): Number of recent tracks to analyze
- **Response:** Same as `/songs/manual` above.

---

## Playlist Endpoints (`/playlist`)

### **GET `/playlist/analyze/{playlist_id}`**
- Analyze the mood of a Spotify playlist by its ID.
- **Path Parameter:**
  - `playlist_id` (str, required)
- **Query Parameter:**
  - `spotify_user_id` (str, required)
- **Response:**
  ```json
  {
    "session_id": "string",
    "mood_response": {
      "inferred_mood": "string",
      "summary": "string",
      "recommendations": {
        "similar_mood": [ { "title": "string", "artist": "string" } ],
        "uplifting_alternatives": [ { "title": "string", "artist": "string" } ]
      },
      "message": "string"
    }
  }
  ```

### **GET `/playlist/user`**
- Fetches the user's Spotify playlists.
- **Query Parameters:**
  - `spotify_user_id` (str, required)
  - `limit` (int, optional, default: 20, min: 1, max: 50)
  - `offset` (int, optional, default: 0, min: 0)
- **Response:**
  ```json
  [
    {
      "id": "string",
      "name": "string",
      "images": [ { ... } ]
    }
  ]
  ```

### **POST `/playlist/create`**
- Create a new Spotify playlist for the user and add tracks (from request or session cache).
- **Query Parameters:**
  - `spotify_user_id` (str, required)
  - `session_id` (str, optional): Use cached mood analysis tracks
  - `delete_after_use` (bool, optional, default: false): Delete session after use
- **Request Body:**
  ```json
  {
    "name": "string",
    "description": "string",
    "public": false,
    "collaborative": false,
    "tracks": [ { "title": "string", "artist": "string" } ]
  }
  ```
- **Response:**
  ```json
  {
    "playlist_id": "string",
    "external_url": "string",
    "message": "Playlist created and tracks added successfully"
  }
  ```

---

## Session-Based Mood Analysis Caching
- Mood analysis endpoints (`/songs/manual`, `/songs/spotify`, `/playlist/analyze/{playlist_id}`) return a `session_id` with the mood analysis result.
- The `session_id` can be used with `/playlist/create` to reuse cached mood analysis, avoiding re-analysis.
- The `/playlist/create` endpoint accepts a `session_id` (query param) and an optional `delete_after_use` flag to purge session data after playlist creation.
- Session data is stored in-memory (not persisted in DB). Suitable for single-process deployments.

---

## Token Management & Refresh
- Access tokens are checked for expiry and refreshed automatically using the stored refresh token.
- If a refresh token is not available or refresh fails, a 401 error is returned.
- Token management is handled transparently for all Spotify API calls.

---

## Error Handling
- All endpoints return a consistent JSON structure:
  ```json
  {
    "success": true,
    "message": "...",
    "data": { ... }
  }
  ```
- On error, `success` is `false` and `message` describes the error.

---

## Schemas

### SongInput
```json
{
  "title": "string",
  "artist": "string"
}
```

### ManualMoodRequest
```json
{
  "songs": [SongInput]
}
```

### MoodRecommendation
```json
{
  "similar_mood": [SongInput],
  "uplifting_alternatives": [SongInput]
}
```

### MoodResponse
```json
{
  "inferred_mood": "string",
  "summary": "string",
  "recommendations": MoodRecommendation,
  "message": "string"
}
```

### PlaylistCreateRequest
```json
{
  "name": "string",
  "description": "string",
  "public": false,
  "collaborative": false,
  "tracks": [SongInput]
}
```

### PlaylistCreateResponse
```json
{
  "playlist_id": "string",
  "external_url": "string",
  "message": "string"
}
```

### PlaylistSummaryResponse
```json
{
  "id": "string",
  "name": "string",
  "images": [ { ... } ]
}
```

---

## Setup
1. Clone the repository.
2. Install dependencies:
   ```powershell
   pip install -r requirements.txt
   ```
3. Set environment variables for your API keys and MongoDB connection string (see `.env.example`).
4. Run the server:
   ```powershell
   uvicorn main:app --reload
   ```



## Contributing
- Fork the repo and create a feature branch.
- Submit a pull request with a clear description of your changes.

---

## License
This project is licensed under the MIT License.
