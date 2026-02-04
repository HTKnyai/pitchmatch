import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Button } from "../components/ui/Button";
import { ModeSelector } from "../components/customize/ModeSelector";
import { DifficultySelector } from "../components/customize/DifficultySelector";
import { SettingsToggles } from "../components/customize/SettingsToggles";
import { GradientBackground } from "../components/ui/GradientBackground";
import { useGame } from "../lib/context/GameContext";
import type { GameMode, Difficulty, Notation } from "../lib/types/game.types";

export default function CustomizeScreen() {
  const router = useRouter();
  const { state, setConfig, startGame } = useGame();
  const config = state.config;

  const handleModeChange = (mode: GameMode) => {
    setConfig({ ...config, mode });
  };

  const handleDifficultyChange = (difficulty: Difficulty) => {
    setConfig({ ...config, difficulty });
  };

  const handleNotationChange = (notation: Notation) => {
    setConfig({ ...config, notation });
  };

  const handleShowOctaveChange = (showOctave: boolean) => {
    setConfig({ ...config, showOctave });
  };

  const handleBlindModeChange = (isBlindMode: boolean) => {
    setConfig({ ...config, isBlindMode });
  };

  const handleExtendedRulesChange = (isExtendedRules: boolean) => {
    setConfig({ ...config, isExtendedRules });
  };

  const handleStart = () => {
    startGame();
    router.push("/game");
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <GradientBackground variant="customize">
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scroll} contentContainerStyle={{ padding: 16 }}>
          {/* Header */}
          <View style={styles.header}>
            <Button title="← Back" onPress={handleBack} variant="ghost" size="sm" />
            <Text style={styles.headerTitle}>
              {config.playerCount === 1 ? "1 Player" : "2 Players"}
            </Text>
          </View>

          {/* Mode selection */}
          <ModeSelector value={config.mode} onValueChange={handleModeChange} />

          {/* Difficulty selection */}
          <DifficultySelector
            value={config.difficulty}
            onValueChange={handleDifficultyChange}
          />

          {/* Settings */}
          <Text style={styles.sectionTitle}>Settings</Text>
          <SettingsToggles
            notation={config.notation}
            showOctave={config.showOctave}
            isBlindMode={config.isBlindMode}
            isExtendedRules={config.isExtendedRules}
            gameMode={config.mode}
            onNotationChange={handleNotationChange}
            onShowOctaveChange={handleShowOctaveChange}
            onBlindModeChange={handleBlindModeChange}
            onExtendedRulesChange={handleExtendedRulesChange}
          />
        </ScrollView>

        {/* Start button */}
        <View style={styles.footer}>
          <Button
            title="Start Game"
            onPress={handleStart}
            variant="primary"
            size="lg"
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  headerTitle: {
    color: "#4A4A4A",
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    marginRight: 64,
  },
  sectionTitle: {
    color: "#4A4A4A",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  footer: {
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderTopWidth: 1,
    borderTopColor: "rgba(74, 74, 74, 0.05)",
  },
});
