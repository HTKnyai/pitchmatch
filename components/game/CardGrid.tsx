import { View } from "react-native";
import { GameCard } from "../ui/Card";
import type { Card, GameConfig, GridLayout } from "../../lib/types/game.types";
import { DIFFICULTY_CONFIG } from "../../constants/Config";

type CardGridProps = {
  cards: Card[];
  config: GameConfig;
  onCardPress: (card: Card) => void;
  disabled?: boolean;
};

export function CardGrid({
  cards,
  config,
  onCardPress,
  disabled = false,
}: CardGridProps) {
  const { gridLayout } = DIFFICULTY_CONFIG[config.difficulty];
  const { rows, cols } = gridLayout;

  // Calculate gap based on grid size
  const gap = cols > 4 ? 3 : 4;

  return (
    <View className="w-full px-4">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <View
          key={rowIndex}
          className="flex-row justify-center"
          style={{ marginBottom: gap * 4 }}
        >
          {Array.from({ length: cols }).map((_, colIndex) => {
            const cardIndex = rowIndex * cols + colIndex;
            const card = cards[cardIndex];

            if (!card) return null;

            return (
              <View
                key={card.id}
                style={{
                  width: `${100 / cols - 1}%`,
                  marginHorizontal: gap,
                }}
              >
                <GameCard
                  card={card}
                  notation={config.notation}
                  showOctave={config.showOctave}
                  isBlindMode={config.isBlindMode}
                  onPress={() => onCardPress(card)}
                  disabled={disabled}
                />
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}
