"use client";

import { useState } from "react";
import { AboutProject } from "@/components/AboutProject";
import { CreativePaths } from "@/components/CreativePaths";
import { FeedbackResult } from "@/components/FeedbackResult";
import { Hero } from "@/components/Hero";
import { ListeningLab } from "@/components/ListeningLab";
import { MusicIdeaForm } from "@/components/MusicIdeaForm";
import { PracticeAgencyLab } from "@/components/PracticeAgencyLab";
import { SampleIdeas } from "@/components/SampleIdeas";
import { analyzeMusicIdea } from "@/lib/api";
import type {
  AnalyzeResponse,
  CreativeApproach,
  MusicStyle,
  SampleIdea,
  SkillLevel,
} from "@/lib/types";

export default function Home() {
  const [idea, setIdea] = useState("");
  const [style, setStyle] = useState<MusicStyle>("Gospel");
  const [skillLevel, setSkillLevel] = useState<SkillLevel>("Intermediate");
  const [keyCenter, setKeyCenter] = useState("");
  const [goal, setGoal] = useState("");
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [selectedApproach, setSelectedApproach] =
    useState<CreativeApproach>("Develop");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!idea.trim()) {
      setError("Enter a chord progression, melody idea, or short musical description.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const feedback = await analyzeMusicIdea({
        idea: idea.trim(),
        style,
        skillLevel,
        keyCenter: keyCenter.trim(),
        goal: goal.trim(),
      });
      setResult(feedback);
      setSelectedApproach("Develop");
      window.setTimeout(() => {
        document.getElementById("feedback")?.scrollIntoView({ block: "start" });
      }, 50);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Audire could not analyze that idea right now.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleSampleSelect(sample: SampleIdea) {
    setIdea(sample.idea);
    setStyle(sample.style);
    setSkillLevel(sample.skillLevel);
    setKeyCenter(sample.keyCenter ?? "");
    setGoal(sample.goal ?? "");
    setResult(null);
    setError("");
  }

  const selectedPath =
    result?.creativePaths.find((path) => path.approach === selectedApproach) ??
    result?.creativePaths[0];

  return (
    <main className="min-h-screen">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-14 px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
        <div className="grid min-h-[calc(100vh-6rem)] items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <Hero />
          <MusicIdeaForm
            error={error}
            goal={goal}
            idea={idea}
            isLoading={isLoading}
            keyCenter={keyCenter}
            onGoalChange={setGoal}
            onIdeaChange={setIdea}
            onKeyCenterChange={setKeyCenter}
            onSkillLevelChange={setSkillLevel}
            onStyleChange={setStyle}
            onSubmit={handleSubmit}
            skillLevel={skillLevel}
            style={style}
          />
        </div>

        <FeedbackResult result={result} />
        {result && selectedPath ? (
          <>
            <CreativePaths
              onSelect={setSelectedApproach}
              paths={result.creativePaths}
              selectedApproach={selectedApproach}
            />
            <ListeningLab original={idea} paths={result.creativePaths} />
            <PracticeAgencyLab
              plan={result.practicePlan}
              reflection={result.aiReflection}
              selectedPath={selectedPath}
            />
          </>
        ) : null}
        <SampleIdeas onSelect={handleSampleSelect} />
        <AboutProject />
      </div>
    </main>
  );
}
