from pydantic import BaseModel
from typing import Any, Dict

class SessionMoodResponse(BaseModel):
    session_id: str
    mood_response: Dict[str, Any]

    class Config:
        from_attributes = True
        arbitrary_types_allowed = True
