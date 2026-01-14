import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button } from "../components/ui/Button";
import { useRanking } from "../lib/hooks/useRanking";
import { formatScore, formatTime, formatDate, formatAccuracy } from "../utils/format";
import type { GameMode, Difficulty, RankingEntry } from "../lib/types/game.types";

export default function RankingScreen() {
  const router = useRouter();
  const { rankings, isLoading, loadRankings } = useRanking();

  const [mode, setMode] = useState<GameMode>("pitch");
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");
  const [isExtended, setIsExtended] = useState(false);

  useEffect(() => {
    loadRankings(mode, difficulty, isExtended, 10);
  }, [mode, difficulty, isExtended]);

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-primary-900">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3">
        <Button title="Back" onPress={handleBack} variant="ghost" size="sm" />
        <Text className="text-white text-xl font-bold flex-1 text-center mr-12">
          Rankings
        </Text>
      </View>

      {/* Filters */}
      <View className="px-4 pb-4">
        {/* Mode filter */}
        <View className="flex-row bg-primary-800 rounded-lg p-1 mb-2">
          <Pressable
            onPress={() => setMode("pitch")}
            className={`flex-1 py-2 rounded-md items-center ${
              mode === "pitch" ? "bg-primary-500" : ""
            }`}
          >
            <Text
              className={`font-bold ${
                mode === "pitch" ? "text-white" : "text-primary-300"
              }`}
            >
              Pitch
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setMode("chord")}
            className={`flex-1 py-2 rounded-md items-center ${
              mode === "chord" ? "bg-primary-500" : ""
            }`}
          >
            <Text
              className={`font-bold ${
                mode === "chord" ? "text-white" : "text-primary-300"
              }`}
            >
              Chord
            </Text>
          </Pressable>
        </View>

        {/* Difficulty filter */}
        <View className="flex-row bg-primary-800 rounded-lg p-1 mb-2">
          {(["easy", "normal", "hard"] as Difficulty[]).map((d) => (
            <Pressable
              key={d}
              onPress={() => setDifficulty(d)}
              className={`flex-1 py-2 rounded-md items-center ${
                difficulty === d ? "bg-primary-500" : ""
              }`}
            >
              <Text
                className={`font-bold capitalize ${
                  difficulty === d ? "text-white" : "text-primary-300"
                }`}
              >
                {d}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Extended rules filter */}
        <View className="flex-row bg-primary-800 rounded-lg p-1">
          <Pressable
            onPress={() => setIsExtended(false)}
            className={`flex-1 py-2 rounded-md items-center ${
              !isExtended ? "bg-primary-500" : ""
            }`}
          >
            <Text
              className={`font-bold ${
                !isExtended ? "text-white" : "text-primary-300"
              }`}
            >
              Normal Rules
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setIsExtended(true)}
            className={`flex-1 py-2 rounded-md items-center ${
              isExtended ? "bg-primary-500" : ""
            }`}
          >
            <Text
              className={`font-bold ${
                isExtended ? "text-white" : "text-primary-300"
              }`}
            >
              Extended Rules
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Rankings list */}
      <ScrollView className="flex-1 px-4">
        {isLoading ? (
          <View className="items-center py-8">
            <Text className="text-primary-300">Loading...</Text>
          </View>
        ) : rankings.length === 0 ? (
          <View className="items-center py-8">
            <Text className="text-primary-300 text-lg">No scores yet!</Text>
            <Text className="text-primary-400 text-sm mt-2">
              Play a game to set a record
            </Text>
          </View>
        ) : (
          rankings.map((entry, index) => (
            <RankingRow key={entry.id} entry={entry} rank={index + 1} />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function RankingRow({ entry, rank }: { entry: RankingEntry; rank: number }) {
  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "text-yellow-400";
      case 2:
        return "text-gray-300";
      case 3:
        return "text-amber-600";
      default:
        return "text-primary-400";
    }
  };

  return (
    <View className="flex-row items-center py-3 border-b border-primary-800">
      <View className="w-10">
        <Text className={`text-xl font-bold ${getRankColor(rank)}`}>
          #{rank}
        </Text>
      </View>
      <View className="flex-1">
        <Text className="text-white text-xl font-bold">
          {formatScore(entry.score)}
        </Text>
        <View className="flex-row mt-1">
          <Text className="text-primary-400 text-sm">
            {formatTime(entry.clearTime)}
          </Text>
          <Text className="text-primary-600 text-sm mx-2">|</Text>
          <Text className="text-primary-400 text-sm">
            {formatAccuracy(entry.accuracy)}
          </Text>
        </View>
      </View>
      <View className="items-end">
        <Text className="text-primary-400 text-sm">{formatDate(entry.date)}</Text>
      </View>
    </View>
  );
}
