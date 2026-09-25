"""Synthesises the "11 Seconds" soundtrack (music bed + sound effects).

Everything is generated from code so there are no licensing questions.
Frame numbers match src/eleven/ElevenSeconds.tsx (30fps).

    pip install numpy && python3 scripts/make_eleven_audio.py
"""
import wave

import numpy as np

SR = 48000
FPS = 30
DUR = 960 / FPS + 0.5
rng = np.random.default_rng(11)
N = int(DUR * SR)
music = np.zeros((N, 2))
sfx = np.zeros((N, 2))


def t_of(frame):
    return frame / FPS


def env(n, a, d):
    """Attack (s) then exponential decay (s)."""
    x = np.arange(n) / SR
    return np.minimum(1, x / max(a, 1e-4)) * np.exp(-np.maximum(0, x - a) / d)


def place(buf, sig, t, gain=1.0, pan=0.0):
    i = int(t * SR)
    if sig.ndim == 1:
        sig = np.stack([sig * (1 - pan) ** 0.5, sig * (1 + pan) ** 0.5], 1) / 2 ** 0.5
    j = min(N, i + len(sig))
    if i < N:
        buf[i:j] += sig[: j - i] * gain


def lowpass(x, cutoff):
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i, v in enumerate(x):
        acc = (1 - a) * v + a * acc
        y[i] = acc
    return y


def noise(n):
    return rng.standard_normal(n)


def reverb(x, secs=2.2, mix=0.3):
    n = int(secs * SR)
    ir = noise(n) * np.exp(-np.arange(n) / SR / (secs / 5))
    ir /= np.sqrt((ir ** 2).sum())
    out = np.zeros_like(x)
    L = len(x) + n
    F = 1 << int(np.ceil(np.log2(L)))
    for c in range(2):
        irc = np.roll(ir, c * 37)
        out[:, c] = np.fft.irfft(np.fft.rfft(x[:, c], F) * np.fft.rfft(irc, F), F)[: len(x)]
    return x * (1 - mix) + out * mix


def note(freq, secs, kind='pad'):
    n = int(secs * SR)
    x = np.arange(n) / SR
    if kind == 'pad':
        s = sum(np.sin(2 * np.pi * freq * (1 + d) * x + p) for d, p in [(-0.004, 0), (0, 1), (0.004, 2)])
        s += 0.3 * np.sin(2 * np.pi * freq * 2 * x)
        e = np.minimum(1, x / 0.8) * np.minimum(1, (secs - x) / 0.8)
        return s * e / 3
    if kind == 'pluck':
        s = np.sin(2 * np.pi * freq * x) + 0.4 * np.sin(2 * np.pi * freq * 2 * x) + 0.15 * np.sin(2 * np.pi * freq * 3 * x)
        return s * env(n, 0.003, 0.28)
    if kind == 'bell':
        s = np.sin(2 * np.pi * freq * x) + 0.5 * np.sin(2 * np.pi * freq * 2.76 * x) * np.exp(-x * 6)
        return s * env(n, 0.002, 0.9)
    if kind == 'bass':
        s = np.sin(2 * np.pi * freq * x) + 0.2 * np.sin(2 * np.pi * freq * 2 * x)
        return s * env(n, 0.01, 0.5)
    raise ValueError(kind)


def hz(midi):
    return 440 * 2 ** ((midi - 69) / 12)


# ---------------------------------------------------------------- sound effects
def tick(hi=True):
    n = int(0.05 * SR)
    x = np.arange(n) / SR
    s = np.sin(2 * np.pi * (3800 if hi else 2600) * x) * np.exp(-x * 220)
    s += noise(n) * np.exp(-x * 400) * 0.5
    return s


def pop(pitch=700):
    n = int(0.14 * SR)
    x = np.arange(n) / SR
    f = pitch * (1 + 1.2 * np.exp(-x * 40))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.002, 0.045)


