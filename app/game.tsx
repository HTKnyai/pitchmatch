import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { CardGrid } from "../components/game/CardGrid";
import { GameHeader } from "../components/game/GameHeader";
import { PauseMenu } from "../components/game/PauseMenu";
import { useGame } from "../lib/context/GameContext";
import { useAudio } from "../lib/hooks/useAudio";
import type { Card, PitchCard, ChordCard } from "../lib/types/game.types";
import { ANIMATION } from "../constants/Config";

export default function GameScreen() {
  const router = useRouter();
  const { state, flipCard, checkMatch, resetFlipped, pauseGame, resumeGame } =
    useGame();
  const { playNote, playChord, playSuccess, playFail } = useAudio();
  const isCheckingRef = useRef(false);

  // Navigate to result when game finishes
  useEffect(() => {
    if (state.gameStatus === "finished") {
      router.replace("/result");
    }
  }, [state.gameStatus]);

  // Redirect to title if game not started
  useEffect(() => {
    if (state.gameStatus === "idle" && state.cards.length === 0) {
      router.replace("/");
    }
  }, []);

  const handleCardPress = async (card: Card) => {
    if (
      isCheckingRef.current ||
      state.flippedCards.length >= 2 ||
      state.gameStatus !== "playing"
    ) {
      return;
    }

    // Flip the card
    flipCard(card);

    // Play the sound
    if (card.mode === "pitch") {
      await playNote((card as PitchCard).pitch);
    } else {
      await playChord((card as ChordCard).pitches);
    }

    // Check for match after second card
    if (state.flippedCards.length === 1) {
      isCheckingRef.current = true;

      // Small delay to let the flip animation complete
      setTimeout(async () => {
        const result = checkMatch();

        if (result.isMatch) {
          await playSuccess();
        } else {
          await playFail();
          // Wait before flipping cards back
          setTimeout(() => {
            resetFlipped();
          }, ANIMATION.matchFailureDuration);
        }

        isCheckingRef.current = false;
      }, ANIMATION.flipDuration + 100);
    }
  };

  const handlePause = () => {
    pauseGame();
  };

  const handleResume = () => {
    resumeGame();
  };

  const handleQuit = () => {
    router.replace("/");
  };

  return (
    <SafeAreaView className="flex-1 bg-cream" edges={["top"]}>
      <GameHeader
        gameState={state}
        config={state.config}
        onPause={handlePause}
      />

      <View className="flex-1 justify-center py-4">
        <CardGrid
          cards={state.cards}
          config={state.config}
          onCardPress={handleCardPress}
          disabled={
            state.gameStatus !== "playing" || state.flippedCards.length >= 2
          }
        />
      </View>

      <PauseMenu
        visible={state.gameStatus === "paused"}
        onResume={handleResume}
        onQuit={handleQuit}
      />
    </SafeAreaView>
  );
}
