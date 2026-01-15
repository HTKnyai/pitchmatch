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
    <View className="bg-white/40 rounded-2xl p-4 border border-soft-charcoal/10">
      {/* Notation selector */}
      <View className="mb-4">
        <Text className="text-soft-charcoal text-base font-medium mb-2">Notation</Text>
        <View className="flex-row bg-white/60 rounded-xl p-1 border border-soft-charcoal/10">
          <Pressable
            onPress={() => onNotationChange("doremi")}
            className={`flex-1 py-2 rounded-lg items-center ${
              notation === "doremi" ? "bg-warm-blue" : ""
            }`}
          >
            <Text
              className={`font-bold ${
                notation === "doremi" ? "text-white" : "text-soft-charcoal/60"
              }`}
            >
              Do Re Mi
            </Text>
          </Pressable>
          <Pressable
            onPress={() => onNotationChange("abc")}
            className={`flex-1 py-2 rounded-lg items-center ${
              notation === "abc" ? "bg-warm-blue" : ""
            }`}
          >
            <Text
              className={`font-bold ${
                notation === "abc" ? "text-white" : "text-soft-charcoal/60"
              }`}
            >
              A B C
            </Text>
          </Pressable>
        </View>
      </View>

      <View className="border-t border-soft-charcoal/10 pt-2">
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
