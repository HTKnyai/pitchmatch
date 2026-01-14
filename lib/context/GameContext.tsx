import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  ReactNode,
} from "react";
import type {
  GameState,
  GameConfig,
  Card,
  PlayerState,
} from "../types/game.types";
import { generateCards } from "../game/CardGenerator";
import { validateMatch } from "../game/MatchValidator";
import { DEFAULT_CONFIG } from "../../constants/Config";

// Initial player state
const initialPlayerState: PlayerState = {
  score: 0,
  matchedPairs: 0,
  attempts: 0,
};

// Initial game state
const initialGameState: GameState = {
  config: DEFAULT_CONFIG as GameConfig,
  cards: [],
  currentPlayer: 1,
  players: {
    player1: { ...initialPlayerState },
    player2: { ...initialPlayerState },
  },
  flippedCards: [],
  matchedPairs: 0,
  totalPairs: 0,
  gameStatus: "idle",
  startTime: null,
  endTime: null,
};

// Action types
type GameAction =
  | { type: "SET_CONFIG"; config: GameConfig }
  | { type: "START_GAME" }
  | { type: "FLIP_CARD"; card: Card }
  | { type: "CHECK_MATCH" }
  | { type: "RESET_FLIPPED" }
  | { type: "PAUSE_GAME" }
  | { type: "RESUME_GAME" }
  | { type: "END_GAME" }
  | { type: "RESET_GAME" };

// Reducer
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "SET_CONFIG":
      return {
        ...state,
        config: action.config,
      };

    case "START_GAME": {
      const cards = generateCards(
        state.config.mode,
        state.config.difficulty,
        state.config.isExtendedRules
      );
      const totalPairs = cards.length / 2;

      return {
        ...state,
        cards,
        totalPairs,
        currentPlayer: 1,
        players: {
          player1: { ...initialPlayerState },
          player2: { ...initialPlayerState },
        },
        flippedCards: [],
        matchedPairs: 0,
        gameStatus: "playing",
        startTime: Date.now(),
        endTime: null,
      };
    }

    case "FLIP_CARD": {
      // Don't flip if already matched or already flipped
      if (action.card.isMatched || action.card.isFlipped) {
        return state;
      }

      // Don't flip more than 2 cards
      if (state.flippedCards.length >= 2) {
        return state;
      }

      const updatedCards = state.cards.map((c) =>
        c.id === action.card.id ? { ...c, isFlipped: true } : c
      );

      const flippedCard = updatedCards.find((c) => c.id === action.card.id)!;

      return {
        ...state,
        cards: updatedCards,
        flippedCards: [...state.flippedCards, flippedCard],
      };
    }

    case "CHECK_MATCH": {
      if (state.flippedCards.length !== 2) {
        return state;
      }

      const [card1, card2] = state.flippedCards;
      const result = validateMatch(card1, card2, state.config);

      const currentPlayerKey =
        `player${state.currentPlayer}` as keyof typeof state.players;

      if (result.isMatch) {
        // Mark cards as matched
        const updatedCards = state.cards.map((c) =>
          c.id === card1.id || c.id === card2.id ? { ...c, isMatched: true } : c
        );

        const newMatchedPairs = state.matchedPairs + 1;
        const isGameComplete = newMatchedPairs >= state.totalPairs;

        return {
          ...state,
          cards: updatedCards,
          flippedCards: [],
          matchedPairs: newMatchedPairs,
          players: {
            ...state.players,
            [currentPlayerKey]: {
              ...state.players[currentPlayerKey],
              score: state.players[currentPlayerKey].score + result.points,
              matchedPairs: state.players[currentPlayerKey].matchedPairs + 1,
              attempts: state.players[currentPlayerKey].attempts + 1,
            },
          },
          gameStatus: isGameComplete ? "finished" : state.gameStatus,
          endTime: isGameComplete ? Date.now() : state.endTime,
        };
      } else {
        // No match - update attempts and switch player in 2-player mode
        const nextPlayer =
          state.config.playerCount === 2
            ? state.currentPlayer === 1
              ? 2
              : 1
            : state.currentPlayer;

        return {
          ...state,
          players: {
            ...state.players,
            [currentPlayerKey]: {
              ...state.players[currentPlayerKey],
              attempts: state.players[currentPlayerKey].attempts + 1,
            },
          },
          currentPlayer: nextPlayer as 1 | 2,
        };
      }
    }

    case "RESET_FLIPPED": {
      const updatedCards = state.cards.map((c) =>
        state.flippedCards.some((fc) => fc.id === c.id) && !c.isMatched
          ? { ...c, isFlipped: false }
          : c
      );

      return {
        ...state,
        cards: updatedCards,
        flippedCards: [],
      };
    }

    case "PAUSE_GAME":
      return {
        ...state,
        gameStatus: "paused",
      };

    case "RESUME_GAME":
      return {
        ...state,
        gameStatus: "playing",
      };

    case "END_GAME":
      return {
        ...state,
        gameStatus: "finished",
        endTime: Date.now(),
      };

    case "RESET_GAME":
      return {
        ...initialGameState,
        config: state.config,
      };

    default:
      return state;
  }
}

// Context type
type GameContextType = {
  state: GameState;
  setConfig: (config: GameConfig) => void;
  startGame: () => void;
  flipCard: (card: Card) => void;
  checkMatch: () => { isMatch: boolean; points: number };
  resetFlipped: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: () => void;
  resetGame: () => void;
};

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);

  const setConfig = useCallback((config: GameConfig) => {
    dispatch({ type: "SET_CONFIG", config });
  }, []);

  const startGame = useCallback(() => {
    dispatch({ type: "START_GAME" });
  }, []);

  const flipCard = useCallback((card: Card) => {
    dispatch({ type: "FLIP_CARD", card });
  }, []);

  const checkMatch = useCallback(() => {
    if (state.flippedCards.length !== 2) {
      return { isMatch: false, points: 0 };
    }

    const [card1, card2] = state.flippedCards;
    const result = validateMatch(card1, card2, state.config);

    dispatch({ type: "CHECK_MATCH" });

    return { isMatch: result.isMatch, points: result.points };
  }, [state.flippedCards, state.config]);

  const resetFlipped = useCallback(() => {
    dispatch({ type: "RESET_FLIPPED" });
  }, []);

  const pauseGame = useCallback(() => {
    dispatch({ type: "PAUSE_GAME" });
  }, []);

  const resumeGame = useCallback(() => {
    dispatch({ type: "RESUME_GAME" });
  }, []);

  const endGame = useCallback(() => {
    dispatch({ type: "END_GAME" });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: "RESET_GAME" });
  }, []);

  return (
    <GameContext.Provider
      value={{
        state,
        setConfig,
        startGame,
        flipCard,
        checkMatch,
        resetFlipped,
        pauseGame,
        resumeGame,
        endGame,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
