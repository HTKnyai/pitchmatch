import { View, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button } from "../components/ui/Button";
import { ResultSummary } from "../components/result/ResultSummary";
import { RankingPreview } from "../components/result/RankingPreview";
import { GradientBackground } from "../components/ui/GradientBackground";
import { useGame } from "../lib/context/GameContext";
import { useRanking } from "../lib/hooks/useRanking";
import { calculateFinalScore, calculateAccuracy } from "../lib/game/ScoreCalculator";

export default function ResultScreen() {
  const router = useRouter();
  const { state, resetGame, startGame } = useGame();
  const { rankings, loadRankings, addRanking, checkHighScore } = useRanking();
  const [isHighScore, setIsHighScore] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);

  const config = state.config;
  const isTwoPlayer = config.playerCount === 2;

  useEffect(() => {
    // Redirect if game not finished
    if (state.gameStatus !== "finished") {
      router.replace("/");
      return;
    }

    // Load rankings and save score for single player
    const initResult = async () => {
      if (!isTwoPlayer && !hasSaved) {
        const finalScore = calculateFinalScore(state, config);
        const player = state.players.player1;
        const clearTime =
          state.endTime && state.startTime
            ? (state.endTime - state.startTime) / 1000
            : 0;
        const accuracy = calculateAccuracy(player.matchedPairs, player.attempts);

        // Check if high score
        const isHigh = await checkHighScore(
          finalScore,
          config.mode,
          config.difficulty,
          config.isExtendedRules
        );
        setIsHighScore(isHigh);

        // Save the ranking
        await addRanking({
          mode: config.mode,
          difficulty: config.difficulty,
          isExtendedRules: config.isExtendedRules,
          score: finalScore,
          clearTime,
          accuracy,
        });

        setHasSaved(true);
      }

      // Load rankings for display
      await loadRankings(
        config.mode,
        config.difficulty,
        config.isExtendedRules,
        5
      );
    };

    initResult();
  }, [state.gameStatus]);

  const handlePlayAgain = () => {
    startGame();
    router.replace("/game");
  };

  const handleBackToTitle = () => {
    resetGame();
    router.replace("/");
  };

  // Show nothing while redirecting
  if (state.gameStatus !== "finished") {
    return null;
  }

  return (
    <GradientBackground variant="result">
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={{ padding: 16, paddingBottom: 140 }}
        >
          <ResultSummary
            gameState={state}
            config={config}
            isHighScore={isHighScore}
          />

          {!isTwoPlayer && (
            <View style={styles.rankingContainer}>
              <RankingPreview
                rankings={rankings}
                currentScore={calculateFinalScore(state, config)}
                title="Your Rankings"
              />
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Play Again"
            onPress={handlePlayAgain}
            variant="primary"
            size="lg"
            fullWidth
          />
          <Button
            title="Back to Title"
            onPress={handleBackToTitle}
            variant="outline"
            size="md"
            fullWidth
          />
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  rankingContainer: {
    marginTop: 24,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderTopWidth: 1,
    borderTopColor: "rgba(74, 74, 74, 0.05)",
    gap: 12,
  },
});
