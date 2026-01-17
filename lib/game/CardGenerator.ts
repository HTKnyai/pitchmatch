import { v4 as uuidv4 } from "uuid";
import type {
  Card,
  PitchCard,
  ChordCard,
  Difficulty,
  ChordType,
  Inversion,
} from "../types/game.types";
import { DIFFICULTY_CONFIG, PITCH_RANGE } from "../../constants/Config";

// Fisher-Yates shuffle
function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Get random elements from array
function getRandomElements<T>(array: T[], count: number): T[] {
  const shuffled = shuffle(array);
  return shuffled.slice(0, count);
}

// Get random integer in range [min, max]
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Create a pitch card from MIDI note
function createPitchCard(midiNote: number): PitchCard {
  return {
    id: uuidv4(),
    mode: "pitch",
    pitch: midiNote,
    pitchClass: midiNote % 12,
    octave: Math.floor(midiNote / 12) - 1,
    isFlipped: false,
    isMatched: false,
  };
}

// Create a chord card
function createChordCard(
  root: number,
  type: ChordType,
  inversion: Inversion,
  baseOctave: number = 4
): ChordCard {
  // Calculate chord pitches based on root, type, and inversion
  const rootMidi = baseOctave * 12 + 12 + root; // base MIDI for octave 4

  let intervals: number[];
  if (type === "major") {
    intervals = [0, 4, 7]; // Root, Major 3rd, Perfect 5th
  } else {
    intervals = [0, 3, 7]; // Root, Minor 3rd, Perfect 5th
  }

  // Apply inversion
  let pitches = intervals.map((i) => rootMidi + i);
  for (let i = 0; i < inversion; i++) {
    const lowest = pitches.shift()!;
    pitches.push(lowest + 12);
  }

  return {
    id: uuidv4(),
    mode: "chord",
    root,
    type,
    inversion,
    pitches,
    isFlipped: false,
    isMatched: false,
  };
}

// Generate pitch cards for normal rules (exact match)
function generatePitchCardsExact(pairCount: number): PitchCard[] {
  // Select random pitches from C2-C6 range
  const availablePitches: number[] = [];
  for (let midi = PITCH_RANGE.min; midi <= PITCH_RANGE.max; midi++) {
    availablePitches.push(midi);
  }

  const selectedPitches = getRandomElements(availablePitches, pairCount);

  // Create pairs (same pitch)
  const cards: PitchCard[] = selectedPitches.flatMap((pitch) => [
    createPitchCard(pitch),
    createPitchCard(pitch),
  ]);

  return shuffle(cards);
}

// Generate pitch cards for extended rules (octave match)
function generatePitchCardsExtended(pairCount: number): PitchCard[] {
  const cards: PitchCard[] = [];
  const usedPitches = new Set<number>();

  // Step 1: Generate at least one octave-different same-pitch-class pair
  // Select a random pitch class (0-11)
  const pitchClass = Math.floor(Math.random() * 12);
  // Select two different octaves
  const octaves = getRandomElements(PITCH_RANGE.octaves as unknown as number[], 2);
  const midi1 = (octaves[0] + 1) * 12 + pitchClass;
  const midi2 = (octaves[1] + 1) * 12 + pitchClass;

  // Add two pairs with the same pitch each
  cards.push(createPitchCard(midi1), createPitchCard(midi1));
  cards.push(createPitchCard(midi2), createPitchCard(midi2));
  usedPitches.add(midi1);
  usedPitches.add(midi2);

  // Step 2: Generate remaining pairs with random pitches
  const remainingPairs = pairCount - 2; // We already created 2 pairs
  const availablePitches: number[] = [];
  for (let midi = PITCH_RANGE.min; midi <= PITCH_RANGE.max; midi++) {
    if (!usedPitches.has(midi)) {
      availablePitches.push(midi);
    }
  }

  const selectedPitches = getRandomElements(availablePitches, remainingPairs);
  selectedPitches.forEach((pitch) => {
    cards.push(createPitchCard(pitch), createPitchCard(pitch));
  });

  return shuffle(cards);
}

// Generate chord cards for normal rules (exact match)
function generateChordCardsExact(pairCount: number): ChordCard[] {
  // Generate combinations of root and type
  const chordOptions: { root: number; type: ChordType }[] = [];
  for (let root = 0; root < 12; root++) {
    chordOptions.push({ root, type: "major" });
    chordOptions.push({ root, type: "minor" });
  }

  const selectedChords = getRandomElements(chordOptions, pairCount);

  // Create pairs (same root, type, and inversion = 0)
  const cards: ChordCard[] = selectedChords.flatMap(({ root, type }) => [
    createChordCard(root, type, 0),
    createChordCard(root, type, 0),
  ]);

  return shuffle(cards);
}

// Generate chord cards for extended rules (inversion match)
function generateChordCardsExtended(pairCount: number): ChordCard[] {
  const chordOptions: { root: number; type: ChordType }[] = [];
  for (let root = 0; root < 12; root++) {
    chordOptions.push({ root, type: "major" });
    chordOptions.push({ root, type: "minor" });
  }

  const selectedChords = getRandomElements(chordOptions, pairCount);

  // Create pairs with potentially different inversions
  const cards: ChordCard[] = selectedChords.flatMap(({ root, type }) => {
    const inv1: Inversion = 0;
    const inv2: Inversion = getRandomInt(0, 2) as Inversion;
    return [
      createChordCard(root, type, inv1),
      createChordCard(root, type, inv2),
    ];
  });

  return shuffle(cards);
}

// Main card generation function
export function generateCards(
  mode: "pitch" | "chord",
  difficulty: Difficulty,
  isExtendedRules: boolean
): Card[] {
  const { pairCount } = DIFFICULTY_CONFIG[difficulty];

  if (mode === "pitch") {
    return isExtendedRules
      ? generatePitchCardsExtended(pairCount)
      : generatePitchCardsExact(pairCount);
  } else {
    return isExtendedRules
      ? generateChordCardsExtended(pairCount)
      : generateChordCardsExact(pairCount);
  }
}
