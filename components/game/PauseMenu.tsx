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
        <View className="bg-primary-800 rounded-2xl p-8 mx-8 items-center shadow-2xl">
          <Text className="text-white text-3xl font-bold mb-8">PAUSE</Text>

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
