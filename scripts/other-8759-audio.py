"""Ambient pad + glossy UI sound design for "The Other 8,759", timed to the frame cues in
src/other/timeline.ts and src/other/Film.tsx. Writes public/wai/other-8759-audio.wav.
Requires numpy + scipy.  python3 scripts/other-8759-audio.py"""
import numpy as np
from scipy.signal import butter, fftconvolve, sosfilt
from scipy.io import wavfile

SR = 48000
FPS = 30
DUR = 990 / FPS
N = int(SR * DUR)
L = np.zeros(N); R = np.zeros(N)
rng = np.random.default_rng(8759)
note = lambda m: 440 * 2 ** ((m - 69) / 12)

# Beats (frames), mirrors timeline.ts
HOUR, SWEEP, POPS, SIGNALS, WAVE, TAGLINE, LOGO = 120, 285, 390, 510, 630, 750, 858


def add(sig, frame, gain=1.0, pan=0.0):
    i = int(frame / FPS * SR)
    if i >= N or i < 0: return
    sig = sig[: N - i] * gain
    L[i:i + len(sig)] += sig * np.sqrt(0.5 * (1 - pan))
    R[i:i + len(sig)] += sig * np.sqrt(0.5 * (1 + pan))

def ts(sec): return np.arange(int(sec * SR)) / SR
def lp(x, hz): return sosfilt(butter(2, min(hz, SR / 2 - 100) / (SR / 2), output='sos'), x)
def hp(x, hz): return sosfilt(butter(2, hz / (SR / 2), 'high', output='sos'), x)
def bp(x, lo, hi): return sosfilt(butter(2, [lo / (SR / 2), hi / (SR / 2)], 'band', output='sos'), x)
def env(t, a, r): return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / r)

# ---------- Sound palette ----------

def tap(pitch=1.0):
    """Soft glossy UI tap for a word landing."""
    t = ts(0.12)
    body = np.sin(2 * np.pi * 1800 * pitch * t * (1 - 0.3 * t)) * env(t, 0.001, 0.018)
    click = hp(rng.standard_normal(len(t)), 3000) * env(t, 0.0005, 0.004) * 0.4
    return body * 0.5 + click

def bubble(base):
    """Glossy pop: pitch-rising sine blip with a glassy overtone."""
    t = ts(0.35)
    f = base * (1 + 0.9 * (1 - np.exp(-t / 0.03)))
    ph = 2 * np.pi * np.cumsum(f) / SR
    s = np.sin(ph) * env(t, 0.002, 0.07) + 0.3 * np.sin(2.01 * ph) * env(t, 0.002, 0.04)
    tp = tap(1.3)
    s[: len(tp)] += 0.25 * tp
    return s

def chime(freqs, decay=1.6, dur=3.0):
    """Glass chime: inharmonic partials, long shimmer tail."""
    t = ts(dur); s = np.zeros(len(t))
    for k, f in enumerate(freqs):
        for p, a in ((1, 1), (2.76, 0.35), (5.4, 0.15)):
            s += a * np.sin(2 * np.pi * f * p * t + k) * env(t, 0.003, decay / p)
    return s / len(freqs)

def whoosh(dur, lo=300, hi=3000, rise=True):
    t = ts(dur); x = rng.standard_normal(len(t))
    e = np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 2
    out = np.zeros(len(t)); seg = 1024
    for i in range(0, len(t), seg):
        p = i / len(t); p = p if rise else 1 - p
        c = lo + (hi - lo) * p
        out[i:i + seg] = bp(x[max(0, i - 2048):i + seg], c * 0.7, c * 1.3)[-len(out[i:i + seg]):]
    return out * e * 0.6

def thump(f=55, dur=0.6):
    t = ts(dur)
    ph = 2 * np.pi * np.cumsum(f * (1 + 1.5 * np.exp(-t / 0.03))) / SR
    return np.sin(ph) * env(t, 0.002, 0.16)

