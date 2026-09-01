"""
Pydantic request/response models shared across routers.
"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel


# ---------------- Auth ----------------

class PatientLoginRequest(BaseModel):
    username: str
    pin: str


class CaregiverLoginRequest(BaseModel):
    email: str
    password: str


class PatientRegisterRequest(BaseModel):
    name: str
    age: int
    gender: str
    language: str
    username: str
    pin: str
    photo_base64: Optional[str] = None


class CaregiverRegisterRequest(BaseModel):
    name: str
    email: str
    phone: str
    password: str
    photo_base64: Optional[str] = None


# ---------------- Patient ----------------

class PatientOut(BaseModel):
    patient_id: str
    name: str
    age: int
    gender: str
    language: str
    username: str
    photo_base64: Optional[str] = None


# ---------------- Game ----------------
# Field names/shape here must match the frontend's standardized result
# object exactly (see frontend/src/hooks/useLocalGameResult.js) — every game
# screen builds this same shape regardless of which game it is.

class GameResultRequest(BaseModel):
    patient_id: str
    game_id: str
    difficulty: str
    rounds: int
    correct: int
    incorrect: int
    errors: int
    accuracy: int
    precision: int
    error_rate: int
    average_response_time: float
    score: int
    completed: bool = True
    timestamp: Optional[datetime] = None  # client-supplied; server fills in if missing


class GameSessionOut(BaseModel):
    session_id: str
    game_id: str
    difficulty: str
    rounds: int
    correct: int
    incorrect: int
    errors: int
    accuracy: int
    precision: int
    error_rate: int
    average_response_time: float
    score: int
    completed: bool
    timestamp: datetime


# ---------------- Medicine ----------------

class MedicineCreateRequest(BaseModel):
    patient_id: str
    name: str
    time: str
    frequency: str


class MedicineUpdateRequest(BaseModel):
    status: Optional[str] = None  # "taken" | "pending"
    name: Optional[str] = None
    time: Optional[str] = None
    frequency: Optional[str] = None


class MedicineOut(BaseModel):
    medicine_id: str
    patient_id: str
    name: str
    time: str
    frequency: str
    status: str


# ---------------- Messages ----------------

class MessageCreateRequest(BaseModel):
    patient_id: str
    text: str


class MessageUpdateRequest(BaseModel):
    read: bool


class MessageOut(BaseModel):
    message_id: str
    patient_id: str
    text: str
    read: bool
    timestamp: datetime


# ---------------- Check-in ----------------

class CheckinCreateRequest(BaseModel):
    patient_id: str
    mood: str


class CheckinOut(BaseModel):
    checkin_id: str
    patient_id: str
    mood: str
    timestamp: datetime
