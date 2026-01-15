import { Audio, AVPlaybackSource } from "expo-av";
import { NOTE_NAMES, PITCH_RANGE } from "../../constants/Config";
import AsyncStorage from "@react-native-async-storage/async-storage";

type SoundCache = Map<string, Audio.Sound>;

const VOLUME_STORAGE_KEY = "@melody_memory/volume";
const DEFAULT_VOLUME = 0.7;

class AudioEngineClass {
  private soundCache: SoundCache = new Map();
  private isInitialized = false;
  private isPreloaded = false;
  private volume: number = DEFAULT_VOLUME;

  // Convert MIDI note to filename key (e.g., 60 -> "C4", 61 -> "Cs4")
  getMidiFileName(midiNote: number): string {
    const pitchClass = midiNote % 12;
    const octave = Math.floor(midiNote / 12) - 1;
    const noteName = NOTE_NAMES.abc[pitchClass];
    // Replace # with s for filename (C# -> Cs)
    const safeNoteName = noteName.replace("#", "s");
    return `${safeNoteName}${octave}`;
  }

  // Get the frequency for a MIDI note (for future synthesis support)
  getMidiFrequency(midiNote: number): number {
    return 440 * Math.pow(2, (midiNote - 69) / 12);
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });
      // Load saved volume
      await this.loadVolume();
      this.isInitialized = true;
    } catch (error) {
      console.warn("Failed to initialize audio:", error);
    }
  }

  // Get current volume
  getVolume(): number {
    return this.volume;
  }

  // Set volume (0.0 to 1.0)
  async setVolume(volume: number): Promise<void> {
    this.volume = Math.max(0, Math.min(1, volume));

    // Update all loaded sounds
    for (const sound of this.soundCache.values()) {
      try {
        await sound.setVolumeAsync(this.volume);
      } catch (error) {
        console.warn("Failed to set volume for sound:", error);
      }
    }

    // Save to storage
    await this.saveVolume();
  }

  // Load volume from storage
  private async loadVolume(): Promise<void> {
    try {
      const savedVolume = await AsyncStorage.getItem(VOLUME_STORAGE_KEY);
      if (savedVolume !== null) {
        this.volume = parseFloat(savedVolume);
      }
    } catch (error) {
      console.warn("Failed to load volume:", error);
    }
  }

  // Save volume to storage
  private async saveVolume(): Promise<void> {
    try {
      await AsyncStorage.setItem(VOLUME_STORAGE_KEY, this.volume.toString());
    } catch (error) {
      console.warn("Failed to save volume:", error);
    }
  }

  // Preload a specific sound file
  async preloadSound(key: string, source: AVPlaybackSource): Promise<void> {
    try {
      if (this.soundCache.has(key)) {
        return;
      }
      const { sound } = await Audio.Sound.createAsync(source, {
        shouldPlay: false,
        volume: this.volume,
      });
      this.soundCache.set(key, sound);
    } catch (error) {
      console.warn(`Failed to preload sound ${key}:`, error);
    }
  }

  // Play a preloaded sound
  async playSound(key: string): Promise<void> {
    const sound = this.soundCache.get(key);
    if (sound) {
      try {
        await sound.setPositionAsync(0);
        await sound.playAsync();
      } catch (error) {
        console.warn(`Failed to play sound ${key}:`, error);
      }
    }
  }

  // Play a note by MIDI number
  async playNote(midiNote: number): Promise<void> {
    const key = this.getMidiFileName(midiNote);
    await this.playSound(key);
  }

  // Play multiple notes simultaneously (for chords)
  async playChord(midiNotes: number[]): Promise<void> {
    const promises = midiNotes.map((note) => this.playNote(note));
    await Promise.all(promises);
  }

  // Play success sound effect
  async playSuccessSound(): Promise<void> {
    await this.playSound("success");
  }

  // Play failure sound effect
  async playFailSound(): Promise<void> {
    await this.playSound("fail");
  }

  // Play game clear fanfare
  async playFanfare(): Promise<void> {
    await this.playSound("fanfare");
  }

  // Preload all note sounds and effect sounds
  async preloadAllSounds(): Promise<void> {
    if (this.isPreloaded) return;

    try {
      const { SOUND_FILES } = await import("../../assets/sounds/index");

      // Preload all sounds
      const preloadPromises = Object.entries(SOUND_FILES).map(
        async ([key, source]) => {
          await this.preloadSound(key, source);
        }
      );

      await Promise.all(preloadPromises);
      this.isPreloaded = true;
      console.log("All audio files preloaded successfully");
    } catch (error) {
      console.warn("Failed to preload audio files:", error);
    }
  }

  // Cleanup all sounds
  async cleanup(): Promise<void> {
    for (const sound of this.soundCache.values()) {
      try {
        await sound.unloadAsync();
      } catch (error) {
        // Ignore cleanup errors
      }
    }
    this.soundCache.clear();
    this.isInitialized = false;
    this.isPreloaded = false;
  }
}

// Singleton instance
export const AudioEngine = new AudioEngineClass();
