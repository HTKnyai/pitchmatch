#!/usr/bin/env python3
"""
Generate simple audio files for the pitch matching game.
Creates sine wave tones for each MIDI note from C2 (36) to C6 (72).
"""

import os
import math
import wave
import struct
import argparse

# Audio settings
SAMPLE_RATE = 44100
DURATION = 1.5  # seconds
AMPLITUDE = 0.3  # 0.0 to 1.0

# Note names mapping
NOTE_NAMES = ['C', 'Cs', 'D', 'Ds', 'E', 'F', 'Fs', 'G', 'Gs', 'A', 'As', 'B']

def midi_to_frequency(midi_note):
    """Convert MIDI note number to frequency in Hz."""
    return 440.0 * math.pow(2.0, (midi_note - 69) / 12.0)

def midi_to_filename(midi_note):
    """Convert MIDI note to filename (e.g., 60 -> 'C4')."""
    pitch_class = midi_note % 12
    octave = (midi_note // 12) - 1
    note_name = NOTE_NAMES[pitch_class]
    return f"{note_name}{octave}"

def generate_sine_wave(frequency, duration, sample_rate=SAMPLE_RATE, amplitude=AMPLITUDE):
    """Generate a sine wave with envelope to avoid clicks."""
    num_samples = int(duration * sample_rate)
    samples = []

    # Envelope parameters
    attack_time = 0.01  # 10ms attack
    release_time = 0.1  # 100ms release
    attack_samples = int(attack_time * sample_rate)
    release_samples = int(release_time * sample_rate)

    for i in range(num_samples):
        # Generate sine wave
        t = i / sample_rate
        sample = amplitude * math.sin(2.0 * math.pi * frequency * t)

        # Apply envelope
        if i < attack_samples:
            # Attack: fade in
            envelope = i / attack_samples
            sample *= envelope
        elif i > num_samples - release_samples:
            # Release: fade out
            envelope = (num_samples - i) / release_samples
            sample *= envelope

        # Convert to 16-bit integer
        sample_int = int(sample * 32767)
        samples.append(sample_int)

    return samples

def save_wav(filename, samples, sample_rate=SAMPLE_RATE):
    """Save samples as a WAV file."""
    with wave.open(filename, 'w') as wav_file:
        # Set parameters: nchannels, sampwidth, framerate, nframes, comptype, compname
        wav_file.setparams((1, 2, sample_rate, len(samples), 'NONE', 'not compressed'))

        # Write samples
        for sample in samples:
            wav_file.writeframes(struct.pack('<h', sample))

def generate_chord(frequencies, duration, sample_rate=SAMPLE_RATE, amplitude=AMPLITUDE):
    """Generate a chord by combining multiple frequencies."""
    num_samples = int(duration * sample_rate)
    samples = []

    # Reduce amplitude per note to avoid clipping
    note_amplitude = amplitude / len(frequencies)

    # Envelope parameters
    attack_time = 0.01
    release_time = 0.1
    attack_samples = int(attack_time * sample_rate)
    release_samples = int(release_time * sample_rate)

    for i in range(num_samples):
        t = i / sample_rate
        sample = 0

        # Sum all frequencies
        for freq in frequencies:
            sample += note_amplitude * math.sin(2.0 * math.pi * freq * t)

        # Apply envelope
        if i < attack_samples:
            envelope = i / attack_samples
            sample *= envelope
        elif i > num_samples - release_samples:
            envelope = (num_samples - i) / release_samples
            sample *= envelope

        # Convert to 16-bit integer
        sample_int = int(sample * 32767)
        sample_int = max(-32767, min(32767, sample_int))  # Clamp
        samples.append(sample_int)

    return samples

def generate_success_sound():
    """Generate a pleasant success sound (ascending major chord)."""
    # C major chord ascending
    freqs_c4 = [midi_to_frequency(60)]  # C4
    freqs_e4 = [midi_to_frequency(64)]  # E4
    freqs_g4 = [midi_to_frequency(67)]  # G4
    freqs_c5 = [midi_to_frequency(72)]  # C5

    duration = 0.15
    samples = []
    samples.extend(generate_sine_wave(freqs_c4[0], duration))
    samples.extend(generate_sine_wave(freqs_e4[0], duration))
    samples.extend(generate_sine_wave(freqs_g4[0], duration))
    samples.extend(generate_sine_wave(freqs_c5[0], duration))

    return samples

def generate_fail_sound():
    """Generate a descending fail sound."""
    # Descending minor second
    freq1 = midi_to_frequency(64)  # E4
    freq2 = midi_to_frequency(63)  # Eb4

    duration = 0.3
    samples = []
    samples.extend(generate_sine_wave(freq1, duration))
    samples.extend(generate_sine_wave(freq2, duration))

    return samples

def generate_fanfare():
    """Generate a celebratory fanfare sound."""
    # Major scale ascending: C-D-E-G-C
    notes = [60, 62, 64, 67, 72]  # C4, D4, E4, G4, C5
    duration = 0.2
    samples = []

    for note in notes:
        freq = midi_to_frequency(note)
        samples.extend(generate_sine_wave(freq, duration, amplitude=0.35))

    # Add final chord (C major)
    chord_freqs = [
        midi_to_frequency(60),  # C4
        midi_to_frequency(64),  # E4
        midi_to_frequency(67),  # G4
    ]
    samples.extend(generate_chord(chord_freqs, 0.8))

    return samples

def generate_index_file(output_dir, note_files, effect_files):
    """Generate TypeScript index file for importing audio assets."""
    index_path = os.path.join(output_dir, "index.ts")

    with open(index_path, 'w') as f:
        f.write("// Auto-generated file - do not edit manually\n")
        f.write("// Run 'python3 scripts/generate_audio.py' to regenerate\n\n")

        # Generate imports for all notes
        f.write("// Note sounds (MIDI 36-72: C2 to C5)\n")
        for filename in sorted(note_files):
            f.write(f"import {filename} from './{filename}.wav';\n")

        f.write("\n// Effect sounds\n")
        for filename in sorted(effect_files):
            f.write(f"import {filename} from './{filename}.wav';\n")

        # Generate sound map
        f.write("\n// Sound file mapping\n")
        f.write("export const SOUND_FILES: Record<string, any> = {\n")

        for filename in sorted(note_files):
            f.write(f"  '{filename}': {filename},\n")

        for filename in sorted(effect_files):
            f.write(f"  '{filename}': {filename},\n")

        f.write("};\n")

    print(f"\nGenerated index file: {index_path}")

def main():
    parser = argparse.ArgumentParser(description='Generate audio files for pitch matching game')
    parser.add_argument('--output-dir', default='assets/sounds',
                        help='Output directory for audio files (default: assets/sounds)')
    args = parser.parse_args()

    output_dir = args.output_dir

    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)

    print(f"Generating audio files in '{output_dir}'...")

    note_files = []
    effect_files = []

    # Generate note files (MIDI 36-72: C2 to C6)
    for midi_note in range(36, 73):
        filename = midi_to_filename(midi_note)
        frequency = midi_to_frequency(midi_note)

        # Generate samples
        samples = generate_sine_wave(frequency, DURATION)

        # Save as WAV
        output_path = os.path.join(output_dir, f"{filename}.wav")
        save_wav(output_path, samples)

        print(f"  Generated {filename}.wav ({frequency:.2f} Hz)")
        note_files.append(filename)

    # Generate effect sounds
    print("\nGenerating effect sounds...")

    # Success sound
    success_samples = generate_success_sound()
    save_wav(os.path.join(output_dir, "success.wav"), success_samples)
    print("  Generated success.wav")
    effect_files.append("success")

    # Fail sound
    fail_samples = generate_fail_sound()
    save_wav(os.path.join(output_dir, "fail.wav"), fail_samples)
    print("  Generated fail.wav")
    effect_files.append("fail")

    # Fanfare
    fanfare_samples = generate_fanfare()
    save_wav(os.path.join(output_dir, "fanfare.wav"), fanfare_samples)
    print("  Generated fanfare.wav")
    effect_files.append("fanfare")

    print(f"\nCompleted! Generated {73-36+3} audio files.")
    print(f"All files saved to '{output_dir}'")

    # Generate TypeScript index file
    generate_index_file(output_dir, note_files, effect_files)

if __name__ == "__main__":
    main()
