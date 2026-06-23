from typing import Literal, Optional

from pydantic import BaseModel, Field

MusicStyle = Literal[
    "Gospel",
    "Jazz",
    "R&B",
    "Pop",
    "Worship",
    "Classical",
    "Other",
]

SkillLevel = Literal[
    "Beginner",
    "Intermediate",
    "Advanced",
]

CreativeApproach = Literal["Preserve", "Develop", "Explore"]
ConfidenceLevel = Literal["Low", "Medium", "High"]


class AnalyzeRequest(BaseModel):
    idea: str = Field(..., min_length=1, max_length=2000)
    style: MusicStyle
    skillLevel: SkillLevel
    keyCenter: Optional[str] = Field(default="", max_length=50)
    goal: Optional[str] = Field(default="", max_length=1000)


class CreativePath(BaseModel):
    approach: CreativeApproach
    title: str
    progression: str
    rationale: str
    tradeoff: str


class PracticeStep(BaseModel):
    title: str
    instruction: str
    repetitions: str
    listenFor: str


class AIReflection(BaseModel):
    evidence: list[str] = Field(..., min_length=1, max_length=4)
    assumptions: list[str] = Field(..., max_length=4)
    unknowns: list[str] = Field(..., min_length=1, max_length=4)
    confidence: ConfidenceLevel
    confidenceReason: str


class AnalyzeResponse(BaseModel):
    musicalAnalysis: str
    whatWorks: str
    suggestions: str
    creativeAlternative: str
    practiceExercise: str
    personalStyleReminder: str
    creativePaths: list[CreativePath] = Field(..., min_length=3, max_length=3)
    practicePlan: list[PracticeStep] = Field(..., min_length=3, max_length=3)
    aiReflection: AIReflection
