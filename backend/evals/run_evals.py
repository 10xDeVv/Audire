from __future__ import annotations

import argparse
import asyncio
import json
import os
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from dotenv import load_dotenv

from app.models import AnalyzeRequest, AnalyzeResponse
from app.prompts import build_analysis_prompt
from app.services.ai_service import analyze_music_idea
from evals.scoring import EvalResult, score_response

EVALS_DIR = Path(__file__).resolve().parent
CASES_PATH = EVALS_DIR / "cases.json"
DEFAULT_REPORT = EVALS_DIR / "reports" / "latest.md"


def load_cases() -> list[dict[str, Any]]:
    return json.loads(CASES_PATH.read_text(encoding="utf-8"))


def select_cases(
    cases: list[dict[str, Any]],
    case_ids: list[str],
    tags: list[str],
    limit: int | None,
) -> list[dict[str, Any]]:
    selected = cases
    if case_ids:
        requested = set(case_ids)
        selected = [case for case in selected if case["id"] in requested]
        missing = requested - {case["id"] for case in selected}
        if missing:
            raise ValueError(f"Unknown case IDs: {', '.join(sorted(missing))}")
    if tags:
        requested_tags = set(tags)
        selected = [
            case for case in selected if requested_tags.intersection(case.get("tags", []))
        ]
    if limit is not None:
        selected = selected[:limit]
    return selected


def run_contract_checks(cases: list[dict[str, Any]]) -> list[EvalResult]:
    results: list[EvalResult] = []
    policy_markers = [
        "Creative paths:",
        "Practice plan:",
        "AI reflection:",
        "Do not praise or critique voicings",
        "Verify chord quality before naming harmonic function",
    ]

    for case in cases:
        failures: list[str] = []
        request = AnalyzeRequest(**case["request"])
        prompt = build_analysis_prompt(request)
        checks = [
            (request.idea in prompt, "Prompt omitted the musical idea."),
            (request.style in prompt, "Prompt omitted the style."),
            (request.skillLevel in prompt, "Prompt omitted the skill level."),
            (
                (request.keyCenter or "Not provided") in prompt,
                "Prompt omitted tonal-center context.",
            ),
        ]
        checks.extend((marker in prompt, f"Prompt omitted policy marker: {marker}") for marker in policy_markers)
        for passed, message in checks:
            if not passed:
                failures.append(message)
        results.append(
            EvalResult(
                case_id=case["id"],
                case_name=case["name"],
                passed=not failures,
                checks_passed=len(checks) - len(failures),
                checks_total=len(checks),
                failures=failures,
            )
        )
    return results


async def run_live_checks(
    cases: list[dict[str, Any]],
) -> tuple[list[EvalResult], dict[str, AnalyzeResponse], dict[str, float]]:
    results: list[EvalResult] = []
    responses: dict[str, AnalyzeResponse] = {}
    durations: dict[str, float] = {}

    for index, case in enumerate(cases, start=1):
        print(f"[{index}/{len(cases)}] {case['id']}...", flush=True)
        started = time.perf_counter()
        try:
            response = await analyze_music_idea(AnalyzeRequest(**case["request"]))
            durations[case["id"]] = time.perf_counter() - started
            responses[case["id"]] = response
            results.append(score_response(case, response))
        except Exception as exc:
            durations[case["id"]] = time.perf_counter() - started
            results.append(
                EvalResult(
                    case_id=case["id"],
                    case_name=case["name"],
                    passed=False,
                    checks_passed=0,
                    checks_total=1,
                    failures=[f"Evaluation request failed: {type(exc).__name__}: {exc}"],
                )
            )
    return results, responses, durations