def riser(dur):
    t = ts(dur)
    f = 200 * 2 ** (4 * (t / dur) ** 2)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.3 + hp(rng.standard_normal(len(t)), 2000) * 0.25
    return s * (t / dur) ** 2

def tick(pitch):
    t = ts(0.05)
    return np.sin(2 * np.pi * pitch * t) * env(t, 0.0005, 0.008)

# ---------- Ambient pad bed ----------
chords = [  # D major 9 world, warm and slow
    (0, [50, 57, 61, 64, 69]),
    (HOUR, [47, 54, 59, 62, 66]),
    (SWEEP, [43, 50, 55, 59, 66]),
    (POPS, [45, 52, 57, 61, 64]),
    (SIGNALS, [50, 57, 62, 66, 69]),
    (WAVE, [43, 50, 59, 62, 69]),
    (TAGLINE, [50, 57, 61, 66, 71]),
    (LOGO, [50, 57, 62, 66, 69, 74]),
    (990, []),
]
pad = np.zeros(N)
for (f0, notes), (f1, _) in zip(chords, chords[1:]):
    a, b = int(f0 / FPS * SR), int(f1 / FPS * SR)
    b2 = min(N, b + int(1.0 * SR)); t = np.arange(b2 - a) / SR
    seg = np.zeros(len(t))
    for m in notes:
        for det in (-0.08, 0.08):
            seg += np.sin(2 * np.pi * note(m + det) * t + rng.uniform(0, 6)) + 0.3 * np.sin(4 * np.pi * note(m + det) * t)
    fade = np.minimum(1, t / 0.8) * np.clip((b2 - a) / SR - t, 0, 1)
    pad[a:b2] += seg * fade / max(1, len(notes))
pad = lp(pad, 1400)
lvl = np.interp(np.arange(N) / SR * FPS, [0, 90, POPS, SIGNALS, WAVE, WAVE + 40, LOGO, 960, 990], [0, .5, .55, .7, .8, 1, .9, .8, 0])
add(pad * lvl * 0.16, 0)
# Sub drone under the dark field
t = np.arange(N) / SR
add(np.sin(2 * np.pi * 36.7 * t) * np.interp(t * FPS, [0, 60, WAVE, TAGLINE, LOGO, 990], [0, 1, 1, .6, .3, 0]) * 0.12, 0)

# Soft pulse from beat 5 onward (builds energy into the payoff)
bpm = 100; step = 60 / bpm / 2
for k in range(int((DUR - SIGNALS / FPS) / step)):
    f = SIGNALS + k * step * FPS
    if f > 975: break
    m = [62, 69, 66, 69][k % 4] + (12 if f > WAVE else 0)
    tt = ts(0.3)
    pl = np.sin(2 * np.pi * note(m) * tt) * env(tt, 0.002, 0.08)
    add(pl, f, 0.05 * (1.4 if f > WAVE else 1), pan=0.4 * (-1) ** k)

# ---------- Cues ----------
# Beat 1: cubes rising: a scatter of tiny glossy ticks, densest mid-rise
for k in range(160):
    f = rng.beta(2, 3) * 90 + 4
    add(tick(rng.uniform(2500, 5200)), f, 0.05, pan=rng.uniform(-.8, .8))
add(whoosh(2.5, 150, 900), 0, 0.25)
add(bubble(700), 62, 0.25)                       # caption tag

# Beat 2: the hour cube lifts and ignites
add(whoosh(1.4, 200, 1800), HOUR + 2, 0.35)
add(chime([note(74), note(78), note(81)], 2.2, 4), HOUR + 26, 0.45)
add(thump(48, 0.9), HOUR + 26, 0.35)

def words(start, n, pitch=1.0, gain=0.22):
    for w in range(n): add(tap(pitch * (1 + 0.04 * w)), start + w * 3, gain, pan=-0.3 + 0.12 * w)

