import { View, Text, Pressable, StyleSheet } from "react-native";
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
import { StatItem } from "./StatItem";
import { Heart, Coin } from "../icons";

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
    borderColor: "#9B7ED9",
  }));

  const bgStyle = useAnimatedStyle(() => ({
    backgroundColor: `rgba(232, 224, 240, ${bgOpacity.value * 0.8})`,
  }));

  return (
    <Animated.View
      style={[animatedStyle, bgStyle, styles.playerPanel]}
    >
      <Text
        style={[
          styles.playerLabel,
          isActive ? styles.playerLabelActive : styles.playerLabelInactive,
        ]}
      >
        Player {playerNumber}
      </Text>
      <Text
        style={[
          styles.playerScore,
          isActive ? styles.playerScoreActive : styles.playerScoreInactive,
        ]}
      >
        {formatScore(score)}
      </Text>
      {comboCount > 1 && isActive && (
        <View style={styles.comboBadge}>
          <Text style={styles.comboText}>{comboCount}x Combo</Text>
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

  // Calculate display values (visual only - not functional)
  const displayHearts = Math.max(0, 3 - (gameState.players.player1.mistakes || 0));
  const displayCoins = gameState.players.player1.score;
  const displayLevel = config.difficulty === "easy" ? 1 : config.difficulty === "normal" ? 2 : 3;

  return (
    <View style={styles.container}>
      {isTwoPlayer ? (
        // Two player header
        <View style={styles.twoPlayerContainer}>
          <PlayerPanel
            playerNumber={1}
            score={gameState.players.player1.score}
            comboCount={gameState.players.player1.comboCount}
            isActive={gameState.currentPlayer === 1}
          />

          <View style={styles.vsContainer}>
            <Text style={styles.vsText}>VS</Text>
            <Pressable onPress={onPause} style={styles.pauseButtonSmall}>
              <Text style={styles.pauseButtonText}>II</Text>
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
        // Single player header - New design
        <View style={styles.singlePlayerContainer}>
          {/* Status bar */}
          <View style={styles.statusBar}>
            <StatItem
              icon={<Heart size={18} color="#FF6B8A" />}
              value={displayHearts}
              color="#FF6B8A"
            />
            <StatItem
              icon={<Coin size={18} color="#FFD700" />}
              value={displayCoins}
              color="#B8860B"
            />
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>Lv.{displayLevel}</Text>
            </View>
            <View style={styles.scoreBadge}>
              <Text style={styles.scoreLabel}>SCORE</Text>
              <Text style={styles.scoreValue}>
                {formatScore(gameState.players.player1.score)}
              </Text>
            </View>
          </View>

          {/* Timer and info bar */}
          <View style={styles.timerBar}>
            <View style={styles.timerContainer}>
              <Text style={styles.timerLabel}>TIME</Text>
              <Text style={styles.timerValue}>{formatTime(elapsedTime)}</Text>
            </View>

            {gameState.players.player1.comboCount > 1 && (
              <View style={styles.comboBadgeSingle}>
                <Text style={styles.comboTextSingle}>
                  {gameState.players.player1.comboCount}x COMBO
                </Text>
              </View>
            )}

            <View style={styles.pairsContainer}>
              <Text style={styles.pairsLabel}>PAIRS</Text>
              <Text style={styles.pairsValue}>
                {gameState.matchedPairs}/{gameState.totalPairs}
              </Text>
            </View>

            <Pressable onPress={onPause} style={styles.pauseButton}>
              <Text style={styles.pauseButtonText}>II</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  // Two player styles
  twoPlayerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: 20,
    padding: 12,
  },
  playerPanel: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  playerLabel: {
    fontSize: 14,
  },
  playerLabelActive: {
    color: "#9B7ED9",
    fontWeight: "800",
  },
  playerLabelInactive: {
    color: "rgba(74, 74, 74, 0.4)",
    fontWeight: "400",
  },
  playerScore: {
    fontSize: 28,
    fontWeight: "bold",
  },
  playerScoreActive: {
    color: "#4A4A4A",
  },
  playerScoreInactive: {
    color: "rgba(74, 74, 74, 0.4)",
  },
  comboBadge: {
    backgroundColor: "#FF6B8A",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginTop: 4,
  },
  comboText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "bold",
  },
  vsContainer: {
    alignItems: "center",
    paddingHorizontal: 8,
  },
  vsText: {
    color: "rgba(74, 74, 74, 0.6)",
    fontSize: 12,
  },
  pauseButtonSmall: {
    marginTop: 4,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: "#9B7ED9",
    borderRadius: 8,
  },
  // Single player styles
  singlePlayerContainer: {
    gap: 8,
  },
  statusBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  levelBadge: {
    backgroundColor: "#9B7ED9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  levelText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  scoreBadge: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 8,
  },
  scoreLabel: {
    fontSize: 11,
    color: "rgba(74, 74, 74, 0.6)",
    fontWeight: "bold",
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#9B7ED9",
  },
  timerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  timerLabel: {
    fontSize: 11,
    color: "rgba(74, 74, 74, 0.6)",
    fontWeight: "bold",
  },
  timerValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4A4A4A",
  },
  comboBadgeSingle: {
    backgroundColor: "#FF6B8A",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  comboTextSingle: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  pairsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  pairsLabel: {
    fontSize: 11,
    color: "rgba(74, 74, 74, 0.6)",
    fontWeight: "bold",
  },
  pairsValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4A4A4A",
  },
  pauseButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#9B7ED9",
    borderRadius: 12,
  },
  pauseButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
});
