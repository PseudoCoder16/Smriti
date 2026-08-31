# API Contract — v2

This is the agreed shape of every backend endpoint. Frontend can build against these shapes before the backend is finished — swap in the real call later with zero rework. Any change to this contract must be communicated to the whole team before code is written against it.

Base URL (local dev): `http://localhost:8000`

Auth: every caregiver-only endpoint below requires `Authorization: Bearer <token>` (token returned by `/login/caregiver` or `/register/caregiver`). Patient endpoints don't need this for the prototype.

---

## Auth

### `POST /login/patient`
**Request** `{ "username": "string", "pin": "string" }`
**Response** `{ "success": true, "patient_id": "string", "name": "string" }`

### `POST /login/caregiver`
**Request** `{ "email": "string", "password": "string" }`
**Response** `{ "success": true, "token": "jwt_string", "caregiver_id": "string" }`

### `POST /register/patient` *(caregiver-authenticated)*
Used by the caregiver dashboard's "+ Add Patient" flow. Sets `caregiver_id` to the logged-in caregiver.
**Request** `{ "name", "age", "gender", "language", "username", "pin", "photo_base64"? }`
**Response** `{ "success": true, "patient_id": "string", "name": "string" }`

### `POST /register/patient/self`
Public — an elderly patient self-registering from the Auth screen. `caregiver_id` is left unset; a caregiver links/claims the patient later.
**Request** same shape as above
**Response** same shape as above

### `POST /register/caregiver`
**Request** `{ "name", "email", "phone", "password", "photo_base64"? }`
**Response** `{ "success": true, "token": "jwt_string", "caregiver_id": "string" }`

---

## Patient

### `GET /patient` *(caregiver-authenticated)*
Lists the patients belonging to the logged-in caregiver — powers the dashboard's patient picker and the add-patient flow.
**Response** `{ "patients": [ { "patient_id", "name", "age", "gender", "language", "username", "photo_base64" } ] }`

### `GET /patient/{id}`
**Response** `{ "patient_id", "name", "age", "gender", "language", "username", "photo_base64" }`

### `GET /patient/{id}/games?limit=30`
**Response**
```json
{ "sessions": [
  { "session_id", "game_type", "difficulty", "score", "correct", "errors", "avg_response_ms", "timestamp" }
]}
```

### `GET /patient/{id}/performance?days=7`
**Response**
```json
{
  "games_completed": 12,
  "accuracy_pct": 82.5,
  "error_rate_pct": 17.5,
  "avg_response_ms": 1450.2,
  "trend": [
    { "date": "2026-08-29", "games_completed": 3, "accuracy_pct": 80, "error_rate_pct": 20, "avg_response_ms": 1500 }
  ]
}
```

---

## Game

### `POST /game/result`
**Request**
```json
{ "patient_id", "game_type": "memory_match | pattern_recognition | routine_recall | tea_sorting | rhythm_tap",
  "difficulty": "easy | medium | hard", "score": 80, "correct": 8, "errors": 2, "avg_response_ms": 3800 }
```
**Response** `{ "session_id": "string", "status": "recorded" }`

---

## Medicine

### `GET /medicine/{patient_id}`
**Response** `{ "medicine": [ { "medicine_id", "patient_id", "name", "time", "frequency", "status": "taken | pending" } ] }`

### `POST /medicine` *(caregiver-authenticated)*
**Request** `{ "patient_id", "name", "time", "frequency" }` → created with `status: "pending"`
**Response** single medicine object

### `PUT /medicine/{id}`
**Request** any of `{ "status"?, "name"?, "time"?, "frequency"? }`
**Response** updated medicine object

---

## Messages

### `GET /messages/{patient_id}`
**Response** `{ "messages": [ { "message_id", "patient_id", "text", "timestamp" } ] }`

### `POST /message` *(caregiver-authenticated)*
**Request** `{ "patient_id", "text" }`
**Response** single message object

---

## Check-in

### `POST /checkin`
**Request** `{ "patient_id", "mood": "Happy | Okay | Sad | Tired" }`
**Response** single checkin object

### `GET /checkin/{patient_id}?limit=30`
**Response** `{ "checkins": [ { "checkin_id", "patient_id", "mood", "timestamp" } ] }`

---

## Notes

- All timestamps: ISO 8601 (UTC)
- `{id}` path params other than `patient_id`/`caregiver_id` are MongoDB ObjectId strings
- Alerts (medicine pending, performance decline, no activity today) are **not** a dedicated endpoint — the caregiver dashboard computes them client-side from `/medicine`, `/patient/{id}/performance`, and `/patient/{id}/games`
- Forgot-password/PIN reset has no backend endpoint yet — frontend keeps a local-only mock flow
- If a new field is needed mid-sprint, add it here first and message the team before changing backend/frontend code
