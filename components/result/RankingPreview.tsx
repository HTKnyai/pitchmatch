import { View, Text } from "react-native";
import type { RankingEntry } from "../../lib/types/game.types";
import { formatScore, formatTime, formatDate } from "../../utils/format";

type RankingPreviewProps = {
  rankings: RankingEntry[];
  currentScore?: number;
  title?: string;
};

export function RankingPreview({
  rankings,
  currentScore,
  title = "Top Scores",
}: RankingPreviewProps) {
  if (rankings.length === 0) {
    return (
      <View className="bg-white/60 rounded-2xl p-4 border border-soft-charcoal/10">
        <Text className="text-soft-charcoal font-bold text-center mb-2">{title}</Text>
        <Text className="text-soft-charcoal/60 text-center">No scores yet!</Text>
      </View>
    );
  }

  return (
    <View className="bg-white/60 rounded-2xl p-4 border border-soft-charcoal/10">
      <Text className="text-soft-charcoal font-bold text-center mb-4">{title}</Text>

      {rankings.slice(0, 5).map((entry, index) => {
        const isCurrentScore =
          currentScore !== undefined && entry.score === currentScore;

        return (
          <View
            key={entry.id}
            className={`flex-row items-center py-2 ${
              index < rankings.length - 1 ? "border-b border-soft-charcoal/10" : ""
            } ${isCurrentScore ? "bg-warm-blue/10 -mx-2 px-2 rounded" : ""}`}
          >
            <View className="w-8">
              <Text
                className={`font-bold ${
                  index === 0
                    ? "text-yellow-500"
                    : index === 1
                    ? "text-gray-400"
                    : index === 2
                    ? "text-amber-600"
                    : "text-soft-charcoal/60"
                }`}
              >
                #{index + 1}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-soft-charcoal font-bold">
                {formatScore(entry.score)}
              </Text>
              <Text className="text-soft-charcoal/60 text-xs">
                {formatTime(entry.clearTime)} - {formatDate(entry.date)}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}
