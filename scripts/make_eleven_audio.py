"""Builds the "11 Seconds" soundtrack: music + sound effects + voiceover.

The music follows the shape of the reference edit: ~104 BPM in F major, an airy
intro with no low end, a short cut to silence, then a warm electronic groove
(sub bass, kick, clap, hats, Rhodes, pad, plucks) that drops on the gradient
slide. It breaks down under "Take all the time you need" and lands on a final
chord on the logo.

- Keys/pads: MIDI rendered with FluidSynth + the FluidR3 GM soundfont.
- Drums, sub bass, risers and SFX: synthesised in numpy.
- VO: clips in public/eleven/vo (see make_eleven_vo.py), music ducked under it.

    apt-get install fluidsynth fluid-soundfont-gm
    pip install numpy scipy mido soundfile
    python3 scripts/make_eleven_audio.py

Frame numbers match `beats` in src/eleven/ElevenSeconds.tsx (30fps).
"""
import os
import subprocess
import tempfile

import mido
import numpy as np
import soundfile as sf
from scipy.signal import butter, resample_poly, sosfilt

SR = 48000
FPS = 30
B1, B2, B3, B4, B5, B6, END = 0, 230, 440, 530, 800, 905, 1020
DUR = END / FPS + 0.3
N = int(DUR * SR)
rng = np.random.default_rng(11)
SF2 = '/usr/share/sounds/sf2/FluidR3_GM.sf2'


def ts(frame):
    return frame / FPS


def stereo(sig, pan=0.0):
    return np.stack([sig * np.sqrt((1 - pan) / 2), sig * np.sqrt((1 + pan) / 2)], 1)


def place(buf, sig, t, gain=1.0, pan=0.0):
    if sig.ndim == 1:
        sig = stereo(sig, pan)
    i = int(round(t * SR))
    j = min(N, i + len(sig))
    if 0 <= i < N:
        buf[i:j] += sig[: j - i] * gain


def filt(x, kind, f, order=2):
    return sosfilt(butter(order, f, kind, fs=SR, output='sos'), x, axis=0)


def env(n, a, d):
    x = np.arange(n) / SR
    return np.minimum(1, x / max(a, 1e-4)) * np.exp(-np.maximum(0, x - a) / d)


def noise(n):
    return rng.standard_normal(n)


def reverb(x, secs=2.2, mix=0.3):
    n = int(secs * SR)
    out = np.zeros_like(x)
    F = 1 << int(np.ceil(np.log2(len(x) + n)))
    for c in range(2):
        ir = filt(noise(n), 'low', 7000) * np.exp(-np.arange(n) / SR / (secs / 5))
        ir /= np.sqrt((ir ** 2).sum())
        out[:, c] = np.fft.irfft(np.fft.rfft(x[:, c], F) * np.fft.rfft(ir, F), F)[: len(x)]
    return x * (1 - mix) + out * mix


# ================================================================== grid
BPM = 104
BEAT = 60 / BPM
BAR = BEAT * 4
DROP = ts(B3)            # the drop lands on the gradient slide
G0 = DROP - 6 * BAR      # six intro bars before it
BREAK = ts(B5)           # breakdown under "Take all the time you need"
FINAL = ts(B6)           # last chord on the logo


def bar_t(b, beat=0.0):
    return G0 + b * BAR + beat * BEAT


# F major, smooth voice leading over a shared A-C top
CHORDS = [
    (41, [57, 60, 64, 67]),  # Fmaj9
    (45, [55, 60, 64, 67]),  # Am7
    (38, [57, 60, 64, 65]),  # Dm9
    (46, [57, 60, 62, 65]),  # Bbmaj9
]

# ================================================================== keys (MIDI)
events = []
EP, PAD, VIBES, AIR = 0, 1, 2, 3
programs = {EP: 4, PAD: 89, VIBES: 11, AIR: 91}


def n_(t, ch, note, vel, dur):
    if t >= 0:
        events.append((t, ch, note, int(vel), dur))


