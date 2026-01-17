import { View, Text, Modal, Pressable } from "react-native";
import Slider from "@react-native-community/slider";
import { Button } from "../ui/Button";
import { useState, useEffect } from "react";
import { useAudio } from "../../lib/hooks/useAudio";

type PauseMenuProps = {
  visible: boolean;
  onResume: () => void;
  onQuit: () => void;
};

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
      <View className="flex-1 items-center justify-center bg-black/70">
        <View className="bg-cream rounded-3xl p-8 mx-8 items-center border border-soft-charcoal/10"
          style={{
            shadowColor: "#4A4A4A",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 10,
          }}
        >
          <Text className="text-soft-charcoal text-3xl font-bold mb-8">PAUSE</Text>

          <View className="gap-4 w-full">
            {/* Volume Control */}
            <View className="w-full mb-4" style={{ minWidth: 250 }}>
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-soft-charcoal text-lg font-semibold">音量</Text>
                <Text className="text-soft-charcoal text-sm">{Math.round(volume * 100)}%</Text>
              </View>
              <Slider
                style={{ width: 250, height: 40 }}
                minimumValue={0}
                maximumValue={1}
                value={volume}
                onValueChange={handleVolumeChange}
                onSlidingComplete={handleVolumeChangeComplete}
                minimumTrackTintColor="#7DA7C9"
                maximumTrackTintColor="#D8D4C8"
                thumbTintColor="#7DA7C9"
              />
            </View>

            <Button
              title="Resume"
              onPress={onResume}
              variant="primary"
              size="lg"
              fullWidth
            />
            <Button
              title="Quit to Title"
              onPress={onQuit}
              variant="outline"
              size="lg"
              fullWidth
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
