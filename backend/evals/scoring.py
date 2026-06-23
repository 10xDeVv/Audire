from __future__ import annotations

import json
import re
from dataclasses import dataclass, field
from typing import Any

from app.models import AnalyzeResponse


@dataclass
class EvalResult:
    case_id: str
    case_name: str
    passed: bool
    checks_passed: int
    checks_total: int
    failures: list[str] = field(default_factory=list)


def _field_text(data: dict[str, Any], field_path: str) -> str:
    if field_path == "all":
        return json.dumps(data, ensure_ascii=False)

    value: Any = data
    for part in field_path.split("."):
        if not isinstance(value, dict) or part not in value:
            return ""
        value = value[part]

    if isinstance(value, str):
        return value
    return json.dumps(value, ensure_ascii=False)


def score_response(case: dict[str, Any], response: AnalyzeResponse) -> EvalResult:
    data = response.model_dump()
    failures: list[str] = []
    passed_checks = 0
    total_checks = 0

    def check(condition: bool, failure: str) -> None:
        nonlocal passed_checks, total_checks
        total_checks += 1
        if condition:
            passed_checks += 1
        else:
            failures.append(failure)

    core_fields = [
        "musicalAnalysis",
        "whatWorks",
        "suggestions",
        "creativeAlternative",
        "practiceExercise",
        "personalStyleReminder",
    ]
    for field_name in core_fields:
        check(bool(data[field_name].strip()), f"{field_name} must not be empty.")

    approaches = [path["approach"] for path in data["creativePaths"]]
    check(
        approaches == ["Preserve", "Develop", "Explore"],
        "Creative paths must be ordered Preserve, Develop, Explore.",
    )
    check(len(data["practicePlan"]) == 3, "Practice plan must contain three steps.")
    check(bool(data["aiReflection"]["evidence"]), "AI reflection needs evidence.")
    check(bool(data["aiReflection"]["unknowns"]), "AI reflection needs unknowns.")

    for path in data["creativePaths"]:
        check(bool(path["progression"].strip()), f"{path['approach']} path needs a progression.")
        check(bool(path["rationale"].strip()), f"{path['approach']} path needs a rationale.")
        check(bool(path["tradeoff"].strip()), f"{path['approach']} path needs a tradeoff.")

    allowed_confidence = case.get("allowedConfidence", [])
    if allowed_confidence:
        check(
            data["aiReflection"]["confidence"] in allowed_confidence,
            (
                f"Confidence {data['aiReflection']['confidence']} is not allowed; "
                f"expected one of {', '.join(allowed_confidence)}."
            ),
        )

    for rule in case.get("required", []):
        text = _field_text(data, rule["field"])
        check(
            re.search(rule["pattern"], text, flags=re.IGNORECASE | re.DOTALL) is not None,
            rule["message"],
        )

    for rule in case.get("forbidden", []):
        text = _field_text(data, rule["field"])
        check(
            re.search(rule["pattern"], text, flags=re.IGNORECASE | re.DOTALL) is None,
            rule["message"],
        )

    return EvalResult(
        case_id=case["id"],
        case_name=case["name"],
        passed=not failures,
        checks_passed=passed_checks,
        checks_total=total_checks,
        failures=failures,
    )