# Intro: Rhodes chords with a syncopated re-hit, vibes motif, airy pad
for b in range(-1, 6):
    root, ch = CHORDS[b % 4]
    t = bar_t(b)
    if t < 0.2:
        continue
    n_(t, EP, root + 12, 44 + 3 * max(0, b), BAR * 0.95)  # left hand
    for m in ch:
        n_(t, EP, m, 46 + 3 * max(0, b), BEAT * 2.2)
        n_(bar_t(b, 2.5), EP, m, 34 + 3 * max(0, b), BEAT * 1.3)
    if b >= 1:
        n_(t, PAD, root + 24, 30 + 4 * b, BAR)
        for m in ch[1:]:
            n_(t, PAD, m, 28 + 4 * b, BAR)
    motif = [(0, 72), (0.75, 69), (1.5, 67), (3, 64)] if b % 2 == 0 else [(0.5, 72), (1.5, 74), (2.5, 72)]
    if b >= 2:
        for beat, m in motif:
            n_(bar_t(b, beat), VIBES, m, 44 + 3 * b, BEAT * 1.5)
n_(bar_t(5), AIR, 77, 40, BAR * 0.9)

# Drop: full groove until the breakdown
b = 6
while bar_t(b) < BREAK - 0.1:
    root, ch = CHORDS[b % 4]
    t = bar_t(b)
    for beat, vel, d in [(0, 62, 1.4), (1.5, 50, 0.4), (2.5, 56, 1.2), (3.5, 44, 0.4)]:
        if bar_t(b, beat) < BREAK - 0.05:
            for m in ch:
                n_(bar_t(b, beat), EP, m, vel, BEAT * d)
    for m in [root + 24] + ch[1:]:
        n_(t, PAD, m, 44, BAR)
    arp = [ch[0] + 12, ch[1] + 12, ch[3] + 12, ch[2] + 12]
    for k in range(8):
        tt = bar_t(b, k * 0.5)
        if tt < BREAK - 0.05:
            n_(tt, VIBES, arp[k % 4], 50 - 10 * (k % 2), BEAT * 0.8)
    b += 1

# Breakdown: one open chord, nothing moving
for m in [53, 57, 60, 64, 67]:
    n_(BREAK + 0.02, EP, m, 40, 3.2)
    n_(BREAK + 0.02, PAD, m, 34, 3.4)
n_(BREAK + 0.8, VIBES, 72, 34, 2.4)

# Final chord on the logo, rolled
for i, m in enumerate([41, 53, 60, 64, 67, 69, 72, 76]):
    n_(FINAL + 0.02 + i * 0.03, EP, m, 60, 3.8)
    n_(FINAL + 0.02, PAD, m, 42, 3.8)
for i, m in enumerate([72, 76, 79, 84]):
    n_(FINAL + 0.25 + i * 0.12, VIBES, m, 46, 2.6)

mid = mido.MidiFile(ticks_per_beat=480)
track = mido.MidiTrack()
mid.tracks.append(track)
tempo = mido.bpm2tempo(BPM)
track.append(mido.MetaMessage('set_tempo', tempo=tempo))
for ch, p in programs.items():
    track.append(mido.Message('program_change', channel=ch, program=p))
    track.append(mido.Message('control_change', channel=ch, control=91, value={EP: 45, PAD: 80, VIBES: 70, AIR: 90}[ch]))
    track.append(mido.Message('control_change', channel=ch, control=93, value=40))
    track.append(mido.Message('control_change', channel=ch, control=10, value={EP: 64, PAD: 64, VIBES: 84, AIR: 44}[ch]))
    track.append(mido.Message('control_change', channel=ch, control=7, value={EP: 105, PAD: 70, VIBES: 80, AIR: 70}[ch]))
msgs = []
for t, ch, m, v, d in events:
    msgs.append((t, 1, mido.Message('note_on', channel=ch, note=m, velocity=max(1, min(127, v)))))
    msgs.append((t + d, 0, mido.Message('note_off', channel=ch, note=m, velocity=0)))
msgs.sort(key=lambda e: (e[0], e[1]))
last = 0
for t, _, msg in msgs:
    tick = int(round(mido.second2tick(t, 480, tempo)))
    msg.time = max(0, tick - last)
    last = max(last, tick)
    track.append(msg)

