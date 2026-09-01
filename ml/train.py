"""
Adaptive Difficulty Engine — Training Script
=============================================

DISCLAIMER: This is a hackathon prototype trained on SYNTHETIC data.
It provides adaptive gameplay difficulty recommendations only.
It does NOT diagnose dementia or provide medical advice.

What this script does:
  1. Generates a synthetic dataset of game performance records.
  2. Saves the dataset as training_data.csv.
  3. Trains a DecisionTreeClassifier on the data.
  4. Saves the model and encoders to model.pkl.

How to run:
  python train.py
"""

import os
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score
import joblib

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
RANDOM_STATE = 42
N_SAMPLES = 200
OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(OUTPUT_DIR, "training_data.csv")
MODEL_PATH = os.path.join(OUTPUT_DIR, "model.pkl")

DIFFICULTIES = ["Easy", "Medium", "Hard"]


# ---------------------------------------------------------------------------
# Synthetic data generation
# ---------------------------------------------------------------------------
def _recommend_difficulty_rule(accuracy, error_rate, response_time, completion_rate, current_difficulty):
    """
    Rule-based label generator for synthetic training data.

    HIGH performance  → increase difficulty (Easy→Medium, Medium→Hard)
    LOW performance   → decrease difficulty (Hard→Medium, Medium→Easy)
    AVERAGE performance → keep current difficulty

    Boundaries: cannot go below Easy or above Hard.
    """
    # Weighted performance score (mirrors predict.py logic)
    score = (
        0.40 * accuracy
        + 0.25 * (100 - error_rate)
        + 0.15 * max(0, 100 - (response_time - 1) * 10)
        + 0.20 * completion_rate
    )

    idx = DIFFICULTIES.index(current_difficulty)

    if score >= 75:
        # High performance — increase difficulty
        new_idx = min(idx + 1, len(DIFFICULTIES) - 1)
    elif score <= 45:
        # Low performance — decrease difficulty
        new_idx = max(idx - 1, 0)
    else:
        # Average performance — maintain
        new_idx = idx

    return DIFFICULTIES[new_idx]


def generate_synthetic_dataset(n_samples=N_SAMPLES, random_state=RANDOM_STATE):
    """
    Generate synthetic game performance records.

    NOTE: This is SYNTHETIC prototype data — NOT real clinical data.
    Patterns are designed to reflect sensible adaptive difficulty logic.
    """
    rng = np.random.default_rng(random_state)
    records = []

    for _ in range(n_samples):
        current_difficulty = rng.choice(DIFFICULTIES)

        # Randomly pick a performance tier to create varied, realistic data
        tier = rng.choice(["high", "average", "low"], p=[0.35, 0.30, 0.35])

        if tier == "high":
            accuracy = rng.uniform(80, 100)
            error_rate = rng.uniform(0, 20)
            response_time = rng.uniform(1.0, 4.0)
            completion_rate = rng.uniform(85, 100)
        elif tier == "low":
            accuracy = rng.uniform(20, 55)
            error_rate = rng.uniform(45, 80)
            response_time = rng.uniform(8.0, 20.0)
            completion_rate = rng.uniform(30, 65)
        else:  # average
            accuracy = rng.uniform(55, 80)
            error_rate = rng.uniform(20, 45)
            response_time = rng.uniform(4.0, 8.0)
            completion_rate = rng.uniform(65, 85)

        # Round for readability
        accuracy = round(accuracy, 1)
        error_rate = round(error_rate, 1)
        response_time = round(response_time, 2)
        completion_rate = round(completion_rate, 1)

        recommended = _recommend_difficulty_rule(
            accuracy, error_rate, response_time, completion_rate, current_difficulty
        )

        records.append({
            "accuracy": accuracy,
            "error_rate": error_rate,
            "average_response_time": response_time,
            "completion_rate": completion_rate,
            "current_difficulty": current_difficulty,
            "recommended_difficulty": recommended,
        })

    return pd.DataFrame(records)


# ---------------------------------------------------------------------------
# Training pipeline
# ---------------------------------------------------------------------------
def train_and_save():
    print("=" * 50)
    print("  Adaptive Difficulty Engine — Training")
    print("=" * 50)

    # Step 1: Generate and save synthetic dataset
    print(f"\n[1/5] Generating {N_SAMPLES} synthetic records...")
    df = generate_synthetic_dataset()
    df.to_csv(CSV_PATH, index=False)
    print(f"      Saved -> {CSV_PATH}")

    # Step 2: Load dataset
    print("\n[2/5] Loading dataset with pandas...")
    df = pd.read_csv(CSV_PATH)
    print(f"      Loaded {len(df)} rows, {len(df.columns)} columns")

    # Step 3: Preprocess — encode difficulty labels
    print("\n[3/5] Encoding difficulty labels...")
    difficulty_encoder = LabelEncoder()
    difficulty_encoder.fit(DIFFICULTIES)

    df["current_difficulty_encoded"] = difficulty_encoder.transform(df["current_difficulty"])
    df["recommended_difficulty_encoded"] = difficulty_encoder.transform(df["recommended_difficulty"])

    feature_cols = [
        "accuracy",
        "error_rate",
        "average_response_time",
        "completion_rate",
        "current_difficulty_encoded",
    ]
    X = df[feature_cols]
    y = df["recommended_difficulty_encoded"]

    # Step 4: Train/test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=RANDOM_STATE, stratify=y
    )

    # Step 5: Train DecisionTreeClassifier
    print("\n[4/5] Training DecisionTreeClassifier...")
    model = DecisionTreeClassifier(random_state=RANDOM_STATE, max_depth=6)
    model.fit(X_train, y_train)

    # Evaluate
    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"      Test accuracy: {acc:.2%}")

    # Step 6: Save model bundle
    print("\n[5/5] Saving model bundle...")
    bundle = {
        "model": model,
        "difficulty_encoder": difficulty_encoder,
        "feature_cols": feature_cols,
    }
    joblib.dump(bundle, MODEL_PATH)
    print(f"      Saved -> {MODEL_PATH}")

    print("\n" + "=" * 50)
    print("  Training completed successfully!")
    print("=" * 50)
    print("\nNext step: run  python predict.py  to test predictions.\n")


if __name__ == "__main__":
    train_and_save()
