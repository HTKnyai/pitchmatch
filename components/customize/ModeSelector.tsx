import { View, Text, Pressable } from "react-native";
import type { GameMode } from "../../lib/types/game.types";

type ModeSelectorProps = {
  value: GameMode;
  onValueChange: (mode: GameMode) => void;
};

export function ModeSelector({ value, onValueChange }: ModeSelectorProps) {
  return (
    <View className="mb-6">
      <Text className="text-white text-lg font-bold mb-3">Game Mode</Text>
      <View className="flex-row bg-primary-800 rounded-xl p-1">
        <Pressable
          onPress={() => onValueChange("pitch")}
          className={`flex-1 py-3 rounded-lg items-center ${
            value === "pitch" ? "bg-primary-500" : ""
          }`}
        >
          <Text
            className={`font-bold ${
              value === "pitch" ? "text-white" : "text-primary-300"
            }`}
          >
            Pitch
          </Text>
          <Text
            className={`text-xs mt-1 ${
              value === "pitch" ? "text-primary-100" : "text-primary-400"
            }`}
          >
            Single Notes
          </Text>
        </Pressable>
        <Pressable
          onPress={() => onValueChange("chord")}
          className={`flex-1 py-3 rounded-lg items-center ${
            value === "chord" ? "bg-primary-500" : ""
          }`}
        >
          <Text
            className={`font-bold ${
              value === "chord" ? "text-white" : "text-primary-300"
            }`}
          >
            Chord
          </Text>
          <Text
            className={`text-xs mt-1 ${
              value === "chord" ? "text-primary-100" : "text-primary-400"
            }`}
          >
            Harmonies
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
