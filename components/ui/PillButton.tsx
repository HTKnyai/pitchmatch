import { Pressable, Text, View, StyleSheet } from "react-native";

type PillButtonProps = {
  label: string;
  sublabel?: string;
  onPress: () => void;
  variant?: "filled" | "outlined";
  disabled?: boolean;
  icon?: React.ReactNode;
};

export function PillButton({
  label,
  sublabel,
  onPress,
  variant = "filled",
  disabled = false,
  icon,
}: PillButtonProps) {
  const isFilled = variant === "filled";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        isFilled ? styles.filled : styles.outlined,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <View style={styles.content}>
        {icon && <View style={styles.icon}>{icon}</View>}
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.label,
              isFilled ? styles.labelFilled : styles.labelOutlined,
            ]}
          >
            {label}
          </Text>
          {sublabel && (
            <Text
              style={[
                styles.sublabel,
                isFilled ? styles.sublabelFilled : styles.sublabelOutlined,
              ]}
            >
              {sublabel}
            </Text>
          )}
        </View>
        <Text
          style={[
            styles.arrow,
            isFilled ? styles.arrowFilled : styles.arrowOutlined,
          ]}
        >
          {">"}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 9999,
    minWidth: 140,
    shadowColor: "#9B7ED9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  filled: {
    backgroundColor: "#9B7ED9",
  },
  outlined: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderWidth: 2,
    borderColor: "#C4B5E0",
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
    justifyContent: "space-between",
  },
  icon: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
  },
  labelFilled: {
    color: "#FFFFFF",
  },
  labelOutlined: {
    color: "#9B7ED9",
  },
  sublabel: {
    fontSize: 11,
    marginTop: 2,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  sublabelFilled: {
    color: "rgba(255, 255, 255, 0.8)",
  },
  sublabelOutlined: {
    color: "#C4B5E0",
  },
  arrow: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 8,
  },
  arrowFilled: {
    color: "rgba(255, 255, 255, 0.6)",
  },
  arrowOutlined: {
    color: "#C4B5E0",
  },
});
