import type { GameState, GameConfig } from "../types/game.types";
import { DIFFICULTY_CONFIG, SCORING } from "../../constants/Config";

export function calculateTimeBonus(
  elapsedSeconds: number,
  difficulty: GameConfig["difficulty"]
): number {
  const targetTime = DIFFICULTY_CONFIG[difficulty].targetTime;

  if (elapsedSeconds >= targetTime) {
    return 0;
  }

  const remainingSeconds = targetTime - elapsedSeconds;
  return Math.floor(remainingSeconds * SCORING.timeBonusPerSecond);
}

export function calculateFinalScore(
  gameState: GameState,
  config: GameConfig
): number {
  const currentPlayerKey =
    `player${gameState.currentPlayer}` as keyof typeof gameState.players;
  const baseScore = gameState.players[currentPlayerKey].score;

  // multi-player mode: no time bonus
  if (config.playerCount > 1) {
    return baseScore;
  }

  // 1-player mode: add time bonus
  if (!gameState.startTime || !gameState.endTime) {
    return baseScore;
  }

  const elapsedSeconds = (gameState.endTime - gameState.startTime) / 1000;
  const timeBonus = calculateTimeBonus(elapsedSeconds, config.difficulty);

  return baseScore + timeBonus;
}

export function calculateAccuracy(
  matchedPairs: number,
  totalAttempts: number
): number {
  if (totalAttempts === 0) {
    return 0;
  }

  // Perfect accuracy means matching every pair on first try
  // matchedPairs attempts would be perfect
  const perfectAttempts = matchedPairs;
  const accuracy = (perfectAttempts / totalAttempts) * 100;

  return Math.round(accuracy * 10) / 10; // Round to 1 decimal place
}

export function getWinner(
  gameState: GameState
): { winner: number | "tie"; scores: Record<string, number> } {
  const playerCount = gameState.config.playerCount;
  const scores: Record<string, number> = {};

  for (let i = 1; i <= playerCount; i++) {
    const key = `player${i}` as keyof typeof gameState.players;
    scores[key] = gameState.players[key].score;
  }

  const maxScore = Math.max(...Object.values(scores));
  const winners = Object.entries(scores).filter(([, s]) => s === maxScore);

  if (winners.length > 1) {
    return { winner: "tie", scores };
  }

  const winnerKey = winners[0][0]; // e.g. "player2"
  const winnerNumber = parseInt(winnerKey.replace("player", ""), 10);
  return { winner: winnerNumber, scores };
}
