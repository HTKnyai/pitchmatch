// Game Mode and Settings
export type GameMode = "pitch" | "chord";
export type Difficulty = "easy" | "normal" | "hard";
export type Notation = "doremi" | "abc";

export type GameConfig = {
  mode: GameMode;
  difficulty: Difficulty;
  notation: Notation;
  showOctave: boolean;
  isBlindMode: boolean;
  isExtendedRules: boolean;
  playerCount: 1 | 2;
};

// Base Card Type
type BaseCard = {
  id: string;
  isFlipped: boolean;
  isMatched: boolean;
};

// Pitch Card (single note)
export type PitchCard = BaseCard & {
  mode: "pitch";
  pitch: number; // MIDI note number (36-72: C2-C6)
  pitchClass: number; // 0-11 (C-B)
  octave: number; // 2-6
};

// Chord Card
export type ChordType = "major" | "minor";
export type Inversion = 0 | 1 | 2;

export type ChordCard = BaseCard & {
  mode: "chord";
  root: number; // 0-11 (pitch class of root note)
  type: ChordType;
  inversion: Inversion;
  pitches: number[]; // MIDI note numbers of chord tones
};

// Union type for all cards
export type Card = PitchCard | ChordCard;

// Player State
export type PlayerState = {
  score: number;
  matchedPairs: number;
  attempts: number;
  comboCount: number;
};

// Game Status
export type GameStatus = "idle" | "playing" | "paused" | "finished";

// Game State
export type GameState = {
  config: GameConfig;
  cards: Card[];
  currentPlayer: 1 | 2;
  players: {
    player1: PlayerState;
    player2: PlayerState;
  };
  flippedCards: Card[];
  matchedPairs: number;
  totalPairs: number;
  gameStatus: GameStatus;
  startTime: number | null;
  endTime: number | null;
};

// Match Result
export type MatchType = "exact" | "extended" | null;

export type MatchResult = {
  isMatch: boolean;
  matchType: MatchType;
  points: number;
};

// Ranking Entry
export type RankingEntry = {
  id: string;
  mode: GameMode;
  difficulty: Difficulty;
  isExtendedRules: boolean;
  score: number;
  clearTime: number; // seconds
  accuracy: number; // 0-100
  date: number; // timestamp
};

// Grid Layout
export type GridLayout = {
  rows: number;
  cols: number;
};

// Difficulty Configuration
export type DifficultyConfig = {
  cardCount: number;
  pairCount: number;
  gridLayout: GridLayout;
  targetTime: number; // seconds
};
