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
          style={frontAnimatedStyle}
          className={`
            absolute inset-0
            items-center justify-center
            rounded-xl
            bg-primary-600
            border-2 border-primary-400
            shadow-lg
          `}
        >
          <Text className="text-4xl text-primary-200">?</Text>
        </Animated.View>

        {/* Back of card (shown when flipped) */}
        <Animated.View
          style={backAnimatedStyle}
          className={`
            absolute inset-0
            items-center justify-center
            rounded-xl
            shadow-lg
            ${card.isMatched ? "bg-green-500 border-green-400" : "bg-white border-gray-200"}
            border-2
          `}
        >
          <Text
            className={`
              text-xl font-bold text-center px-1
              ${card.isMatched ? "text-white" : "text-gray-800"}
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
