# In-memory session cache for mood analysis results
import uuid
import threading
from typing import Optional, Dict, Any

# global in-memory cache
defaultdict = dict 
SESSION_CACHE: Dict[str, dict] = defaultdict()
_SESSION_LOCK = threading.Lock()

def create_session_id() -> str:
    return str(uuid.uuid4())

def store_analysis(session_id: str, mood_data: dict):
    with _SESSION_LOCK:
        SESSION_CACHE[session_id] = mood_data

def get_analysis(session_id: str) -> Optional[dict]:
    with _SESSION_LOCK:
        return SESSION_CACHE.get(session_id)

def delete_analysis(session_id: str):
    with _SESSION_LOCK:
        SESSION_CACHE.pop(session_id, None)
