from pydantic import BaseModel
from typing import Any, Dict, Optional

class SessionMoodResponse(BaseModel):
    session_id: str
    mood_response: Dict[str, Any]  # serialized MoodResponse

    class Config:
        orm_mode = True
        arbitrary_types_allowed = True
