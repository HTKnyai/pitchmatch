import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Button } from "../components/ui/Button";
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
    <SafeAreaView className="flex-1 bg-primary-900">
      <View className="flex-1 items-center justify-center px-8">
        {/* Logo */}
        <View className="items-center mb-12">
          <Text className="text-6xl mb-2">&#127925;</Text>
          <Text className="text-white text-4xl font-bold text-center">
            Melody
          </Text>
          <Text className="text-primary-300 text-4xl font-bold text-center">
            Memory
          </Text>
          <Text className="text-primary-400 text-sm mt-2">
            Train Your Musical Ear
          </Text>
        </View>

        {/* Menu buttons */}
        <View className="w-full max-w-xs gap-4">
          <Button
            title="1 Player"
            onPress={handleSinglePlayer}
            variant="primary"
            size="lg"
            fullWidth
          />
          <Button
            title="2 Players"
            onPress={handleTwoPlayer}
            variant="secondary"
            size="lg"
            fullWidth
          />
          <Button
            title="Rankings"
            onPress={handleRanking}
            variant="outline"
            size="lg"
            fullWidth
          />
        </View>
      </View>

      {/* Footer */}
      <View className="items-center pb-4">
        <Text className="text-primary-600 text-xs">v1.0.0</Text>
      </View>
    </SafeAreaView>
  );
}
