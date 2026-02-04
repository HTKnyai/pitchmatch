import { View, Text, Modal, Pressable, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useEffect } from "react";
import { useAudio } from "../../lib/hooks/useAudio";

type PauseMenuProps = {
  visible: boolean;
  onResume: () => void;
  onQuit: () => void;
};

type GradientButtonProps = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
};

function GradientButton({ title, onPress, variant = "primary" }: GradientButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        pressed && styles.buttonPressed,
      ]}
    >
      <LinearGradient
        colors={isPrimary ? ["#C4B5E0", "#9B7ED9", "#C4B5E0"] : ["#E8E0F0", "#D5C8E8", "#E8E0F0"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBorder}
      >
        <View style={[styles.buttonInner, !isPrimary && styles.buttonInnerSecondary]}>
          <Text style={[styles.buttonText, !isPrimary && styles.buttonTextSecondary]}>
            {title}
          </Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

export function PauseMenu({ visible, onResume, onQuit }: PauseMenuProps) {
  const { getVolume, setVolume } = useAudio();
  const [volume, setVolumeState] = useState(0.7);

  useEffect(() => {
    if (visible) {
      setVolumeState(getVolume());
    }
  }, [visible, getVolume]);

  const handleVolumeChange = (value: number) => {
    setVolumeState(value);
  };

  const handleVolumeChangeComplete = async (value: number) => {
    await setVolume(value);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>PAUSE</Text>

          <View style={styles.content}>
            {/* Volume Control */}
            <View style={styles.volumeContainer}>
              <View style={styles.volumeHeader}>
                <Text style={styles.volumeLabel}>音量</Text>
                <Text style={styles.volumeValue}>{Math.round(volume * 100)}%</Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={1}
                value={volume}
                onValueChange={handleVolumeChange}
                onSlidingComplete={handleVolumeChangeComplete}
                minimumTrackTintColor="#9B7ED9"
                maximumTrackTintColor="#E8E0F0"
                thumbTintColor="#9B7ED9"
              />
            </View>

            <View style={styles.buttonContainer}>
              <GradientButton
                title="Resume"
                onPress={onResume}
                variant="primary"
              />
              <GradientButton
                title="Quit to Title"
                onPress={onQuit}
                variant="secondary"
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  container: {
    backgroundColor: "#FFF8F0",
    borderRadius: 24,
    padding: 32,
    marginHorizontal: 32,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(74, 74, 74, 0.1)",
    shadowColor: "#4A4A4A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  title: {
    color: "#4A4A4A",
    fontSize: 28,
    fontFamily: "Nunito_800ExtraBold",
    marginBottom: 24,
    letterSpacing: 2,
  },
  content: {
    width: "100%",
    gap: 16,
  },
  volumeContainer: {
    width: "100%",
    marginBottom: 8,
    minWidth: 250,
  },
  volumeHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  volumeLabel: {
    color: "#4A4A4A",
    fontSize: 16,
    fontFamily: "Nunito_600SemiBold",
  },
  volumeValue: {
    color: "#4A4A4A",
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
  },
  slider: {
    width: 250,
    height: 40,
  },
  buttonContainer: {
    gap: 12,
    width: "100%",
  },
  gradientBorder: {
    borderRadius: 9999,
    padding: 4,
    width: "100%",
  },
  buttonInner: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 9999,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonInnerSecondary: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  buttonText: {
    color: "#9B7ED9",
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
  },
  buttonTextSecondary: {
    color: "#9B7ED9",
  },
  buttonPressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.9,
  },
});
