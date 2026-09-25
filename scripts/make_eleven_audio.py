"""Builds the "11 Seconds" soundtrack: score + sound effects + voiceover.

- Score: written as MIDI here and played through the FluidR3 GM soundfont
  (piano, strings, warm pad, harp) with FluidSynth, plus a synthesised sub
  and soft percussion for the middle section.
- SFX: synthesised from code.
- VO: the clips in public/eleven/vo (see make_eleven_vo.py), with the music
  ducked underneath.

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
    i = int(t * SR)
    j = min(N, i + len(sig))
    if 0 <= i < N:
        buf[i:j] += sig[: j - i] * gain


def filt(x, kind, f, order=2):
    return sosfilt(butter(order, f, kind, fs=SR, output='sos'), x)


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


# =============================================================== score (MIDI)
BPM = 84
BEAT = 60 / BPM
TPB = 480
events = []  # (time_s, channel, note, velocity, dur_s)


def n_(t, ch, note, vel, dur):
    events.append((t, ch, note, vel, dur))


PIANO, STRINGS, PAD, HARP, CELLO = 0, 1, 2, 3, 4
programs = {PIANO: 0, STRINGS: 49, PAD: 89, HARP: 46, CELLO: 42}

# D major colours
Dmaj9 = [50, 57, 62, 66, 69, 76]
Bm9 = [47, 54, 62, 66, 69, 73]
Gmaj9 = [43, 50, 59, 66, 69, 74]
A6sus = [45, 52, 62, 64, 66, 71]
Em9 = [40, 52, 59, 62, 66, 67]

# --- Beat 1-2: a sparse, slightly uneasy piano figure over a low cello drone.
t = 0.35
figure = [(81, 70), (78, 58), (74, 55), (78, 50)]
bar_chords = [Dmaj9, Bm9, Dmaj9, Em9, Bm9, Gmaj9, Em9, A6sus]
bar = 0
while t < ts(B3) - 0.4:
    ch = bar_chords[bar % len(bar_chords)]
    n_(t, PIANO, ch[0] + 12 if ch[0] < 48 else ch[0], 42, BEAT * 4)
    for i, (m, v) in enumerate(figure):
        tt = t + i * BEAT
        if tt < ts(B3) - 0.3:
            m2 = m if bar % 2 == 0 else m - (3 if m == 78 else 0)
            n_(tt, PIANO, m2, v - 12 + 4 * (bar > 3), BEAT * 1.6)
    t += BEAT * 4
    bar += 1
n_(0.2, CELLO, 38, 34, ts(B2) - 0.2)
n_(ts(B2), CELLO, 38, 40, ts(B3) - ts(B2) - 0.1)
n_(ts(B2) + 1.5, STRINGS, 69, 30, ts(B3) - ts(B2) - 1.7)  # tension creeps in
n_(ts(B2) + 3.5, STRINGS, 71, 34, ts(B3) - ts(B2) - 3.6)

# --- Beat 3: hard stop, then a big warm bloom on the gradient.
tb = ts(B3) + 0.18
for m in Gmaj9 + [78]:
    n_(tb, STRINGS, m, 78, 3.2)
    n_(tb, PAD, m, 60, 3.4)
for i, m in enumerate([43, 55, 62, 66, 71, 74, 78]):
    n_(tb + i * 0.035, PIANO, m, 72, 2.8)

# --- Beat 4: the groove. Flowing piano 8ths, strings, pad.
t = ts(B4) - 0.05
prog4 = [Dmaj9, Bm9, Gmaj9, A6sus, Dmaj9]
bar = 0
while t < ts(B5) - 0.2:
    ch = prog4[bar % len(prog4)]
    for m in ch[1:]:
        n_(t, STRINGS, m, 52, BEAT * 4)
        n_(t, PAD, m, 44, BEAT * 4)
    n_(t, CELLO, ch[0], 50, BEAT * 4)
    up = sorted(ch[1:]) + [ch[3] + 12]
    for k in range(8):
        tt = t + k * BEAT / 2
        if tt < ts(B5) - 0.2:
            n_(tt, PIANO, up[k % len(up)] + 12, 58 - 8 * (k % 2), BEAT)
    t += BEAT * 4
    bar += 1

# --- Beat 5: time stops. One held chord, nothing moving.
t5 = ts(B5) + 0.1
for m in [50, 57, 62, 66, 69, 76]:
    n_(t5, STRINGS, m, 40, 3.2)
for i, m in enumerate([62, 69, 76, 81]):
    n_(t5 + 0.6 + i * 0.12, PIANO, m, 44, 3.0)

# --- Beat 6: resolve on the logo with a harp glissando into a final chord.
t6 = ts(B6) - 0.35
for i, m in enumerate([62, 64, 66, 69, 71, 74, 76, 78, 81, 83, 86]):
    n_(t6 + i * 0.03, HARP, m, 60, 2.5)
for m in [38, 50, 57, 62, 64, 66, 69, 73]:
    n_(ts(B6) + 0.05, STRINGS, m, 58, 3.4)
    n_(ts(B6) + 0.05, PAD, m, 40, 3.4)
for i, m in enumerate([38, 50, 57, 64, 66, 69, 73, 76]):
    n_(ts(B6) + 0.05 + i * 0.05, PIANO, m, 60, 3.5)

mid = mido.MidiFile(ticks_per_beat=TPB)
track = mido.MidiTrack()
mid.tracks.append(track)
track.append(mido.MetaMessage('set_tempo', tempo=mido.bpm2tempo(BPM)))
for ch, p in programs.items():
    track.append(mido.Message('program_change', channel=ch, program=p))
    track.append(mido.Message('control_change', channel=ch, control=91, value=70))  # reverb send
    track.append(mido.Message('control_change', channel=ch, control=10, value={PIANO: 58, STRINGS: 70, PAD: 64, HARP: 50, CELLO: 60}[ch]))
    track.append(mido.Message('control_change', channel=ch, control=7, value={PIANO: 110, STRINGS: 88, PAD: 60, HARP: 90, CELLO: 80}[ch]))
msgs = []
for t, ch, m, v, d in events:
    msgs.append((t, 1, mido.Message('note_on', channel=ch, note=m, velocity=int(max(1, min(127, v))))))
    msgs.append((t + d, 0, mido.Message('note_off', channel=ch, note=m, velocity=0)))
msgs.sort(key=lambda e: (e[0], e[1]))
last = 0
for t, _, msg in msgs:
    tick = int(round(mido.second2tick(t, TPB, mido.bpm2tempo(BPM))))
    msg.time = max(0, tick - last)
    last = max(last, tick)
    track.append(msg)

tmp = tempfile.mkdtemp()
mid.save(os.path.join(tmp, 'score.mid'))
subprocess.run(
    ['fluidsynth', '-ni', '-g', '0.5', '-r', str(SR), '-R', '1', '-C', '1',
     '-o', 'synth.reverb.room-size=0.8', '-o', 'synth.reverb.width=1', '-o', 'synth.reverb.level=0.7',
     '-F', os.path.join(tmp, 'score.wav'), SF2, os.path.join(tmp, 'score.mid')],
    check=True, capture_output=True,
)
score, sr = sf.read(os.path.join(tmp, 'score.wav'))
assert sr == SR
music = np.zeros((N, 2))
music[: min(N, len(score))] = score[:N]

# Synth sub and soft percussion under beat 4 only
def kick():
    n = int(0.45 * SR)
    x = np.arange(n) / SR
    f = 48 * (1 + 2.2 * np.exp(-x * 28))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.003, 0.16)


def shaker():
    n = int(0.09 * SR)
    return filt(noise(n), 'high', 7000) * env(n, 0.02, 0.03)


t = ts(B4) - 0.05
k = 0
while t < ts(B5) - 0.3:
    if k % 2 == 0:
        place(music, kick(), t, 0.22)
    place(music, shaker(), t + BEAT / 2, 0.05, 0.3)
    place(music, shaker(), t, 0.025, -0.3)
    t += BEAT
    k += 1

# =============================================================== sound effects
sfx = np.zeros((N, 2))


def tick(hi=True):
    n = int(0.06 * SR)
    x = np.arange(n) / SR
    s = np.sin(2 * np.pi * (4200 if hi else 3100) * x) * np.exp(-x * 260)
    s += filt(noise(n), 'high', 3000) * np.exp(-x * 500) * 0.6
    s += np.sin(2 * np.pi * 900 * x) * np.exp(-x * 150) * 0.3  # body of the watch
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
    # sweep by crossfading between a dark and a bright band
    dark = filt(noise(n), 'band', [lo, lo * 4])
    bright = filt(noise(n), 'band', [hi / 4, hi])
    s = dark * (1 - shape) + bright * shape
    edge = np.minimum(1, x / 0.02) * np.minimum(1, (secs - x) / 0.03)
    return s * shape * edge * 2


def sub_hit():
    n = int(1.2 * SR)
    x = np.arange(n) / SR
    f = 42 * (1 + 1.5 * np.exp(-x * 18))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.003, 0.35)


def glass(freq):
    n = int(1.6 * SR)
    x = np.arange(n) / SR
    s = sum(a * np.sin(2 * np.pi * freq * r * x) * np.exp(-x * dcy)
            for r, a, dcy in [(1, 1, 3), (2.01, 0.35, 5), (3.02, 0.15, 8), (4.1, 0.08, 12)])
    return s * np.minimum(1, x / 0.002)


# Beat 1: stopwatch start click, eleven ticks, the "11" lands
place(sfx, tick(False), ts(B1 + 2), 0.3)
for k in range(11):
    place(sfx, tick(k % 2 == 0), ts(B1 + 14 + k * 6), 0.5, pan=0.2)
place(sfx, glass(1175) * 0.4, ts(B1 + 80), 1)
place(sfx, pop(1400), ts(B1 + 150), 0.12)

# Beat 2: objects pop in, typing builds
for d, p in [(4, 600), (8, 750), (12, 680), (14, 900), (16, 500), (20, 450), (24, 950)]:
    place(sfx, pop(p), ts(B2 + d), 0.28, pan=rng.uniform(-0.6, 0.6))
place(sfx, whoosh(1.6, lo=150, hi=3000), ts(B2 + 38), 0.2)
t = ts(B2 + 55)
while t < ts(B3) - 0.08:
    density = min(1, (t - ts(B2 + 55)) / 5.5)
    place(sfx, key_click(), t, 0.06 + 0.12 * density, pan=rng.uniform(-0.3, 0.3))
    t += rng.uniform(0.05, 0.18) * (1.3 - 0.8 * density)

# Beat 3: silence for a breath, then sub + reverse swell into the bloom
place(sfx, whoosh(0.45, lo=200, hi=8000), ts(B3) - 0.45, 0.35)
place(sfx, sub_hit(), ts(B3) + 0.15, 0.55)

# Beat 4: bubble, cards sweep in, check chimes rise
place(sfx, whoosh(0.5), ts(B4) - 0.45, 0.25)
place(sfx, pop(620), ts(B4 + 4), 0.3)
for d, pan in [(40, -0.5), (52, 0), (64, 0.5)]:
    place(sfx, whoosh(0.35, rising=False, lo=400, hi=5000), ts(B4 + d), 0.28, pan)
for d, f, pan in [(85, 1175, -0.5), (105, 1480, 0), (122, 1760, 0.5)]:
    place(sfx, glass(f) * 0.28, ts(B4 + d), 1, pan)

# Beat 5 / 6
place(sfx, whoosh(0.7, rising=False, lo=200, hi=3000), ts(B5), 0.18)
place(sfx, whoosh(0.9, lo=200, hi=6000), ts(B6) - 0.9, 0.2)
place(sfx, sub_hit(), ts(B6) + 0.05, 0.4)

# =============================================================== voiceover
vo = np.zeros((N, 2))
cues = {
    '1a': B1 + 78, '1b': B1 + 108,
    '2a': B2 + 58, '2b': B2 + 98,
    '3': B3 + 10,
    '4a': B4 + 108, '4b': B4 + 176,
    '5': B5 + 20,
    '6': B6 + 14,
}
for key, frame in cues.items():
    a, sr = sf.read(f'public/eleven/vo/{key}.wav')
    if a.ndim > 1:
        a = a.mean(1)
    a = resample_poly(a, SR, sr)
    a = filt(a, 'high', 80)
    a = a / (np.sqrt((a ** 2).mean()) + 1e-9) * 0.1  # level-match lines
    place(vo, a, ts(frame), 1.0)
    end = ts(frame) + len(a) / SR
    assert end < ts({'1': B2, '2': B3, '3': B4, '4': B5, '5': B6, '6': END}[key[0]]) + 0.35, (key, end)
vo = reverb(vo, 0.8, 0.08)

# Duck music + sfx under the voice (smooth envelope follower)
lvl = np.abs(vo).mean(1)
k = int(0.12 * SR)
lvl = np.convolve(lvl, np.ones(k) / k, 'same')
duck = 1 - 0.5 * np.clip(lvl / 0.03, 0, 1)
duck = np.convolve(duck, np.ones(k) / k, 'same')[:, None]

# =============================================================== master
def norm_rms(x, target):
    return x * target / (np.sqrt((x ** 2).mean()) + 1e-9)


music = norm_rms(music, 0.06)
sfx = reverb(sfx, 1.2, 0.18)
mix = music * duck + sfx * (0.6 + 0.4 * duck) + vo
mix = filt(mix.T, 'high', 30).T
mix = np.tanh(mix * 1.5) / 1.5
fade = np.ones(N)
fn = int(1.5 * SR)
fade[-fn:] = np.linspace(1, 0, fn) ** 2
mix *= fade[:, None]
mix *= 0.9 / np.abs(mix).max()

sf.write('public/eleven/soundtrack.wav', mix.astype(np.float32), SR, subtype='PCM_16')
print('wrote public/eleven/soundtrack.wav', round(DUR, 2), 's')
