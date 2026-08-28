"""
Smriti API entry point. Run with: uvicorn main:app --reload
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import auth
# When more routers are added, import + include them the same way, e.g.:
# from routers import patients, reminders, game_sessions, dashboard

app = FastAPI(title="Smriti API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
# app.include_router(patients.router)
# app.include_router(reminders.router)
# app.include_router(game_sessions.router)
# app.include_router(dashboard.router)


@app.get("/")
async def root():
    return {"status": "Smriti backend running"}
