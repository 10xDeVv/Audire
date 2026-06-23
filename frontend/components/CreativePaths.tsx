import { Compass, Route, ShieldCheck } from "lucide-react";
import type { CreativeApproach, CreativePath } from "@/lib/types";

const approachIcons = {
  Preserve: ShieldCheck,
  Develop: Route,
  Explore: Compass,
};

interface CreativePathsProps {
  paths: CreativePath[];
  selectedApproach: CreativeApproach;
  onSelect: (approach: CreativeApproach) => void;
}

export function CreativePaths({
  paths,
  selectedApproach,
  onSelect,
}: CreativePathsProps) {
  return (
    <section className="space-y-5">
      <div>
        <p className="text-sm font-semibold uppercase text-moss">Creative paths</p>
        <h2 className="mt-2 font-display text-3xl text-paper sm:text-4xl">
          Three directions, your decision
        </h2>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {paths.map((path) => {
          const Icon = approachIcons[path.approach];
          const isSelected = path.approach === selectedApproach;

          return (
            <article
              className={`rounded-lg border p-5 transition ${
                isSelected
                  ? "border-brass bg-brass/[0.09]"
                  : "border-paper/[0.12] bg-paper/[0.055]"
              }`}
              key={path.approach}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Icon aria-hidden="true" className="h-5 w-5 text-brass" />
                  <span className="text-sm font-bold text-brass">{path.approach}</span>
                </div>
                <button
                  aria-pressed={isSelected}
                  className="rounded-lg border border-paper/20 px-3 py-2 text-sm font-semibold text-paper transition hover:border-brass disabled:opacity-60"
                  disabled={isSelected}
                  onClick={() => onSelect(path.approach)}
                  type="button"
                >
                  {isSelected ? "Selected" : "Choose"}
                </button>
              </div>

              <h3 className="mt-5 text-xl font-bold text-paper">{path.title}</h3>
              <p className="mt-3 font-mono text-sm leading-6 text-brass">
                {path.progression}
              </p>
              <p className="mt-4 leading-7 text-paper/75">{path.rationale}</p>
              <p className="mt-4 border-t border-paper/10 pt-4 text-sm leading-6 text-paper/[0.55]">
                Tradeoff: {path.tradeoff}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
