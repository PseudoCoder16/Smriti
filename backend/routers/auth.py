"""
Auth routes: patient login (no password, just profile selection) and caregiver login (email + password -> JWT).
"""
import os
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, HTTPException
from jose import jwt
from passlib.context import CryptContext
from pydantic import BaseModel

from database import patients_collection, caregivers_collection

router = APIRouter(prefix="/auth", tags=["auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_HOURS = 24


class PatientLoginRequest(BaseModel):
    patient_id: str


class CaregiverLoginRequest(BaseModel):
    email: str
    password: str


@router.post("/patient-login")
async def patient_login(payload: PatientLoginRequest):
    # No password check on purpose — patients "log in" by tapping their own
    # profile photo, so the frontend just sends the patient_id it already knows.
    patient = await patients_collection.find_one({"patient_id": payload.patient_id})

    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    return {
        "success": True,
        "patient_id": patient["patient_id"],
        "name": patient["name"],
    }


@router.post("/caregiver-login")
async def caregiver_login(payload: CaregiverLoginRequest):
    caregiver = await caregivers_collection.find_one({"email": payload.email})

    # Same error for "no such email" and "wrong password" so we don't leak
    # which one was incorrect.
    if not caregiver or not pwd_context.verify(payload.password, caregiver["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    expire = datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRE_HOURS)
    token = jwt.encode(
        {"caregiver_id": caregiver["caregiver_id"], "exp": expire},
        JWT_SECRET,
        algorithm=JWT_ALGORITHM,
    )

    return {
        "success": True,
        "token": token,
        "caregiver_id": caregiver["caregiver_id"],
    }
