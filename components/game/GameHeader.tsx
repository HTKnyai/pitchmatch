import { View, Text, Pressable } from "react-native";
import { useEffect, useState } from "react";
import type { GameState, GameConfig } from "../../lib/types/game.types";
import { formatTime, formatScore } from "../../utils/format";

type GameHeaderProps = {
  gameState: GameState;
  config: GameConfig;
  onPause: () => void;
};

export function GameHeader({ gameState, config, onPause }: GameHeaderProps) {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (gameState.gameStatus !== "playing" || !gameState.startTime) {
      return;
    }

    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - gameState.startTime!) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState.gameStatus, gameState.startTime]);

  const isTwoPlayer = config.playerCount === 2;

  return (
    <View className="w-full px-4 py-3 bg-white/40">
      {isTwoPlayer ? (
        // Two player header
        <View className="flex-row items-center justify-between">
          <View className="items-center flex-1">
            <Text
              className={`text-sm ${
                gameState.currentPlayer === 1
                  ? "text-warm-blue font-bold"
                  : "text-soft-charcoal/60"
              }`}
            >
              Player 1
            </Text>
            <Text
              className={`text-2xl font-bold ${
                gameState.currentPlayer === 1 ? "text-soft-charcoal" : "text-soft-charcoal/60"
              }`}
            >
              {formatScore(gameState.players.player1.score)}
            </Text>
          </View>

          <View className="items-center px-4">
            <Text className="text-soft-charcoal/60 text-sm">VS</Text>
            <Pressable
              onPress={onPause}
              className="mt-1 px-3 py-1 bg-warm-sage rounded-lg"
            >
              <Text className="text-white text-xs">PAUSE</Text>
            </Pressable>
          </View>

          <View className="items-center flex-1">
            <Text
              className={`text-sm ${
                gameState.currentPlayer === 2
                  ? "text-warm-blue font-bold"
                  : "text-soft-charcoal/60"
              }`}
            >
              Player 2
            </Text>
            <Text
              className={`text-2xl font-bold ${
                gameState.currentPlayer === 2 ? "text-soft-charcoal" : "text-soft-charcoal/60"
              }`}
            >
              {formatScore(gameState.players.player2.score)}
            </Text>
          </View>
        </View>
      ) : (
        // Single player header
        <View className="flex-row items-center justify-between">
          <View className="items-center">
            <Text className="text-soft-charcoal/60 text-sm">SCORE</Text>
            <Text className="text-soft-charcoal text-2xl font-bold">
              {formatScore(gameState.players.player1.score)}
            </Text>
          </View>

          <View className="items-center">
            <Text className="text-soft-charcoal/60 text-sm">TIME</Text>
            <Text className="text-soft-charcoal text-2xl font-bold">
              {formatTime(elapsedTime)}
            </Text>
          </View>

          <View className="items-center">
            <Text className="text-soft-charcoal/60 text-sm">PAIRS</Text>
            <Text className="text-soft-charcoal text-2xl font-bold">
              {gameState.matchedPairs}/{gameState.totalPairs}
            </Text>
          </View>

          <Pressable
            onPress={onPause}
            className="px-4 py-2 bg-warm-blue rounded-xl"
          >
            <Text className="text-white font-bold">II</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
