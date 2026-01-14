import { useState, useCallback } from "react";
import type {
  RankingEntry,
  GameMode,
  Difficulty,
} from "../types/game.types";
import {
  getRankings,
  saveRanking,
  getScoreRank,
  isHighScore,
} from "../storage/ranking";

export function useRanking() {
  const [rankings, setRankings] = useState<RankingEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadRankings = useCallback(
    async (
      mode: GameMode,
      difficulty: Difficulty,
      isExtendedRules: boolean,
      limit: number = 10
    ) => {
      setIsLoading(true);
      try {
        const data = await getRankings(mode, difficulty, isExtendedRules, limit);
        setRankings(data);
      } catch (error) {
        console.warn("Failed to load rankings:", error);
        setRankings([]);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const addRanking = useCallback(
    async (entry: Omit<RankingEntry, "id" | "date">) => {
      try {
        const newEntry = await saveRanking(entry);
        return newEntry;
      } catch (error) {
        console.warn("Failed to save ranking:", error);
        return null;
      }
    },
    []
  );

  const checkHighScore = useCallback(
    async (
      score: number,
      mode: GameMode,
      difficulty: Difficulty,
      isExtendedRules: boolean
    ) => {
      return await isHighScore(score, mode, difficulty, isExtendedRules);
    },
    []
  );

  const getRank = useCallback(
    async (
      score: number,
      mode: GameMode,
      difficulty: Difficulty,
      isExtendedRules: boolean
    ) => {
      return await getScoreRank(score, mode, difficulty, isExtendedRules);
    },
    []
  );

  return {
    rankings,
    isLoading,
    loadRankings,
    addRanking,
    checkHighScore,
    getRank,
  };
}
