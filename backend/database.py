"""
Async MongoDB connection setup using Motor.
Import `db` (or one of the collection variables below) anywhere you need to read/write data.
"""
import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

client = AsyncIOMotorClient(MONGO_URI)
db = client["smriti"]

# Collection references — import these directly in routers, e.g.:
#   from database import patients_collection
patients_collection = db["patients"]
caregivers_collection = db["caregivers"]
medicine_collection = db["medicine"]
messages_collection = db["messages"]
checkins_collection = db["checkins"]
game_sessions_collection = db["game_sessions"]
