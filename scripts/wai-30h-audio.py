"""Original score + SFX for the Wai "30 hours" film, synthesised and timed to
the frame cues in src/wai/Backlog.tsx. Writes public/wai/30h-score.wav.
Requires numpy + scipy.  python3 scripts/wai-30h-audio.py"""
import numpy as np
from scipy.signal import fftconvolve, butter, sosfilt
from scipy.io import wavfile

SR = 48000
FPS = 30
DUR = 870 / FPS
N = int(SR * DUR)
L = np.zeros(N); R = np.zeros(N)
rng = np.random.default_rng(7)
t_ = lambda f: f / FPS
note = lambda m: 440 * 2 ** ((m - 69) / 12)

def add(sig, at, gain=1.0, pan=0.0):
    i = int(at * SR)
    if i >= N: return
    sig = sig[: N - i] * gain
    L[i:i + len(sig)] += sig * np.sqrt(0.5 * (1 - pan))
    R[i:i + len(sig)] += sig * np.sqrt(0.5 * (1 + pan))

def env(n, a, r, sus=None):
    t = np.arange(n) / SR
    e = np.minimum(1, t / max(a, 1e-4))
    return e * (np.exp(-t / r) if sus is None else 1)

def lp(x, hz, order=2):
    return sosfilt(butter(order, min(hz, SR / 2 - 100) / (SR / 2), output='sos'), x)

def hp(x, hz):
    return sosfilt(butter(2, hz / (SR / 2), 'high', output='sos'), x)

# ---- Music ----------------------------------------------------------------
def pad(midis, start, end, gain, bright=1800, fade=1.2):
    n = int((end - start) * SR); t = np.arange(n) / SR
    s = np.zeros(n)
    for m in midis:
        for d in (-0.07, 0.0, 0.08):  # detuned saws, softened
            ph = rng.random()
            s += ((t * note(m) * 2 ** (d / 12) + ph) % 1 * 2 - 1)
    s = lp(s / (3 * len(midis)), bright, 4)
    e = np.minimum(1, np.minimum(t / fade, (end - start - t) / fade)).clip(0)
    return s * e * gain

chords = [  # (start s, end s, notes, brightness)
    (0.0, 5.0, [38, 50, 57, 61, 64, 66], 1400),     # Dmaj9-ish
    (4.6, 8.2, [43, 55, 59, 62, 66, 69], 1700),     # Gmaj7
    (7.8, 13.7, [35, 47, 54, 57, 62, 66], 1500),    # Bm add
    (13.5, 16.6, [35, 47, 54, 59, 62], 700),        # Bm, dark (the line)
    (16.4, 19.8, [43, 55, 59, 62, 66, 69], 1600),   # G
    (19.6, 23.2, [45, 57, 61, 64, 67, 71], 2600),   # A6 lift
    (23.0, DUR, [38, 50, 57, 61, 64, 66, 69], 1900),  # D resolve
]
for s, e, ms, b in chords:
    x = pad(ms, s, e, 0.16, b)
    add(x, s, 1, -0.2); add(x, s + 0.013, 0.8, 0.25)

# Sub pulse (96bpm eighths) where the film is "working".
beat = 60 / 96 / 2
def pulse(start, end, root, gain):
    k = 0; t0 = start
    while t0 < end:
        n = int(0.22 * SR); t = np.arange(n) / SR
        x = np.sin(2 * np.pi * note(root) * t) * np.exp(-t / 0.08)
        add(x, t0, gain * (1 if k % 2 == 0 else 0.55)); t0 += beat; k += 1
pulse(1.0, 13.3, 26, 0.22)
pulse(16.5, 23.0, 31, 0.24)

# Glassy arpeggio plucks.
def pluck(m, dur=0.6, bright=4000):
    n = int(dur * SR); t = np.arange(n) / SR
    x = np.sin(2 * np.pi * note(m) * t) + 0.35 * np.sin(2 * np.pi * note(m + 12) * t) + 0.12 * np.sin(2 * np.pi * note(m + 19) * t)
    return lp(x * np.exp(-t / (dur / 4)) * np.minimum(1, t / 0.003), bright)
arp = [62, 66, 69, 73, 74, 73, 69, 66]
t0, k = 2.0, 0
while t0 < 13.0:
    add(pluck(arp[k % 8]), t0, 0.05, (k % 2) * 0.6 - 0.3); t0 += beat * 2; k += 1

# ---- Effects --------------------------------------------------------------
def noise(n): return rng.standard_normal(n)

def whoosh(at, dur, up=True, gain=0.35):
    n = int(dur * SR); t = np.arange(n) / SR
    x = noise(n); out = np.zeros(n); blk = 1024
    for i in range(0, n, blk):  # sweeping band
        u = i / n; fc = 300 + 5000 * (u if up else 1 - u) ** 2
        out[i:i + blk] = lp(x[i:i + blk], fc)[: len(out[i:i + blk])]
    e = np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 2
    add(hp(out, 120) * e, at, gain)