words(HOUR + 34, 4); words(HOUR + 46, 5); words(HOUR + 58, 3)
add(bubble(650), HOUR + 82, 0.25)                # CDC tag
add(whoosh(0.5, 2500, 600, rise=False), SWEEP - 12, 0.25)

# Beat 3: sweep back
add(whoosh(2.0, 150, 1200), SWEEP + 4, 0.4)
words(SWEEP + 22, 4, 0.9); words(SWEEP + 36, 3, 0.9)
add(whoosh(0.5, 2500, 600, rise=False), POPS - 10, 0.25)

# Beat 4: vignettes pop, ascending pitches; labels tick in
for k, (f, pan) in enumerate(((398, -.6), (414, .6), (430, -.2), (446, .4))):
    add(bubble([420, 520, 620, 760][k]), f, 0.45, pan)
    add(tick(3200), f + 10, 0.08, pan)
    add(tap(1.2), f + 10, 0.12, pan)

# Beat 5: count-up and signals line
add(whoosh(0.9, 300, 2600), SIGNALS - 6, 0.3)
words(SIGNALS + 8, 6, 1.05)
for k in range(26):                               # counter ticking up
    add(tick(1500 + k * 90), SIGNALS + 16 + k * (26 / 26), 0.09)
add(chime([note(81), note(85)], 0.8, 1.5), SIGNALS + 42, 0.25)
words(SIGNALS + 46, 5, 1.1)
add(whoosh(0.5, 2500, 600, rise=False), WAVE - 8, 0.25)

# Beat 6: the wave: boom + shimmer, sparkles along paths, heartbeat lub-dub
add(thump(40, 1.4), WAVE, 0.7)
add(riser(0.6)[::-1] * 0.4, WAVE, 0.3)
shimmer = chime([note(m) for m in (74, 78, 81, 86, 90)], 2.5, 5)
add(shimmer, WAVE + 2, 0.35)
for k in range(28):
    add(tick(note(86 + [0, 4, 7, 11, 14][k % 5])), WAVE + 22 + k * 2.2, 0.07, pan=rng.uniform(-.7, .7))
for f in (WAVE + 40, WAVE + 66, WAVE + 92):
    add(thump(60, 0.4), f, 0.35); add(thump(52, 0.4), f + 7, 0.25)

# Beat 7a: tagline
add(thump(45, 1.0), TAGLINE + 10, 0.45)
add(chime([note(62), note(69), note(74)], 1.8, 3), TAGLINE + 10, 0.3)
words(TAGLINE + 32, 6, 1.0)
add(riser(0.9), LOGO - 26, 0.45)                 # into the flash
add(whoosh(0.7, 400, 4000), LOGO - 14, 0.4)

# Beat 7b: logo rises, sheen, tagline
add(thump(42, 1.6), LOGO + 2, 0.6)
add(whoosh(1.0, 1200, 200, rise=False), LOGO + 6, 0.3)
add(chime([note(74), note(81), note(86), note(90)], 3.0, 5), LOGO + 34, 0.4)   # sheen glint
add(bubble(900), LOGO + 58, 0.2)

# ---------- Mix ----------
ir_t = ts(2.2)
ir = rng.standard_normal(len(ir_t)) * np.exp(-ir_t / 0.55)
ir = lp(ir, 5000)
wetL = fftconvolve(L, ir)[:N]; wetR = fftconvolve(R, ir[::-1].copy())[:N]
L2 = L + 0.012 * wetL; R2 = R + 0.012 * wetR
fade = np.clip((990 / FPS - t) / 1.0, 0, 1)
L2 *= fade; R2 *= fade
peak = max(np.abs(L2).max(), np.abs(R2).max())
out = np.tanh(np.stack([L2, R2], 1) / peak * 1.1) * 0.89
wavfile.write('public/wai/other-8759-audio.wav', SR, (out * 32767).astype(np.int16))
print('wrote public/wai/other-8759-audio.wav', round(DUR, 2), 's')
