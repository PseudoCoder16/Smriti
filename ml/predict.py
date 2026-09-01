"""
Adaptive Difficulty Engine — Prediction Module
===============================================

DISCLAIMER: This is a hackathon prototype trained on SYNTHETIC data.
It provides adaptive gameplay difficulty recommendations only.
It does NOT diagnose dementia or provide medical advice.

All outputs describe GAME PERFORMANCE / cognitive game engagement.
They are NOT a medical assessment.

What this module does:
  Analyzes game performance metrics and recommends the next
  game difficulty level (Easy / Medium / Hard).

Input features:
  - accuracy             : Percentage correct (0-100)
  - error_rate           : Percentage of errors (0-100)
  - average_response_time: Average time per response in seconds
  - completion_rate      : Percentage of game completed (0-100)
  - current_difficulty   : Current level — "Easy", "Medium", or "Hard"

How to run standalone tests:
  python predict.py

FastAPI integration example:
  from ml.predict import (
      recommend_difficulty,
      calculate_performance_score,
      analyze_trend,
      analyze_game_performance,
  )

  result = analyze_game_performance(
      accuracy=88,
      error_rate=12,
      response_time=2.8,
      completion_rate=95,
      current_difficulty="Medium",
      previous_score=75,
      patient_baseline_score=76,
  )
"""

from pathlib import Path

import joblib
import pandas as pd

# ---------------------------------------------------------------------------
# Paths — load model.pkl from this folder, not the current working directory
# ---------------------------------------------------------------------------
_MODULE_DIR = Path(__file__).resolve().parent
_MODEL_PATH = _MODULE_DIR / "model.pkl"

# Difficulty order used by the safety limiter (one step at a time)
_DIFFICULTY_ORDER = ["Easy", "Medium", "Hard"]

# Lazy-loaded model bundle (loaded once on first call — not on import)
_bundle = None


def _load_bundle():
    """Load model.pkl once and cache it in memory."""
    global _bundle
    if _bundle is None:
        if not _MODEL_PATH.exists():
            raise FileNotFoundError(
                f"Model file not found at {_MODEL_PATH}. "
                "Run 'python train.py' first to generate and train the model."
            )
        _bundle = joblib.load(_MODEL_PATH)
    return _bundle


def _build_feature_frame(accuracy, error_rate, response_time, completion_rate, current_encoded):
    """Build a 1-row DataFrame in the same feature order used during training."""
    bundle = _load_bundle()
    feature_cols = bundle["feature_cols"]
    return pd.DataFrame([{
        "accuracy": accuracy,
        "error_rate": error_rate,
        "average_response_time": response_time,
        "completion_rate": completion_rate,
        "current_difficulty_encoded": current_encoded,
    }], columns=feature_cols)


def _predict_raw(accuracy, error_rate, response_time, completion_rate, current_difficulty):
    """
    Run the Decision Tree once and return (label, confidence_percent).

    Confidence is the highest class probability from predict_proba().
    This is MODEL prediction confidence on synthetic training data.
    It is NOT medical confidence or clinical certainty.
    """
    bundle = _load_bundle()
    model = bundle["model"]
    encoder = bundle["difficulty_encoder"]

    current_encoded = encoder.transform([current_difficulty])[0]
    features = _build_feature_frame(
        accuracy, error_rate, response_time, completion_rate, current_encoded
    )

    prediction_encoded = model.predict(features)[0]
    recommended = encoder.inverse_transform([prediction_encoded])[0]

    # predict_proba returns probabilities for each difficulty class.
    # We report the highest probability as a percentage (hackathon demo only).
    probabilities = model.predict_proba(features)[0]
    confidence = round(float(max(probabilities) * 100), 2)

    return recommended, confidence


# ---------------------------------------------------------------------------
# Core prediction function (kept for existing FastAPI / teammate imports)
# ---------------------------------------------------------------------------
def recommend_difficulty(
    accuracy,
    error_rate,
    response_time,
    completion_rate,
    current_difficulty,
):
    """
    Recommend the next game difficulty based on performance metrics.

    Parameters
    ----------
    accuracy : float
        Percentage of correct answers (0-100).
    error_rate : float
        Percentage of errors (0-100).
    response_time : float
        Average response time in seconds.
    completion_rate : float
        Percentage of game completed (0-100).
    current_difficulty : str
        Current difficulty level: "Easy", "Medium", or "Hard".

    Returns
    -------
    str
        Recommended difficulty: "Easy", "Medium", or "Hard".
    """
    recommended, _confidence = _predict_raw(
        accuracy, error_rate, response_time, completion_rate, current_difficulty
    )
    return recommended


