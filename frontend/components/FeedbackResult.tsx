import type { AnalyzeResponse } from "@/lib/types";
import { FeedbackSection } from "./FeedbackSection";

interface FeedbackResultProps {
  result: AnalyzeResponse | null;
}

export function FeedbackResult({ result }: FeedbackResultProps) {
  if (!result) {
    return null;
  }

  const sections = [
    ["What is happening musically", result.musicalAnalysis],
    ["What already works", result.whatWorks],
    ["Suggestions for improvement", result.suggestions],
    ["Creative alternative", result.creativeAlternative],
    ["Practice exercise", result.practiceExercise],
    ["Personal style reminder", result.personalStyleReminder],
  ] as const;

  return (
    <section className="space-y-5" id="feedback">
      <div>
        <p className="text-sm font-semibold uppercase text-moss">
          Feedback
        </p>
        <h2 className="mt-2 font-display text-3xl text-paper sm:text-4xl">
          A listening note for your idea
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {sections.map(([title, body]) => (
          <FeedbackSection body={body} key={title} title={title} />
        ))}
      </div>
    </section>
  );
}
