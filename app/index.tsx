import { View, Text, Pressable, StyleSheet, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useGame } from "../lib/context/GameContext";
import { PillButton } from "../components/ui/PillButton";
import { GradientBackground } from "../components/ui/GradientBackground";
import { Settings } from "../components/icons";

const backgroundImage = require("../assets/images/melodymemory_title.jpeg");

export default function TitleScreen() {
  const router = useRouter();
  const { setConfig, state } = useGame();
  const [imageError, setImageError] = useState(false);
  const [showPlayerPicker, setShowPlayerPicker] = useState(false);

  const handleSinglePlayer = () => {
    setConfig({ ...state.config, playerCount: 1 });
    router.push("/customize");
  };

  const handleMultiPlayer = () => {
    setShowPlayerPicker(true);
  };

  const handleSelectPlayerCount = (count: 2 | 3 | 4) => {
    setConfig({ ...state.config, playerCount: count });
    router.push("/customize");
  };

  const handleRanking = () => {
    router.push("/ranking");
  };

  const content = (
    <SafeAreaView style={styles.container}>
      {/* Settings button */}
      <View style={styles.settingsContainer}>
        <Pressable
          style={styles.settingsButton}
          onPress={() => {
            // Settings functionality can be added later
          }}
        >
          <Settings size={24} color="#9B7ED9" />
        </Pressable>
      </View>

      {/* Spacer to push buttons to bottom */}
      <View style={styles.spacer} />

      {/* Menu buttons */}
      <View style={styles.buttonContainer}>
        <View style={styles.buttonRow}>
          <PillButton
            label="ひとりで"
            sublabel="スコアアタック"
            onPress={handleSinglePlayer}
            variant="filled"
          />
          <PillButton
            label="みんなで"
            sublabel="バトル"
            onPress={handleMultiPlayer}
            variant="filled"
          />
        </View>

        {showPlayerPicker && (
          <View style={styles.playerPickerContainer}>
            <Text style={styles.playerPickerLabel}>人数を選択</Text>
            <View style={styles.playerPickerRow}>
              {([2, 3, 4] as const).map((count) => (
                <Pressable
                  key={count}
                  style={styles.playerCountButton}
                  onPress={() => handleSelectPlayerCount(count)}
                >
                  <Text style={styles.playerCountText}>{count}人</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        <View style={styles.buttonRow}>
          <PillButton
            label="Rankings"
            onPress={handleRanking}
            variant="outlined"
          />
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Crafted for musicians</Text>
        <Text style={styles.footerDot}>v 1.0.0</Text>
      </View>
    </SafeAreaView>
  );

  // Fallback to gradient background if image fails to load
  if (imageError) {
    return (
      <GradientBackground variant="title" style={styles.background}>
        {content}
      </GradientBackground>
    );
  }

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.background}
      resizeMode="cover"
      onError={() => setImageError(true)}
    >
      {content}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  settingsContainer: {
    position: "absolute",
    top: 60,
    right: 24,
    zIndex: 10,
  },
  settingsButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#9B7ED9",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  spacer: {
    flex: 1,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: 24,
    gap: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 11,
    color: "rgba(74, 74, 74, 0.6)",
    textTransform: "uppercase",
    letterSpacing: 2,
    fontFamily: "Nunito_600SemiBold",
  },
  footerDot: {
    fontSize: 11,
    color: "rgba(74, 74, 74, 0.6)",
    marginTop: 4,
    fontFamily: "Nunito_400Regular",
  },
  playerPickerContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    gap: 12,
  },
  playerPickerLabel: {
    fontSize: 13,
    color: "rgba(74, 74, 74, 0.7)",
    fontFamily: "Nunito_600SemiBold",
    letterSpacing: 1,
  },
  playerPickerRow: {
    flexDirection: "row",
    gap: 12,
  },
  playerCountButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "#9B7ED9",
    borderRadius: 16,
    alignItems: "center",
  },
  playerCountText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
  },
});
