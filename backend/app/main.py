"""FastAPI backend for Thailand Tour Booking Voice & Text Chat."""

import base64
import json
import os
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel

from app.tour_data import get_all_tours, get_tour_by_id, get_all_bookings, create_booking
from app.gemini_service import ChatSession


# Store active chat sessions (keyed by session ID)
chat_sessions: dict[str, ChatSession] = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    chat_sessions.clear()


app = FastAPI(
    title="Thailand Tour Booking Chat",
    description="Voice and text chat powered by Google Gemini for booking Thailand tours",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---- REST API Endpoints ----


@app.get("/api/tours")
async def list_tours():
    """Get all available tours."""
    return {"tours": get_all_tours()}


@app.get("/api/tours/{tour_id}")
async def get_tour(tour_id: str):
    """Get a specific tour by ID."""
    tour = get_tour_by_id(tour_id)
    if not tour:
        raise HTTPException(status_code=404, detail="Tour not found")
    return tour


@app.get("/api/bookings")
async def list_bookings():
    """Get all bookings."""
    return {"bookings": get_all_bookings()}


class BookingRequest(BaseModel):
    tour_id: str
    selected_date: str
    num_participants: int
    customer_name: str
    customer_email: str


@app.post("/api/bookings")
async def make_booking(req: BookingRequest):
    """Create a new booking."""
    booking = create_booking(
        tour_id=req.tour_id,
        selected_date=req.selected_date,
        num_participants=req.num_participants,
        customer_name=req.customer_name,
        customer_email=req.customer_email,
    )
    if not booking:
        raise HTTPException(status_code=400, detail="Invalid tour ID or date")
    return booking


class ChatMessage(BaseModel):
    message: str
    session_id: str = "default"


@app.post("/api/chat")
async def chat_text(req: ChatMessage):
    """Send a text message and get an AI response."""
    if req.session_id not in chat_sessions:
        chat_sessions[req.session_id] = ChatSession()

    session = chat_sessions[req.session_id]
    response = await session.send_message(req.message)
    return {"response": response, "session_id": req.session_id}


class VoiceMessage(BaseModel):
    audio_base64: str
    session_id: str = "default"


@app.post("/api/voice")
async def chat_voice(req: VoiceMessage):
    """Send audio (base64 encoded) and get a text response."""
    if req.session_id not in chat_sessions:
        chat_sessions[req.session_id] = ChatSession()

    session = chat_sessions[req.session_id]
    audio_bytes = base64.b64decode(req.audio_base64)
    transcribed, response = await session.process_audio(audio_bytes)
    return {
        "transcribed_text": transcribed,
        "response": response,
        "session_id": req.session_id,
    }


# ---- WebSocket for real-time chat ----


@app.websocket("/ws/chat/{session_id}")
async def websocket_chat(websocket: WebSocket, session_id: str):
    """WebSocket endpoint for real-time text and voice chat."""
    await websocket.accept()

    if session_id not in chat_sessions:
        chat_sessions[session_id] = ChatSession()

    session = chat_sessions[session_id]

    try:
        while True:
            data = await websocket.receive_text()
            msg = json.loads(data)

            if msg.get("type") == "text":
                response = await session.send_message(msg["content"])
                await websocket.send_json(
                    {"type": "text_response", "content": response}
                )

            elif msg.get("type") == "audio":
                audio_bytes = base64.b64decode(msg["content"])
                transcribed, response = await session.process_audio(audio_bytes)
                await websocket.send_json(
                    {
                        "type": "voice_response",
                        "transcribed_text": transcribed,
                        "content": response,
                    }
                )

    except WebSocketDisconnect:
        pass


@app.get("/api/health")
async def health_check():
    return {"status": "ok", "service": "Thailand Tour Booking Chat"}


# ---- Serve frontend static files ----

STATIC_DIR = Path(__file__).resolve().parent.parent / "static"

if STATIC_DIR.is_dir():
    app.mount("/assets", StaticFiles(directory=STATIC_DIR / "assets"), name="assets")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        """Serve the React SPA for all non-API routes."""
        file_path = STATIC_DIR / full_path
        if full_path and file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(STATIC_DIR / "index.html")
