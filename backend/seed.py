"""
One-off script: seeds MongoDB with the same demo accounts the old
localStorage-backed frontend used to hardcode, so login works immediately.
Run with: python seed.py
"""
import asyncio

from auth_utils import hash_secret
from database import caregivers_collection, medicine_collection, patients_collection

DEMO_PATIENTS = [
    {"patient_id": "p1", "name": "Dipali Baruah", "age": 72, "gender": "Female", "language": "Assamese", "username": "dipali01", "pin": "1234"},
    {"patient_id": "p2", "name": "Temjen Longkumer", "age": 68, "gender": "Male", "language": "Ao Naga", "username": "temjen01", "pin": "1234"},
    {"patient_id": "p3", "name": "Lalrinawmi", "age": 75, "gender": "Female", "language": "Mizo", "username": "lalrin01", "pin": "1234"},
    {"patient_id": "p4", "name": "Ibemhal Konthoujam", "age": 70, "gender": "Female", "language": "Manipuri", "username": "ibemhal01", "pin": "1234"},
]

DEMO_CAREGIVER = {
    "caregiver_id": "c1",
    "name": "Dr. Mary Lyngdoh",
    "email": "demo@smriti.care",
    "phone": "9000000000",
    "password": "demo123",
}


async def seed():
    for p in DEMO_PATIENTS:
        exists = await patients_collection.find_one({"patient_id": p["patient_id"]})
        if exists:
            print(f"skip patient {p['username']} (already exists)")
            continue
        await patients_collection.insert_one({
            "patient_id": p["patient_id"],
            "name": p["name"],
            "age": p["age"],
            "gender": p["gender"],
            "language": p["language"],
            "username": p["username"],
            "pin_hash": hash_secret(p["pin"]),
            "photo_base64": None,
            "caregiver_id": DEMO_CAREGIVER["caregiver_id"],
        })
        print(f"created patient {p['username']} (PIN {p['pin']})")

    exists = await caregivers_collection.find_one({"caregiver_id": DEMO_CAREGIVER["caregiver_id"]})
    if exists:
        print("skip caregiver (already exists)")
    else:
        await caregivers_collection.insert_one({
            "caregiver_id": DEMO_CAREGIVER["caregiver_id"],
            "name": DEMO_CAREGIVER["name"],
            "email": DEMO_CAREGIVER["email"],
            "phone": DEMO_CAREGIVER["phone"],
            "password_hash": hash_secret(DEMO_CAREGIVER["password"]),
            "photo_base64": None,
        })
        print(f"created caregiver {DEMO_CAREGIVER['email']} (password {DEMO_CAREGIVER['password']})")

    seed_medicine = [
        {"patient_id": "p1", "name": "Morning Medicine", "time": "8:00 AM", "frequency": "Daily", "status": "taken"},
        {"patient_id": "p1", "name": "Afternoon Medicine", "time": "1:00 PM", "frequency": "Daily", "status": "pending"},
    ]
    for m in seed_medicine:
        exists = await medicine_collection.find_one({"patient_id": m["patient_id"], "name": m["name"]})
        if not exists:
            await medicine_collection.insert_one(m)
            print(f"created medicine entry: {m['name']} for {m['patient_id']}")

    print("Seed complete.")


if __name__ == "__main__":
    asyncio.run(seed())
