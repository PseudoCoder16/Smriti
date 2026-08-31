"""
Login and registration for both roles.
Patient: username + PIN (hashed, no JWT needed — prototype-level auth).
Caregiver: email + password -> JWT, required as a Bearer token on caregiver-only routes.
"""
import uuid

from fastapi import APIRouter, Depends, HTTPException

from auth_utils import create_caregiver_token, get_current_caregiver, hash_secret, verify_secret
from database import caregivers_collection, patients_collection
from models.schemas import (
    CaregiverLoginRequest,
    CaregiverRegisterRequest,
    PatientLoginRequest,
    PatientRegisterRequest,
)

router = APIRouter(tags=["auth"])


@router.post("/login/patient")
async def patient_login(payload: PatientLoginRequest):
    patient = await patients_collection.find_one({"username": payload.username.lower()})
    if not patient or not verify_secret(payload.pin, patient["pin_hash"]):
        raise HTTPException(status_code=401, detail="Invalid username or PIN")

    return {"success": True, "patient_id": patient["patient_id"], "name": patient["name"]}


@router.post("/login/caregiver")
async def caregiver_login(payload: CaregiverLoginRequest):
    caregiver = await caregivers_collection.find_one({"email": payload.email})

    # Same error for "no such email" and "wrong password" so we don't leak which one was incorrect.
    if not caregiver or not verify_secret(payload.password, caregiver["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_caregiver_token(caregiver["caregiver_id"])
    return {"success": True, "token": token, "caregiver_id": caregiver["caregiver_id"]}


async def _create_patient(payload: PatientRegisterRequest, caregiver_id: str | None):
    username = payload.username.lower()
    if await patients_collection.find_one({"username": username}):
        raise HTTPException(status_code=409, detail="This username is already taken")

    patient_id = "p" + uuid.uuid4().hex[:12]
    await patients_collection.insert_one({
        "patient_id": patient_id,
        "name": payload.name,
        "age": payload.age,
        "gender": payload.gender,
        "language": payload.language,
        "username": username,
        "pin_hash": hash_secret(payload.pin),
        "photo_base64": payload.photo_base64,
        "caregiver_id": caregiver_id,
    })
    return {"success": True, "patient_id": patient_id, "name": payload.name}


@router.post("/register/patient")
async def register_patient(payload: PatientRegisterRequest, caregiver: dict = Depends(get_current_caregiver)):
    """Caregiver-authenticated — used by the "+ Add Patient" flow on the caregiver dashboard."""
    return await _create_patient(payload, caregiver["caregiver_id"])


@router.post("/register/patient/self")
async def register_patient_self(payload: PatientRegisterRequest):
    """Public — an elderly patient registering themselves from the Auth screen, with no caregiver yet.
    A caregiver can link/claim them later from their dashboard."""
    return await _create_patient(payload, None)


@router.post("/register/caregiver")
async def register_caregiver(payload: CaregiverRegisterRequest):
    if await caregivers_collection.find_one({"email": payload.email}):
        raise HTTPException(status_code=409, detail="An account with this email already exists")

    caregiver_id = "c" + uuid.uuid4().hex[:12]
    await caregivers_collection.insert_one({
        "caregiver_id": caregiver_id,
        "name": payload.name,
        "email": payload.email,
        "phone": payload.phone,
        "password_hash": hash_secret(payload.password),
        "photo_base64": payload.photo_base64,
    })
    token = create_caregiver_token(caregiver_id)
    return {"success": True, "token": token, "caregiver_id": caregiver_id}
