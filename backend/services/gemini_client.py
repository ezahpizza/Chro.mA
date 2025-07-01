#gemini client for mood classification
import re
import json
import logging
from typing import List, Dict, Any, Optional
from agno.agent import Agent
from agno.tools.serpapi import SerpApiTools
from agno.models.google import Gemini
from config import settings

logger = logging.getLogger(__name__)

class GeminiClient:
    def __init__(self):
        self.serpapi_key = settings.SERPAPI_KEY
        self.gemini_model = settings.GEMINI_MODEL
        if not self.serpapi_key:
            raise ValueError("SERPAPI_KEY environment variable is required")
        if not self.gemini_model:
            raise ValueError("GEMINI_MODEL environment variable is required")
        self._setup_agent()

    def _setup_agent(self):
        self.agent = Agent(
            name="Song Mood Analyzer",
            instructions=[
                "You are a music mood analysis expert.",
                "Given a list of songs, analyze their mood and emotional themes using web search snippets.",
                "Classify the overall mood as one of: happy, neutral, sad, nostalgic, hopeful, anxious.",
                "Suggest similar mood songs and uplifting alternatives.",
                "Return a JSON object with keys: inferred_mood, summary, recommendations (with similar_mood and uplifting_alternatives), and message."
            ],
            model=Gemini(id=self.gemini_model),
            tools=[SerpApiTools(api_key=self.serpapi_key)],
            add_datetime_to_instructions=True,
        )

    async def classify_mood_and_generate_response(self, songs: List[Dict[str, str]]) -> Optional[Dict[str, Any]]:
        #analyze mood 
        def extract_json_from_markdown(text):
            match = re.search(r"```(?:json)?\s*([\s\S]+?)\s*```", text)
            if match:
                return match.group(1)
            return text
        try:
            prompt = self._build_prompt(songs)
            logger.info(f"Analyzing mood for {len(songs)} songs via Agno agent")
            result = self.agent.run(prompt, stream=False)
            if not result or not result.content:
                logger.warning("No content returned from Gemini agent")
                return {
                    "inferred_mood": "unknown",
                    "summary": "Could not analyze mood.",
                    "recommendations": {
                        "similar_mood": [],
                        "uplifting_alternatives": []
                    },
                    "message": "Sorry, we couldn't analyze your mood."
                }

            try:
                content = extract_json_from_markdown(result.content)
                return json.loads(content)
            except Exception as e:
                logger.error(f"Failed to parse JSON from Gemini agent response. Error: {str(e)}, Raw output: {result.content}")
                return {
                    "inferred_mood": "unknown",
                    "summary": "Could not analyze mood.",
                    "recommendations": {
                        "similar_mood": [],
                        "uplifting_alternatives": []
                    },
                    "message": f"Sorry, we couldn't analyze your mood. Parse error: {str(e)}"
                }
        except Exception as e:
            logger.error(f"Gemini mood analysis failed: {str(e)}")
            return {
                "inferred_mood": "unknown",
                "summary": "Could not analyze mood.",
                "recommendations": {
                    "similar_mood": [],
                    "uplifting_alternatives": []
                },
                "message": f"Sorry, we couldn't analyze your mood. Exception: {str(e)}"
            }

    def _build_prompt(self, songs: List[Dict[str, str]]) -> str:
        prompt = """
    Analyze the following songs for mood and emotional themes. For each song, use web search to find relevant snippets about its meaning and mood. Classify the overall mood as one of: happy, neutral, sad, nostalgic, hopeful, anxious. 

    Return a JSON object with this exact structure:
    {
    "inferred_mood": "one of: happy, neutral, sad, nostalgic, hopeful, anxious",
    "summary": "brief analysis of the overall mood",
    "recommendations": {
        "similar_mood": ["Song Title by Artist", "Song Title by Artist", "Song Title by Artist", "Song Title by Artist"],
        "uplifting_alternatives": ["Song Title by Artist", "Song Title by Artist", "Song Title by Artist", "Song Title by Artist"]
    },
    "message": "personalized message based on the mood"
    }

    Songs to analyze:
    """
        for song in songs:
            prompt += f"\nSong: {song['title']} by {song['artist']}"
        return prompt