def get_ml_confidence(
    accuracy,
    error_rate,
    response_time,
    completion_rate,
    current_difficulty,
):
    """
    Return the Decision Tree's prediction confidence as a percentage.

    Uses predict_proba() and takes the highest class probability.

    NOTE: This confidence is the model's certainty on SYNTHETIC training data.
    It is NOT medical confidence, clinical certainty, or a diagnosis score.
    """
    _recommended, confidence = _predict_raw(
        accuracy, error_rate, response_time, completion_rate, current_difficulty
    )
    return confidence


# ---------------------------------------------------------------------------
# Performance score
# ---------------------------------------------------------------------------
def calculate_performance_score(
    accuracy,
    error_rate,
    response_time,
    completion_rate,
):
    """
    Calculate a composite GAME PERFORMANCE score from 0 to 100.

    Weighting:
      - Accuracy:         40%
      - Error rate:       25%  (lower error -> higher score)
      - Response time:    15%  (faster response -> higher score)
      - Completion rate:  20%

    This is a gameplay score only — not a medical score.
    """
    # Error component: invert so lower error_rate gives a higher score
    error_component = 100 - error_rate

    # Response time component: 1s -> 100, 11s+ -> 0 (linear scale)
    time_component = max(0.0, min(100.0, 100 - (response_time - 1) * 10))

    score = (
        0.40 * accuracy
        + 0.25 * error_component
        + 0.15 * time_component
        + 0.20 * completion_rate
    )

    return round(max(0.0, min(100.0, score)), 1)


# ---------------------------------------------------------------------------
# Trend analysis
# ---------------------------------------------------------------------------
def analyze_trend(previous_score, current_score, threshold=5):
    """
    Compare two GAME PERFORMANCE scores and return a trend label.

    Default threshold is 5 points.
    Returns "Improving", "Stable", or "Declining".
    """
    diff = current_score - previous_score

    if diff > threshold:
        return "Improving"
    elif diff < -threshold:
        return "Declining"
    else:
        return "Stable"


# ---------------------------------------------------------------------------
# Feature 1 — Explainable recommendation (gentle, non-clinical language)
# ---------------------------------------------------------------------------
def get_recommendation_explanation(
    accuracy,
    error_rate,
    response_time,
    completion_rate,
    current_difficulty,
    recommended_difficulty,
):
    """
    Explain WHY a difficulty was recommended, using game-performance language.

    Wording is kept gentle because players may be older adults.
    This is NOT a medical explanation.
    """
    factors = []

    # Simple readable thresholds for the demo
    if accuracy >= 80:
        factors.append(f"High accuracy: {accuracy}%")
    elif accuracy <= 50:
        factors.append(f"Lower accuracy this session: {accuracy}%")
    else:
        factors.append(f"Moderate accuracy: {accuracy}%")

    if error_rate <= 20:
        factors.append(f"Low error rate: {error_rate}%")
    elif error_rate >= 50:
        factors.append(f"Higher error rate this session: {error_rate}%")
    else:
        factors.append(f"Moderate error rate: {error_rate}%")

    if response_time <= 4:
        factors.append(f"Fast response time: {response_time} seconds")
    elif response_time >= 8:
        factors.append(f"Slower response time this session: {response_time} seconds")
    else:
        factors.append(f"Moderate response time: {response_time} seconds")

    if completion_rate >= 85:
        factors.append(f"High completion rate: {completion_rate}%")
    elif completion_rate <= 65:
        factors.append(f"Lower completion rate this session: {completion_rate}%")
    else:
        factors.append(f"Moderate completion rate: {completion_rate}%")

    current_idx = _DIFFICULTY_ORDER.index(current_difficulty)
    recommended_idx = _DIFFICULTY_ORDER.index(recommended_difficulty)

    if recommended_idx > current_idx:
        reason = (
            "Strong game performance detected due to high accuracy, "
            "low error rate, comfortable response time, and high completion."
        )
    elif recommended_idx < current_idx:
        reason = (
            "Lower game performance was detected, so the difficulty is being "
            "reduced to provide a more comfortable experience."
        )
    else:
        reason = (
            "Game performance is in a comfortable range, so the current "
            "difficulty is being maintained."
        )

    return {
        "reason": reason,
        "factors": factors,
    }


