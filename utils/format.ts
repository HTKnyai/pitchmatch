import type { Notation, Card, PitchCard, ChordCard } from "../lib/types/game.types";
import { NOTE_NAMES, CHORD_TYPE_NAMES } from "../constants/Config";

// Format time in seconds to MM:SS
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

// Format a pitch card for display
export function formatPitchCard(
  card: PitchCard,
  notation: Notation,
  showOctave: boolean
): string {
  const noteName = NOTE_NAMES[notation][card.pitchClass];
  if (showOctave) {
    return `${noteName}${card.octave}`;
  }
  return noteName;
}

// Format a chord card for display
export function formatChordCard(
  card: ChordCard,
  notation: Notation,
  showOctave: boolean
): string {
  const rootName = NOTE_NAMES[notation][card.root];
  const typeName = CHORD_TYPE_NAMES[card.type][notation];

  let inversionSuffix = "";
  if (card.inversion === 1) {
    inversionSuffix = notation === "doremi" ? "第1転回" : "/1st";
  } else if (card.inversion === 2) {
    inversionSuffix = notation === "doremi" ? "第2転回" : "/2nd";
  }

  if (notation === "doremi") {
    return `${rootName}${typeName}${inversionSuffix}`;
  } else {
    return `${rootName}${typeName}${inversionSuffix}`;
  }
}

// Format any card for display
export function formatCard(
  card: Card,
  notation: Notation,
  showOctave: boolean
): string {
  if (card.mode === "pitch") {
    return formatPitchCard(card as PitchCard, notation, showOctave);
  } else {
    return formatChordCard(card as ChordCard, notation, showOctave);
  }
}

// Format score with commas
export function formatScore(score: number): string {
  return score.toLocaleString();
}

// Format date
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

// Format accuracy
export function formatAccuracy(accuracy: number): string {
  return `${accuracy.toFixed(1)}%`;
}
