import { Pressable, Text, View, StyleSheet, Image } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { useEffect, useState } from "react";
import type { Card as CardType } from "../../lib/types/game.types";
import { formatCard } from "../../utils/format";
import type { Notation } from "../../lib/types/game.types";
import { ANIMATION } from "../../constants/Config";
import { Sparkle } from "../icons";

// Card icon image (treble clef logo)
const cardIconImage = require("../../assets/images/cref_logo.png");

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

// L-shaped corner decoration component
function CornerDecoration({ position }: { position: "topLeft" | "topRight" | "bottomLeft" | "bottomRight" }) {
  const isTop = position.includes("top");
  const isLeft = position.includes("Left");

  return (
    <View
      style={[
        styles.cornerContainer,
        {
          top: isTop ? 6 : undefined,
          bottom: !isTop ? 6 : undefined,
          left: isLeft ? 6 : undefined,
          right: !isLeft ? 6 : undefined,
        },
      ]}
    >
      {/* Horizontal line */}
      <View
        style={[
          styles.cornerLineHorizontal,
          {
            top: isTop ? 0 : undefined,
            bottom: !isTop ? 0 : undefined,
            left: isLeft ? 0 : undefined,
            right: !isLeft ? 0 : undefined,
          },
        ]}
      />
      {/* Vertical line */}
      <View
        style={[
          styles.cornerLineVertical,
          {
            top: isTop ? 0 : undefined,
            bottom: !isTop ? 0 : undefined,
            left: isLeft ? 0 : undefined,
            right: !isLeft ? 0 : undefined,
          },
        ]}
      />
    </View>
  );
}

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
  const [imageError, setImageError] = useState(false);

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
            styles.cardFront,
            {
              backgroundColor: colorSet.bg,
              shadowColor: "#9B7ED9",
            },
          ]}
        >
          {/* White border overlay */}
          <View style={styles.whiteBorderOverlay}>
            {/* L-shaped corner decorations */}
            <CornerDecoration position="topLeft" />
            <CornerDecoration position="topRight" />
            <CornerDecoration position="bottomLeft" />
            <CornerDecoration position="bottomRight" />

            {/* Card image - now card-shaped instead of circular */}
            <View style={styles.iconContainer}>
              {imageError ? (
                <Sparkle size={40} color={colorSet.border} />
              ) : (
                <Image
                  source={cardIconImage}
                  style={styles.cardIcon}
                  resizeMode="cover"
                  onError={() => setImageError(true)}
                />
              )}
            </View>
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
          {/* White border overlay for flipped card */}
          <View style={[styles.whiteBorderOverlay, card.isMatched && styles.matchedBorderOverlay]}>
            <CornerDecoration position="topLeft" />
            <CornerDecoration position="topRight" />
            <CornerDecoration position="bottomLeft" />
            <CornerDecoration position="bottomRight" />

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
          </View>
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  cardFront: {
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  cardFlipped: {
    backgroundColor: "#FFFFFF",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  cardMatched: {
    backgroundColor: "#9B7ED9",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  whiteBorderOverlay: {
    position: "absolute",
    top: 4,
    left: 4,
    right: 4,
    bottom: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  matchedBorderOverlay: {
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  cornerContainer: {
    position: "absolute",
    width: 12,
    height: 12,
  },
  cornerLineHorizontal: {
    position: "absolute",
    width: 12,
    height: 2,
    backgroundColor: "rgba(155, 126, 217, 0.5)",
    borderRadius: 1,
  },
  cornerLineVertical: {
    position: "absolute",
    width: 2,
    height: 12,
    backgroundColor: "rgba(155, 126, 217, 0.5)",
    borderRadius: 1,
  },
  cardText: {
    fontSize: 20,
    fontFamily: "Nunito_700Bold",
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
    position: "absolute",
    top: 4,
    left: 4,
    right: 4,
    bottom: 4,
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  cardIcon: {
    width: "50%",
    height: "65%",
  },
});
