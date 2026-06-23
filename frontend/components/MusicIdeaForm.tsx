import type { FormEvent } from "react";
import type { MusicStyle, SkillLevel } from "@/lib/types";

const styles: MusicStyle[] = [
  "Gospel",
  "Jazz",
  "R&B",
  "Pop",
  "Worship",
  "Classical",
  "Other",
];

const skillLevels: SkillLevel[] = ["Beginner", "Intermediate", "Advanced"];

interface MusicIdeaFormProps {
  idea: string;
  style: MusicStyle;
  skillLevel: SkillLevel;
  keyCenter: string;
  goal: string;
  isLoading: boolean;
  error: string;
  onIdeaChange: (value: string) => void;
  onStyleChange: (value: MusicStyle) => void;
  onSkillLevelChange: (value: SkillLevel) => void;
  onKeyCenterChange: (value: string) => void;
  onGoalChange: (value: string) => void;
  onSubmit: () => void;
}

export function MusicIdeaForm({
  idea,
  style,
  skillLevel,
  keyCenter,
  goal,
  isLoading,
  error,
  onIdeaChange,
  onStyleChange,
  onSkillLevelChange,
  onKeyCenterChange,
  onGoalChange,
  onSubmit,
}: MusicIdeaFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form
      className="section-reveal rounded-lg border border-paper/[0.12] bg-paper/[0.07] p-5 shadow-2xl shadow-black/25 backdrop-blur md:p-6"
      id="idea-form"
      onSubmit={handleSubmit}
    >
      <div className="space-y-5">
        <label className="block space-y-2">
          <span className="text-sm font-semibold text-paper">Musical idea</span>
          <textarea
            className="min-h-32 w-full resize-y rounded-lg border border-paper/[0.15] bg-ink/70 px-4 py-3 text-paper placeholder:text-paper/[0.35]"
            maxLength={2000}
            onChange={(event) => onIdeaChange(event.target.value)}
            placeholder="Example: Cmaj7 - Am7 - Dm7 - G7"
            required
            value={idea}
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-paper">Style</span>
            <select
              className="h-12 w-full rounded-lg border border-paper/[0.15] bg-ink/70 px-3 text-paper"
              onChange={(event) => onStyleChange(event.target.value as MusicStyle)}
              value={style}
            >
              {styles.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-semibold text-paper">Skill level</span>
            <select
              className="h-12 w-full rounded-lg border border-paper/[0.15] bg-ink/70 px-3 text-paper"
              onChange={(event) =>
                onSkillLevelChange(event.target.value as SkillLevel)
              }
              value={skillLevel}
            >
              {skillLevels.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
        </div>

        <label className="block space-y-2">
          <span className="text-sm font-semibold text-paper">
            Key or tonal center <span className="font-normal text-paper/60">(optional)</span>
          </span>
          <input
            className="h-12 w-full rounded-lg border border-paper/[0.15] bg-ink/70 px-4 text-paper placeholder:text-paper/[0.35]"
            maxLength={50}
            onChange={(event) => onKeyCenterChange(event.target.value)}
            placeholder="Example: D minor, C major, or not sure"
            value={keyCenter}
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-semibold text-paper">Practice goal</span>
          <textarea
            className="min-h-24 w-full resize-y rounded-lg border border-paper/[0.15] bg-ink/70 px-4 py-3 text-paper placeholder:text-paper/[0.35]"
            maxLength={1000}
            onChange={(event) => onGoalChange(event.target.value)}
            placeholder="Example: I want this to sound less basic and more gospel-inspired."
            value={goal}
          />
        </label>
      </div>

      {error ? (
        <p className="mt-4 rounded-lg border border-ember/40 bg-ember/[0.12] px-4 py-3 text-sm text-paper">
          {error}
        </p>
      ) : null}

      <button
        className="mt-6 h-12 w-full rounded-lg bg-brass px-5 font-bold text-ink transition hover:bg-paper disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isLoading}
        type="submit"
      >
        {isLoading ? "Listening..." : "Analyze My Idea"}
      </button>
    </form>
  );
}
