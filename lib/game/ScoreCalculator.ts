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

  // 2-player mode: no time bonus
  if (config.playerCount === 2) {
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
): { winner: 1 | 2 | "tie"; scores: { player1: number; player2: number } } {
  const player1Score = gameState.players.player1.score;
  const player2Score = gameState.players.player2.score;

  let winner: 1 | 2 | "tie";
  if (player1Score > player2Score) {
    winner = 1;
  } else if (player2Score > player1Score) {
    winner = 2;
  } else {
    winner = "tie";
  }

  return {
    winner,
    scores: { player1: player1Score, player2: player2Score },
  };
}