def write_report(
    path: Path,
    mode: str,
    results: list[EvalResult],
    cases: list[dict[str, Any]],
    responses: dict[str, AnalyzeResponse] | None = None,
    durations: dict[str, float] | None = None,
) -> None:
    responses = responses or {}
    durations = durations or {}
    case_map = {case["id"]: case for case in cases}
    passed = sum(result.passed for result in results)
    total_checks = sum(result.checks_total for result in results)
    passed_checks = sum(result.checks_passed for result in results)
    generated_at = datetime.now(timezone.utc).isoformat(timespec="seconds")

    lines = [
        "# Audire Evaluation Report",
        "",
        f"- Generated: `{generated_at}`",
        f"- Mode: `{mode}`",
        f"- Model: `{os.getenv('OPENAI_MODEL', 'not configured')}`",
        f"- Cases passed: **{passed}/{len(results)}**",
        f"- Checks passed: **{passed_checks}/{total_checks}**",
        "",
        "## Results",
        "",
        "| Case | Status | Checks | Duration |",
        "|---|---:|---:|---:|",
    ]

    for result in results:
        duration = durations.get(result.case_id)
        duration_text = f"{duration:.1f}s" if duration is not None else "-"
        status = "PASS" if result.passed else "FAIL"
        lines.append(
            f"| `{result.case_id}` | {status} | {result.checks_passed}/{result.checks_total} | {duration_text} |"
        )

    for result in results:
        lines.extend(["", f"## {result.case_name}", ""])
        case = case_map[result.case_id]
        request = case["request"]
        lines.extend(
            [
                f"- Progression/input: `{request['idea']}`",
                f"- Context: `{request.get('keyCenter') or 'not provided'}` / `{request['style']}` / `{request['skillLevel']}`",
                f"- Result: **{'PASS' if result.passed else 'FAIL'}**",
            ]
        )
        if result.failures:
            lines.extend(["", "Failures:"])
            lines.extend(f"- {failure}" for failure in result.failures)

        response = responses.get(result.case_id)
        if response is not None:
            lines.extend(
                [
                    "",
                    f"**Analysis:** {response.musicalAnalysis}",
                    "",
                    f"**Suggestions:** {response.suggestions}",
                    "",
                    "**Creative paths:**",
                ]
            )
            lines.extend(
                f"- {path.approach}: `{path.progression}` - {path.tradeoff}"
                for path in response.creativePaths
            )
            lines.extend(
                [
                    "",
                    f"**AI confidence:** {response.aiReflection.confidence} - {response.aiReflection.confidenceReason}",
                ]
            )

    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run Audire music-theory evaluations.")
    parser.add_argument("--live", action="store_true", help="Call the configured OpenAI model.")
    parser.add_argument("--case", action="append", default=[], help="Run one case ID. Repeatable.")
    parser.add_argument("--tag", action="append", default=[], help="Run cases matching a tag. Repeatable.")
    parser.add_argument("--limit", type=int, default=None, help="Limit selected cases.")
    parser.add_argument("--report", type=Path, default=DEFAULT_REPORT, help="Markdown report path.")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    load_dotenv(EVALS_DIR.parent / ".env", override=True)

    try:
        cases = select_cases(load_cases(), args.case, args.tag, args.limit)
    except ValueError as exc:
        print(str(exc), file=sys.stderr)
        return 2

    if not cases:
        print("No evaluation cases selected.", file=sys.stderr)
        return 2

    if args.live:
        if os.getenv("AUDIRE_USE_OPENAI", "false").lower() != "true":
            print("AUDIRE_USE_OPENAI must be true for live evaluations.", file=sys.stderr)
            return 2
        results, responses, durations = asyncio.run(run_live_checks(cases))
        mode = "live"
    else:
        results = run_contract_checks(cases)
        responses = {}
        durations = {}
        mode = "contract"

    write_report(args.report, mode, results, cases, responses, durations)
    passed = sum(result.passed for result in results)
    print(f"{passed}/{len(results)} cases passed. Report: {args.report}")
    for result in results:
        if not result.passed:
            print(f"FAIL {result.case_id}: {'; '.join(result.failures)}")
    return 0 if passed == len(results) else 1


if __name__ == "__main__":
    raise SystemExit(main())
