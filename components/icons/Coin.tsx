import Svg, { Circle, Path, G } from "react-native-svg";

type CoinProps = {
  size?: number;
  color?: string;
};

export function Coin({ size = 24, color = "#FFD700" }: CoinProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" fill={color} />
      <Circle cx="12" cy="12" r="8" fill="#FFF8DC" fillOpacity={0.3} />
      <Circle cx="12" cy="12" r="7" stroke={color} strokeWidth="1.5" fill="none" />
      <G>
        <Path
          d="M12 7V17"
          stroke="#B8860B"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <Path
          d="M9 9.5C9 9.5 9.5 8 12 8C14.5 8 15 9.5 15 10C15 11 14 11.5 12 12C10 12.5 9 13 9 14C9 15 10 16 12 16C14 16 15 14.5 15 14.5"
          stroke="#B8860B"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
      </G>
    </Svg>
  );
}
