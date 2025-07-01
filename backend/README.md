
# psykSpot Backend

psykSpot is a production-ready FastAPI backend for an AI-powered music mood and travel planning application. It integrates with Google Gemini, SerpAPI, Spotify, and MongoDB to provide intelligent music mood analysis, song recommendations, travel research, flight search, hotel and restaurant recommendations, and itinerary generation.

## Features
- Music mood analysis from manual or Spotify song input
- Song recommendations (similar mood, uplifting alternatives)
- MongoDB-based caching and history
- Modular, extensible, and fully async

## Technology Stack
- Python 3.10+
- FastAPI
- MongoDB
- SerpAPI (for web search)
- Google Gemini (for LLM-powered research and planning)
- Spotify API (for user music data)
- Pydantic (for data validation)

## Music Mood Analysis Endpoints (`/songs`)

- **POST `/songs/manual`**
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
      "inferred_mood": "string", // e.g. "happy", "sad", etc.
      "summary": "string",
      "recommendations": {
        "similar_mood": [
          { "title": "string", "artist": "string" }
        ],
        "uplifting_alternatives": [
          { "title": "string", "artist": "string" }
        ]
      },
      "message": "string"
    }
    ```

- **GET `/songs/spotify`**
  - Analyze the mood of a user's recent Spotify tracks.
  - **Query Parameters:**
    - `spotify_user_id` (str, required): Spotify user ID
    - `count` (int, optional, default: 1, min: 1, max: 10): Number of recent tracks to analyze
  - **Response:** Same as above



## Playlist Endpoints (`/playlist`)

- **POST `/playlist/create`**
  - Create a new Spotify playlist for the user and add tracks by searching for their title and artist.
  - **Query Parameters:**
    - `spotify_user_id` (str, required): Spotify user ID (used to look up the access token in the backend)
  - **Request Body:**
    ```json
    {
      "name": "string",
      "description": "string",
      "public": false,
      "collaborative": false,
      "tracks": [
        { "title": "string", "artist": "string" }
      ]
    }
    ```
    - `name`: Name of the new playlist.
    - `description`: Playlist description (optional).
    - `public`: Whether the playlist is public (default: false).
    - `collaborative`: Whether the playlist is collaborative (default: false).
    - `tracks`: List of songs to add, each with a `title` and `artist`. The backend will search Spotify for each track and add the best match.

  - **Response:**
    ```json
    {
      "playlist_id": "string",
      "external_url": "string",
      "message": "Playlist created and tracks added successfully"
    }
    ```

  - **Notes:**
    - The backend will search for each track using the Spotify Search API and add the found tracks to the new playlist.
    - The access token used must have the `playlist-modify-public` and/or `playlist-modify-private` scopes.
    - If a track cannot be found, it will be skipped.
    - If no valid tracks are found, the request will fail with a 400 error.

- **POST `/playlist/analyze`**
  - Analyze the mood of a Spotify playlist by its ID.
  - **Request Body:**
    ```json
    {
      "playlist_id": "string"
    }
    ```
  - **Response:**
    ```json
    {
      "playlist_id": "string",
      "playlist_name": "string",
      "tracks": [
        { "title": "string", "artist": "string" }
      ],
      "mood_response": {
        "inferred_mood": "string",
        "summary": "string",
        "recommendations": {
        "similar_mood": [
          { "title": "string", "artist": "string" }
        ],
        "uplifting_alternatives": [
          { "title": "string", "artist": "string" }
        ]
        },
        "message": "string"
      }
    }
    ```


### Music Mood Schemas

- **SongInput**
  ```json
  {
    "title": "string",
    "artist": "string"
  }
  ```
- **ManualMoodRequest**
  ```json
  {
    "songs": [SongInput]
  }
  ```
- **MoodRecommendation**
  ```json
  {
    "similar_mood": [
      { "title": "string", "artist": "string" }
    ],
    "uplifting_alternatives": [
      { "title": "string", "artist": "string" }
    ]
  }
  ```
- **MoodResponse**
  ```json
  {
    "inferred_mood": "string",
    "summary": "string",
    "recommendations": {
      "similar_mood": [
        { "title": "string", "artist": "string" }
      ],
      "uplifting_alternatives": [
        { "title": "string", "artist": "string" }
      ]
    },
    "message": "string"
  }
  ```

  ### Playlist  Schemas

- **PlaylistAnalysisRequest**
  ```json
  {
    "playlist_id": "string"
  }
  ```
- **PlaylistAnalysisResponse**
  ```json
  {
    "playlist_id": "string",
    "playlist_name": "string",
    "tracks": [
      { "title": "string", "artist": "string" }
    ],
    "mood_response": {
      "inferred_mood": "string",
      "summary": "string",
      "recommendations": {
        "similar_mood": [
          { "title": "string", "artist": "string" }
        ],
        "uplifting_alternatives": [
          { "title": "string", "artist": "string" }
        ]
      },
      "message": "string"
    }
  }
  ```


## Session-Based Mood Analysis Caching
The backend  supports session-based temporary storage for mood analysis results:

Mood analysis endpoints (/songs/manual, /songs/spotify, /playlist/analyze) now return a session_id along with the mood analysis result.
The session_id can be used with the /playlist/create endpoint to reuse the cached mood analysis, avoiding the need to re-analyze songs.
The /playlist/create endpoint accepts a session_id (as a query parameter or in the request body) and an optional delete_after_use flag to purge the session data after playlist creation.
Session data is stored in-memory and is not persisted in the database. It is suitable for single-process deployments.
Example Workflow:

Call a mood analysis endpoint and receive { ..., "session_id": "..." }.
Use the returned session_id to create a playlist via /playlist/create?session_id=....
(Optional) Set delete_after_use=true to remove the session data after use.

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

## Error Handling
- All endpoints return a consistent JSON structure:
  ```json
  {
    "success": true,
    "message": "...",
    "data": {...}
  }
  ```
- On error, `success` is `false` and `message` describes the error.


## Testing
- Tests are located in the `tests/` directory.
- To run tests:
  ```powershell
  pytest
  ```
- Tests are fully isolated from the production database.

## Contributing
- Fork the repo and create a feature branch.
- Submit a pull request with a clear description of your changes.

## License
This project is licensed under the MIT License.
