import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, ViewStyle } from "react-native";
import { ReactNode } from "react";

type GradientVariant = "title" | "game" | "result" | "customize";

type GradientBackgroundProps = {
  variant: GradientVariant;
  style?: ViewStyle;
  children: ReactNode;
};

const gradientConfigs: Record<
  GradientVariant,
  {
    colors: readonly [string, string, ...string[]];
    start: { x: number; y: number };
    end: { x: number; y: number };
  }
> = {
  title: {
    colors: ["#FFE5EC", "#FFF8F0", "#E8E4F5"],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  game: {
    colors: ["#F5F0FA", "#E8E0F0", "#D5C8E8"],
    start: { x: 0.5, y: 0 },
    end: { x: 0.5, y: 1 },
  },
  result: {
    colors: ["#FFF8F0", "#F5F0FA", "#E8E0F0"],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  customize: {
    colors: ["#F5F0FA", "#FFE5EC", "#FFF8F0"],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
};

export function GradientBackground({
  variant,
  style,
  children,
}: GradientBackgroundProps) {
  const config = gradientConfigs[variant];

  return (
    <LinearGradient
      colors={config.colors}
      start={config.start}
      end={config.end}
      style={[styles.gradient, style]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});
