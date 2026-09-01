"""
Smriti AI — Adaptive Difficulty Engine (ML Module)
====================================================

DISCLAIMER: Hackathon prototype trained on SYNTHETIC data.
Provides adaptive gameplay recommendations only.
Does NOT diagnose dementia or provide medical advice.
"""

from .predict import (
    recommend_difficulty,
    calculate_performance_score,
    analyze_trend,
    analyze_game_performance,
    get_recommendation_explanation,
    get_ml_confidence,
    compare_to_baseline,
    calculate_personal_baseline,
    generate_caregiver_alert,
    apply_difficulty_safety_limit,
)

__all__ = [
    "recommend_difficulty",
    "calculate_performance_score",
    "analyze_trend",
    "analyze_game_performance",
    "get_recommendation_explanation",
    "get_ml_confidence",
    "compare_to_baseline",
    "calculate_personal_baseline",
    "generate_caregiver_alert",
    "apply_difficulty_safety_limit",
]
