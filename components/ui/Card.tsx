import { Pressable, Text, View } from "react-native";
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

type GameCardProps = {
  card: CardType;
  notation: Notation;
  showOctave: boolean;
  isBlindMode: boolean;
  onPress: () => void;
  disabled?: boolean;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function GameCard({
  card,
  notation,
  showOctave,
  isBlindMode,
  onPress,
  disabled = false,
}: GameCardProps) {
  const rotation = useSharedValue(0);

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
      className="w-full aspect-[3/4]"
    >
      <View className="relative w-full h-full">
        {/* Front of card (hidden when flipped) */}
        <Animated.View
          style={[
            frontAnimatedStyle,
            {
              shadowColor: "#9CB5A2",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 4,
              elevation: 3,
            },
          ]}
          className="absolute inset-0 items-center justify-center rounded-2xl bg-warm-peach border-2 border-soft-charcoal/10"
        >
          <View className="w-10 h-10 items-center justify-center rounded-full bg-soft-charcoal/10">
            <Text className="text-2xl">🎵</Text>
          </View>
        </Animated.View>

        {/* Back of card (shown when flipped) */}
        <Animated.View
          style={[
            backAnimatedStyle,
            {
              shadowColor: card.isMatched ? "#9CB5A2" : "#7DA7C9",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 4,
              elevation: 3,
            },
          ]}
          className={`
            absolute inset-0
            items-center justify-center
            rounded-2xl
            border-2
            ${card.isMatched ? "bg-warm-sage border-warm-sage" : "bg-white border-soft-charcoal/10"}
          `}
        >
          <Text
            className={`
              text-xl font-bold text-center px-1
              ${card.isMatched ? "text-white" : "text-warm-blue"}
            `}
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
