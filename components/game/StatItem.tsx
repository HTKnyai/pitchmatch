import { View, Text, StyleSheet } from "react-native";
import { ReactNode } from "react";

type StatItemProps = {
  icon: ReactNode;
  value: number | string;
  color?: string;
};

export function StatItem({ icon, value, color = "#4A4A4A" }: StatItemProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>{icon}</View>
      <Text style={[styles.value, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  iconContainer: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
