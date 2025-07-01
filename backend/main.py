import logging
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from db.mongodb import mongodb
from routers import auth_spotify, mood, playlists

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s"
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    await mongodb.connect()
    yield
    await mongodb.disconnect()

app = FastAPI(
    title="psykSpot",
    description="MVP backend for mood analysis and recommendations",
    version="0.1.0",
    lifespan=lifespan,
    debug=settings.DEBUG
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.CORS_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_spotify.router, tags=["auth"])
app.include_router(mood.router, prefix="/mood", tags=["mood"])
app.include_router(playlists.router, prefix="/playlist", tags=["playlist"])


@app.get("/")
async def root():
    return {"message": "psykSpot running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

