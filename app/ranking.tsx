import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button } from "../components/ui/Button";
import { GradientBackground } from "../components/ui/GradientBackground";
import { useRanking } from "../lib/hooks/useRanking";
import { formatScore, formatTime, formatDate, formatAccuracy } from "../utils/format";
import type { GameMode, Difficulty, RankingEntry } from "../lib/types/game.types";

export default function RankingScreen() {
  const router = useRouter();
  const { rankings, isLoading, loadRankings } = useRanking();

  const [mode, setMode] = useState<GameMode>("pitch");
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");
  const [isExtended, setIsExtended] = useState(false);

  useEffect(() => {
    loadRankings(mode, difficulty, isExtended, 10);
  }, [mode, difficulty, isExtended]);

  const handleBack = () => {
    router.back();
  };

  return (
    <GradientBackground variant="result">
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Button title="← Back" onPress={handleBack} variant="ghost" size="sm" />
          <Text style={styles.headerTitle}>Rankings</Text>
        </View>

        {/* Filters */}
        <View style={styles.filters}>
          {/* Mode filter */}
          <View style={styles.filterRow}>
            <Pressable
              onPress={() => setMode("pitch")}
              style={[
                styles.filterButton,
                mode === "pitch" && styles.filterButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  mode === "pitch" && styles.filterTextActive,
                ]}
              >
                Pitch
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setMode("chord")}
              style={[
                styles.filterButton,
                mode === "chord" && styles.filterButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  mode === "chord" && styles.filterTextActive,
                ]}
              >
                Chord
              </Text>
            </Pressable>
          </View>

          {/* Difficulty filter */}
          <View style={styles.filterRow}>
            {(["easy", "normal", "hard"] as Difficulty[]).map((d) => (
              <Pressable
                key={d}
                onPress={() => setDifficulty(d)}
                style={[
                  styles.filterButton,
                  difficulty === d && styles.filterButtonSecondary,
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    difficulty === d && styles.filterTextActive,
                    { textTransform: "capitalize" },
                  ]}
                >
                  {d}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Extended rules filter */}
          <View style={styles.filterRow}>
            <Pressable
              onPress={() => setIsExtended(false)}
              style={[
                styles.filterButton,
                !isExtended && styles.filterButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  !isExtended && styles.filterTextActive,
                ]}
              >
                Normal Rules
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setIsExtended(true)}
              style={[
                styles.filterButton,
                isExtended && styles.filterButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  isExtended && styles.filterTextActive,
                ]}
              >
                Extended Rules
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Rankings list */}
        <ScrollView style={styles.list}>
          {isLoading ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Loading...</Text>
            </View>
          ) : rankings.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No scores yet!</Text>
              <Text style={styles.emptySubtitle}>
                Play a game to set a record
              </Text>
            </View>
          ) : (
            rankings.map((entry, index) => (
              <RankingRow key={entry.id} entry={entry} rank={index + 1} />
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    color: "#4A4A4A",
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    marginRight: 64,
  },
  filters: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  filterRow: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: "rgba(74, 74, 74, 0.1)",
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  filterButtonActive: {
    backgroundColor: "#9B7ED9",
  },
  filterButtonSecondary: {
    backgroundColor: "#9CB5A2",
  },
  filterText: {
    fontWeight: "bold",
    color: "rgba(74, 74, 74, 0.6)",
  },
  filterTextActive: {
    color: "#FFFFFF",
  },
  list: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyText: {
    color: "rgba(74, 74, 74, 0.6)",
  },
  emptyTitle: {
    color: "#4A4A4A",
    fontSize: 18,
  },
  emptySubtitle: {
    color: "rgba(74, 74, 74, 0.6)",
    fontSize: 14,
    marginTop: 8,
  },
});

function RankingRow({ entry, rank }: { entry: RankingEntry; rank: number }) {
  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "#EAB308"; // gold
      case 2:
        return "#9CA3AF"; // silver
      case 3:
        return "#D97706"; // bronze
      default:
        return "rgba(74, 74, 74, 0.6)";
    }
  };

  return (
    <View style={rowStyles.container}>
      <View style={rowStyles.rankContainer}>
        <Text style={[rowStyles.rankText, { color: getRankColor(rank) }]}>
          #{rank}
        </Text>
      </View>
      <View style={rowStyles.content}>
        <Text style={rowStyles.score}>{formatScore(entry.score)}</Text>
        <View style={rowStyles.details}>
          <Text style={rowStyles.detailText}>{formatTime(entry.clearTime)}</Text>
          <Text style={rowStyles.separator}>|</Text>
          <Text style={rowStyles.detailText}>{formatAccuracy(entry.accuracy)}</Text>
        </View>
      </View>
      <View style={rowStyles.dateContainer}>
        <Text style={rowStyles.dateText}>{formatDate(entry.date)}</Text>
      </View>
    </View>
  );
}

const rowStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(74, 74, 74, 0.1)",
  },
  rankContainer: {
    width: 40,
  },
  rankText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
  },
  score: {
    color: "#4A4A4A",
    fontSize: 20,
    fontWeight: "bold",
  },
  details: {
    flexDirection: "row",
    marginTop: 4,
  },
  detailText: {
    color: "rgba(74, 74, 74, 0.6)",
    fontSize: 14,
  },
  separator: {
    color: "rgba(74, 74, 74, 0.3)",
    fontSize: 14,
    marginHorizontal: 8,
  },
  dateContainer: {
    alignItems: "flex-end",
  },
  dateText: {
    color: "rgba(74, 74, 74, 0.6)",
    fontSize: 14,
  },
});
