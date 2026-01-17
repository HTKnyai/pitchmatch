import { View, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { useEffect, useState } from "react";
import { ANIMATION } from "../../constants/Config";

type TurnIndicatorProps = {
  currentPlayer: 1 | 2;
  previousPlayer: 1 | 2 | null;
  isTwoPlayer: boolean;
};

export function TurnIndicator({
  currentPlayer,
  previousPlayer,
  isTwoPlayer,
}: TurnIndicatorProps) {
  const [showNotification, setShowNotification] = useState(false);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    // Only show notification on turn change in 2-player mode
    if (
      isTwoPlayer &&
      previousPlayer !== null &&
      previousPlayer !== currentPlayer
    ) {
      setShowNotification(true);

      // Animate in
      opacity.value = withTiming(1, { duration: 200 });
      scale.value = withSequence(
        withTiming(1.1, { duration: 150, easing: Easing.out(Easing.back) }),
        withTiming(1, { duration: 100 })
      );

      // Animate out after delay
      const timeout = setTimeout(() => {
        opacity.value = withTiming(0, { duration: 200 });
        scale.value = withTiming(0.8, { duration: 200 });
        setTimeout(() => setShowNotification(false), 200);
      }, ANIMATION.turnNotificationDuration);

      return () => clearTimeout(timeout);
    }
  }, [currentPlayer, previousPlayer, isTwoPlayer, opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  if (!showNotification) return null;

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          position: "absolute",
          top: "40%",
          left: 0,
          right: 0,
          alignItems: "center",
          zIndex: 100,
        },
      ]}
    >
      <View className="bg-warm-blue px-8 py-4 rounded-2xl shadow-lg">
        <Text className="text-white text-2xl font-bold">
          Player {currentPlayer}'s Turn!
        </Text>
      </View>
    </Animated.View>
  );
}
