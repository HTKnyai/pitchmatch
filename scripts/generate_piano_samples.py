#!/usr/bin/env python3
"""
Download FluidR3_GM piano samples (CC BY 3.0) for each note in MIDI 36-72 (C2-C5).

No external dependencies — uses Python standard library only.

Usage:
  python3 scripts/generate_piano_samples.py

Output:
  assets/sounds/piano/*.mp3  (37 files, one per note)
  assets/sounds/index.ts     (auto-updated)

License:
  Piano samples from FluidR3_GM soundfont by Frank Wen, CC BY 3.0
  Source: github.com/gleitz/midi-js-soundfonts
"""

import os
import sys
import urllib.request
from pathlib import Path

SOUNDFONT_BASE = (
    "https://raw.githubusercontent.com/gleitz/midi-js-soundfonts"
    "/gh-pages/FluidR3_GM/acoustic_grand_piano-mp3"
)

SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent
OUTPUT_DIR = PROJECT_DIR / "assets" / "sounds" / "piano"
INDEX_PATH = PROJECT_DIR / "assets" / "sounds" / "index.ts"

# Maps AudioEngine key → gleitz filename  (AudioEngine uses Cs/Ds/Fs/Gs/As; gleitz uses Db/Eb/Gb/Ab/Bb)
FLAT_MAP = {"Cs": "Db", "Ds": "Eb", "Fs": "Gb", "Gs": "Ab", "As": "Bb"}

NOTE_NAMES = ["C", "Cs", "D", "Ds", "E", "F", "Fs", "G", "Gs", "A", "As", "B"]


def midi_to_key(midi_note: int) -> str:
    """Return AudioEngine key, e.g. 60 -> 'C4', 61 -> 'Cs4'."""
    pitch_class = midi_note % 12
    octave = (midi_note // 12) - 1
    return f"{NOTE_NAMES[pitch_class]}{octave}"


def key_to_gleitz_name(key: str) -> str:
    """Convert AudioEngine key to gleitz filename, e.g. 'Cs4' -> 'Db4'."""
    for sharp, flat in FLAT_MAP.items():
        if key.startswith(sharp):
            return flat + key[len(sharp):]
    return key


def download_note(key: str, output_path: Path, retries: int = 3) -> bool:
    gleitz_name = key_to_gleitz_name(key)
    url = f"{SOUNDFONT_BASE}/{gleitz_name}.mp3"
    for attempt in range(retries):
        try:
            urllib.request.urlretrieve(url, str(output_path))
            return True
        except Exception as e:
            if attempt == retries - 1:
                print(f"  FAILED {key} ({url}): {e}", file=sys.stderr)
    return False


def generate_index(note_keys: list[str]) -> str:
    lines = [
        "// Auto-generated file - do not edit manually",
        "// Run 'python3 scripts/generate_piano_samples.py' to regenerate",
        "",
        "// Note sounds (MIDI 36-72: C2 to C5)",
        "// Piano samples from FluidR3_GM soundfont by Frank Wen, CC BY 3.0",
        "// Source: github.com/gleitz/midi-js-soundfonts",
    ]
    for key in note_keys:
        lines.append(f"import {key} from './piano/{key}.mp3';")

    lines += [
        "",
        "// Effect sounds",
        "import fail from './fail.m4a';",
        "import fanfare from './fanfare.m4a';",
        "import success from './success.m4a';",
        "",
        "// Sound file mapping",
        "export const SOUND_FILES: Record<string, any> = {",
    ]
    for key in note_keys:
        lines.append(f"  '{key}': {key},")
    lines += [
        "  'fail': fail,",
        "  'fanfare': fanfare,",
        "  'success': success,",
        "};",
        "",
    ]
    return "\n".join(lines)


def main():
    print("=== Piano Sample Downloader ===")
    print(f"Source: {SOUNDFONT_BASE}")
    print(f"Output: {OUTPUT_DIR}\n")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    note_keys = []
    failed = []

    for midi_note in range(36, 73):  # C2 (36) to C5 (72)
        key = midi_to_key(midi_note)
        output_path = OUTPUT_DIR / f"{key}.mp3"

        if output_path.exists():
            print(f"  {key}.mp3  (cached)")
            note_keys.append(key)
            continue

        ok = download_note(key, output_path)
        if ok:
            print(f"  {key}.mp3  downloaded")
            note_keys.append(key)
        else:
            failed.append(key)

    print(f"\nDone: {len(note_keys)} / 37 notes.")

    if failed:
        print(f"Failed: {', '.join(failed)}", file=sys.stderr)

    index_content = generate_index(note_keys)
    INDEX_PATH.write_text(index_content, encoding="utf-8")
    print(f"Updated: {INDEX_PATH}")

    if failed:
        sys.exit(1)


if __name__ == "__main__":
    main()
