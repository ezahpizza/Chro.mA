#serpAPI client for extracting mood snippets 
import re
import json
import logging
from typing import List, Dict, Any, Optional
from agno.agent import Agent
from agno.tools.serpapi import SerpApiTools
from agno.models.google import Gemini
from config import settings

logger = logging.getLogger(__name__)

class SerpClient:
    def __init__(self):
        self.serpapi_key = settings.SERPAPI_KEY
        self.gemini_model = getattr(settings, 'GEMINI_MODEL', None)
        if not self.serpapi_key:
            raise ValueError("SERPAPI_KEY environment variable is required")
        if not self.gemini_model:
            raise ValueError("GEMINI_MODEL environment variable is required")
        self._setup_agent()

    def _setup_agent(self):
        self.agent = Agent(
            name="Song Snippet Extractor",
            instructions=[
                "You are a music information extractor.",
                "Given a list of songs, use web search to extract relevant snippets about their meaning and mood.",
                "Return a list of objects, each with keys: song (with title and artist) and snippets (list of strings)."
            ],
            model=Gemini(id=self.gemini_model),
            tools=[SerpApiTools(api_key=self.serpapi_key)],
            add_datetime_to_instructions=True,
        )

    async def get_song_mood(self, songs: List[Dict[str, str]]) -> Optional[List[Dict[str, Any]]]:
        #extract mood snippets
        def extract_json_from_markdown(text):
            match = re.search(r"```(?:json)?\s*([\s\S]+?)\s*```", text)
            if match:
                return match.group(1)
            return text
            
        try:
            prompt = self._build_prompt(songs)
            logger.info(f"Extracting mood snippets for {len(songs)} songs via Agno agent")
            result = self.agent.run(prompt, stream=False)
            if not result or not result.content:
                logger.warning(f"No content returned from SerpAPI agent. Raw result: {result}")
                return [
                    {
                        "song": song,
                        "snippets": ["No response from SerpAPI agent"]
                    } for song in songs
                ]
            
            try:
                content = result.content
                logger.info(f"Raw SerpAPI agent output: {content}")
                content = extract_json_from_markdown(content)
                parsed = json.loads(content)
                if not isinstance(parsed, list):
                    logger.warning(f"SerpAPI agent did not return a list. Output: {parsed}")
                    return [
                        {
                            "song": song,
                            "snippets": ["SerpAPI agent did not return a list"]
                        } for song in songs
                    ]
                return parsed
            except Exception as e:
                logger.error(f"Failed to parse JSON from SerpAPI agent response. Error: {str(e)}, Raw output: {result.content}")
                return [
                    {
                        "song": song,
                        "snippets": [str(result.content)] if result.content else []
                    } for song in songs
                ]
        except Exception as e:
            logger.error(f"SerpAPI snippet extraction failed: {str(e)}")
            return [
                {
                    "song": song,
                    "snippets": []
                } for song in songs
            ]

    def _build_prompt(self, songs: List[Dict[str, str]]) -> str:
        prompt = """
For each of the following songs, use web search to extract relevant snippets about the song's meaning and mood. Return a list of objects, each with keys: song (with title and artist) and snippets (list of strings).
"""
        for song in songs:
            prompt += f"\nSong: {song['title']} by {song['artist']}"
        return prompt