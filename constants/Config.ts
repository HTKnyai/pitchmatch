import type { Difficulty, DifficultyConfig } from "../lib/types/game.types";

// Difficulty settings
export const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyConfig> = {
  easy: {
    cardCount: 8,
    pairCount: 4,
    gridLayout: { rows: 2, cols: 4 },
    targetTime: 60,
  },
  normal: {
    cardCount: 16,
    pairCount: 8,
    gridLayout: { rows: 4, cols: 4 },
    targetTime: 120,
  },
  hard: {
    cardCount: 24,
    pairCount: 12,
    gridLayout: { rows: 4, cols: 6 },
    targetTime: 180,
  },
} as const;

// Scoring
export const SCORING = {
  exactMatch: 100,
  extendedMatch: 150,
  timeBonusPerSecond: 2,
} as const;

// Pitch range (MIDI note numbers)
export const PITCH_RANGE = {
  min: 36, // C2
  max: 72, // C6
  octaves: [2, 3, 4, 5, 6] as const,
} as const;

// Note names for display
export const NOTE_NAMES = {
  doremi: [
    "ド",
    "ド#",
    "レ",
    "レ#",
    "ミ",
    "ファ",
    "ファ#",
    "ソ",
    "ソ#",
    "ラ",
    "ラ#",
    "シ",
  ],
  abc: ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"],
} as const;

// Chord type names for display
export const CHORD_TYPE_NAMES = {
  major: {
    doremi: "メジャー",
    abc: "maj",
  },
  minor: {
    doremi: "マイナー",
    abc: "min",
  },
} as const;

// Animation durations (ms)
export const ANIMATION = {
  flipDuration: 300,
  matchSuccessDuration: 500,
  matchFailureDuration: 800,
  scorePopupDuration: 600,
} as const;

// Storage keys
export const STORAGE_KEYS = {
  rankings: "@melody_memory/rankings",
} as const;

// Default game config
export const DEFAULT_CONFIG = {
  mode: "pitch",
  difficulty: "normal",
  notation: "doremi",
  showOctave: true,
  isBlindMode: false,
  isExtendedRules: false,
  playerCount: 1,
} as const;
