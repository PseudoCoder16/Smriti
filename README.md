# Smriti — AI Cognitive Gaming & Memory Assistance Platform

AI-powered cognitive gaming and memory assistance platform for elderly dementia patients in the North Eastern Region (NER). Built for CodeSpecs — prototype demo on September 1.

## Problem

Elderly dementia patients in NER face limited access to cognitive therapy and specialized care due to healthcare infrastructure gaps and geographic isolation. Caregivers struggle with continuous monitoring and engagement. This platform provides adaptive cognitive games, reminders, voice-assisted multilingual interaction, and a caregiver dashboard — designed to work in low-connectivity environments.

## Tech Stack

- **Frontend:** React + Tailwind CSS
- **Backend:** FastAPI (Python)
- **Database:** MongoDB (via Motor/PyMongo)
- **ML:** scikit-learn (adaptive difficulty engine)
- **Voice:** Web Speech API (browser-native STT/TTS)

## Project Structure

```
smriti/
├── backend/          # FastAPI app
│   ├── main.py
│   ├── routers/      # auth, patients, reminders, games, dashboard
│   ├── models/
│   └── requirements.txt
├── frontend/         # React app
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.jsx
│   └── package.json
├── CONTRACT.md        # API contract — read before building any feature
└── README.md
```

## Getting Started

### Backend
```bash
cd backend
python -m venv venv

pip install -r requirements.txt
uvicorn main:app --reload
```
Runs on `http://localhost:8000` — Swagger docs at `http://localhost:8000/docs`

### Frontend
```bash
cd frontend
npm install
npm start
```
Runs on `http://localhost:3000`

## Core Features (Problem Statement Requirements)

- [ ] Cognitive games: memory match, pattern recognition, daily routine recall
- [ ] AI-adaptive difficulty based on patient performance
- [ ] Voice-assisted, multilingual interaction (regional language + English)
- [ ] Culturally familiar visuals and themes
- [ ] Reminders: medicine, hydration, daily activities, appointments
- [ ] Caregiver dashboard: activity monitoring, alerts
- [ ] Offline-first support with sync
- [ ] Elderly-friendly, mobile/tablet-accessible UI

## Team

| Member | Role |
|--------|------|
| Atishay Jain (Lead) | Architecture, integration, ML adaptive-difficulty logic |
| Ankit Chaurasia | Backend — data models, reminders API, offline sync |
| Riddhima Agarwal | Frontend — UI shell, Games 1 & 2, caregiver dashboard UI |
| Shreya Srivastava | Frontend — Game 3, reminders UI, dashboard alerts |
| Vansh Jain | Voice interaction, regional language, theming |
| Aryan Gupta | Pitch deck & presentation |

## Branching

- `main` — stable, demo-ready code only
- One feature branch per person, merge to `main` at daily checkpoints

See `CONTRACT.md` for the full API contract before building any feature that talks to the backend.
