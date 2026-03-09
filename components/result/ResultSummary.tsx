import { View, Text } from "react-native";
import type { GameState, GameConfig } from "../../lib/types/game.types";
import {
  calculateFinalScore,
  calculateAccuracy,
  calculateTimeBonus,
  getWinner,
} from "../../lib/game/ScoreCalculator";
import { formatScore, formatTime, formatAccuracy } from "../../utils/format";

type ResultSummaryProps = {
  gameState: GameState;
  config: GameConfig;
  isHighScore?: boolean;
};

export function ResultSummary({
  gameState,
  config,
  isHighScore = false,
}: ResultSummaryProps) {
  const isMultiPlayer = config.playerCount > 1;

  if (isMultiPlayer) {
    return <MultiPlayerResult gameState={gameState} />;
  }

  return (
    <SinglePlayerResult
      gameState={gameState}
      config={config}
      isHighScore={isHighScore}
    />
  );
}

function SinglePlayerResult({
  gameState,
  config,
  isHighScore,
}: {
  gameState: GameState;
  config: GameConfig;
  isHighScore: boolean;
}) {
  const player = gameState.players.player1;
  const elapsedSeconds = gameState.endTime && gameState.startTime
    ? (gameState.endTime - gameState.startTime) / 1000
    : 0;

  const timeBonus = calculateTimeBonus(elapsedSeconds, config.difficulty);
  const finalScore = player.score + timeBonus;
  const accuracy = calculateAccuracy(player.matchedPairs, player.attempts);

  return (
    <View className="items-center">
      {isHighScore && (
        <View className="bg-pastel-yellow px-4 py-1 rounded-full mb-4 border border-soft-charcoal/10">
          <Text className="text-soft-charcoal font-bold">NEW HIGH SCORE!</Text>
        </View>
      )}

      <Text className="text-soft-charcoal/60 text-lg">Final Score</Text>
      <Text className="text-soft-charcoal text-5xl font-bold mb-6">
        {formatScore(finalScore)}
      </Text>

      <View className="w-full bg-white/60 rounded-2xl p-4 mb-4 border border-soft-charcoal/10">
        <View className="flex-row justify-between mb-2">
          <Text className="text-soft-charcoal/60">Base Score</Text>
          <Text className="text-soft-charcoal font-bold">
            {formatScore(player.score)}
          </Text>
        </View>
        <View className="flex-row justify-between mb-2">
          <Text className="text-soft-charcoal/60">Time Bonus</Text>
          <Text className="text-warm-sage font-bold">
            +{formatScore(timeBonus)}
          </Text>
        </View>
        <View className="border-t border-soft-charcoal/10 pt-2 mt-2 flex-row justify-between">
          <Text className="text-soft-charcoal/60">Clear Time</Text>
          <Text className="text-soft-charcoal font-bold">
            {formatTime(elapsedSeconds)}
          </Text>
        </View>
        <View className="flex-row justify-between mt-2">
          <Text className="text-soft-charcoal/60">Accuracy</Text>
          <Text className="text-soft-charcoal font-bold">
            {formatAccuracy(accuracy)}
          </Text>
        </View>
      </View>
    </View>
  );
}

function MultiPlayerResult({ gameState }: { gameState: GameState }) {
  const result = getWinner(gameState);
  const playerCount = gameState.config.playerCount;

  return (
    <View className="items-center">
      <Text className="text-soft-charcoal/60 text-lg mb-2">
        {result.winner === "tie" ? "引き分け" : "勝者"}
      </Text>
      <Text className="text-soft-charcoal text-4xl font-bold mb-6">
        {result.winner === "tie"
          ? "DRAW!"
          : `Player ${result.winner}!`}
      </Text>

      <View className="w-full bg-white/60 rounded-2xl p-4 border border-soft-charcoal/10">
        <View className="flex-row flex-wrap justify-around gap-y-4">
          {Array.from({ length: playerCount }, (_, i) => {
            const n = i + 1;
            const key = `player${n}` as keyof typeof gameState.players;
            const isWinner = result.winner === n;
            return (
              <View key={n} className="items-center min-w-[80px]">
                <Text
                  className={`text-lg font-bold ${
                    isWinner ? "text-warm-blue" : "text-soft-charcoal/60"
                  }`}
                >
                  P{n}
                </Text>
                <Text className="text-soft-charcoal text-2xl font-bold">
                  {formatScore(result.scores[key])}
                </Text>
                <Text className="text-soft-charcoal/60 text-sm">
                  {gameState.players[key].matchedPairs} pairs
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}
