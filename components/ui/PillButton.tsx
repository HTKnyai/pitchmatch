import { Pressable, Text, View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type PillButtonProps = {
  label: string;
  sublabel?: string;
  onPress: () => void;
  variant?: "filled" | "outlined";
  disabled?: boolean;
  icon?: React.ReactNode;
  wide?: boolean;
};

export function PillButton({
  label,
  sublabel,
  onPress,
  variant = "filled",
  disabled = false,
  icon,
  wide = false,
}: PillButtonProps) {
  const isFilled = variant === "filled";

  // For filled variant, use gradient border with inner content
  if (isFilled) {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={({ pressed }) => [
          pressed && styles.pressed,
          disabled && styles.disabled,
        ]}
      >
        <LinearGradient
          colors={["#7EC8E3", "#5B9BD5", "#7EC8E3"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradientBorder, wide && styles.wideButton]}
        >
          <View style={styles.innerContent}>
            <View style={styles.content}>
              {icon && <View style={styles.icon}>{icon}</View>}
              <View style={styles.textContainer}>
                <Text
                  style={[styles.label, styles.labelFilled]}
                  numberOfLines={1}
                >
                  {label}
                </Text>
                {sublabel && (
                  <Text
                    style={[styles.sublabel, styles.sublabelFilled]}
                    numberOfLines={1}
                  >
                    {sublabel}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </LinearGradient>
      </Pressable>
    );
  }

  // Outlined variant (for Rankings button)
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        styles.outlined,
        wide && styles.wideButton,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <View style={styles.content}>
        {icon && <View style={styles.icon}>{icon}</View>}
        <View style={styles.textContainer}>
          <Text
            style={[styles.label, styles.labelOutlined]}
            numberOfLines={1}
          >
            {label}
          </Text>
          {sublabel && (
            <Text
              style={[styles.sublabel, styles.sublabelOutlined]}
              numberOfLines={1}
            >
              {sublabel}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 9999,
    minWidth: 160,
    shadowColor: "#9B7ED9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  gradientBorder: {
    borderRadius: 9999,
    padding: 4,
    minWidth: 160,
    shadowColor: "#5B9BD5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  innerContent: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 9999,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  wideButton: {
    minWidth: 200,
  },
  outlined: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderWidth: 2,
    borderColor: "#C4B5E0",
    minWidth: 200,
  },
  pressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.9,
  },
  disabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginRight: 12,
  },
  textContainer: {
    flexShrink: 0,
  },
  label: {
    fontSize: 18,
    fontFamily: "Nunito_700Bold",
  },
  labelFilled: {
    color: "#4A7BA7",
  },
  labelOutlined: {
    color: "#9B7ED9",
    fontFamily: "Nunito_700Bold",
  },
  sublabel: {
    fontSize: 11,
    marginTop: 2,
    textTransform: "uppercase",
    letterSpacing: 1,
    fontFamily: "Nunito_600SemiBold",
  },
  sublabelFilled: {
    color: "rgba(74, 123, 167, 0.7)",
  },
  sublabelOutlined: {
    color: "#C4B5E0",
    fontFamily: "Nunito_600SemiBold",
  },
});
