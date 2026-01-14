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
  const isTwoPlayer = config.playerCount === 2;

  if (isTwoPlayer) {
    return <TwoPlayerResult gameState={gameState} />;
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
        <View className="bg-yellow-500 px-4 py-1 rounded-full mb-4">
          <Text className="text-yellow-900 font-bold">NEW HIGH SCORE!</Text>
        </View>
      )}

      <Text className="text-primary-200 text-lg">Final Score</Text>
      <Text className="text-white text-5xl font-bold mb-6">
        {formatScore(finalScore)}
      </Text>

      <View className="w-full bg-primary-800/50 rounded-xl p-4 mb-4">
        <View className="flex-row justify-between mb-2">
          <Text className="text-primary-300">Base Score</Text>
          <Text className="text-white font-bold">
            {formatScore(player.score)}
          </Text>
        </View>
        <View className="flex-row justify-between mb-2">
          <Text className="text-primary-300">Time Bonus</Text>
          <Text className="text-green-400 font-bold">
            +{formatScore(timeBonus)}
          </Text>
        </View>
        <View className="border-t border-primary-700 pt-2 mt-2 flex-row justify-between">
          <Text className="text-primary-300">Clear Time</Text>
          <Text className="text-white font-bold">
            {formatTime(elapsedSeconds)}
          </Text>
        </View>
        <View className="flex-row justify-between mt-2">
          <Text className="text-primary-300">Accuracy</Text>
          <Text className="text-white font-bold">
            {formatAccuracy(accuracy)}
          </Text>
        </View>
      </View>
    </View>
  );
}

function TwoPlayerResult({ gameState }: { gameState: GameState }) {
  const result = getWinner(gameState);

  return (
    <View className="items-center">
      <Text className="text-primary-200 text-lg mb-2">
        {result.winner === "tie" ? "It's a" : "Winner"}
      </Text>
      <Text className="text-white text-4xl font-bold mb-6">
        {result.winner === "tie"
          ? "TIE!"
          : result.winner === 1
          ? "Player 1!"
          : "Player 2!"}
      </Text>

      <View className="w-full flex-row justify-around bg-primary-800/50 rounded-xl p-4">
        <View className="items-center">
          <Text
            className={`text-lg font-bold ${
              result.winner === 1 ? "text-yellow-400" : "text-primary-300"
            }`}
          >
            Player 1
          </Text>
          <Text className="text-white text-3xl font-bold">
            {formatScore(result.scores.player1)}
          </Text>
          <Text className="text-primary-400 text-sm">
            {gameState.players.player1.matchedPairs} pairs
          </Text>
        </View>

        <View className="items-center justify-center">
          <Text className="text-primary-400 text-2xl">vs</Text>
        </View>

        <View className="items-center">
          <Text
            className={`text-lg font-bold ${
              result.winner === 2 ? "text-yellow-400" : "text-primary-300"
            }`}
          >
            Player 2
          </Text>
          <Text className="text-white text-3xl font-bold">
            {formatScore(result.scores.player2)}
          </Text>
          <Text className="text-primary-400 text-sm">
            {gameState.players.player2.matchedPairs} pairs
          </Text>
        </View>
      </View>
    </View>
  );
}