tmp = tempfile.mkdtemp()
mid.save(os.path.join(tmp, 'keys.mid'))
subprocess.run(
    ['fluidsynth', '-ni', '-g', '0.5', '-r', str(SR), '-R', '1', '-C', '1',
     '-o', 'synth.reverb.room-size=0.7', '-o', 'synth.reverb.width=1', '-o', 'synth.reverb.level=0.6',
     '-o', 'synth.chorus.depth=6', '-o', 'synth.chorus.level=0.8',
     '-F', os.path.join(tmp, 'keys.wav'), SF2, os.path.join(tmp, 'keys.mid')],
    check=True, capture_output=True,
)
keys_raw, sr = sf.read(os.path.join(tmp, 'keys.wav'))
assert sr == SR
keys = np.zeros((N, 2))
keys[: min(N, len(keys_raw))] = keys_raw[:N]
keys = filt(keys, 'high', 55)
keys = keys / (np.sqrt((keys ** 2).mean()) + 1e-9) * 0.05

# ================================================================== drums + bass
drums = np.zeros((N, 2))
bass = np.zeros((N, 2))
kick_times = []


def kick():
    n = int(0.5 * SR)
    x = np.arange(n) / SR
    f = 46 * (1 + 3.0 * np.exp(-x * 32))
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.002, 0.22)
    click = filt(noise(n), 'band', [2000, 7000]) * np.exp(-x * 400) * 0.25
    return np.tanh(1.6 * (body + click))


def clap():
    n = int(0.35 * SR)
    x = np.arange(n) / SR
    s = filt(noise(n), 'band', [900, 4500])
    e = np.zeros(n)
    for o in (0, 0.009, 0.018):
        i = int(o * SR)
        e[i:] += np.exp(-(x[: n - i]) * 180) * 0.6
    e += np.exp(-x * 14) * 0.25 * (x > 0.02)
    return s * e


def hat(open_=False):
    n = int((0.22 if open_ else 0.06) * SR)
    x = np.arange(n) / SR
    return filt(noise(n), 'high', 7500) * np.exp(-x * (18 if open_ else 90))


def sub(freq, secs):
    n = int(secs * SR)
    x = np.arange(n) / SR
    s = np.sin(2 * np.pi * freq * x) + 0.18 * np.sin(2 * np.pi * freq * 2 * x)
    e = np.minimum(1, x / 0.008) * np.minimum(1, (secs - x) / 0.04)
    return np.tanh(1.3 * s) * e


def hz(m):
    return 440 * 2 ** ((m - 69) / 12)


# Intro: hats creep in under the typing (filtered, getting brighter)
for b in range(2, 6):
    for k in range(8):
        t = bar_t(b, k * 0.5 + (0.04 if k % 2 else 0))
        if t < DROP - BEAT:
            lvl = 0.03 + 0.03 * (b - 2) + 0.03 * (k % 2 == 1)
            place(drums, hat(), t, lvl, 0.25)
# Rim clicks on 2 and 4 from bar 4
for b in (4, 5):
    for beat in (1, 3):
        t = bar_t(b, beat)
        if t < DROP - BEAT:
            n = int(0.05 * SR)
            place(drums, filt(noise(n), 'band', [1500, 4000]) * env(n, 0.001, 0.012), t, 0.18, -0.15)

# Groove from the drop to the breakdown
b = 6
while bar_t(b) < BREAK:
    root, _ = CHORDS[b % 4]
    for beat in (0, 1.75, 2.5):
        t = bar_t(b, beat)
        if t < BREAK - 0.02:
            place(drums, kick(), t, 0.2)
            kick_times.append(t)
    for beat in (1, 3):
        t = bar_t(b, beat)
        if t < BREAK - 0.02:
            place(drums, clap(), t, 0.3)
    for k in range(16):
        t = bar_t(b, k * 0.25 + (0.03 if k % 2 else 0))
        if t < BREAK - 0.02:
            lvl = [0.10, 0.04, 0.07, 0.04][k % 4]
            place(drums, hat(open_=(k % 8 == 6)), t, lvl * (0.8 if k % 8 == 6 else 1), 0.3 if k % 2 else -0.2)
    # sub bass: follows the kick, glides into the next bar
    for beat, length in ((0, 1.6), (1.75, 0.6), (2.5, 1.4)):
        t = bar_t(b, beat)
        if t < BREAK - 0.02:
            length = min(length * BEAT, BREAK - t)
            place(bass, sub(hz(root - 12 if root > 40 else root), length), t, 0.07)
    b += 1

