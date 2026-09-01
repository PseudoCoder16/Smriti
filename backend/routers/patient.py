"""
Patient profile + performance aggregation, used by both the patient's own
"My Progress" screen and the caregiver dashboard.
"""
from fastapi import APIRouter, Depends, HTTPException

from auth_utils import get_current_caregiver
from database import game_sessions_collection, patients_collection

router = APIRouter(prefix="/patient", tags=["patient"])


@router.get("")
async def list_my_patients(caregiver: dict = Depends(get_current_caregiver)):
    cursor = patients_collection.find({"caregiver_id": caregiver["caregiver_id"]})
    patients = []
    async for p in cursor:
        patients.append({
            "patient_id": p["patient_id"],
            "name": p["name"],
            "age": p["age"],
            "gender": p["gender"],
            "language": p["language"],
            "username": p["username"],
            "photo_base64": p.get("photo_base64"),
        })
    return {"patients": patients}


@router.get("/{patient_id}")
async def get_patient(patient_id: str):
    patient = await patients_collection.find_one({"patient_id": patient_id})
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return {
        "patient_id": patient["patient_id"],
        "name": patient["name"],
        "age": patient["age"],
        "gender": patient["gender"],
        "language": patient["language"],
        "username": patient["username"],
        "photo_base64": patient.get("photo_base64"),
    }


def _response_time(s: dict) -> float:
    # `average_response_time` is the current field name; `avg_response_ms`
    # covers any pre-Phase-8 documents still in the collection so old data
    # keeps working instead of crashing these reads.
    return s.get("average_response_time", s.get("avg_response_ms", 0)) or 0


@router.get("/{patient_id}/games")
async def get_patient_games(patient_id: str, limit: int = 30):
    cursor = game_sessions_collection.find({"patient_id": patient_id}).sort("timestamp", -1).limit(limit)
    sessions = []
    async for s in cursor:
        sessions.append({
            "session_id": str(s["_id"]),
            "game_id": s.get("game_id", s.get("game_type")),
            "difficulty": s.get("difficulty"),
            "rounds": s.get("rounds"),
            "correct": s.get("correct", 0),
            "incorrect": s.get("incorrect", 0),
            "errors": s.get("errors", 0),
            "accuracy": s.get("accuracy"),
            "precision": s.get("precision"),
            "error_rate": s.get("error_rate"),
            "average_response_time": _response_time(s),
            "score": s.get("score"),
            "completed": s.get("completed", True),
            "timestamp": s["timestamp"],
        })
    return {"sessions": sessions}


@router.get("/{patient_id}/performance")
async def get_patient_performance(patient_id: str, days: int = 7):
    cursor = game_sessions_collection.find({"patient_id": patient_id}).sort("timestamp", 1)
    sessions = [s async for s in cursor]

    if not sessions:
        return {
            "games_completed": 0,
            "accuracy_pct": 0,
            "error_rate_pct": 0,
            "avg_response_ms": 0,
            "trend": [],
        }

    total_correct = sum(s.get("correct", 0) for s in sessions)
    total_errors = sum(s.get("errors", 0) for s in sessions)
    total_attempts = total_correct + total_errors
    avg_response_ms = round(sum(_response_time(s) for s in sessions) / len(sessions), 1)

    by_day: dict[str, list[dict]] = {}
    for s in sessions:
        day = s["timestamp"].strftime("%Y-%m-%d")
        by_day.setdefault(day, []).append(s)

    trend = []
    for day, day_sessions in sorted(by_day.items())[-days:]:
        d_correct = sum(s.get("correct", 0) for s in day_sessions)
        d_errors = sum(s.get("errors", 0) for s in day_sessions)
        d_attempts = d_correct + d_errors
        trend.append({
            "date": day,
            "games_completed": len(day_sessions),
            "accuracy_pct": round((d_correct / d_attempts) * 100, 1) if d_attempts else 0,
            "error_rate_pct": round((d_errors / d_attempts) * 100, 1) if d_attempts else 0,
            "avg_response_ms": round(sum(_response_time(s) for s in day_sessions) / len(day_sessions), 1),
        })

    return {
        "games_completed": len(sessions),
        "accuracy_pct": round((total_correct / total_attempts) * 100, 1) if total_attempts else 0,
        "error_rate_pct": round((total_errors / total_attempts) * 100, 1) if total_attempts else 0,
        "avg_response_ms": avg_response_ms,
        "trend": trend,
    }
