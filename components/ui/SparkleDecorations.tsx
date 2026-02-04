import { View, StyleSheet } from "react-native";
import { Sparkle } from "../icons";

type SparklePosition = {
  top?: number | string;
  bottom?: number | string;
  left?: number | string;
  right?: number | string;
  size: number;
  color?: string;
  opacity?: number;
};

const sparklePositions: SparklePosition[] = [
  { top: "15%", left: "20%", size: 6, opacity: 0.4 },
  { top: "12%", right: "25%", size: 8, opacity: 0.6 },
  { top: "25%", left: "15%", size: 4, opacity: 0.3 },
  { top: "20%", right: "18%", size: 10, opacity: 0.5 },
  { top: "35%", left: "25%", size: 5, opacity: 0.4 },
  { top: "30%", right: "22%", size: 7, opacity: 0.5 },
  { top: "45%", left: "12%", size: 6, opacity: 0.3 },
  { top: "42%", right: "15%", size: 4, opacity: 0.4 },
  { top: "55%", left: "22%", size: 8, opacity: 0.5 },
  { top: "50%", right: "28%", size: 5, opacity: 0.3 },
];

export function SparkleDecorations() {
  return (
    <View style={styles.container} pointerEvents="none">
      {sparklePositions.map((pos, index) => (
        <View
          key={index}
          style={[
            styles.sparkle,
            {
              top: pos.top,
              bottom: pos.bottom,
              left: pos.left,
              right: pos.right,
              opacity: pos.opacity ?? 0.5,
            },
          ]}
        >
          <Sparkle size={pos.size} color={pos.color ?? "#9B7ED9"} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  sparkle: {
    position: "absolute",
  },
});
