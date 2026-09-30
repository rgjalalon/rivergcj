"""Sound design for the Wai "paperwork" film.

Writes public/wai-paperwork/sfx.wav: one stereo track spanning the whole film
(48 kHz). The original music and typing sounds come from the source edit; this
adds the cold-open hook (ticks, sub hit, digit roll, paper rustle, riser) and a
few transition whooshes. Cue frames mirror src/waiPaperwork/timeline.ts.

    pip install numpy scipy && python3 scripts/make_paperwork_sfx.py
"""

from pathlib import Path

import numpy as np
from scipy.signal import butter, fftconvolve, sosfilt

SR = 48000
FPS = 30
rng = np.random.default_rng(7)


def t(n):
    return np.arange(int(n)) / SR


def env(n, attack, release):
    a = int(attack * SR)
    e = np.exp(-np.arange(n) / (release * SR))
    if a:
        e[:a] *= np.linspace(0, 1, a)
    return e


def band(x, lo, hi, order=2):
    sos = butter(order, [lo, hi], btype="band", fs=SR, output="sos")
    return sosfilt(sos, x)


def lowpass(x, f, order=2):
    return sosfilt(butter(order, f, btype="low", fs=SR, output="sos"), x)


def reverb(x, decay=1.6, mix=0.25):
    """Cheap diffuse tail: noise impulse response, stereo decorrelated."""
    n = int(decay * SR)
    out = []
    for seed in (1, 2):
        r = np.random.default_rng(seed)
        ir = r.standard_normal(n) * np.exp(-np.arange(n) / (decay / 5 * SR))
        ir = lowpass(ir, 5000)
        ir /= np.sqrt((ir**2).sum())
        dry = np.pad(x, (0, n))
        wet = fftconvolve(x, ir)[: len(dry)]
        wet = np.pad(wet, (0, len(dry) - len(wet)))
        out.append(dry * (1 - mix) + wet * mix)
    return np.stack(out, 1)


def tick(level=0.35):
    n = int(0.06 * SR)
    click = band(rng.standard_normal(n), 2500, 7000) * env(n, 0, 0.004)
    body = np.sin(2 * np.pi * 1850 * t(n)) * env(n, 0, 0.012) * 0.5
    return (click + body) * level


def sub_hit(level=0.9, f0=90, f1=38, length=1.8):
    n = int(length * SR)
    freq = f1 + (f0 - f1) * np.exp(-t(n) / 0.09)
    phase = 2 * np.pi * np.cumsum(freq) / SR
    body = np.sin(phase) * env(n, 0.002, 0.55)
    knock = lowpass(rng.standard_normal(n), 900) * env(n, 0, 0.025) * 0.6
    return np.tanh((body + knock) * 1.4) * level


def rustle(length=0.35, level=0.12):
    n = int(length * SR)
    x = band(rng.standard_normal(n), 1800, 9000)
    grains = np.abs(lowpass(rng.standard_normal(n), 35)) * 6
    shape = np.sin(np.pi * np.linspace(0, 1, n)) ** 1.5
    return x * grains * shape * level


def whoosh(length=0.9, level=0.25, rise=True):
    n = int(length * SR)
    x = rng.standard_normal(n)
    out = np.zeros(n)
    # Sweep a band-pass through a few blocks for a moving, airy tone.
    blocks = 24
    edges = np.linspace(0, n, blocks + 1).astype(int)
    for i in range(blocks):
        p = i / (blocks - 1)
        c = 300 * (20 ** (p if rise else 1 - p))
        seg = band(x[max(0, edges[i] - 2000) : edges[i + 1]], c * 0.6, min(c * 1.8, 20000))
        out[edges[i] : edges[i + 1]] = seg[-(edges[i + 1] - edges[i]) :]
    shape = np.linspace(0, 1, n) ** 2.2 if rise else np.sin(np.pi * np.linspace(0, 1, n)) ** 2
    return out * shape * level


def riser(length=1.1, level=0.22):
    n = int(length * SR)
    w = whoosh(length, 1.0, rise=True)
    tone = np.sin(2 * np.pi * np.cumsum(np.linspace(180, 720, n)) / SR) * 0.15
    shape = np.linspace(0, 1, n) ** 3
    return (w + tone * shape) * level


def shimmer(length=1.6, level=0.08):
    """Soft glint for the logo sweep: detuned high partials."""
    n = int(length * SR)
    x = sum(np.sin(2 * np.pi * f * t(n) + i) for i, f in enumerate([1568, 2093, 2637, 3136]))
    return x / 4 * env(n, 0.08, 0.45) * level


HOOK = 96
SRC_START = 1.8


def src(seconds):
    """Source time (seconds) -> film frame, as in timeline.ts."""
    return round(seconds * FPS + HOOK - SRC_START * FPS)


DURATION_FRAMES = src(39.2)
total = int(DURATION_FRAMES / FPS * SR) + SR
mono = np.zeros(total)


def place(sig, frame):
    s = int(frame / FPS * SR)
    e = min(total, s + len(sig))
    mono[s:e] += sig[: e - s]


def slap(level=0.3):
    """A sheet landing on the pile: airy swish into a soft paper thud."""
    n = int(0.12 * SR)
    swish = band(rng.standard_normal(n), 1500, 9000) * np.linspace(0, 1, n) ** 2 * 0.5
    m = int(0.18 * SR)
    thud = lowpass(rng.standard_normal(m), 700) * env(m, 0, 0.03) * 1.6
    snap = band(rng.standard_normal(m), 2500, 8000) * env(m, 0, 0.008)
    return np.concatenate([swish, thud + snap]) * level


# Intro: headline cards land on the pile (mirrors headlineGaps in timeline.ts),
# getting denser, then the title hit.
gaps = [7, 6, 6, 5, 5, 4, 4, 4, 3, 3, 3, 3]
starts = [-3]
for g in gaps:
    starts.append(starts[-1] + g)
for i, s0 in enumerate(starts):
    land = s0 + 5
    place(slap(0.22 + 0.012 * i), max(0, land - 0.12 * FPS))
place(riser(0.9, 0.12), 34)
place(sub_hit(0.8), 62)
place(whoosh(0.45, 0.14, rise=False), 60)
# Into footage: soft whoosh on the cut.
place(whoosh(0.4, 0.1, rise=False), HOOK - 3)
# Type cards and logo.
place(sub_hit(0.3, 80, 40, 1.0), src(4.5))
place(whoosh(0.4, 0.08, rise=False), src(4.95))
place(shimmer(1.8, 0.07), src(7.3))
place(whoosh(0.6, 0.1, rise=False), src(12.45))
# Payoff and end card.
place(sub_hit(0.4, 75, 36, 1.4), src(33.5))
place(whoosh(0.8, 0.1, rise=False), src(34.8))

stereo = reverb(mono, decay=1.8, mix=0.22)[:total]
peak = np.abs(stereo).max()
stereo = np.tanh(stereo / max(peak, 1e-9) * 1.1) * 0.7
out = Path(__file__).resolve().parent.parent / "public/wai-paperwork/sfx.wav"

import wave

with wave.open(str(out), "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((stereo * 32767).astype("<i2").tobytes())
print("wrote", out)