# ---------------------------------------------------------------------------
# Feature 3 — Personal GAME PERFORMANCE baseline (not a medical baseline)
# ---------------------------------------------------------------------------
def calculate_personal_baseline(previous_scores):
    """
    Average previous GAME PERFORMANCE scores into a personal baseline.

    previous_scores: list of numbers, e.g. [70, 72, 68]
    Returns None if the list is empty or missing.
    """
    if not previous_scores:
        return None

    valid_scores = [float(score) for score in previous_scores]
    if not valid_scores:
        return None

    return round(sum(valid_scores) / len(valid_scores), 1)


def compare_to_baseline(current_score, patient_baseline_score, threshold=8):
    """
    Compare the current GAME PERFORMANCE score with a personal game baseline.

    Threshold of 8 points:
      difference >  8  -> Above Personal Baseline
      difference < -8  -> Below Personal Baseline
      otherwise        -> Near Personal Baseline

    This baseline is from previous game scores only — not a medical baseline.
    """
    difference = round(float(current_score) - float(patient_baseline_score), 1)

    if difference > threshold:
        status = "Above Personal Baseline"
    elif difference < -threshold:
        status = "Below Personal Baseline"
    else:
        status = "Near Personal Baseline"

    return {
        "baseline_status": status,
        "difference": difference,
    }


# ---------------------------------------------------------------------------
# Feature 4 — Caregiver alert (game performance only, careful wording)
# ---------------------------------------------------------------------------
def generate_caregiver_alert(previous_score, current_score, trend):
    """
    Flag large drops in GAME PERFORMANCE for caregiver review.

    HIGH:   drop of 20 or more points
    MEDIUM: Declining trend OR drop of 10-19 points
    NONE:   Stable/Improving and no significant drop

    Do NOT interpret this as dementia progression or a medical alert.
    """
    drop = float(previous_score) - float(current_score)

    if drop >= 20:
        return {
            "alert": True,
            "severity": "High",
            "message": (
                "A significant decrease in recent game performance was detected. "
                "Caregiver review may be helpful."
            ),
        }

    if trend == "Declining" or (10 <= drop < 20):
        return {
            "alert": True,
            "severity": "Medium",
            "message": (
                "Declining game performance trend detected. "
                "A caregiver check-in may be helpful."
            ),
        }

    return {
        "alert": False,
        "severity": "None",
        "message": "No significant change in recent game performance detected.",
    }


# ---------------------------------------------------------------------------
# Feature 5 — Safety limiter (never skip a difficulty level)
# ---------------------------------------------------------------------------
def apply_difficulty_safety_limit(current_difficulty, ml_recommendation):
    """
    Keep difficulty changes to ONE level at a time for a gentler experience.

    Easy   -> Easy or Medium
    Medium -> Easy, Medium, or Hard
    Hard   -> Medium or Hard

    Example: Easy + ML says Hard -> final Medium
    """
    current_idx = _DIFFICULTY_ORDER.index(current_difficulty)
    recommended_idx = _DIFFICULTY_ORDER.index(ml_recommendation)

    # Clamp the jump to at most 1 step
    if recommended_idx > current_idx + 1:
        final_idx = current_idx + 1
    elif recommended_idx < current_idx - 1:
        final_idx = current_idx - 1
    else:
        final_idx = recommended_idx

    final_difficulty = _DIFFICULTY_ORDER[final_idx]
    safety_applied = final_difficulty != ml_recommendation

    return {
        "raw_ml_recommendation": ml_recommendation,
        "final_recommended_difficulty": final_difficulty,
        "safety_adjustment_applied": safety_applied,
    }


# ---------------------------------------------------------------------------
# Feature 6 — Single FastAPI-friendly entry point
# ---------------------------------------------------------------------------
def analyze_game_performance(
    accuracy,
    error_rate,
    response_time,
    completion_rate,
    current_difficulty,
    previous_score=None,
    patient_baseline_score=None,
):
    """
    Combine recommendation, confidence, safety, score, trend, baseline,
    explanation, and caregiver alert into ONE dictionary.

    Optional fields:
      previous_score         — previous session GAME PERFORMANCE score
      patient_baseline_score — average of previous GAME PERFORMANCE scores

    Missing optional data is handled without crashing.
    """
    raw_recommendation, confidence = _predict_raw(
        accuracy, error_rate, response_time, completion_rate, current_difficulty
    )

    safety = apply_difficulty_safety_limit(current_difficulty, raw_recommendation)
    final_difficulty = safety["final_recommended_difficulty"]

    performance_score = calculate_performance_score(
        accuracy, error_rate, response_time, completion_rate
    )

    if previous_score is None:
        trend = "Not enough previous data"
        caregiver_alert = {
            "alert": False,
            "severity": "None",
            "message": "No previous game session score available for comparison.",
        }
    else:
        trend = analyze_trend(previous_score, performance_score)
        caregiver_alert = generate_caregiver_alert(
            previous_score, performance_score, trend
        )

    if patient_baseline_score is None:
        baseline_comparison = "No personal baseline available"
    else:
        baseline_comparison = compare_to_baseline(
            performance_score, patient_baseline_score
        )

    explanation = get_recommendation_explanation(
        accuracy,
        error_rate,
        response_time,
        completion_rate,
        current_difficulty,
        final_difficulty,
    )

    return {
        "raw_ml_recommendation": safety["raw_ml_recommendation"],
        "recommended_difficulty": final_difficulty,
        "safety_adjustment_applied": safety["safety_adjustment_applied"],
        "performance_score": performance_score,
        "trend": trend,
        "confidence": confidence,
        "baseline_comparison": baseline_comparison,
        "explanation": explanation,
        "caregiver_alert": caregiver_alert,
    }


