import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useGame } from "../lib/context/GameContext";

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
    <SafeAreaView className="flex-1 bg-cream">
      {/* Decorative organic shapes */}
      <View className="absolute inset-0 pointer-events-none opacity-40">
        <View className="absolute -top-10 -left-10 w-48 h-48 bg-soft-blue rounded-full"
          style={{ borderRadius: 999 }} />
        <View className="absolute top-1/2 -right-10 w-60 h-60 bg-sage-green rounded-full"
          style={{ borderRadius: 999 }} />
        <View className="absolute bottom-20 left-10 w-32 h-32 bg-pastel-yellow rounded-full opacity-50"
          style={{ borderRadius: 999 }} />
      </View>

      <View className="flex-1 items-center justify-between px-8 py-6">
        {/* Settings button */}
        <View className="w-full items-end">
          <Pressable className="w-12 h-12 items-center justify-center rounded-full bg-white/50 border border-soft-charcoal/5">
            <Text className="text-soft-charcoal/60 text-xl">⚙️</Text>
          </Pressable>
        </View>

        {/* Logo and Title - Center */}
        <View className="items-center flex-1 justify-center">
          <View className="items-center mb-12">
            <View className="w-40 h-40 items-center justify-center mb-8">
              <Text className="text-7xl">🎵</Text>
            </View>
            <Text className="text-soft-charcoal text-4xl font-bold text-center tracking-tight">
              Melody Memory
            </Text>
            <Text className="text-soft-charcoal/60 text-sm mt-3 px-8 text-center">
              Perfect your pitch through playful recognition.
            </Text>
          </View>

          {/* Menu buttons */}
          <View className="w-full max-w-xs gap-5">
            <Pressable
              onPress={handleSinglePlayer}
              className="flex-row items-center justify-between px-8 py-5 bg-warm-blue rounded-3xl active:scale-95"
              style={{
                shadowColor: "#7DA7C9",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 10,
                elevation: 5,
              }}
            >
              <View className="flex-row items-center gap-4">
                <Text className="text-white/90 text-2xl">👤</Text>
                <View>
                  <Text className="text-white font-bold text-lg">1 Player</Text>
                  <Text className="text-white/80 text-xs uppercase tracking-wider mt-0.5">
                    Score Attack
                  </Text>
                </View>
              </View>
              <Text className="text-white/60">›</Text>
            </Pressable>

            <Pressable
              onPress={handleTwoPlayer}
              className="flex-row items-center justify-between px-8 py-5 bg-warm-sage rounded-3xl active:scale-95"
              style={{
                shadowColor: "#9CB5A2",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 10,
                elevation: 5,
              }}
            >
              <View className="flex-row items-center gap-4">
                <Text className="text-white/90 text-2xl">👥</Text>
                <View>
                  <Text className="text-white font-bold text-lg">2 Players</Text>
                  <Text className="text-white/80 text-xs uppercase tracking-wider mt-0.5">
                    Battle Mode
                  </Text>
                </View>
              </View>
              <Text className="text-white/60">›</Text>
            </Pressable>

            <Pressable
              onPress={handleRanking}
              className="flex-row items-center justify-between px-8 py-5 bg-white border border-soft-charcoal/10 rounded-3xl active:scale-95"
            >
              <View className="flex-row items-center gap-4">
                <Text className="text-warm-blue text-2xl">📊</Text>
                <Text className="text-soft-charcoal font-bold text-lg">Rankings</Text>
              </View>
              <Text className="text-soft-charcoal/30">›</Text>
            </Pressable>
          </View>
        </View>

        {/* Footer */}
        <View className="items-center">
          <View className="flex-row items-center gap-2">
            <Text className="text-soft-charcoal/40 text-xs uppercase tracking-widest font-bold">
              🎵 Crafted for musicians
            </Text>
            <Text className="text-soft-charcoal/40 text-xs">•</Text>
            <Text className="text-soft-charcoal/40 text-xs uppercase tracking-widest font-bold">
              v 1.0.0
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
