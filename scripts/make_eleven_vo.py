"""Generates the "11 Seconds" voiceover with Kokoro, an open-weight TTS model.

    pip install kokoro-onnx soundfile
    # model files: https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0
    python3 scripts/make_eleven_vo.py path/to/kokoro-v1.0.onnx path/to/voices-v1.0.bin

"Wai" is spelled "Why" so the model pronounces it correctly.
"""
import sys

import soundfile as sf
from kokoro_onnx import Kokoro

VOICE = 'af_heart'
LINES = {
    '1a': 'Eleven seconds.',
    '1b': "That's how long the average patient talks, before being interrupted.",
    '2a': "It's not rudeness.",
    '2b': "It's the note. Someone has to write it.",
    '3': 'What if no one had to?',
    '4a': 'Why writes it all, while you talk.',
    '4b': 'So the doctor looks at you. And you get heard.',
    '5': 'Take all the time you need.',
    '6': 'Why. Care, uninterrupted.',
}

k = Kokoro(sys.argv[1], sys.argv[2])
for key, text in LINES.items():
    audio, sr = k.create(text, voice=VOICE, speed=0.92, lang='en-us')
    sf.write(f'public/eleven/vo/{key}.wav', audio, sr)
    print(key, round(len(audio) / sr, 2), 's')
