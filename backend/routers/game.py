"""
Records one finished game session. Called by every game screen on completion
(ML adaptive-difficulty logic reads from game_sessions_collection later).

The stored document's fields match GameResultRequest exactly, which in turn
mirrors the frontend's standardized result shape (see
frontend/src/hooks/useLocalGameResult.js) — no renaming/reshaping happens
here so the "format must remain the same" requirement holds end-to-end.
"""
from datetime import datetime, timezone

from fastapi import APIRouter

from database import game_sessions_collection
from models.schemas import GameResultRequest

router = APIRouter(prefix="/game", tags=["game"])


@router.post("/result")
async def record_game_result(payload: GameResultRequest):
    doc = payload.model_dump()
    if doc.get("timestamp") is None:
        doc["timestamp"] = datetime.now(timezone.utc)
    result = await game_sessions_collection.insert_one(doc)
    return {"session_id": str(result.inserted_id), "status": "recorded"}
