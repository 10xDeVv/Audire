import os

import httpx
import truststore

from app.models import (
    AIReflection,
    AnalyzeRequest,
    AnalyzeResponse,
    CreativePath,
    PracticeStep,
)
from app.prompts import build_analysis_prompt

truststore.inject_into_ssl()


async def analyze_music_idea(payload: AnalyzeRequest) -> AnalyzeResponse:
    if _should_use_openai():
        return await _analyze_with_openai(payload)

    return _placeholder_analysis(payload)


def _should_use_openai() -> bool:
    return (
        os.getenv("AUDIRE_USE_OPENAI", "false").lower() == "true"
        and bool(os.getenv("OPENAI_API_KEY"))
    )


async def _analyze_with_openai(payload: AnalyzeRequest) -> AnalyzeResponse:
    from openai import AsyncOpenAI

    prompt = build_analysis_prompt(payload)
    async with httpx.AsyncClient() as http_client:
        client = AsyncOpenAI(
            api_key=os.getenv("OPENAI_API_KEY"),
            http_client=http_client,
        )
        response = await client.responses.parse(
            model=os.getenv("OPENAI_MODEL", "gpt-5.5"),
            instructions=(
                "You are a careful music-theory educator. Verify every harmonic "
                "claim against the supplied chord symbols and tonal context. "
                "State uncertainty instead of inventing context."
            ),
            input=prompt,
            text_format=AnalyzeResponse,
            reasoning={"effort": "medium"},
            text={"verbosity": "low"},
        )

    if response.output_parsed is None:
        raise ValueError("OpenAI did not return structured music feedback.")

    return response.output_parsed


def _placeholder_analysis(payload: AnalyzeRequest) -> AnalyzeResponse:
    idea = payload.idea.strip()
    goal = payload.goal.strip() if payload.goal else "develop the idea with more intention"
    context = (
        f"in {payload.keyCenter.strip()}"
        if payload.keyCenter and payload.keyCenter.strip()
        else "without a stated tonal center"
    )

    return AnalyzeResponse(
        musicalAnalysis=(
            f"Your idea, {idea}, is being considered {context}. Chord function depends "
            "on that tonal context, so Audire will avoid assigning definitive Roman "
            "numerals when the key is not known."
        ),
        whatWorks=(
            "The idea is direct enough to practice and remember, which is a strength. "
            "That makes it easier to experiment without losing the core musical feeling."
        ),
        suggestions=(
            f"To work toward your goal to {goal}, try changing one element at a time: "
            "add a passing chord, use a richer voicing, shift the rhythm, or leave more "
            "space before the resolution."
        ),
        creativeAlternative=_creative_alternative(payload),
        practiceExercise=(
            "Play the original version slowly for four repetitions. Then add one small "
            "variation for four repetitions, compare the feeling, and keep only the "
            "changes that still sound like you."
        ),
        personalStyleReminder=(
            "These are options, not rules. Your taste and touch matter, so use the "
            "feedback as a listening prompt rather than a final answer."
        ),
        creativePaths=[
            CreativePath(
                approach="Preserve",
                title="Keep the core",
                progression=idea,
                rationale="Start by hearing the original clearly before changing it.",
                tradeoff="Preserves identity but adds no new harmonic motion.",
            ),
            CreativePath(
                approach="Develop",
                title="Add one color",
                progression=idea,
                rationale="Change one chord or inversion at a time and compare the result.",
                tradeoff="Adds color while asking you to choose the exact harmony.",
            ),
            CreativePath(
                approach="Explore",
                title="Change the route",
                progression=idea,
                rationale="Try alternate bass movement while retaining recognizable chords.",
                tradeoff="Creates surprise but may move farther from the original mood.",
            ),
        ],
        practicePlan=[
            PracticeStep(
                title="Hear the original",
                instruction=f"Loop {idea} slowly without adding anything.",
                repetitions="4 repetitions",
                listenFor="Where tension rises and where the phrase feels settled.",
            ),
            PracticeStep(
                title="Change one detail",
                instruction="Add one passing chord or voicing change, then return to the original.",
                repetitions="4 alternating repetitions",
                listenFor="Whether the new movement supports the goal or distracts from it.",
            ),
            PracticeStep(
                title="Choose by ear",
                instruction="Play both versions without stopping and keep the one that feels personal.",
                repetitions="3 comparisons",
                listenFor="Which version sounds intentional and still feels like your voice.",
            ),
        ],
        aiReflection=AIReflection(
            evidence=[f"The entered musical idea is {idea}."],
            assumptions=[],
            unknowns=["Voicing, rhythm, melody, tempo, and performance touch were not provided."],
            confidence="Low" if not payload.keyCenter else "Medium",
            confidenceReason="Text chord symbols provide limited context without hearing the performance.",
        ),
    )


def _creative_alternative(payload: AnalyzeRequest) -> str:
    style_variations = {
        "Gospel": "Try adding secondary dominants or walk-up movement, such as Cmaj7 - E7 - Am7 - D7 - G7.",
        "Jazz": "Try smoother voice leading with sevenths and guide tones, then resolve the tension gently.",
        "R&B": "Try softer extended voicings like maj7, min9, or add9 chords with a laid-back rhythm.",
        "Pop": "Try keeping the progression simple but changing the groove, register, or final chord color.",
        "Worship": "Try a suspended chord before the resolution to make the arrival feel more open and emotional.",
        "Classical": "Try shaping the phrase with clearer cadences, contrary motion, or a short melodic sequence.",
        "Other": "Try creating a second version that changes the bass movement while keeping the top melody familiar.",
    }
    return style_variations[payload.style]
