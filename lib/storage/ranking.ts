import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";
import type {
  RankingEntry,
  GameMode,
  Difficulty,
} from "../types/game.types";
import { STORAGE_KEYS } from "../../constants/Config";

const MAX_RANKINGS = 100; // Keep top 100 scores per category

type RankingsData = {
  rankings: RankingEntry[];
};

// Get all rankings from storage
async function getAllRankings(): Promise<RankingEntry[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.rankings);
    if (!data) {
      return [];
    }
    const parsed: RankingsData = JSON.parse(data);
    return parsed.rankings || [];
  } catch (error) {
    console.warn("Failed to load rankings:", error);
    return [];
  }
}

// Save rankings to storage
async function saveAllRankings(rankings: RankingEntry[]): Promise<void> {
  try {
    const data: RankingsData = { rankings };
    await AsyncStorage.setItem(STORAGE_KEYS.rankings, JSON.stringify(data));
  } catch (error) {
    console.warn("Failed to save rankings:", error);
  }
}

// Add a new ranking entry
export async function saveRanking(
  entry: Omit<RankingEntry, "id" | "date">
): Promise<RankingEntry> {
  const newEntry: RankingEntry = {
    ...entry,
    id: uuidv4(),
    date: Date.now(),
  };

  const rankings = await getAllRankings();
  rankings.push(newEntry);

  // Sort by score (descending) and keep top entries per category
  const sortedRankings = rankings.sort((a, b) => b.score - a.score);

  // Group by category and limit each
  const categorized = new Map<string, RankingEntry[]>();
  for (const ranking of sortedRankings) {
    const key = `${ranking.mode}-${ranking.difficulty}-${ranking.isExtendedRules}`;
    const existing = categorized.get(key) || [];
    if (existing.length < MAX_RANKINGS) {
      existing.push(ranking);
      categorized.set(key, existing);
    }
  }

  // Flatten back to array
  const limitedRankings = Array.from(categorized.values()).flat();

  await saveAllRankings(limitedRankings);
  return newEntry;
}

// Get rankings filtered by mode, difficulty, and rules
export async function getRankings(
  mode: GameMode,
  difficulty: Difficulty,
  isExtendedRules: boolean,
  limit: number = 10
): Promise<RankingEntry[]> {
  const rankings = await getAllRankings();

  return rankings
    .filter(
      (entry) =>
        entry.mode === mode &&
        entry.difficulty === difficulty &&
        entry.isExtendedRules === isExtendedRules
    )
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

// Get the rank of a specific score
export async function getScoreRank(
  score: number,
  mode: GameMode,
  difficulty: Difficulty,
  isExtendedRules: boolean
): Promise<number> {
  const rankings = await getRankings(mode, difficulty, isExtendedRules, 100);
  const rank = rankings.findIndex((entry) => entry.score <= score);
  return rank === -1 ? rankings.length + 1 : rank + 1;
}

// Check if a score is a new high score
export async function isHighScore(
  score: number,
  mode: GameMode,
  difficulty: Difficulty,
  isExtendedRules: boolean
): Promise<boolean> {
  const rankings = await getRankings(mode, difficulty, isExtendedRules, 1);
  if (rankings.length === 0) {
    return true;
  }
  return score > rankings[0].score;
}

// Clear all rankings (for testing/reset)
export async function clearRankings(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEYS.rankings);
}