def key_click():
    n = int(0.04 * SR)
    x = np.arange(n) / SR
    s = noise(n) * np.exp(-x * 300)
    s = s - lowpass(s, 1500)  # keep the clacky top
    return s + 0.4 * np.sin(2 * np.pi * 180 * x) * np.exp(-x * 120)


def whoosh(secs=0.6, rising=True):
    n = int(secs * SR)
    x = np.arange(n) / SR
    s = noise(n)
    shape = (x / secs) ** 2 if rising else np.exp(-x / (secs / 3))
    cut = 400 + 5000 * shape
    out = np.empty(n)
    acc = 0.0
    for i in range(n):
        a = np.exp(-2 * np.pi * cut[i] / SR)
        acc = (1 - a) * s[i] + a * acc
        out[i] = acc
    return out * shape * 3


def thump():
    n = int(0.5 * SR)
    x = np.arange(n) / SR
    f = 55 * (1 + 2.5 * np.exp(-x * 30))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.002, 0.18)


def swipe():
    return whoosh(0.35, rising=False) * 0.6


# Beat 1: stopwatch start, eleven ticks, then words
place(sfx, pop(520), t_of(2), 0.5)
for k in range(11):
    place(sfx, tick(k % 2 == 0), t_of(14 + k * 6), 0.55, pan=0.25)
place(sfx, note(hz(88), 1.2, 'bell') * 0.35, t_of(80), 1)  # "11" lands
for d in (108, 116, 124, 130, 138):
    place(sfx, pop(900 + d), t_of(d), 0.14, pan=rng.uniform(-0.4, 0.4))
place(sfx, pop(1400), t_of(150), 0.18)  # source tag

# Beat 2 (starts 190): objects pop in, then typing takes over the room
b2 = 190
for d, p in [(4, 600), (8, 750), (12, 680), (14, 900), (16, 500), (20, 450), (24, 950)]:
    place(sfx, pop(p), t_of(b2 + d), 0.35, pan=rng.uniform(-0.6, 0.6))
place(sfx, whoosh(1.4), t_of(b2 + 40), 0.25)
t = t_of(b2 + 55)
while t < t_of(b2 + 205):
    density = (t - t_of(b2 + 55)) / 5.0
    place(sfx, key_click(), t, 0.08 + 0.14 * density, pan=rng.uniform(-0.3, 0.3))
    t += rng.uniform(0.05, 0.19) * (1.3 - 0.8 * density)
for d in (60, 66, 100, 140, 150):
    place(sfx, pop(1100), t_of(b2 + d), 0.12)

# Beat 3 (400): a hard cut to silence, then the gradient blooms
place(sfx, whoosh(0.5, rising=False), t_of(400), 0.5)
place(sfx, thump(), t_of(400), 0.8)
for i, m in enumerate([74, 78, 81, 86]):
    place(sfx, note(hz(m), 2.5, 'bell') * 0.12, t_of(410 + i * 3), 1, pan=-0.3 + i * 0.2)

# Beat 4 (490): conversation bubble, cards, checks
b4 = 490
place(sfx, whoosh(0.5), t_of(b4 - 12), 0.35)
place(sfx, pop(620), t_of(b4 + 4), 0.4)
for d, pan in [(40, -0.5), (52, 0), (64, 0.5)]:
    place(sfx, swipe(), t_of(b4 + d), 0.5, pan)
for d, m, pan in [(85, 86, -0.5), (105, 90, 0), (122, 93, 0.5)]:
    place(sfx, note(hz(m), 1.4, 'bell') * 0.3, t_of(b4 + d), 1, pan)

# Beat 5 (745): everything drops away; one soft bell for the still stopwatch
place(sfx, whoosh(0.6, rising=False), t_of(745), 0.3)
place(sfx, note(hz(74), 3.0, 'bell') * 0.3, t_of(752), 1)

