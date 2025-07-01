
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
        "similar_mood": ["string"],
        "uplifting_alternatives": ["string"]
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
    "similar_mood": ["string"],
    "uplifting_alternatives": ["string"]
  }
  ```
- **MoodResponse**
  ```json
  {
    "inferred_mood": "string",
    "summary": "string",
    "recommendations": MoodRecommendation,
    "message": "string"
  }
  ```

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
