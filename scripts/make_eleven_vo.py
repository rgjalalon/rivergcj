"""Generates the "11 Seconds" voiceover with Kokoro, an open-weight TTS model.

    pip install kokoro-onnx soundfile numpy
    # model files: https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0
    python3 scripts/make_eleven_vo.py path/to/kokoro-v1.0.onnx path/to/voices-v1.0.bin

Each line is built from short phrases rendered separately, trimmed, then joined
with hand-timed pauses, which reads far more naturally than one long sentence.
"Wai" is pronounced "way", so it's written that way here.
"""
import sys

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

VOICE = 'af_heart'

# cue -> list of (phrase, speed) or pause-in-seconds
LINES = {
    '1a': [('Eleven seconds.', 0.94)],
    '1b': [("That's how long the average patient talks,", 1.02), 0.22, ('before being interrupted.', 0.97)],
    '2a': [("It's not rudeness.", 0.98)],
    '2b': [("It's the note.", 0.96), 0.4, ('Someone has to write it.', 1.0)],
    '3': [('What if', 0.95), 0.16, ('no one had to?', 0.92)],
    '4a': [('Way writes it all,', 1.0), 0.12, ('while you talk.', 0.98)],
    '4b': [('So the doctor looks at you.', 1.0), 0.38, ('And you get heard.', 0.93)],
    '5': [('Take all the time', 0.94), 0.1, ('you need.', 0.9)],
    '6': [('Way.', 0.95), 0.42, ('Care, uninterrupted.', 0.94)],
}


def trim(a, sr, thresh=0.012, pad=0.03):
    idx = np.where(np.abs(a) > thresh)[0]
    if not len(idx):
        return a
    s = max(0, idx[0] - int(pad * sr))
    e = min(len(a), idx[-1] + int(pad * 2 * sr))
    out = a[s:e].copy()
    f = int(0.01 * sr)
    out[:f] *= np.linspace(0, 1, f)
    out[-f:] *= np.linspace(1, 0, f)
    return out


k = Kokoro(sys.argv[1], sys.argv[2])
for key, parts in LINES.items():
    chunks, sr = [], 24000
    for p in parts:
        if isinstance(p, float):
            chunks.append(np.zeros(int(p * sr)))
            continue
        text, speed = p
        audio, sr = k.create(text, voice=VOICE, speed=speed, lang='en-us')
        chunks.append(trim(audio, sr))
    line = np.concatenate(chunks)
    sf.write(f'public/eleven/vo/{key}.wav', line, sr)
    print(key, round(len(line) / sr, 2), 's')
