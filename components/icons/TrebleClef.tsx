import Svg, { Path } from "react-native-svg";

type TrebleClefProps = {
  size?: number;
  color?: string;
};

export function TrebleClef({ size = 100, color = "#4A4A4A" }: TrebleClefProps) {
  // Aspect ratio is approximately 1:2.5 (width:height)
  const width = size;
  const height = size * 2.5;

  return (
    <Svg width={width} height={height} viewBox="0 0 40 100" fill="none">
      <Path
        d="M20.5 98C20.5 98 12 92 12 84C12 76 18 72 20 72C22 72 28 74 28 82C28 90 20.5 98 20.5 98Z"
        fill={color}
      />
      <Path
        d="M19 72V8C19 8 19 2 24 2C29 2 32 8 32 14C32 20 28 28 20 36C12 44 8 54 8 62C8 70 12 76 18 78"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M20 36C20 36 26 30 30 24C34 18 34 12 30 8"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M8 50C8 50 14 46 22 46C30 46 34 50 34 56C34 62 30 68 22 70"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}
