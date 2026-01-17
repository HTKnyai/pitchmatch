import { View, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  withDelay,
} from "react-native-reanimated";
import { useEffect } from "react";
import { ANIMATION } from "../../constants/Config";

type ScorePopupProps = {
  points: number;
  comboCount: number;
  multiplier: number;
};

export function ScorePopup({
  points,
  comboCount,
  multiplier,
}: ScorePopupProps) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);
  const translateY = useSharedValue(0);

  useEffect(() => {
    // Animate in
    opacity.value = withTiming(1, { duration: 150 });
    scale.value = withSequence(
      withSpring(1.2, { damping: 8 }),
      withSpring(1, { damping: 10 })
    );

    // Float up and fade out
    translateY.value = withDelay(
      ANIMATION.scorePopupDuration - 300,
      withTiming(-30, { duration: 300 })
    );
    opacity.value = withDelay(
      ANIMATION.scorePopupDuration - 200,
      withTiming(0, { duration: 200 })
    );
  }, [opacity, scale, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  const hasCombo = comboCount > 1;

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          position: "absolute",
          top: "45%",
          left: 0,
          right: 0,
          alignItems: "center",
          zIndex: 50,
        },
      ]}
    >
      <View
        className={`px-6 py-3 rounded-2xl ${hasCombo ? "bg-warm-coral" : "bg-warm-sage"}`}
      >
        <Text className="text-white text-3xl font-bold text-center">
          +{points}
        </Text>
        {hasCombo && (
          <Text className="text-white text-sm font-bold text-center mt-1">
            {comboCount}x COMBO! ({multiplier.toFixed(1)}x)
          </Text>
        )}
      </View>
    </Animated.View>
  );
}
