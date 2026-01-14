import { View, Text, Pressable } from "react-native";
import type { GameMode } from "../../lib/types/game.types";

type ModeSelectorProps = {
  value: GameMode;
  onValueChange: (mode: GameMode) => void;
};

export function ModeSelector({ value, onValueChange }: ModeSelectorProps) {
  return (
    <View className="mb-6">
      <Text className="text-soft-charcoal text-lg font-bold mb-3">Game Mode</Text>
      <View className="flex-row bg-white/60 rounded-2xl p-1 border border-soft-charcoal/10">
        <Pressable
          onPress={() => onValueChange("pitch")}
          className={`flex-1 py-3 rounded-xl items-center ${
            value === "pitch" ? "bg-warm-blue" : ""
          }`}
        >
          <Text
            className={`font-bold ${
              value === "pitch" ? "text-white" : "text-soft-charcoal/60"
            }`}
          >
            Pitch
          </Text>
          <Text
            className={`text-xs mt-1 ${
              value === "pitch" ? "text-white/80" : "text-soft-charcoal/40"
            }`}
          >
            Single Notes
          </Text>
        </Pressable>
        <Pressable
          onPress={() => onValueChange("chord")}
          className={`flex-1 py-3 rounded-xl items-center ${
            value === "chord" ? "bg-warm-blue" : ""
          }`}
        >
          <Text
            className={`font-bold ${
              value === "chord" ? "text-white" : "text-soft-charcoal/60"
            }`}
          >
            Chord
          </Text>
          <Text
            className={`text-xs mt-1 ${
              value === "chord" ? "text-white/80" : "text-soft-charcoal/40"
            }`}
          >
            Harmonies
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
