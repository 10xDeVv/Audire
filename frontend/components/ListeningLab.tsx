"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { LoaderCircle, Play, Square, Volume2 } from "lucide-react";
import {
  canPlayProgression,
  scheduleProgression,
  type PlaybackSession,
} from "@/lib/musicPlayback";
import type { CreativePath } from "@/lib/types";

interface ListeningLabProps {
  original: string;
  paths: CreativePath[];
}

export function ListeningLab({ original, paths }: ListeningLabProps) {
  const [tempo, setTempo] = useState(82);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const contextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<PlaybackSession | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const tracks = useMemo(
    () => [
      { id: "Original", label: "Original", progression: original },
      ...paths.map((path) => ({
        id: path.approach,
        label: path.approach,
        progression: path.progression,
      })),
    ],
    [original, paths],
  );

  function stopPlayback() {
    sessionRef.current?.stop();
    sessionRef.current = null;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
    setPlayingId(null);
  }

  async function playTrack(id: string, progression: string) {
    stopPlayback();
    setError("");
    setLoadingId(id);

    try {
      const context = contextRef.current ?? new AudioContext();
      contextRef.current = context;
      if (context.state === "suspended") await context.resume();
      const session = await scheduleProgression(context, progression, tempo);
      sessionRef.current = session;
      setPlayingId(id);
      timeoutRef.current = setTimeout(stopPlayback, session.durationMs);
    } catch (playbackError) {
      setError(
        playbackError instanceof Error
          ? playbackError.message
          : "Playback could not read this progression.",
      );
    } finally {
      setLoadingId(null);
    }
  }

  useEffect(() => stopPlayback, []);

  return (
    <section className="section-reveal border-y border-paper/10 py-8">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase text-moss">Listening lab</p>
          <h2 className="mt-2 font-display text-3xl text-paper sm:text-4xl">
            Compare with your ears
          </h2>
        </div>

        <label className="w-full max-w-xs space-y-2">
          <span className="flex justify-between text-sm font-semibold text-paper">
            <span>Tempo</span>
            <span className="text-brass">{tempo} BPM</span>
          </span>
          <input
            aria-label="Playback tempo"
            className="w-full accent-brass"
            max="140"
            min="50"
            onChange={(event) => setTempo(Number(event.target.value))}
            step="1"
            type="range"
            value={tempo}
          />
        </label>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {tracks.map((track) => {
          const isPlaying = playingId === track.id;
          const isLoading = loadingId === track.id;
          const isPlayable = canPlayProgression(track.progression);

          return (
            <div
              className="ui-lift flex min-h-24 items-center justify-between gap-4 rounded-lg border border-paper/[0.12] bg-ink/[0.38] p-4"
              key={track.id}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-sm font-bold text-brass">
                  <Volume2 aria-hidden="true" className="h-4 w-4" />
                  {track.label}
                </div>
                <p className="mt-2 break-words font-mono text-sm leading-6 text-paper/75">
                  {track.progression}
                </p>
              </div>

              <button
                aria-label={
                  isLoading
                    ? `Loading ${track.label}`
                    : isPlaying
                      ? `Stop ${track.label}`
                      : `Play ${track.label}`
                }
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brass text-ink transition hover:bg-paper disabled:cursor-not-allowed disabled:opacity-40"
                disabled={!isPlayable || loadingId !== null}
                onClick={() =>
                  isPlaying ? stopPlayback() : playTrack(track.id, track.progression)
                }
                title={isPlayable ? `${isPlaying ? "Stop" : "Play"} ${track.label}` : "Chord symbols unavailable for playback"}
                type="button"
              >
                {isLoading ? (
                  <LoaderCircle
                    aria-hidden="true"
                    className="h-5 w-5 animate-spin"
                  />
                ) : isPlaying ? (
                  <Square aria-hidden="true" className="h-4 w-4" fill="currentColor" />
                ) : (
                  <Play aria-hidden="true" className="h-5 w-5" fill="currentColor" />
                )}
              </button>
            </div>
          );
        })}
      </div>

      {error ? <p className="mt-4 text-sm text-ember">{error}</p> : null}
    </section>
  );
}
