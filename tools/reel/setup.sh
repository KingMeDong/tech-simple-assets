#!/usr/bin/env bash
# Installs everything the Reel pipeline needs. Idempotent; safe to re-run.
set -euo pipefail

pip install -q piper-tts faster-whisper playwright numpy pillow

VOICE_DIR="${PIPER_VOICE_DIR:-$HOME/.local/share/piper-voices}"
mkdir -p "$VOICE_DIR"
BASE="https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/ryan/high"
for f in en_US-ryan-high.onnx en_US-ryan-high.onnx.json; do
  [ -s "$VOICE_DIR/$f" ] || curl -sSL -o "$VOICE_DIR/$f" "$BASE/$f"
done

# Pre-download the Whisper model used for word timing + pronunciation QA.
python3 -c "from faster_whisper import WhisperModel; WhisperModel('small.en', device='cpu', compute_type='int8')"

command -v ffmpeg >/dev/null || { echo "ffmpeg missing: apt-get install -y ffmpeg"; exit 1; }
echo "Reel pipeline ready."
