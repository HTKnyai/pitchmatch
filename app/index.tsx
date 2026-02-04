import { View, Text, Pressable, StyleSheet, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useGame } from "../lib/context/GameContext";
import { PillButton } from "../components/ui/PillButton";
import { Settings } from "../components/icons";

const backgroundImage = require("../assets/images/melodymemory_title.jpeg");

export default function TitleScreen() {
  const router = useRouter();
  const { setConfig, state } = useGame();

  const handleSinglePlayer = () => {
    setConfig({ ...state.config, playerCount: 1 });
    router.push("/customize");
  };

  const handleTwoPlayer = () => {
    setConfig({ ...state.config, playerCount: 2 });
    router.push("/customize");
  };

  const handleRanking = () => {
    router.push("/ranking");
  };

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.background}
      resizeMode="cover"
    >
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
              label="1 Player"
              sublabel="Score Attack"
              onPress={handleSinglePlayer}
              variant="filled"
            />
            <PillButton
              label="2 Players"
              sublabel="Battle Mode"
              onPress={handleTwoPlayer}
              variant="filled"
            />
          </View>
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
    fontWeight: "bold",
  },
  footerDot: {
    fontSize: 11,
    color: "rgba(74, 74, 74, 0.6)",
    marginTop: 4,
  },
});
