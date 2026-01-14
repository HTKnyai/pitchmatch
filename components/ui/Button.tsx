import { Pressable, Text, View } from "react-native";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  fullWidth?: boolean;
};

const variantStyles: Record<ButtonVariant, { container: string; text: string }> = {
  primary: {
    container: "bg-primary-500 active:bg-primary-600",
    text: "text-white",
  },
  secondary: {
    container: "bg-primary-100 active:bg-primary-200",
    text: "text-primary-700",
  },
  outline: {
    container: "bg-transparent border-2 border-primary-500 active:bg-primary-50",
    text: "text-primary-500",
  },
  ghost: {
    container: "bg-transparent active:bg-primary-50",
    text: "text-primary-500",
  },
};

const sizeStyles: Record<ButtonSize, { container: string; text: string }> = {
  sm: {
    container: "px-4 py-2 rounded-lg",
    text: "text-sm",
  },
  md: {
    container: "px-6 py-3 rounded-xl",
    text: "text-base",
  },
  lg: {
    container: "px-8 py-4 rounded-2xl",
    text: "text-lg",
  },
};

export function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  fullWidth = false,
}: ButtonProps) {
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`
        items-center justify-center
        ${variantStyle.container}
        ${sizeStyle.container}
        ${fullWidth ? "w-full" : ""}
        ${disabled ? "opacity-50" : ""}
      `}
    >
      <Text
        className={`
          font-bold
          ${variantStyle.text}
          ${sizeStyle.text}
        `}
      >
        {title}
      </Text>
    </Pressable>
  );
}
