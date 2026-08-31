"""
Patient mood check-ins ("How are you feeling today?").
"""
from datetime import datetime, timezone

from fastapi import APIRouter

from database import checkins_collection
from models.schemas import CheckinCreateRequest

router = APIRouter(tags=["checkin"])


def serialize(c: dict) -> dict:
    return {
        "checkin_id": str(c["_id"]),
        "patient_id": c["patient_id"],
        "mood": c["mood"],
        "timestamp": c["timestamp"],
    }


@router.post("/checkin")
async def create_checkin(payload: CheckinCreateRequest):
    doc = {
        "patient_id": payload.patient_id,
        "mood": payload.mood,
        "timestamp": datetime.now(timezone.utc),
    }
    result = await checkins_collection.insert_one(doc)
    doc["_id"] = result.inserted_id
    return serialize(doc)


@router.get("/checkin/{patient_id}")
async def list_checkins(patient_id: str, limit: int = 30):
    cursor = checkins_collection.find({"patient_id": patient_id}).sort("timestamp", -1).limit(limit)
    return {"checkins": [serialize(c) async for c in cursor]}
