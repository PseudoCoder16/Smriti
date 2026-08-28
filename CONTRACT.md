# API Contract — v1

This is the agreed shape of every backend endpoint. Frontend can build against these shapes (using hardcoded mock JSON matching this exact structure) before the backend is finished — swap in the real call later with zero rework. Any change to this contract must be communicated to the whole team before code is written against it.

Base URL (local dev): `http://localhost:8000`

---

## Auth

### `POST /auth/patient-login`
Patient taps their profile icon to enter — no password.

**Request**
```json
{ "patient_id": "string" }
```
**Response**
```json
{ "success": true, "patient_id": "string", "name": "string" }
```

### `POST /auth/caregiver-login`
**Request**
```json
{ "email": "string", "password": "string" }
```
**Response**
```json
{ "success": true, "token": "jwt_string", "caregiver_id": "string" }
```

---

## Patients

### `POST /patients`
Caregiver creates a patient profile.

**Request**
```json
{ "name": "string", "language": "string", "photo_url": "string", "caregiver_id": "string" }
```
**Response**
```json
{ "patient_id": "string", "name": "string", "language": "string", "photo_url": "string" }
```

### `GET /patients/{id}`
**Response**
```json
{
  "patient_id": "string",
  "name": "string",
  "language": "string",
  "photo_url": "string",
  "difficulty_level": 1
}
```

---

## Reminders

### `POST /reminders`
**Request**
```json
{
  "patient_id": "string",
  "type": "medicine | hydration | activity | appointment",
  "title": "string",
  "time": "2026-09-01T09:00:00Z"
}
```
**Response**
```json
{ "reminder_id": "string", "status": "created" }
```

### `GET /reminders/{patient_id}`
**Response**
```json
{
  "reminders": [
    {
      "reminder_id": "string",
      "type": "medicine",
      "title": "string",
      "time": "2026-09-01T09:00:00Z",
      "completed": false
    }
  ]
}
```

---

## Game Sessions

### `POST /game-sessions`
Called every time a patient finishes a game.

**Request**
```json
{
  "patient_id": "string",
  "game_type": "memory_match | pattern_recognition | routine_recall",
  "score": 8,
  "difficulty": 2,
  "duration_seconds": 95
}
```
**Response**
```json
{ "session_id": "string", "new_difficulty": 3 }
```

### `GET /game-sessions/{patient_id}`
**Response**
```json
{
  "sessions": [
    {
      "game_type": "memory_match",
      "score": 8,
      "difficulty": 2,
      "timestamp": "2026-09-01T09:15:00Z"
    }
  ]
}
```

---

## Dashboard

### `GET /dashboard/{patient_id}`
Single endpoint that aggregates everything the caregiver dashboard needs.

**Response**
```json
{
  "patient_name": "string",
  "last_active": "2026-09-01T09:15:00Z",
  "games_today": 3,
  "avg_score_trend": [
    { "date": "2026-08-29", "score": 6 },
    { "date": "2026-08-30", "score": 7 }
  ],
  "reminder_compliance_pct": 85,
  "alerts": [
    {
      "type": "missed_reminder | low_activity | low_mood",
      "message": "string",
      "timestamp": "2026-09-01T09:00:00Z"
    }
  ]
}
```

---

## Notes

- All timestamps: ISO 8601 format
- All `{id}` / `{patient_id}` path params: MongoDB ObjectId as string
- Auth: caregiver endpoints (except login) should require the `token` in an `Authorization: Bearer <token>` header — patient endpoints don't need this for the prototype
- If a new field is needed mid-sprint, add it here first and message the team before changing backend/frontend code
