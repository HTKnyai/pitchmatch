import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Button } from "../components/ui/Button";
import { ModeSelector } from "../components/customize/ModeSelector";
import { DifficultySelector } from "../components/customize/DifficultySelector";
import { SettingsToggles } from "../components/customize/SettingsToggles";
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
    <SafeAreaView className="flex-1 bg-primary-900">
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
        {/* Header */}
        <View className="flex-row items-center mb-6">
          <Button title="Back" onPress={handleBack} variant="ghost" size="sm" />
          <Text className="text-white text-xl font-bold flex-1 text-center mr-12">
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
        <Text className="text-white text-lg font-bold mb-3">Settings</Text>
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
      <View className="p-4 bg-primary-900">
        <Button
          title="Start Game"
          onPress={handleStart}
          variant="primary"
          size="lg"
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
}
