import json
import unittest
from pathlib import Path

from app.models import AIReflection, AnalyzeRequest, AnalyzeResponse, CreativePath, PracticeStep
from app.prompts import build_analysis_prompt
from evals.scoring import score_response


def valid_response() -> AnalyzeResponse:
    return AnalyzeResponse(
        musicalAnalysis="Dm7 and Gm7 share D and F; without a key the function is ambiguous.",
        whatWorks="The shared D and F provide smooth common-tone movement.",
        suggestions="Try Dm7 - D7 - Gm7 and listen for F# resolving to G.",
        creativeAlternative="Try Dm7 - Ab7 - Gm7 for chromatic motion.",
        practiceExercise="Compare Dm7 - Gm7 with Dm7 - D7 - Gm7 four times.",
        personalStyleReminder="Keep only the option that sounds like you.",
        creativePaths=[
            CreativePath(
                approach="Preserve",
                title="Preserve",
                progression="Dm7 - Gm7",
                rationale="Keeps the shared tones.",
                tradeoff="Less added motion.",
            ),
            CreativePath(
                approach="Develop",
                title="Develop",
                progression="Dm7 - D7 - Gm7",
                rationale="F# resolves to G.",
                tradeoff="Stronger directional pull.",
            ),
            CreativePath(
                approach="Explore",
                title="Explore",
                progression="Dm7 - Ab7 - Gm7",
                rationale="Chromatic semitone motion.",
                tradeoff="Less diatonic color.",
            ),
        ],
        practicePlan=[
            PracticeStep(title="One", instruction="Loop it.", repetitions="4 times", listenFor="Shared tones."),
            PracticeStep(title="Two", instruction="Add D7.", repetitions="4 times", listenFor="F# to G."),
            PracticeStep(title="Three", instruction="Compare.", repetitions="3 times", listenFor="Personal fit."),
        ],
        aiReflection=AIReflection(
            evidence=["Dm7 contains D, F, A, C."],
            assumptions=[],
            unknowns=["The tonal center is unknown."],
            confidence="Medium",
            confidenceReason="The chord tones are clear but function is ambiguous.",
        ),
    )


class EvalSuiteTests(unittest.TestCase):
    def setUp(self) -> None:
        cases_path = Path(__file__).parents[1] / "evals" / "cases.json"
        self.cases = json.loads(cases_path.read_text(encoding="utf-8"))

    def test_case_ids_are_unique_and_requests_validate(self) -> None:
        ids = [case["id"] for case in self.cases]
        self.assertEqual(len(ids), len(set(ids)))
        for case in self.cases:
            AnalyzeRequest(**case["request"])

    def test_prompt_contains_accuracy_and_reflection_contracts(self) -> None:
        prompt = build_analysis_prompt(AnalyzeRequest(**self.cases[0]["request"]))
        self.assertIn("Verify chord quality before naming harmonic function", prompt)
        self.assertIn("Creative paths:", prompt)
        self.assertIn("Practice plan:", prompt)
        self.assertIn("AI reflection:", prompt)

    def test_valid_response_passes_ambiguous_regression_case(self) -> None:
        result = score_response(self.cases[0], valid_response())
        self.assertTrue(result.passed, result.failures)

    def test_false_ii_v_claim_is_rejected(self) -> None:
        response = valid_response()
        response.musicalAnalysis = "Dm7 to Gm7 functions as a ii-V progression."
        result = score_response(self.cases[0], response)
        self.assertFalse(result.passed)
        self.assertTrue(any("ii-V" in failure for failure in result.failures))


if __name__ == "__main__":
    unittest.main()
