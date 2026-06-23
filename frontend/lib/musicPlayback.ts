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

export function canPlayProgression(progression: string): boolean {
  try {
    const symbols = splitProgression(progression);
    return symbols.length > 0 && symbols.every((symbol) => Boolean(parseChord(symbol)));
  } catch {
    return false;
  }
}

export function scheduleProgression(
  context: AudioContext,
  progression: string,
  tempo: number,
): PlaybackSession {
  const chords = splitProgression(progression).map(parseChord);

  if (chords.length === 0) {
    throw new Error("Enter chord symbols separated by hyphens to use playback.");
  }

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