def tick(at, gain=0.08, hz=5200):
    n = int(0.03 * SR); t = np.arange(n) / SR
    add(hp(noise(n), hz) * np.exp(-t / 0.006), at, gain, rng.uniform(-0.3, 0.3))

def thump(at, gain=0.3):
    n = int(0.25 * SR); t = np.arange(n) / SR
    f = 140 * np.exp(-t / 0.05) + 55
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.07)
    add(x + lp(noise(n), 1800) * np.exp(-t / 0.02) * 0.3, at, gain, rng.uniform(-0.4, 0.4))

def shimmer(at, gain=0.12, ms=(74, 78, 81, 85)):
    for i, m in enumerate(ms): add(pluck(m, 1.6, 7000), at + i * 0.045, gain)

def riser(at, dur, gain=0.18):
    n = int(dur * SR); t = np.arange(n) / SR
    f = 110 * 2 ** (2.5 * t / dur)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.4 + hp(noise(n), 2000) * (t / dur) * 0.5
    add(x * (t / dur) ** 2, at, gain)

def impact(at, gain=0.5):
    n = int(2.5 * SR); t = np.arange(n) / SR
    x = np.sin(2 * np.pi * 45 * t) * np.exp(-t / 0.5) + lp(noise(n), 900) * np.exp(-t / 0.35) * 0.4
    add(x, at, gain)

# Opening: counter pull-back, bar fill.
whoosh(t_(26), t_(74), up=False, gain=0.25)
riser(t_(8), t_(92), 0.07)
for fr in range(62, 118, 2): tick(t_(fr), 0.045, 6000)           # caption typing
shimmer(t_(150), 0.12)                                             # split glows
for i in range(12): thump(t_(256 + 9 * i), 0.2)                    # cards pile up
riser(t_(300), t_(92), 0.14)                                       # tension
whoosh(t_(380), t_(32), up=True, gain=0.45)                        # whip into card
impact(t_(410), 0.18)
for i, fr in enumerate(range(505, 535, 2)): tick(t_(fr), 0.07, 3500)  # prompt typing
# Click on send.
n = int(0.05 * SR); tt = np.arange(n) / SR
add(hp(noise(n), 1500) * np.exp(-tt / 0.004) + np.sin(2 * np.pi * 1800 * tt) * np.exp(-tt / 0.01) * 0.4, t_(568), 0.35)
whoosh(t_(566), t_(30), up=True, gain=0.5)                         # fly through button
# Cards clear: rising pentatonic ticks, one per card.
penta = [74, 76, 78, 81, 83, 86, 88, 90, 93, 95, 98, 100]
for k, i in enumerate(range(11, -1, -1)):
    fr = 592 + (11 - i) * 5
    add(pluck(penta[k], 0.35, 8000), t_(fr), 0.1, (k % 3 - 1) * 0.4); tick(t_(fr), 0.05)
    add(lp(noise(int(0.12 * SR)), 3000) * np.exp(-np.arange(int(0.12 * SR)) / SR / 0.04), t_(fr + 3), 0.05)
riser(t_(656), t_(28), 0.2)
impact(t_(684), 0.45); shimmer(t_(684), 0.16, (62, 69, 74, 78, 81))  # flood
for fr in range(710, 744, 2): tick(t_(fr), 0.03, 6500)             # closing typing
shimmer(t_(790), 0.14, (74, 81, 86, 90))                           # logo chime

# ---- Mix: reverb, master fade, normalise -------------------------------------
ir_n = int(2.8 * SR); it = np.arange(ir_n) / SR
irL = noise(ir_n) * np.exp(-it / 0.7); irR = noise(ir_n) * np.exp(-it / 0.7)
wetL = fftconvolve(L, lp(irL, 5000))[:N]; wetR = fftconvolve(R, lp(irR, 5000))[:N]
wetL /= np.abs(wetL).max(); wetR /= np.abs(wetR).max()
mixL = L / np.abs(L).max() + wetL * 0.28; mixR = R / np.abs(R).max() + wetR * 0.28
tt = np.arange(N) / SR
fade = np.minimum(1, np.minimum(tt / 0.3, (DUR - tt) / 2.0)).clip(0)
st = np.stack([mixL, mixR], 1) * fade[:, None]
st = np.tanh(st * 1.2)
st = st / np.abs(st).max() * 0.89
wavfile.write('public/wai/30h-score.wav', SR, (st * 32767).astype(np.int16))
print('wrote public/wai/30h-score.wav', round(DUR, 2), 's')
