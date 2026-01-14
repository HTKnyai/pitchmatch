import { View, Text, Pressable } from "react-native";
import type { Difficulty } from "../../lib/types/game.types";
import { DIFFICULTY_CONFIG } from "../../constants/Config";

type DifficultySelectorProps = {
  value: Difficulty;
  onValueChange: (difficulty: Difficulty) => void;
};

const difficulties: { key: Difficulty; label: string }[] = [
  { key: "easy", label: "Easy" },
  { key: "normal", label: "Normal" },
  { key: "hard", label: "Hard" },
];

export function DifficultySelector({
  value,
  onValueChange,
}: DifficultySelectorProps) {
  return (
    <View className="mb-6">
      <Text className="text-soft-charcoal text-lg font-bold mb-3">Difficulty</Text>
      <View className="flex-row bg-white/60 rounded-2xl p-1 border border-soft-charcoal/10">
        {difficulties.map(({ key, label }) => {
          const config = DIFFICULTY_CONFIG[key];
          const isSelected = value === key;

          return (
            <Pressable
              key={key}
              onPress={() => onValueChange(key)}
              className={`flex-1 py-3 rounded-xl items-center ${
                isSelected ? "bg-warm-sage" : ""
              }`}
            >
              <Text
                className={`font-bold ${
                  isSelected ? "text-white" : "text-soft-charcoal/60"
                }`}
              >
                {label}
              </Text>
              <Text
                className={`text-xs mt-1 ${
                  isSelected ? "text-white/80" : "text-soft-charcoal/40"
                }`}
              >
                {config.pairCount} pairs
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
