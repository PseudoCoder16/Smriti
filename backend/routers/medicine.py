"""
Medicine schedule: caregiver creates/edits entries, patient (or caregiver)
reads them, patient toggles status via PUT when taken.
"""
from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Depends, HTTPException
from pymongo import ReturnDocument

from auth_utils import get_current_caregiver
from database import medicine_collection
from models.schemas import MedicineCreateRequest, MedicineUpdateRequest

router = APIRouter(prefix="/medicine", tags=["medicine"])


def serialize(m: dict) -> dict:
    return {
        "medicine_id": str(m["_id"]),
        "patient_id": m["patient_id"],
        "name": m["name"],
        "time": m["time"],
        "frequency": m["frequency"],
        "status": m["status"],
    }


@router.get("/{patient_id}")
async def list_medicine(patient_id: str):
    cursor = medicine_collection.find({"patient_id": patient_id})
    return {"medicine": [serialize(m) async for m in cursor]}


@router.post("")
async def add_medicine(payload: MedicineCreateRequest, caregiver: dict = Depends(get_current_caregiver)):
    doc = {
        "patient_id": payload.patient_id,
        "name": payload.name,
        "time": payload.time,
        "frequency": payload.frequency,
        "status": "pending",
    }
    result = await medicine_collection.insert_one(doc)
    doc["_id"] = result.inserted_id
    return serialize(doc)


@router.put("/{medicine_id}")
async def update_medicine(medicine_id: str, payload: MedicineUpdateRequest):
    try:
        oid = ObjectId(medicine_id)
    except InvalidId:
        raise HTTPException(status_code=404, detail="Medicine entry not found")

    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")

    result = await medicine_collection.find_one_and_update(
        {"_id": oid}, {"$set": updates}, return_document=ReturnDocument.AFTER
    )
    if not result:
        raise HTTPException(status_code=404, detail="Medicine entry not found")
    return serialize(result)
