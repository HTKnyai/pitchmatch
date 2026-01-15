import { View, Text, Modal, Pressable } from "react-native";
import { Button } from "../ui/Button";

type PauseMenuProps = {
  visible: boolean;
  onResume: () => void;
  onQuit: () => void;
};

export function PauseMenu({ visible, onResume, onQuit }: PauseMenuProps) {
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
