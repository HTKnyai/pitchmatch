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
      <Text className="text-white text-lg font-bold mb-3">Difficulty</Text>
      <View className="flex-row bg-primary-800 rounded-xl p-1">
        {difficulties.map(({ key, label }) => {
          const config = DIFFICULTY_CONFIG[key];
          const isSelected = value === key;

          return (
            <Pressable
              key={key}
              onPress={() => onValueChange(key)}
              className={`flex-1 py-3 rounded-lg items-center ${
                isSelected ? "bg-primary-500" : ""
              }`}
            >
              <Text
                className={`font-bold ${
                  isSelected ? "text-white" : "text-primary-300"
                }`}
              >
                {label}
              </Text>
              <Text
                className={`text-xs mt-1 ${
                  isSelected ? "text-primary-100" : "text-primary-400"
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
