import { View, Text, Pressable } from "react-native";
import { ToggleSwitch } from "../ui/ToggleSwitch";
import type { Notation, GameMode } from "../../lib/types/game.types";

type SettingsTogglesProps = {
  notation: Notation;
  showOctave: boolean;
  isBlindMode: boolean;
  isExtendedRules: boolean;
  gameMode: GameMode;
  onNotationChange: (notation: Notation) => void;
  onShowOctaveChange: (value: boolean) => void;
  onBlindModeChange: (value: boolean) => void;
  onExtendedRulesChange: (value: boolean) => void;
};

export function SettingsToggles({
  notation,
  showOctave,
  isBlindMode,
  isExtendedRules,
  gameMode,
  onNotationChange,
  onShowOctaveChange,
  onBlindModeChange,
  onExtendedRulesChange,
}: SettingsTogglesProps) {
  return (
    <View className="bg-primary-800/50 rounded-xl p-4">
      {/* Notation selector */}
      <View className="mb-4">
        <Text className="text-white text-base font-medium mb-2">Notation</Text>
        <View className="flex-row bg-primary-800 rounded-lg p-1">
          <Pressable
            onPress={() => onNotationChange("doremi")}
            className={`flex-1 py-2 rounded-md items-center ${
              notation === "doremi" ? "bg-primary-500" : ""
            }`}
          >
            <Text
              className={`font-bold ${
                notation === "doremi" ? "text-white" : "text-primary-300"
              }`}
            >
              Do Re Mi
            </Text>
          </Pressable>
          <Pressable
            onPress={() => onNotationChange("abc")}
            className={`flex-1 py-2 rounded-md items-center ${
              notation === "abc" ? "bg-primary-500" : ""
            }`}
          >
            <Text
              className={`font-bold ${
                notation === "abc" ? "text-white" : "text-primary-300"
              }`}
            >
              A B C
            </Text>
          </Pressable>
        </View>
      </View>

      <View className="border-t border-primary-700 pt-2">
        {gameMode === "pitch" && (
          <ToggleSwitch
            label="Show Octave"
            value={showOctave}
            onValueChange={onShowOctaveChange}
            description="Display octave number (e.g., C4)"
          />
        )}

        <ToggleSwitch
          label="Blind Mode"
          value={isBlindMode}
          onValueChange={onBlindModeChange}
          description="Hide note names until matched"
        />

        <ToggleSwitch
          label="Extended Rules"
          value={isExtendedRules}
          onValueChange={onExtendedRulesChange}
          description={
            gameMode === "pitch"
              ? "Match across octaves (+50 bonus)"
              : "Match chord inversions (+50 bonus)"
          }
        />
      </View>
    </View>
  );
}
