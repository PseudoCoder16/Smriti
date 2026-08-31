"""
Caregiver -> patient one-way messages (e.g. "Please take your afternoon medicine").
"""
from datetime import datetime, timezone

from fastapi import APIRouter, Depends

from auth_utils import get_current_caregiver
from database import messages_collection
from models.schemas import MessageCreateRequest

router = APIRouter(tags=["messages"])


def serialize(m: dict) -> dict:
    return {
        "message_id": str(m["_id"]),
        "patient_id": m["patient_id"],
        "text": m["text"],
        "timestamp": m["timestamp"],
    }


@router.get("/messages/{patient_id}")
async def list_messages(patient_id: str):
    cursor = messages_collection.find({"patient_id": patient_id}).sort("timestamp", -1)
    return {"messages": [serialize(m) async for m in cursor]}


@router.post("/message")
async def send_message(payload: MessageCreateRequest, caregiver: dict = Depends(get_current_caregiver)):
    doc = {
        "patient_id": payload.patient_id,
        "text": payload.text,
        "timestamp": datetime.now(timezone.utc),
        "sent_by": caregiver["caregiver_id"],
    }
    result = await messages_collection.insert_one(doc)
    doc["_id"] = result.inserted_id
    return serialize(doc)
