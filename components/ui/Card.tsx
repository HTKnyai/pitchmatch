import { Pressable, Text, View, StyleSheet, Image } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { useEffect } from "react";
import type { Card as CardType } from "../../lib/types/game.types";
import { formatCard } from "../../utils/format";
import type { Notation } from "../../lib/types/game.types";
import { ANIMATION } from "../../constants/Config";

// Card icon image (treble clef from title image)
const cardIconImage = require("../../assets/images/melodymemory_title.jpeg");

type GameCardProps = {
  card: CardType;
  cardIndex: number;
  notation: Notation;
  showOctave: boolean;
  isBlindMode: boolean;
  onPress: () => void;
  disabled?: boolean;
};

// Pastel card background colors
const CARD_COLORS = [
  { bg: "#FFD6E0", border: "#FFB8C8" }, // Pink
  { bg: "#E0D4F5", border: "#C9B8E8" }, // Purple
  { bg: "#D4F5E9", border: "#B8E8D4" }, // Mint
  { bg: "#FFF8E7", border: "#F5E8C4" }, // Cream
];

export function GameCard({
  card,
  cardIndex,
  notation,
  showOctave,
  isBlindMode,
  onPress,
  disabled = false,
}: GameCardProps) {
  const rotation = useSharedValue(0);

  // Get color based on card index
  const colorSet = CARD_COLORS[cardIndex % CARD_COLORS.length];

  useEffect(() => {
    rotation.value = withTiming(card.isFlipped || card.isMatched ? 180 : 0, {
      duration: ANIMATION.flipDuration,
    });
  }, [card.isFlipped, card.isMatched]);

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(
      rotation.value,
      [0, 180],
      [0, 180],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      backfaceVisibility: "hidden",
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(
      rotation.value,
      [0, 180],
      [180, 360],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      backfaceVisibility: "hidden",
    };
  });

  const showContent = card.isFlipped || card.isMatched;
  const displayText = showContent
    ? formatCard(card, notation, showOctave)
    : "?";

  // In blind mode, only show content after match
  const blindModeDisplay = isBlindMode && !card.isMatched ? "?" : displayText;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || card.isMatched}
      style={styles.pressable}
    >
      <View style={styles.cardContainer}>
        {/* Front of card (hidden when flipped) */}
        <Animated.View
          style={[
            frontAnimatedStyle,
            styles.cardFace,
            {
              backgroundColor: colorSet.bg,
              borderColor: colorSet.border,
              shadowColor: "#9B7ED9",
            },
          ]}
        >
          <View style={styles.iconContainer}>
            <Image
              source={cardIconImage}
              style={styles.cardIcon}
              resizeMode="cover"
            />
          </View>
        </Animated.View>

        {/* Back of card (shown when flipped) */}
        <Animated.View
          style={[
            backAnimatedStyle,
            styles.cardFace,
            card.isMatched
              ? styles.cardMatched
              : styles.cardFlipped,
            {
              shadowColor: card.isMatched ? "#9B7ED9" : "#9B7ED9",
            },
          ]}
        >
          <Text
            style={[
              styles.cardText,
              card.isMatched ? styles.cardTextMatched : styles.cardTextFlipped,
            ]}
            numberOfLines={2}
            adjustsFontSizeToFit
          >
            {isBlindMode ? blindModeDisplay : displayText}
          </Text>
        </Animated.View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: "100%",
    aspectRatio: 3 / 4,
  },
  cardContainer: {
    position: "relative",
    width: "100%",
    height: "100%",
  },
  cardFace: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  cardFlipped: {
    backgroundColor: "#FFFFFF",
    borderColor: "rgba(74, 74, 74, 0.1)",
  },
  cardMatched: {
    backgroundColor: "#9B7ED9",
    borderColor: "#9B7ED9",
  },
  cardText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    paddingHorizontal: 8,
  },
  cardTextFlipped: {
    color: "#9B7ED9",
  },
  cardTextMatched: {
    color: "#FFFFFF",
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  cardIcon: {
    width: 80,
    height: 80,
  },
});