# Final hit on the logo
place(drums, kick(), FINAL, 0.25)
kick_times.append(FINAL)
place(bass, sub(hz(29), 2.8) * np.exp(-np.arange(int(2.8 * SR)) / SR / 1.2), FINAL, 0.12)

# Sidechain pump on keys + bass from every kick
pump = np.ones(N)
for t in kick_times:
    i = int(t * SR)
    n = int(0.32 * SR)
    x = np.arange(n) / SR
    j = min(N, i + n)
    pump[i:j] = np.minimum(pump[i:j], (1 - 0.5 * np.exp(-x / 0.09))[: j - i])
keys *= pump[:, None]
bass *= pump[:, None] ** 0.5

# Breakdown: keys lose their top end, like a filter closing
k_dark = filt(keys, 'low', 700)
mixk = np.clip((np.arange(N) / SR - BREAK) / 0.4, 0, 1)
mixk *= 1 - np.clip((np.arange(N) / SR - (FINAL - 0.6)) / 0.6, 0, 1)
keys = keys * (1 - mixk[:, None]) + k_dark * mixk[:, None] * 1.4

# Risers and the cut before the drop
def riser(secs):
    n = int(secs * SR)
    x = np.arange(n) / SR
    s = filt(noise(n), 'high', 1500)
    tone = np.sin(2 * np.pi * np.cumsum(300 + 900 * (x / secs) ** 2) / SR) * 0.15
    return (s * 0.5 + tone) * (x / secs) ** 2.5


place(drums, riser(BAR * 1.5), DROP - 0.3 - BAR * 1.5, 0.35)
# Hard cut: silence the music for the last 0.3s before the drop
t_idx = np.arange(N) / SR
cut = 1 - ((t_idx > DROP - 0.3) & (t_idx < DROP)).astype(float)
cut = np.convolve(cut, np.ones(240) / 240, 'same')

drums = reverb(drums, 1.0, 0.1)
music = (keys + drums + bass) * cut[:, None]

# Tail: everything rings out after the final chord
fade = np.ones(N)
f0 = int((END / FPS - 1.6) * SR)
fade[f0:] = np.linspace(1, 0, N - f0) ** 2
music *= fade[:, None]

# ================================================================== sound effects
sfx = np.zeros((N, 2))


def tick(hi=True):
    n = int(0.06 * SR)
    x = np.arange(n) / SR
    s = np.sin(2 * np.pi * (4200 if hi else 3100) * x) * np.exp(-x * 260)
    s += filt(noise(n), 'high', 3000) * np.exp(-x * 500) * 0.6
    s += np.sin(2 * np.pi * 900 * x) * np.exp(-x * 150) * 0.3
    return s


def pop(pitch=700):
    n = int(0.12 * SR)
    x = np.arange(n) / SR
    f = pitch * (1 + 0.8 * np.exp(-x * 45))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.001, 0.035)


def key_click():
    n = int(0.05 * SR)
    x = np.arange(n) / SR
    s = filt(noise(n), 'band', [1800, 6000]) * np.exp(-x * 320)
    return s + 0.5 * np.sin(2 * np.pi * rng.uniform(160, 220) * x) * np.exp(-x * 110)


def whoosh(secs=0.6, rising=True, lo=300, hi=6000):
    n = int(secs * SR)
    x = np.arange(n) / SR
    shape = (x / secs) ** 2.2 if rising else np.exp(-x / (secs / 3.5))
    dark = filt(noise(n), 'band', [lo, lo * 4])
    bright = filt(noise(n), 'band', [hi / 4, hi])
    s = dark * (1 - shape) + bright * shape
    edge = np.minimum(1, x / 0.02) * np.minimum(1, (secs - x) / 0.03)
    return s * shape * edge * 2


def glass(freq):
    n = int(1.6 * SR)
    x = np.arange(n) / SR
    s = sum(a * np.sin(2 * np.pi * freq * r * x) * np.exp(-x * dcy)
            for r, a, dcy in [(1, 1, 3), (2.01, 0.35, 5), (3.02, 0.15, 8), (4.1, 0.08, 12)])
    return s * np.minimum(1, x / 0.002)


