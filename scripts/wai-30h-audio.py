"""Original techy-but-friendly score + SFX for the Wai "30 hours" film, synthesised and timed to
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

def noise(n): return rng.standard_normal(n)

# ---- Music: techy but friendly -----------------------------------------------
# 116 bpm, bright major I-V-vi-IV in D. Soft kick, crisp 16th hats, claps,
# sidechained pads and bass, marimba-ish plucks and a bleepy arp. Drums drop out
# under the "Every hour..." line and the closing card.
BPM = 116
BEAT = 60 / BPM
BAR = BEAT * 4
T0 = 0.25
beat_t = lambda k: T0 + k * BEAT
PROG = [(38, [50, 54, 57, 61]), (45, [49, 52, 57, 61]), (47, [50, 54, 59, 62]), (43, [50, 55, 59, 62])]  # D A Bm G
chord_at = lambda t: PROG[int(max(0, t - T0) // (BAR * 1)) % 4]

sections = {  # seconds
    'kick': [(2.3, 13.4), (17.0, 23.0)],
    'hats': [(4.4, 13.4), (16.6, 23.0)],
    'clap': [(6.5, 13.4), (19.4, 23.0)],
    'bass': [(2.3, 13.5), (16.6, 23.1)],
    'arp': [(0.3, 13.5), (19.2, 23.2)],
}
on = lambda name, t: any(a <= t < b for a, b in sections[name])
ML = np.zeros(N); MR = np.zeros(N)

def madd(sig, at, gain=1.0, pan=0.0):
    i = int(at * SR)
    if i >= N or i < 0: return
    sig = sig[: N - i] * gain
    ML[i:i + len(sig)] += sig * np.sqrt(0.5 * (1 - pan))
    MR[i:i + len(sig)] += sig * np.sqrt(0.5 * (1 + pan))

def saw(fr, n, ph=0.0):
    t = np.arange(n) / SR
    return ((t * fr + ph) % 1) * 2 - 1

def marimba(m, dur=0.5):
    n = int(dur * SR); t = np.arange(n) / SR
    x = np.sin(2 * np.pi * note(m) * t) * np.exp(-t / 0.18) + 0.25 * np.sin(2 * np.pi * note(m) * 4 * t) * np.exp(-t / 0.03)
    return x * np.minimum(1, t / 0.002)

def bleep(m, dur=0.12):
    n = int(dur * SR); t = np.arange(n) / SR
    x = np.sign(np.sin(2 * np.pi * note(m) * t)) * 0.5 + np.sin(2 * np.pi * note(m) * t) * 0.5
    return lp(x, 3500) * np.exp(-t / 0.05) * np.minimum(1, t / 0.002)

# Drums + bass + arp on the grid.
k = 0
kicks = []
while beat_t(k) < DUR:
    t = beat_t(k)
    root, tones = chord_at(t)
    if on('kick', t):
        n = int(0.3 * SR); tt = np.arange(n) / SR
        f = 150 * np.exp(-tt / 0.03) + 48
        madd(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / 0.16), t, 0.75); kicks.append(t)
    if on('clap', t) and k % 2 == 1:
        n = int(0.2 * SR); tt = np.arange(n) / SR
        c = sum(np.roll(hp(noise(n), 900) * np.exp(-tt / 0.04), int(d * SR)) for d in (0, 0.009, 0.018))
        madd(lp(c, 6000), t, 0.16, 0.1)
    for s16 in range(4):
        ts = t + s16 * BEAT / 4
        if on('hats', ts):
            n = int(0.05 * SR); tt = np.arange(n) / SR
            vel = [0.5, 0.25, 0.8, 0.3][s16]
            madd(hp(noise(n), 7500) * np.exp(-tt / (0.03 if s16 == 2 else 0.012)), ts, 0.09 * vel, 0.35 if s16 % 2 else -0.35)
        if on('arp', ts):
            seq = [tones[0] + 12, tones[1] + 12, tones[2] + 12, tones[3] + 12]
            m = seq[(k * 4 + s16) % 4] + (12 if (k // 8) % 2 and s16 == 3 else 0)
            madd(bleep(m) if s16 % 2 else marimba(m), ts, 0.09 if s16 % 2 else 0.12, [-0.5, 0.4, -0.2, 0.5][s16])
    for e8 in range(2):  # bass: root on the beat, octave on the "and"
        te = t + e8 * BEAT / 2
        if on('bass', te):
            n = int(BEAT / 2 * SR * 0.9); tt = np.arange(n) / SR
            m = root + (12 if e8 else 0)
            x = lp(saw(note(m), n) + 0.5 * np.sin(2 * np.pi * note(m - 12) * tt), 700) * np.exp(-tt / 0.25) * np.minimum(1, tt / 0.004)
            madd(x, te, 0.22)
    k += 1

# Sidechain envelope from the kicks.
duck = np.ones(N); tt = np.arange(int(0.35 * SR)) / SR; shape = 1 - 0.6 * np.exp(-tt / 0.09)
for t in kicks:
    i = int(t * SR); j = min(N, i + len(shape)); duck[i:j] = np.minimum(duck[i:j], shape[: j - i])

# Pads follow the progression; dark and filtered under the line, open at the end.
def pad(midis, start, end, gain, bright=2200, fade=0.4):
    n = int((end - start) * SR); t = np.arange(n) / SR
    s = sum(saw(note(m) * 2 ** (d / 12), n, rng.random()) for m in midis for d in (-0.08, 0.0, 0.09))
    s = lp(s / (3 * len(midis)), bright, 4)
    return s * np.clip(np.minimum(t / fade, (end - start - t) / fade), 0, 1) * gain
P = np.zeros(N)
t = T0
while t < 13.7:
    root, tones = chord_at(t); x = pad(tones, t, min(t + BAR + 0.05, 13.7), 0.2, 2400)
    i = int(t * SR); P[i:i + len(x)] += x[: N - i]; t += BAR
x = pad([47, 54, 59, 62, 66], 13.5, 16.8, 0.2, 800, 0.8); i = int(13.5 * SR); P[i:i + len(x)] += x   # Bm, filtered
t = 16.6
while t < 23.1:
    root, tones = chord_at(t); x = pad(tones + [tones[1] + 12], t, min(t + BAR + 0.05, 23.1), 0.2, 3000)
    i = int(t * SR); P[i:i + len(x)] += x[: N - i]; t += BAR
x = pad([50, 54, 57, 61, 64, 69], 23.0, DUR, 0.24, 2600, 1.2); i = int(23.0 * SR); P[i:i + len(x)] += x[: N - i]  # Dmaj9 resolve
ML += P * duck; MR += np.roll(P, 600) * duck
# Friendly marimba motif over the end card.
for i, (m, dt) in enumerate([(74, 0), (78, 0.26), (81, 0.52), (86, 1.03), (85, 2.07), (81, 2.33), (78, 2.59), (81, 3.1)]):
    madd(marimba(m, 0.8), 23.4 + dt, 0.14, (i % 3 - 1) * 0.4)
# Filter riser into the prompt section.
n = int(2.6 * SR); tt = np.arange(n) / SR
madd(lp(noise(n), 3000) * (tt / 2.6) ** 3 * 0.5 + np.sin(2 * np.pi * np.cumsum(220 * 2 ** (2 * tt / 2.6)) / SR) * (tt / 2.6) ** 2 * 0.2, 14.0, 0.25)
L += ML; R += MR

def pluck(m, dur=0.6, bright=4000):
    n = int(dur * SR); t = np.arange(n) / SR
    x = np.sin(2 * np.pi * note(m) * t) + 0.35 * np.sin(2 * np.pi * note(m + 12) * t) + 0.12 * np.sin(2 * np.pi * note(m + 19) * t)
    return lp(x * np.exp(-t / (dur / 4)) * np.minimum(1, t / 0.003), bright)

# ---- Effects --------------------------------------------------------------
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
