import { Chord, Note } from "@tonaljs/tonal";

interface ParsedChord {
  symbol: string;
  bassMidi: number;
  voiceMidis: number[];
}

export interface PlaybackSession {
  durationMs: number;
  stop: () => void;
}

interface PianoSample {
  midi: number;
  path: string;
}

const PIANO_SAMPLES: PianoSample[] = [
  { midi: 36, path: "/audio/piano/C2.mp3" },
  { midi: 42, path: "/audio/piano/Fs2.mp3" },
  { midi: 45, path: "/audio/piano/A2.mp3" },
  { midi: 48, path: "/audio/piano/C3.mp3" },
  { midi: 54, path: "/audio/piano/Fs3.mp3" },
  { midi: 57, path: "/audio/piano/A3.mp3" },
  { midi: 60, path: "/audio/piano/C4.mp3" },
];

const pianoBuffers = new WeakMap<
  AudioContext,
  Promise<Map<number, AudioBuffer>>
>();

function splitProgression(progression: string): string[] {
  return progression
    .replaceAll("`", "")
    .split(/\s+(?:-|→)\s+|\s*\|\s*|,\s*/)
    .map((symbol) => symbol.trim())
    .filter(Boolean);
}

function parseChord(symbol: string): ParsedChord {
  const normalizedSymbol = symbol
    .replaceAll("♭", "b")
    .replaceAll("♯", "#")
    .replace(/\(([^)]+)\)/g, "$1")
    .replaceAll(" ", "");
  const [baseSymbol, slashBass] = normalizedSymbol
    .split("/")
    .map((part) => part.trim());
  const chord = Chord.get(baseSymbol);

  if (chord.empty || !chord.tonic || chord.notes.length === 0) {
    throw new Error(`Playback could not read ${symbol}.`);
  }

  const bassName = slashBass || chord.tonic;
  const bassChroma = Note.chroma(bassName);
  const voiceChromas = chord.notes.map((note) => Note.chroma(note));

  if (bassChroma === undefined || voiceChromas.some((value) => value === undefined)) {
    throw new Error(`Playback could not map the notes in ${symbol}.`);
  }

  return {
    symbol,
    bassMidi: 36 + bassChroma,
    voiceMidis: voiceChromas.map((chroma) => 48 + (chroma ?? 0)),
  };
}

function midiToFrequency(midi: number): number {
  return 440 * 2 ** ((midi - 69) / 12);
}

function loadPianoSamples(
  context: AudioContext,
): Promise<Map<number, AudioBuffer>> {
  const cached = pianoBuffers.get(context);
  if (cached) return cached;

  const pending = Promise.all(
    PIANO_SAMPLES.map(async ({ midi, path }) => {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`Could not load piano sample ${path}.`);
      }

      const buffer = await context.decodeAudioData(await response.arrayBuffer());
      return [midi, buffer] as const;
    }),
  ).then((samples) => new Map(samples));

  pianoBuffers.set(context, pending);
  pending.catch(() => pianoBuffers.delete(context));
  return pending;
}

function nearestPianoSample(midi: number): PianoSample {
  return PIANO_SAMPLES.reduce((nearest, candidate) =>
    Math.abs(candidate.midi - midi) < Math.abs(nearest.midi - midi)
      ? candidate
      : nearest,
  );
}

export function canPlayProgression(progression: string): boolean {
  try {
    const symbols = splitProgression(progression);
    return symbols.length > 0 && symbols.every((symbol) => Boolean(parseChord(symbol)));
  } catch {
    return false;
  }
}

function scheduleSynthProgression(
  context: AudioContext,
  chords: ParsedChord[],
  tempo: number,
): PlaybackSession {
  const activeOscillators: OscillatorNode[] = [];
  const secondsPerBeat = 60 / tempo;
  const chordDuration = secondsPerBeat * 2;
  const startAt = context.currentTime + 0.06;

  chords.forEach((chord, chordIndex) => {
    const chordStart = startAt + chordIndex * chordDuration;
    const chordEnd = chordStart + chordDuration;
    const notes = [chord.bassMidi, ...chord.voiceMidis];
    const peakGain = 0.16 / Math.sqrt(notes.length);

    notes.forEach((midi, noteIndex) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();

      oscillator.type = noteIndex === 0 ? "sine" : "triangle";
      oscillator.frequency.setValueAtTime(midiToFrequency(midi), chordStart);
      gain.gain.setValueAtTime(0.0001, chordStart);
      gain.gain.exponentialRampToValueAtTime(peakGain, chordStart + 0.04);
      gain.gain.setValueAtTime(peakGain, Math.max(chordStart + 0.05, chordEnd - 0.12));
      gain.gain.exponentialRampToValueAtTime(0.0001, chordEnd);

      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(chordStart);
      oscillator.stop(chordEnd + 0.02);
      activeOscillators.push(oscillator);
    });
  });

  return {
    durationMs: (chords.length * chordDuration + 0.1) * 1000,
    stop: () => {
      activeOscillators.forEach((oscillator) => {
        try {
          oscillator.stop();
        } catch {
          // An oscillator that already ended needs no further cleanup.
        }
      });
    },
  };
}

function schedulePianoProgression(
  context: AudioContext,
  chords: ParsedChord[],
  tempo: number,
  buffers: Map<number, AudioBuffer>,
): PlaybackSession {
  const activeSources: AudioBufferSourceNode[] = [];
  const secondsPerBeat = 60 / tempo;
  const chordDuration = secondsPerBeat * 2;
  const startAt = context.currentTime + 0.06;

  chords.forEach((chord, chordIndex) => {
    const chordStart = startAt + chordIndex * chordDuration;
    const chordEnd = chordStart + chordDuration;
    const notes = [chord.bassMidi, ...chord.voiceMidis];
    const peakGain = 0.48 / Math.sqrt(notes.length);

    notes.forEach((midi) => {
      const sample = nearestPianoSample(midi);
      const buffer = buffers.get(sample.midi);
      if (!buffer) return;

      const source = context.createBufferSource();
      const gain = context.createGain();
      source.buffer = buffer;
      source.playbackRate.setValueAtTime(
        2 ** ((midi - sample.midi) / 12),
        chordStart,
      );
      gain.gain.setValueAtTime(0.0001, chordStart);
      gain.gain.exponentialRampToValueAtTime(peakGain, chordStart + 0.015);
      gain.gain.setValueAtTime(
        peakGain,
        Math.max(chordStart + 0.02, chordEnd - 0.18),
      );
      gain.gain.exponentialRampToValueAtTime(0.0001, chordEnd);

      source.connect(gain);
      gain.connect(context.destination);
      source.start(chordStart);
      source.stop(chordEnd + 0.03);
      activeSources.push(source);
    });
  });

  return {
    durationMs: (chords.length * chordDuration + 0.1) * 1000,
    stop: () => {
      activeSources.forEach((source) => {
        try {
          source.stop();
        } catch {
          // A source that already ended needs no further cleanup.
        }
      });
    },
  };
}

export async function scheduleProgression(
  context: AudioContext,
  progression: string,
  tempo: number,
): Promise<PlaybackSession> {
  const chords = splitProgression(progression).map(parseChord);

  if (chords.length === 0) {
    throw new Error("Enter chord symbols separated by hyphens to use playback.");
  }

  try {
    const buffers = await loadPianoSamples(context);
    return schedulePianoProgression(context, chords, tempo, buffers);
  } catch {
    return scheduleSynthProgression(context, chords, tempo);
  }
}
