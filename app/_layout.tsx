import "react-native-get-random-values"; // polyfill for uuid (crypto.getRandomValues)
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { GameProvider } from "../lib/context/GameContext";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GameProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#0c4a6e" },
            animation: "slide_from_right",
          }}
        />
      </GameProvider>
    </GestureHandlerRootView>
  );
}
