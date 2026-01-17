import { View, Text, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useEffect, useState } from "react";
import type { GameState, GameConfig } from "../../lib/types/game.types";
import { formatTime, formatScore } from "../../utils/format";
import { ANIMATION } from "../../constants/Config";

type GameHeaderProps = {
  gameState: GameState;
  config: GameConfig;
  onPause: () => void;
};

type PlayerPanelProps = {
  playerNumber: 1 | 2;
  score: number;
  comboCount: number;
  isActive: boolean;
};

function PlayerPanel({
  playerNumber,
  score,
  comboCount,
  isActive,
}: PlayerPanelProps) {
  const scale = useSharedValue(1);
  const borderWidth = useSharedValue(0);
  const bgOpacity = useSharedValue(0);

  useEffect(() => {
    if (isActive) {
      scale.value = withSpring(1.05, { damping: 10 });
      borderWidth.value = withTiming(3, {
        duration: ANIMATION.turnTransitionDuration,
      });
      bgOpacity.value = withTiming(1, {
        duration: ANIMATION.turnTransitionDuration,
      });
    } else {
      scale.value = withSpring(1, { damping: 10 });
      borderWidth.value = withTiming(0, {
        duration: ANIMATION.turnTransitionDuration,
      });
      bgOpacity.value = withTiming(0, {
        duration: ANIMATION.turnTransitionDuration,
      });
    }
  }, [isActive, scale, borderWidth, bgOpacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    borderWidth: borderWidth.value,
    borderColor: "#7DA7C9",
  }));

  const bgStyle = useAnimatedStyle(() => ({
    backgroundColor: `rgba(200, 220, 240, ${bgOpacity.value * 0.5})`,
  }));

  return (
    <Animated.View
      style={[animatedStyle, bgStyle]}
      className="items-center flex-1 py-2 px-3 rounded-xl"
    >
      <Text
        className={`text-base ${
          isActive
            ? "text-warm-blue font-extrabold"
            : "text-soft-charcoal/40 font-normal"
        }`}
      >
        Player {playerNumber}
      </Text>
      <Text
        className={`text-3xl font-bold ${
          isActive ? "text-soft-charcoal" : "text-soft-charcoal/40"
        }`}
      >
        {formatScore(score)}
      </Text>
      {comboCount > 1 && isActive && (
        <View className="bg-warm-coral px-2 py-0.5 rounded-full mt-1">
          <Text className="text-white text-xs font-bold">
            {comboCount}x Combo
          </Text>
        </View>
      )}
    </Animated.View>
  );
}

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
        // Two player header - enhanced
        <View className="flex-row items-center justify-between">
          <PlayerPanel
            playerNumber={1}
            score={gameState.players.player1.score}
            comboCount={gameState.players.player1.comboCount}
            isActive={gameState.currentPlayer === 1}
          />

          <View className="items-center px-2">
            <Text className="text-soft-charcoal/60 text-sm">VS</Text>
            <Pressable
              onPress={onPause}
              className="mt-1 px-3 py-1 bg-warm-sage rounded-lg"
            >
              <Text className="text-white text-xs">PAUSE</Text>
            </Pressable>
          </View>

          <PlayerPanel
            playerNumber={2}
            score={gameState.players.player2.score}
            comboCount={gameState.players.player2.comboCount}
            isActive={gameState.currentPlayer === 2}
          />
        </View>
      ) : (
        // Single player header - with combo display
        <View className="flex-row items-center justify-between">
          <View className="items-center">
            <Text className="text-soft-charcoal/60 text-sm">SCORE</Text>
            <Text className="text-soft-charcoal text-2xl font-bold">
              {formatScore(gameState.players.player1.score)}
            </Text>
          </View>

          {gameState.players.player1.comboCount > 1 && (
            <View className="items-center">
              <View className="bg-warm-coral px-3 py-1 rounded-full">
                <Text className="text-white font-bold">
                  {gameState.players.player1.comboCount}x COMBO
                </Text>
              </View>
            </View>
          )}

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
