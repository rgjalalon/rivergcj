"""Builds the "11 Seconds" music track (music only: no voiceover, no sound effects).

A warm, upbeat groove at 104 BPM in F major, shaped like the reference edit:
- collage / halftone section: light and bouncy (Rhodes comping, snaps, shaker,
  a filtered bass), building with a snare roll under "What if no one had to?"
- a short cut, then the full groove drops as the orb appears (kick, clap, funky
  synth bass, a soft analogue-style lead hook, pad) and carries the chat,
  the type on black and the cards
- a final chord rings out on the logo.

Rhodes and pad are MIDI played through FluidSynth + the FluidR3 GM soundfont.
Drums, bass and lead are synthesised in numpy.

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
from scipy.signal import butter, sosfilt

SR = 48000
FPS = 30
# Frames: drop on the orb (590), final chord on the logo (1340), end (1500)
B1, B2, B3, B4, B5, B6, END = 0, 0, 590, 0, 1340, 1340, 1500
DUR = END / FPS + 0.3
N = int(DUR * SR)
rng = np.random.default_rng(11)
SF2 = '/usr/share/sounds/sf2/FluidR3_GM.sf2'

BPM = 104
BEAT = 60 / BPM
BAR = BEAT * 4
DROP = B3 / FPS          # full groove drops as the orb appears (like the reference)
INTRO = int(np.ceil(DROP / BAR))  # intro bars before the drop
LIGHT = 3                # of those, bars with only keys, snaps and shaker
G0 = DROP - INTRO * BAR
BREAK = B5 / FPS         # gentle breakdown
FINAL = B6 / FPS         # last chord on the logo
NBARS = int((BREAK - G0) / BAR) + 1


def bar_t(b, beat=0.0):
    return G0 + b * BAR + beat * BEAT


def stereo(sig, pan=0.0):
    return np.stack([sig * np.sqrt((1 - pan) / 2), sig * np.sqrt((1 + pan) / 2)], 1)


def place(buf, sig, t, gain=1.0, pan=0.0):
    if sig.ndim == 1:
        sig = stereo(sig, pan)
    i = int(round(t * SR))
    if i < 0:
        sig, i = sig[-i:], 0
    j = min(N, i + len(sig))
    if i < N:
        buf[i:j] += sig[: j - i] * gain


def filt(x, kind, f, order=2):
    return sosfilt(butter(order, f, kind, fs=SR, output='sos'), x, axis=0)


def env(n, a, d):
    x = np.arange(n) / SR
    return np.minimum(1, x / max(a, 1e-4)) * np.exp(-np.maximum(0, x - a) / d)


def noise(n):
    return rng.standard_normal(n)


def hz(m):
    return 440 * 2 ** ((m - 69) / 12)


def reverb(x, secs=2.0, mix=0.25):
    n = int(secs * SR)
    out = np.zeros_like(x)
    F = 1 << int(np.ceil(np.log2(len(x) + n)))
    for c in range(2):
        ir = filt(noise(n), 'low', 6000) * np.exp(-np.arange(n) / SR / (secs / 5))
        ir /= np.sqrt((ir ** 2).sum())
        out[:, c] = np.fft.irfft(np.fft.rfft(x[:, c], F) * np.fft.rfft(ir, F), F)[: len(x)]
    return x * (1 - mix) + out * mix


# F major: Fmaj9 | Am7 | Dm9 | Bbmaj9, voiced around a shared A-C top
CHORDS = [
    (41, [57, 60, 64, 67]),
    (45, [55, 60, 64, 67]),
    (38, [57, 60, 64, 65]),
    (46, [57, 60, 62, 65]),
]

# ================================================================ Rhodes + pad
events = []
EP, PAD = 0, 1


def n_(t, ch, note, vel, dur):
    if t >= 0:
        events.append((t, ch, note, int(vel), dur))


# funky comping: hits on 1, the "and" of 2, the "and" of 3 and the "e" of 4
COMP = [(0, 1.2, 0), (1.5, 0.45, -8), (2.5, 0.9, -4), (3.25, 0.35, -12)]
for b in range(-1, NBARS):
    root, ch = CHORDS[b % 4]
    base = 48 if b < LIGHT else 54 if b < INTRO else 58
    for beat, d, dv in COMP:
        t = bar_t(b, beat)
        if t >= BREAK - 0.05:
            break
        for m in ch:
            n_(t, EP, m, base + dv, BEAT * d)
    if b >= LIGHT and bar_t(b) < BREAK:
        for m in [root + 12] + ch:
            n_(bar_t(b), PAD, m, 36 if b < INTRO else 44, BAR)

# breakdown: one open, warm chord (only when there is room for one)
for m in ([41, 53, 57, 60, 64, 67] if FINAL - BREAK > 0.5 else []):
    n_(BREAK + 0.02, EP, m, 46, 3.3)
    n_(BREAK + 0.02, PAD, m, 38, 3.4)
# final chord, rolled
for i, m in enumerate([41, 53, 60, 64, 67, 69, 72]):
    n_(FINAL + i * 0.025, EP, m, 62, 3.8)
    n_(FINAL, PAD, m, 44, 3.8)

mid = mido.MidiFile(ticks_per_beat=480)
track = mido.MidiTrack()
mid.tracks.append(track)
tempo = mido.bpm2tempo(BPM)
track.append(mido.MetaMessage('set_tempo', tempo=tempo))
for ch, prog, vol, rev in [(EP, 4, 108, 40), (PAD, 89, 72, 85)]:
    track.append(mido.Message('program_change', channel=ch, program=prog))
    track.append(mido.Message('control_change', channel=ch, control=7, value=vol))
    track.append(mido.Message('control_change', channel=ch, control=91, value=rev))
    track.append(mido.Message('control_change', channel=ch, control=93, value=50))
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
     '-o', 'synth.reverb.room-size=0.6', '-o', 'synth.reverb.level=0.5',
     '-o', 'synth.chorus.depth=8', '-o', 'synth.chorus.level=1.2',
     '-F', os.path.join(tmp, 'keys.wav'), SF2, os.path.join(tmp, 'keys.mid')],
    check=True, capture_output=True,
)
raw, sr = sf.read(os.path.join(tmp, 'keys.wav'))
assert sr == SR
keys = np.zeros((N, 2))
keys[: min(N, len(raw))] = raw[:N]
keys = filt(keys, 'high', 110)
# intro: keys start slightly muffled and open up bar by bar
t_idx = np.arange(N) / SR
openness = np.clip((t_idx - G0) / (4 * BAR), 0, 1)[:, None]
keys = filt(keys, 'low', 1800) * (1 - openness) + keys * openness
keys /= np.sqrt((keys ** 2).mean()) + 1e-9


# ================================================================ synths
def saw(freq, n, detune=0.0):
    x = np.arange(n) / SR
    out = np.zeros(n)
    kmax = max(1, int(9000 / freq))
    for k in range(1, min(kmax, 60) + 1):
        out += np.sin(2 * np.pi * k * freq * (1 + detune) * x) / k
    return out


def bass_note(m, beats, bright=1.0):
    n = int(beats * BEAT * SR)
    f = hz(m)
    s = saw(f, n) * 0.6 + np.sin(2 * np.pi * f * np.arange(n) / SR)
    # plucky filter: bright on the attack, closes quickly
    lo = filt(s, 'low', 180)
    hi = filt(s, 'low', 180 + 900 * bright)
    e = np.exp(-np.arange(n) / SR / 0.08)
    s = lo * (1 - e) + hi * e
    s *= np.minimum(1, np.arange(n) / (0.004 * SR)) * np.minimum(1, (n - np.arange(n)) / (0.02 * SR))
    return np.tanh(s * 1.5)


def lead_note(m, beats):
    n = int(beats * BEAT * SR)
    f = hz(m)
    x = np.arange(n) / SR
    s = sum(saw(f, n, d) for d in (-0.006, 0, 0.006)) / 3
    s = filt(s, 'low', 2200)
    s += 0.35 * np.sin(2 * np.pi * f * x)  # round it off
    e = np.minimum(1, x / 0.012) * (0.75 + 0.25 * np.exp(-x / 0.15)) * np.minimum(1, (n - np.arange(n)) / (0.05 * SR))
    return s * e


bass = np.zeros((N, 2))
lead = np.zeros((N, 2))

# funky octave bass: root, pickup, octave, root, octave, fifth
BASS = [(0, 0, 0.7), (0.75, 0, 0.4), (1.5, 12, 0.4), (2.5, 0, 0.7), (3.25, 12, 0.3), (3.5, 7, 0.4)]
for b in range(LIGHT, NBARS):
    root, _ = CHORDS[b % 4]
    r = root if root < 44 else root - 12
    bright = 0.35 if b < INTRO else 1.0
    for beat, off, d in BASS:
        t = bar_t(b, beat)
        if b == INTRO - 1 and beat >= 3:
            continue  # leave room for the build
        if t < BREAK - 0.05:
            place(bass, bass_note(r + off + 12, d, bright), t, 0.8 if b < INTRO else 1.0)
if FINAL - BREAK > 0.5:
    place(bass, bass_note(41, 4.0, 0.3) * np.exp(-np.arange(int(4 * BEAT * SR)) / SR / 1.4), BREAK, 0.6)
place(bass, bass_note(41, 6.0, 0.6) * np.exp(-np.arange(int(6 * BEAT * SR)) / SR / 1.6), FINAL, 0.9)

# lead hook over the drop (two-bar phrase, F major pentatonic)
HOOK = [
    [(0, 72, 0.5), (0.5, 74, 0.5), (1, 77, 1.0), (2.5, 74, 0.5), (3, 72, 1.0)],
    [(0, 69, 0.5), (0.5, 72, 0.5), (1, 74, 1.5), (3, 77, 0.5), (3.5, 79, 0.5)],
]
for b in range(INTRO, NBARS):
    for beat, m, d in HOOK[(b - INTRO) % 2]:
        t = bar_t(b, beat)
        if t < BREAK - 0.1:
            place(lead, lead_note(m, d), t, 1.0)
place(lead, lead_note(77, 3.0) * np.exp(-np.arange(int(3 * BEAT * SR)) / SR / 0.9), FINAL + 0.1, 0.8)
lead[:, 1] = np.roll(lead[:, 1], int(0.012 * SR))  # width
lead = reverb(lead, 1.8, 0.3)
echo = np.zeros_like(lead)  # dark ping-pong echo for air
d = int(BEAT * 0.75 * SR)
echo[d:, 0] = filt(lead[:-d, 1], 'low', 2500) * 0.25
echo[2 * d:, 1] = filt(lead[:-2 * d, 0], 'low', 2000) * 0.15
lead += echo

# ================================================================ drums
drums = np.zeros((N, 2))
kicks = []


def kick():
    n = int(0.45 * SR)
    x = np.arange(n) / SR
    f = 50 * (1 + 2.6 * np.exp(-x * 34))
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.002, 0.2)
    click = filt(noise(n), 'band', [1500, 6000]) * np.exp(-x * 500) * 0.2
    return np.tanh(1.5 * (body + click))


def clap():
    n = int(0.3 * SR)
    x = np.arange(n) / SR
    s = filt(noise(n), 'band', [1000, 5000])
    e = np.zeros(n)
    for o in (0, 0.008, 0.017):
        i = int(o * SR)
        e[i:] += np.exp(-x[: n - i] * 160) * 0.6
    e += np.exp(-x * 12) * 0.22 * (x > 0.02)
    return s * e


def snap():
    n = int(0.15 * SR)
    x = np.arange(n) / SR
    return filt(noise(n), 'band', [1800, 5500]) * np.exp(-x * 70)


def hat(open_=False):
    n = int((0.2 if open_ else 0.05) * SR)
    x = np.arange(n) / SR
    return filt(noise(n), 'high', 8000) * np.exp(-x * (16 if open_ else 100))


def shaker():
    n = int(0.08 * SR)
    x = np.arange(n) / SR
    return filt(noise(n), 'band', [5000, 12000]) * np.minimum(1, x / 0.015) * np.exp(-x * 45)


def snare():
    n = int(0.2 * SR)
    x = np.arange(n) / SR
    return filt(noise(n), 'band', [1200, 7000]) * np.exp(-x * 25) + 0.4 * np.sin(2 * np.pi * 190 * x) * np.exp(-x * 30)


SWING = 0.035
for b in range(0, NBARS):
    if bar_t(b) >= BREAK:
        break
    full = b >= INTRO
    for k in range(16):  # shaker 16ths, swung
        t = bar_t(b, k * 0.25) + (SWING if k % 2 else 0)
        if t < BREAK - 0.02 and not (b == INTRO - 1 and k >= 14):
            place(drums, shaker(), t, [0.18, 0.09, 0.14, 0.09][k % 4] * (1 if full else 0.8), 0.35)
    for beat in (1, 3):
        t = bar_t(b, beat)
        if t < BREAK - 0.02:
            if full:
                place(drums, clap(), t, 0.5)
            elif b < INTRO - 1:
                place(drums, snap(), t, 0.35, -0.2)
    if b >= LIGHT:
        for k in range(8):
            t = bar_t(b, k * 0.5) + (SWING if k % 2 else 0)
            if t < BREAK - 0.02 and not (b == INTRO - 1 and k >= 6):
                place(drums, hat(open_=(k % 4 == 3)), t, (0.14 if k % 2 else 0.09) * (1.3 if full else 1), 0.2)
    if full:
        for beat in (0, 1.75, 2.5):
            t = bar_t(b, beat)
            if t < BREAK - 0.02:
                place(drums, kick(), t, 0.6)
                kicks.append(t)

# snare build over the last bar before the drop
for k in range(16):
    t = bar_t(INTRO - 1, k * 0.25)
    if t < DROP - 0.3:
        place(drums, snare(), t, 0.08 + 0.3 * (k / 16) ** 2, 0.1 * ((-1) ** k))
n = int(BAR * SR)
x = np.arange(n) / SR
place(drums, filt(noise(n), 'band', [800, 9000]) * (x / x[-1]) ** 3, DROP - 0.3 - BAR, 0.18)  # riser
place(drums, kick(), FINAL, 0.6)
kicks.append(FINAL)
place(drums, clap(), FINAL, 0.25)
drums = reverb(drums, 1.1, 0.12)

# ================================================================ mix
pump = np.ones(N)
for t in kicks:
    i = int(t * SR)
    m = int(0.3 * SR)
    xx = np.arange(m) / SR
    j = min(N, i + m)
    pump[i:j] = np.minimum(pump[i:j], (1 - 0.45 * np.exp(-xx / 0.08))[: j - i])
pump = pump[:, None]

music = keys * 0.055 * pump + bass * 0.10 * pump ** 0.6 + lead * 0.05 + drums * 0.55

# breakdown: filter closes while the drums are out, reopens on the logo
dark = filt(music, 'low', 900)
k = np.clip((t_idx - BREAK) / 0.5, 0, 1) * (1 - np.clip((t_idx - (FINAL - 0.4)) / 0.4, 0, 1))
music = music * (1 - k[:, None]) + dark * k[:, None] * 1.3

# the cut: a breath of silence just before the drop
cut = 1 - ((t_idx > DROP - 0.3) & (t_idx < DROP - 0.01)).astype(float)
cut = np.convolve(cut, np.ones(240) / 240, 'same')
music *= cut[:, None]

music *= np.clip(t_idx / 0.4, 0, 1)[:, None]
f0 = END / FPS - 1.8
music *= (1 - np.clip((t_idx - f0) / 1.8, 0, 1) ** 2)[:, None]

music = filt(music, 'high', 30)
music = music - 0.4 * filt(music, 'band', [180, 450]) + 0.8 * filt(music, 'band', [2000, 6000]) + 0.5 * filt(music, 'high', 6000)  # clean the mud, add presence and air
music = np.tanh(music * 2.0) / 2.0  # glue
music *= 0.9 / np.abs(music).max()

# ================================================================ voice-over
# Narrator (n*) and patient (p*) clips from public/eleven/vo, placed on the
# picture (seconds). The music ducks under the voice.
VO_CUES = {
    'n1': 0.5, 'n2': 4.6, 'n3': 5.9, 'n4': 8.9, 'n5': 9.9, 'n6': 12.3, 'n7': 15.9,
    'p1': 25.3, 'p2': 28.6,
    'n8': 37.6,
}
vo = np.zeros((N, 2))
for key, t in VO_CUES.items():
    path = f'public/eleven/vo/{key}.wav'
    if not os.path.exists(path):
        continue
    v, vsr = sf.read(path)
    if v.ndim > 1:
        v = v.mean(1)
    assert vsr == SR, path
    v = filt(v, 'high', 80)
    v = v / (np.sqrt((v ** 2).mean()) + 1e-9) * (0.14 if key.startswith('p') else 0.11)  # patient sits a touch forward
    place(vo, v, t, 1.0)
if np.abs(vo).max() > 0:
    vo = reverb(vo, 0.6, 0.06)
    lvl = np.convolve(np.abs(vo).mean(1), np.ones(4800) / 4800, 'same')
    duck = 1 - 0.68 * np.clip(lvl / 0.02, 0, 1)
    duck = np.convolve(duck, np.ones(9600) / 9600, 'same')[:, None]
    music = music * 0.75 * duck + vo
    music = np.tanh(music * 1.2) / 1.2
    music *= 0.9 / np.abs(music).max()
sf.write('public/eleven/soundtrack.wav', music.astype(np.float32), SR, subtype='PCM_16')
print('wrote public/eleven/soundtrack.wav', round(DUR, 2), 's')
