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
      console.log("Initializing audio mode...");
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        allowsRecordingIOS: false,
        interruptionModeIOS: 1, // DoNotMix
        interruptionModeAndroid: 1, // DoNotMix
      });
      console.log("Audio mode initialized successfully");
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
      const { sound, status } = await Audio.Sound.createAsync(source, {
        volume: this.volume,
        shouldPlay: false,
      });
      if (status.isLoaded) {
        this.soundCache.set(key, sound);
      } else {
        console.warn(`Sound ${key} failed to load`);
      }
    } catch (error) {
      console.warn(`Failed to preload sound ${key}:`, error);
    }
  }

  // Play a preloaded sound
  async playSound(key: string): Promise<void> {
    const sound = this.soundCache.get(key);
    if (sound) {
      try {
        const status = await sound.getStatusAsync();
        console.log(`Playing ${key}, status:`, status.isLoaded ? 'loaded' : 'not loaded');
        if (status.isLoaded) {
          await sound.setPositionAsync(0);
          await sound.playAsync();
        } else {
          console.warn(`Sound ${key} is not loaded`);
        }
      } catch (error) {
        console.warn(`Failed to play sound ${key}:`, error);
      }
    } else {
      console.warn(`Sound ${key} not found in cache`);
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
      console.log("Starting to preload sounds...");
      const { SOUND_FILES } = await import("../../assets/sounds/index");
      console.log(`Found ${Object.keys(SOUND_FILES).length} sound files to preload`);

      // Preload sounds sequentially to avoid overwhelming the system
      let loadedCount = 0;
      let failedCount = 0;
      for (const [key, source] of Object.entries(SOUND_FILES)) {
        try {
          await this.preloadSound(key, source as AVPlaybackSource);
          loadedCount++;
        } catch (e) {
          failedCount++;
          console.warn(`Failed to load ${key}:`, e);
        }
      }

      console.log(`Preload complete: ${loadedCount} loaded, ${failedCount} failed`);
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
