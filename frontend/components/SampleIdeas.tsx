import type { SampleIdea } from "@/lib/types";

const samples: SampleIdea[] = [
  {
    title: "Gospel color",
    idea: "C - Am - F - G",
    style: "Gospel",
    skillLevel: "Intermediate",
    keyCenter: "C major",
    goal: "Make it sound less basic and more gospel-inspired.",
  },
  {
    title: "Jazz movement",
    idea: "Dm7 - G7 - Cmaj7",
    style: "Jazz",
    skillLevel: "Intermediate",
    keyCenter: "C major",
    goal: "Add smoother movement between chords.",
  },
  {
    title: "Worship lift",
    idea: "F - Bb - C - F",
    style: "Worship",
    skillLevel: "Beginner",
    keyCenter: "F major",
    goal: "Make it more emotional without making it too complex.",
  },
];

interface SampleIdeasProps {
  onSelect: (sample: SampleIdea) => void;
}

export function SampleIdeas({ onSelect }: SampleIdeasProps) {
  return (
    <section className="space-y-5">
      <div>
        <p className="text-sm font-semibold uppercase text-moss">
          Samples
        </p>
        <h2 className="mt-2 font-display text-3xl text-paper sm:text-4xl">
          Start with a short progression
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {samples.map((sample) => (
          <button
            className="rounded-lg border border-paper/[0.12] bg-paper/[0.06] p-5 text-left transition hover:border-brass/70 hover:bg-paper/[0.09]"
            key={sample.title}
            onClick={() => onSelect(sample)}
            type="button"
          >
            <span className="text-sm font-bold text-brass">{sample.title}</span>
            <span className="mt-3 block text-lg font-semibold text-paper">
              {sample.idea}
            </span>
            <span className="mt-3 block text-sm leading-6 text-paper/[0.65]">
              {sample.style} · {sample.skillLevel} · {sample.keyCenter}
            </span>
            <span className="mt-3 block text-sm leading-6 text-paper/[0.65]">
              {sample.goal}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
