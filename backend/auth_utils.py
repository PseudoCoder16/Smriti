"""
Shared password/PIN hashing and JWT helpers, used by auth.py and by any
router that needs to verify a caregiver's Bearer token.
"""
import os
from datetime import datetime, timedelta, timezone

from fastapi import Header, HTTPException
from jose import JWTError, jwt
from passlib.context import CryptContext

from database import caregivers_collection

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_HOURS = 24


def hash_secret(raw: str) -> str:
    return pwd_context.hash(raw)


def verify_secret(raw: str, hashed: str) -> bool:
    return pwd_context.verify(raw, hashed)


def create_caregiver_token(caregiver_id: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRE_HOURS)
    return jwt.encode({"caregiver_id": caregiver_id, "exp": expire}, JWT_SECRET, algorithm=JWT_ALGORITHM)


async def get_current_caregiver(authorization: str = Header(...)) -> dict:
    """FastAPI dependency: validates the 'Authorization: Bearer <token>' header
    and returns the caregiver document. Use as `caregiver = Depends(get_current_caregiver)`."""
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or malformed Authorization header")
    token = authorization.removeprefix("Bearer ").strip()
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    caregiver = await caregivers_collection.find_one({"caregiver_id": payload["caregiver_id"]})
    if not caregiver:
        raise HTTPException(status_code=401, detail="Caregiver not found")
    return caregiver