place(sfx, tick(False), ts(B1 + 2), 0.3)
for k in range(11):
    place(sfx, tick(k % 2 == 0), ts(B1 + 14 + k * 6), 0.45, pan=0.2)
place(sfx, glass(1397) * 0.35, ts(B1 + 80), 1)
place(sfx, pop(1400), ts(B1 + 150), 0.1)

for d, p in [(4, 600), (8, 750), (12, 680), (14, 900), (16, 500), (20, 450), (24, 950)]:
    place(sfx, pop(p), ts(B2 + d), 0.24, pan=rng.uniform(-0.6, 0.6))
place(sfx, whoosh(1.6, lo=150, hi=3000), ts(B2 + 38), 0.15)
t = ts(B2 + 55)
while t < DROP - 0.35:
    density = min(1, (t - ts(B2 + 55)) / 5.5)
    place(sfx, key_click(), t, 0.05 + 0.1 * density, pan=rng.uniform(-0.3, 0.3))
    t += rng.uniform(0.05, 0.18) * (1.3 - 0.8 * density)

place(sfx, whoosh(0.5), ts(B4) - 0.45, 0.2)
place(sfx, pop(620), ts(B4 + 4), 0.25)
for d, pan in [(40, -0.5), (52, 0), (64, 0.5)]:
    place(sfx, whoosh(0.35, rising=False, lo=400, hi=5000), ts(B4 + d), 0.22, pan)
for d, f, pan in [(85, 1397, -0.5), (105, 1760, 0), (122, 2093, 0.5)]:
    place(sfx, glass(f) * 0.22, ts(B4 + d), 1, pan)
place(sfx, whoosh(0.7, rising=False, lo=200, hi=3000), BREAK, 0.14)
place(sfx, whoosh(0.9, lo=200, hi=6000), FINAL - 0.9, 0.16)
sfx = reverb(sfx, 1.2, 0.18)

# ================================================================== voiceover
vo = np.zeros((N, 2))
cues = {
    '1a': B1 + 78, '1b': B1 + 106,
    '2a': B2 + 56, '2b': B2 + 96,
    '3': B3 + 8,
    '4a': B4 + 106, '4b': B4 + 172,
    '5': B5 + 18,
    '6': B6 + 12,
}
limits = {'1': B2, '2': B3, '3': B4, '4': B5, '5': B6, '6': END}
for key, frame in cues.items():
    a, sr = sf.read(f'public/eleven/vo/{key}.wav')
    if a.ndim > 1:
        a = a.mean(1)
    a = resample_poly(a, SR, sr)
    a = filt(a, 'high', 90)
    # gentle warmth: a touch of low-mid, a touch of air
    a = a + 0.25 * filt(a, 'band', [150, 400]) + 0.15 * filt(a, 'high', 8000)
    a = a / (np.sqrt((a ** 2).mean()) + 1e-9) * 0.1
    a = np.tanh(a * 2.2) / 2.2  # soft compression
    place(vo, a, ts(frame), 1.0)
    end = ts(frame) + len(a) / SR
    assert end < ts(limits[key[0]]) + 0.35, (key, round(end, 2))
vo = reverb(vo, 0.7, 0.07)

# Duck music + sfx under the voice
lvl = np.abs(vo).mean(1)
k = int(0.1 * SR)
lvl = np.convolve(lvl, np.ones(k) / k, 'same')
duck = 1 - 0.42 * np.clip(lvl / 0.025, 0, 1)
duck = np.convolve(duck, np.ones(k * 2) / (k * 2), 'same')[:, None]

# ================================================================== master
music = music / (np.sqrt((music[int(DROP * SR): int(BREAK * SR)] ** 2).mean()) + 1e-9) * 0.075
mix = music * duck + sfx * (0.6 + 0.4 * duck) + vo
mix = filt(mix, 'high', 28)
mix = np.tanh(mix * 1.4) / 1.4
mix *= 0.9 / np.abs(mix).max()
sf.write('public/eleven/soundtrack.wav', mix.astype(np.float32), SR, subtype='PCM_16')
sf.write(os.path.join(tmp, 'music_only.wav'), (music / np.abs(music).max() * 0.9).astype(np.float32), SR)
print('wrote public/eleven/soundtrack.wav', round(DUR, 2), 's; music stem', os.path.join(tmp, 'music_only.wav'))
