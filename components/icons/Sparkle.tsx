import Svg, { Circle } from "react-native-svg";

type SparkleProps = {
  size?: number;
  color?: string;
};

export function Sparkle({ size = 8, color = "#9B7ED9" }: SparkleProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 8 8" fill="none">
      <Circle cx="4" cy="4" r="4" fill={color} fillOpacity={0.6} />
      <Circle cx="4" cy="4" r="2" fill={color} />
    </Svg>
  );
}
