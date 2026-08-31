"""
Records one finished game session. Called by every game screen on completion
(ML adaptive-difficulty logic reads from game_sessions_collection later).
"""
from datetime import datetime, timezone

from fastapi import APIRouter

from database import game_sessions_collection
from models.schemas import GameResultRequest

router = APIRouter(prefix="/game", tags=["game"])


@router.post("/result")
async def record_game_result(payload: GameResultRequest):
    doc = {
        "patient_id": payload.patient_id,
        "game_type": payload.game_type,
        "difficulty": payload.difficulty,
        "score": payload.score,
        "correct": payload.correct,
        "errors": payload.errors,
        "avg_response_ms": payload.avg_response_ms,
        "timestamp": datetime.now(timezone.utc),
    }
    result = await game_sessions_collection.insert_one(doc)
    return {"session_id": str(result.inserted_id), "status": "recorded"}
