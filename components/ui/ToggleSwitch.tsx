import { Pressable, Text, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useEffect } from "react";

type ToggleSwitchProps = {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  description?: string;
};

export function ToggleSwitch({
  label,
  value,
  onValueChange,
  description,
}: ToggleSwitchProps) {
  const translateX = useSharedValue(value ? 20 : 0);

  useEffect(() => {
    translateX.value = withSpring(value ? 20 : 0, {
      damping: 15,
      stiffness: 200,
    });
  }, [value]);

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      className="flex-row items-center justify-between py-3"
    >
      <View className="flex-1 mr-4">
        <Text className="text-white text-base font-medium">{label}</Text>
        {description && (
          <Text className="text-primary-200 text-sm mt-1">{description}</Text>
        )}
      </View>
      <View
        className={`
          w-12 h-7 rounded-full p-1
          ${value ? "bg-primary-400" : "bg-gray-500"}
        `}
      >
        <Animated.View
          style={thumbStyle}
          className="w-5 h-5 rounded-full bg-white shadow"
        />
      </View>
    </Pressable>
  );
}
