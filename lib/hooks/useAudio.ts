import { useEffect, useCallback, useRef } from "react";
import { AudioEngine } from "../audio/AudioEngine";

export function useAudio() {
  const isInitializedRef = useRef(false);

  useEffect(() => {
    const init = async () => {
      if (!isInitializedRef.current) {
        await AudioEngine.initialize();
        await AudioEngine.preloadAllSounds();
        isInitializedRef.current = true;
      }
    };

    init();

    return () => {
      // Don't cleanup on unmount to preserve cache across navigation
    };
  }, []);

  const playNote = useCallback(async (midiNote: number) => {
    await AudioEngine.playNote(midiNote);
  }, []);

  const playChord = useCallback(async (midiNotes: number[]) => {
    await AudioEngine.playChord(midiNotes);
  }, []);

  const playSuccess = useCallback(async () => {
    await AudioEngine.playSuccessSound();
  }, []);

  const playFail = useCallback(async () => {
    await AudioEngine.playFailSound();
  }, []);

  const playFanfare = useCallback(async () => {
    await AudioEngine.playFanfare();
  }, []);

  return {
    playNote,
    playChord,
    playSuccess,
    playFail,
    playFanfare,
  };
}