# ---------------------------------------------------------------------------
# Feature 7 — Clean demo output
# ---------------------------------------------------------------------------
def _print_analysis(title, accuracy, error_rate, response_time, completion_rate,
                    current_difficulty, previous_score, patient_baseline_score):
    """Print one complete test case in a demo-friendly format."""
    result = analyze_game_performance(
        accuracy=accuracy,
        error_rate=error_rate,
        response_time=response_time,
        completion_rate=completion_rate,
        current_difficulty=current_difficulty,
        previous_score=previous_score,
        patient_baseline_score=patient_baseline_score,
    )

    baseline = result["baseline_comparison"]
    if isinstance(baseline, dict):
        baseline_text = (
            f"{baseline['baseline_status']} "
            f"(difference: {baseline['difference']})"
        )
    else:
        baseline_text = baseline

    alert = result["caregiver_alert"]
    alert_label = "Yes" if alert["alert"] else "No"

    print("=" * 48)
    print("AI-BASED ADAPTIVE DIFFICULTY ENGINE")
    print(title)
    print("=" * 48)
    print()
    print("INPUT PERFORMANCE")
    print()
    print(f"Accuracy: {accuracy}%")
    print(f"Error Rate: {error_rate}%")
    print(f"Response Time: {response_time} sec")
    print(f"Completion Rate: {completion_rate}%")
    print(f"Current Difficulty: {current_difficulty}")
    print()
    print("AI ANALYSIS")
    print()
    print(f"Performance Score: {result['performance_score']}/100")
    print(f"Trend: {result['trend']}")
    print(f"ML Confidence: {result['confidence']}%")
    print()
    print(f"Raw ML Recommendation: {result['raw_ml_recommendation']}")
    print(f"Final Recommendation: {result['recommended_difficulty']}")
    if result["safety_adjustment_applied"]:
        print("Safety limiter: difficulty was adjusted by one level.")
    print()
    print(f"Baseline Status: {baseline_text}")
    print()
    print("WHY THIS RECOMMENDATION?")
    print()
    print(result["explanation"]["reason"])
    for factor in result["explanation"]["factors"]:
        print(f"  * {factor}")
    print()
    print("CAREGIVER ALERT")
    print()
    print(f"Alert: {alert_label}")
    print(f"Severity: {alert['severity']}")
    print(f"Message: {alert['message']}")
    print()
    print("=" * 48)
    print()


if __name__ == "__main__":
    print()
    print("Running Adaptive Difficulty Engine test examples...")
    print("Hackathon prototype — synthetic game performance data only.")
    print("This is NOT a medical diagnostic system.")
    print()

    # Test case 1 — Strong game performance
    _print_analysis(
        title="TEST CASE 1 — Strong Performance",
        accuracy=88,
        error_rate=12,
        response_time=2.8,
        completion_rate=95,
        current_difficulty="Medium",
        previous_score=75,
        patient_baseline_score=76,
    )

    # Test case 2 — Lower game performance
    _print_analysis(
        title="TEST CASE 2 — Lower Performance",
        accuracy=40,
        error_rate=60,
        response_time=12,
        completion_rate=60,
        current_difficulty="Medium",
        previous_score=70,
        patient_baseline_score=72,
    )

    # Test case 3 — Average game performance
    _print_analysis(
        title="TEST CASE 3 — Average Performance",
        accuracy=68,
        error_rate=32,
        response_time=5.5,
        completion_rate=78,
        current_difficulty="Medium",
        previous_score=67,
        patient_baseline_score=68,
    )
