import type {
  Card,
  PitchCard,
  ChordCard,
  GameConfig,
  MatchResult,
} from "../types/game.types";
import { SCORING } from "../../constants/Config";

function isPitchCard(card: Card): card is PitchCard {
  return card.mode === "pitch";
}

function isChordCard(card: Card): card is ChordCard {
  return card.mode === "chord";
}

function validatePitchMatch(
  card1: PitchCard,
  card2: PitchCard,
  isExtendedRules: boolean
): MatchResult {
  // Same card clicked twice
  if (card1.id === card2.id) {
    return { isMatch: false, matchType: null, points: 0 };
  }

  // Exact match (same pitch)
  if (card1.pitch === card2.pitch) {
    return { isMatch: true, matchType: "exact", points: SCORING.exactMatch };
  }

  // Extended rules: same pitch class (octave independent)
  if (isExtendedRules && card1.pitchClass === card2.pitchClass) {
    return {
      isMatch: true,
      matchType: "extended",
      points: SCORING.extendedMatch,
    };
  }

  return { isMatch: false, matchType: null, points: 0 };
}

function validateChordMatch(
  card1: ChordCard,
  card2: ChordCard,
  isExtendedRules: boolean
): MatchResult {
  // Same card clicked twice
  if (card1.id === card2.id) {
    return { isMatch: false, matchType: null, points: 0 };
  }

  // Must have same root and type
  if (card1.root !== card2.root || card1.type !== card2.type) {
    return { isMatch: false, matchType: null, points: 0 };
  }

  // Exact match (same inversion)
  if (card1.inversion === card2.inversion) {
    return { isMatch: true, matchType: "exact", points: SCORING.exactMatch };
  }

  // Extended rules: different inversions of same chord
  if (isExtendedRules) {
    return {
      isMatch: true,
      matchType: "extended",
      points: SCORING.extendedMatch,
    };
  }

  return { isMatch: false, matchType: null, points: 0 };
}

export function validateMatch(
  card1: Card,
  card2: Card,
  config: GameConfig
): MatchResult {
  // Cards must be of the same mode
  if (card1.mode !== card2.mode) {
    return { isMatch: false, matchType: null, points: 0 };
  }

  if (isPitchCard(card1) && isPitchCard(card2)) {
    return validatePitchMatch(card1, card2, config.isExtendedRules);
  }

  if (isChordCard(card1) && isChordCard(card2)) {
    return validateChordMatch(card1, card2, config.isExtendedRules);
  }

  return { isMatch: false, matchType: null, points: 0 };
}
