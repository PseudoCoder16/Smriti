"""
Smriti API entry point. Run with: uvicorn main:app --reload
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import auth, checkin, game, medicine, messages, patient

app = FastAPI(title="Smriti API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(patient.router)
app.include_router(game.router)
app.include_router(medicine.router)
app.include_router(messages.router)
app.include_router(checkin.router)


@app.get("/")
async def root():
    return {"status": "Smriti backend running"}