# Beat 6 (850): logo resolve
place(sfx, whoosh(0.8), t_of(850 - 18), 0.25)
place(sfx, thump(), t_of(858), 0.45)
for i, m in enumerate([62, 69, 74, 78, 81]):
    place(sfx, note(hz(m), 4.0, 'bell') * 0.13, t_of(860 + i * 2), 1, pan=-0.4 + i * 0.2)

# ------------------------------------------------------------------------ music
BPM = 100
BEAT = 60 / BPM  # 0.6s = 18 frames
# D major: Dmaj9 - Bm9 - Gmaj9 - A6sus, one chord per bar
chords = [
    (50, [62, 66, 69, 73, 76]),
    (47, [59, 62, 66, 69, 73]),
    (43, [59, 62, 66, 67, 71]),
    (45, [57, 62, 64, 66, 69]),
]


def bar_chord(i):
    return chords[i % 4]


def kick():
    return thump()


def hat():
    n = int(0.05 * SR)
    s = noise(n)
    return (s - lowpass(s, 6000)) * env(n, 0.001, 0.02)


# Section A (0 – 13.3s): sparse, tense. A low pulse on each beat and a thin pad.
tA_end = t_of(400)
t = 0.0
bar = 0
while t < tA_end:
    root, pad = bar_chord(bar if bar % 2 == 0 else 1)
    for m in pad[:3]:
        place(music, note(hz(m), BEAT * 4 + 0.8, 'pad') * 0.05, t, 1)
    for b in range(4):
        tb = t + b * BEAT
        if tb < tA_end:
            place(music, note(hz(root - 12 + 12), 0.4, 'bass') * 0.18 * (1 if b % 2 == 0 else 0.6), tb, 1)
    t += BEAT * 4
    bar += 1

# Section B (beat 3 → end of beat 4): the groove opens up, warm and hopeful
tB0, tB1 = t_of(406), t_of(745)
t = tB0
bar = 0
while t < tB1:
    root, pad = bar_chord(bar)
    for m in pad:
        place(music, note(hz(m), BEAT * 4 + 1.0, 'pad') * 0.05, t, 1)
    for b in range(4):
        tb = t + b * BEAT
        if tb >= tB1:
            break
        place(music, kick() * (1 if b % 2 == 0 else 0.55), tb, 0.55)
        place(music, note(hz(root - 12), BEAT * 0.9, 'bass') * 0.28, tb, 1)
        for h in range(2):
            place(music, hat(), tb + h * BEAT / 2 + BEAT / 4, 0.15, pan=0.3)
        # arpeggiated pluck, 8ths
        for h in range(2):
            m = pad[(b * 2 + h) % len(pad)] + 12
            place(music, note(hz(m), 0.5, 'pluck') * 0.10, tb + h * BEAT / 2, 1, pan=-0.3 + 0.6 * ((b * 2 + h) % 2))
    t += BEAT * 4
    bar += 1

# Section C (beat 5 → end): just the pad, slow and open. Time stops ticking.
for i, (s, chord) in enumerate([(t_of(745), chords[0]), (t_of(850), chords[2]), (t_of(880), chords[0])]):
    length = [3.8, 1.4, 4.0][i]
    for m in chord[1]:
        place(music, note(hz(m), length, 'pad') * 0.06, s, 1)
    place(music, note(hz(chord[0] - 12), length, 'pad') * 0.08, s, 1)

# -------------------------------------------------------------------------- mix
music = reverb(music, 2.6, 0.35)
sfx = reverb(sfx, 1.4, 0.2)
mix = music * 0.9 + sfx
# Silence the first frames of beat 3's hard cut so the bloom lands
mix = np.tanh(mix * 1.4) / 1.4
fade = np.ones(N)
fn = int(1.2 * SR)
fade[-fn:] = np.linspace(1, 0, fn)
mix *= fade[:, None]
mix *= 0.89 / np.abs(mix).max()

out = (mix * 32767).astype('<i2')
with wave.open('public/eleven/soundtrack.wav', 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(out.tobytes())
print('wrote public/eleven/soundtrack.wav', round(DUR, 2), 's')
