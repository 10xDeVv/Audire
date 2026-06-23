"use client";

import { useEffect, useRef, useState } from "react";
import {
  Check,
  CheckCircle2,
  Circle,
  LockKeyhole,
  Pause,
  PencilLine,
  Play,
  TimerReset,
  XCircle,
} from "lucide-react";
import type { AIReflection, CreativePath, PracticeStep } from "@/lib/types";

type AgencyDecision = "Keep" | "Adapt" | "Reject";

const decisions = [
  { label: "Keep", icon: CheckCircle2 },
  { label: "Adapt", icon: PencilLine },
  { label: "Reject", icon: XCircle },
] as const;

interface PracticeAgencyLabProps {
  plan: PracticeStep[];
  reflection: AIReflection;
  selectedPath: CreativePath;
}

export function PracticeAgencyLab({
  plan,
  reflection,
  selectedPath,
}: PracticeAgencyLabProps) {
  const [completed, setCompleted] = useState<boolean[]>(() => plan.map(() => false));
  const [tempo, setTempo] = useState(72);
  const [metronomeOn, setMetronomeOn] = useState(false);
  const [decision, setDecision] = useState<AgencyDecision>("Adapt");
  const [note, setNote] = useState("");
  const [reflectionLoaded, setReflectionLoaded] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const contextRef = useRef<AudioContext | null>(null);

  function clickMetronome() {
    const context = contextRef.current;
    if (!context) return;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const now = context.currentTime;

    oscillator.frequency.setValueAtTime(1000, now);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.06);
  }

  function toggleMetronome() {
    if (metronomeOn) {
      setMetronomeOn(false);
      return;
    }

    const context = contextRef.current ?? new AudioContext();
    contextRef.current = context;
    if (context.state === "suspended") void context.resume();
    setMetronomeOn(true);
  }

  useEffect(() => {
    if (!metronomeOn) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
      return;
    }

    clickMetronome();
    intervalRef.current = setInterval(clickMetronome, (60 / tempo) * 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [metronomeOn, tempo]);

  useEffect(() => {
    setCompleted(plan.map(() => false));
  }, [plan]);

  useEffect(() => {
    setReflectionLoaded(false);
    const storageKey = `audire-agency:${selectedPath.progression}`;
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) {
      setDecision("Adapt");
      setNote("");
      setReflectionLoaded(true);
      return;
    }
    try {
      const parsed = JSON.parse(saved) as {
        decision?: AgencyDecision;
        note?: string;
      };
      if (
        parsed.decision === "Keep" ||
        parsed.decision === "Adapt" ||
        parsed.decision === "Reject"
      ) {
        setDecision(parsed.decision);
      }
      if (typeof parsed.note === "string") setNote(parsed.note);
    } catch {
      window.localStorage.removeItem(storageKey);
      setDecision("Adapt");
      setNote("");
    } finally {
      setReflectionLoaded(true);
    }
  }, [selectedPath.progression]);

  useEffect(() => {
    if (!reflectionLoaded) return;
    window.localStorage.setItem(
      `audire-agency:${selectedPath.progression}`,
      JSON.stringify({ decision, note }),
    );
  }, [decision, note, reflectionLoaded, selectedPath.progression]);

  return (
    <section className="section-reveal space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase text-moss">Practice & agency</p>
        <h2 className="mt-2 font-display text-3xl text-paper sm:text-4xl">
          Turn the suggestion into your own decision
        </h2>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-4">
          <div className="flex flex-col justify-between gap-4 border-b border-paper/10 pb-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm text-paper/[0.55]">Current path</p>
              <p className="mt-1 font-mono text-sm leading-6 text-brass">
                {selectedPath.progression}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-paper/70">
                <span>{tempo} BPM</span>
                <input
                  aria-label="Metronome tempo"
                  className="w-24 accent-brass"
                  max="160"
                  min="40"
                  onChange={(event) => setTempo(Number(event.target.value))}
                  type="range"
                  value={tempo}
                />
              </label>
              <button
                aria-pressed={metronomeOn}
                className="flex h-11 items-center gap-2 rounded-lg bg-brass px-4 text-sm font-bold text-ink transition hover:bg-paper"
                onClick={toggleMetronome}
                title={metronomeOn ? "Stop metronome" : "Start metronome"}
                type="button"
              >
                {metronomeOn ? (
                  <Pause aria-hidden="true" className="h-4 w-4" fill="currentColor" />
                ) : (
                  <Play aria-hidden="true" className="h-4 w-4" fill="currentColor" />
                )}
                Metronome
              </button>
            </div>
          </div>

          {plan.map((step, index) => {
            const isComplete = completed[index];
            return (
              <button
                aria-pressed={isComplete}
                className={`ui-lift flex w-full gap-4 rounded-lg border p-5 text-left ${
                  isComplete
                    ? "border-moss bg-moss/10"
                    : "border-paper/[0.12] bg-paper/[0.05] hover:border-brass/60"
                }`}
                key={`${step.title}-${index}`}
                onClick={() =>
                  setCompleted((current) =>
                    current.map((value, itemIndex) =>
                      itemIndex === index ? !value : value,
                    ),
                  )
                }
                type="button"
              >
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-paper/25">
                  {isComplete ? (
                    <Check aria-hidden="true" className="h-4 w-4 text-moss" />
                  ) : (
                    <Circle aria-hidden="true" className="h-3 w-3 text-paper/[0.45]" />
                  )}
                </span>
                <span>
                  <span className="block font-bold text-paper">
                    {index + 1}. {step.title}
                  </span>
                  <span className="mt-2 block leading-7 text-paper/70">
                    {step.instruction}
                  </span>
                  <span className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-paper/50">
                    <span className="inline-flex items-center gap-1.5">
                      <TimerReset aria-hidden="true" className="h-4 w-4" />
                      {step.repetitions}
                    </span>
                    <span>Listen for: {step.listenFor}</span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <aside className="border-l-0 border-paper/10 lg:border-l lg:pl-8">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-xl font-bold text-paper">AI confidence & limits</h3>
              <p className="mt-1 text-sm text-paper/50">How much should you trust this reading?</p>
            </div>
            <span className="rounded-lg border border-brass/[0.35] px-3 py-1 text-sm font-bold text-brass">
              {reflection.confidence} confidence
            </span>
          </div>
          <p className="mt-4 rounded-lg border border-moss/30 bg-moss/10 px-4 py-3 text-sm leading-6 text-paper/70">
            This confidence describes the AI&apos;s interpretation. It is not a score
            for your playing or your original idea.
          </p>
          <p className="mt-3 text-sm leading-6 text-paper/60">
            {reflection.confidenceReason}
          </p>

          <ReflectionList items={reflection.evidence} title="What the AI can support" />
          <ReflectionList
            emptyText="No extra assumptions were needed."
            items={reflection.assumptions}
            title="What the AI assumed"
          />
          <ReflectionList items={reflection.unknowns} title="What the AI cannot know yet" />

          <div className="mt-7 border-t border-paper/10 pt-6">
            <h4 className="text-lg font-bold text-paper">Your verdict on the AI suggestion</h4>
            <p className="mt-2 text-sm leading-6 text-paper/60">
              Judge the suggestion, not your musicianship. What should happen to it?
            </p>

            <div
              aria-label="Decision about the AI suggestion"
              className="mt-4 grid grid-cols-3 overflow-hidden rounded-lg border border-paper/15"
              role="group"
            >
              {decisions.map(({ label, icon: Icon }) => {
                const isSelected = decision === label;
                return (
                  <button
                    aria-pressed={isSelected}
                    className={`flex min-h-12 items-center justify-center gap-2 border-r border-paper/15 px-2 text-sm font-bold transition last:border-r-0 ${
                      isSelected
                        ? "bg-brass text-ink"
                        : "bg-paper/[0.04] text-paper/65 hover:bg-paper/[0.09] hover:text-paper"
                    }`}
                    key={label}
                    onClick={() => setDecision(label)}
                    type="button"
                  >
                    <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>

            <label className="mt-6 block space-y-2">
              <span className="text-sm font-bold text-paper">Why did your ear decide that?</span>
              <textarea
                className="min-h-24 w-full resize-y rounded-lg border border-paper/[0.15] bg-ink/70 px-3 py-2 text-paper placeholder:text-paper/30"
                maxLength={500}
                onChange={(event) => setNote(event.target.value)}
                placeholder="For example: I like the movement, but I would simplify the last chord."
                value={note}
              />
            </label>

            <p className="mt-4 flex gap-2 rounded-lg bg-paper/[0.045] px-3 py-3 text-xs leading-5 text-paper/50">
              <LockKeyhole aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-moss" />
              <span>
                Saved only in this browser for this path. It is not sent to the AI
                and does not change the model or future feedback.
              </span>
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

interface ReflectionListProps {
  title: string;
  items: string[];
  emptyText?: string;
}

function ReflectionList({ title, items, emptyText }: ReflectionListProps) {
  return (
    <div className="mt-6">
      <h4 className="text-sm font-bold text-brass">{title}</h4>
      {items.length > 0 ? (
        <ul className="mt-2 space-y-2 text-sm leading-6 text-paper/[0.65]">
          {items.map((item) => (
            <li className="border-l border-paper/20 pl-3" key={item}>
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm leading-6 text-paper/[0.45]">{emptyText}</p>
      )}
    </div>
  );
}
