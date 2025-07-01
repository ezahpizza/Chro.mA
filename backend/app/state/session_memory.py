# In-memory session cache for mood analysis results
import uuid
import threading
from typing import Optional, Dict, Any

# Global in-memory session cache
defaultdict = dict  # for clarity
SESSION_CACHE: Dict[str, dict] = defaultdict()
_SESSION_LOCK = threading.Lock()

def create_session_id() -> str:
    """Generate a new UUID4 session ID as a string."""
    return str(uuid.uuid4())

def store_analysis(session_id: str, mood_data: dict):
    """Store the mood analysis result for a session."""
    with _SESSION_LOCK:
        SESSION_CACHE[session_id] = mood_data

def get_analysis(session_id: str) -> Optional[dict]:
    """Retrieve the mood analysis result for a session, or None if not found."""
    with _SESSION_LOCK:
        return SESSION_CACHE.get(session_id)

def delete_analysis(session_id: str):
    """Delete the session entry from the cache."""
    with _SESSION_LOCK:
        SESSION_CACHE.pop(session_id, None)
