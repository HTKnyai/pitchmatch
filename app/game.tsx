import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { CardGrid } from "../components/game/CardGrid";
import { GameHeader } from "../components/game/GameHeader";
import { PauseMenu } from "../components/game/PauseMenu";
import { TurnIndicator } from "../components/game/TurnIndicator";
import { ScorePopup } from "../components/game/ScorePopup";
import { GradientBackground } from "../components/ui/GradientBackground";
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

  // Track previous player for turn transition
  const [previousPlayer, setPreviousPlayer] = useState<1 | 2 | null>(null);
  const previousPlayerRef = useRef<1 | 2>(state.currentPlayer);

  // Score popup state
  const [scorePopup, setScorePopup] = useState<{
    visible: boolean;
    points: number;
    comboCount: number;
    multiplier: number;
  }>({ visible: false, points: 0, comboCount: 0, multiplier: 1 });

  // Track player changes for turn indicator
  useEffect(() => {
    if (previousPlayerRef.current !== state.currentPlayer) {
      setPreviousPlayer(previousPlayerRef.current);
      previousPlayerRef.current = state.currentPlayer;
    }
  }, [state.currentPlayer]);

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

  // Check for match when two cards are flipped
  useEffect(() => {
    if (
      state.flippedCards.length === 2 &&
      !isCheckingRef.current &&
      state.gameStatus === "playing"
    ) {
      isCheckingRef.current = true;

      // Small delay to let the flip animation complete
      setTimeout(async () => {
        const result = checkMatch();

        if (result.isMatch) {
          // Show score popup with combo info
          setScorePopup({
            visible: true,
            points: result.points,
            comboCount: result.comboCount,
            multiplier: result.multiplier,
          });

          // Hide popup after duration
          setTimeout(() => {
            setScorePopup((prev) => ({ ...prev, visible: false }));
          }, ANIMATION.scorePopupDuration);

          isCheckingRef.current = false;
        } else {
          // Wait before flipping cards back
          // Keep isCheckingRef true until cards are reset to prevent re-triggering
          setTimeout(() => {
            resetFlipped();
            isCheckingRef.current = false;
          }, ANIMATION.matchFailureDuration);
        }
      }, ANIMATION.flipDuration + 100);
    }
  }, [state.flippedCards, state.gameStatus, checkMatch, resetFlipped]);

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
    <GradientBackground variant="game">
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <GameHeader
          gameState={state}
          config={state.config}
          onPause={handlePause}
        />

        <View style={{ flex: 1, justifyContent: "center", paddingVertical: 16 }}>
          <CardGrid
            cards={state.cards}
            config={state.config}
            onCardPress={handleCardPress}
            disabled={
              state.gameStatus !== "playing" || state.flippedCards.length >= 2
            }
          />
        </View>

        {/* Turn transition indicator */}
        <TurnIndicator
          currentPlayer={state.currentPlayer}
          previousPlayer={previousPlayer}
          isTwoPlayer={state.config.playerCount === 2}
        />

        {/* Score popup with combo info */}
        {scorePopup.visible && (
          <ScorePopup
            points={scorePopup.points}
            comboCount={scorePopup.comboCount}
            multiplier={scorePopup.multiplier}
          />
        )}

        <PauseMenu
          visible={state.gameStatus === "paused"}
          onResume={handleResume}
          onQuit={handleQuit}
        />
      </SafeAreaView>
    </GradientBackground>
  );
}
