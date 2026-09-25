# The Wellness: app walkthrough video

A 30-second product video (1920×1080, 30fps, H.264 MP4) built with [Remotion](https://remotion.dev).
It shows a walkthrough of The Wellness clinic app: home → booking calendar → treatment detail → confirmation → end card.

**Rendered file:** [`renders/the-wellness-app.mp4`](renders/the-wellness-app.mp4)

## Run it

```bash
npm install
npm run studio   # live preview in the browser
npm run render   # writes out/the-wellness-app.mp4
```

If Remotion can't download its own headless Chrome, point it at an installed one:
`REMOTION_BROWSER=/path/to/chrome-headless-shell npm run render`.

## Timeline (frames at 30fps)

| Scene | Frames | What happens |
|---|---|---|
| 1. Home | 0–126 | Phone fades in on cream; greeting and booking card appear in sequence |
| 2. Booking | 126–336 | Tap "Book a treatment" → calendar pushes in → date tap → time slot highlight → Continue |
| 3. Treatment | 336–522 | Detail screen: image placeholder, description, price → Confirm booking |
| 4. Confirmation | 522–705 | Ring and checkmark draw on, booking summary |
| 5. End card | 705–900 | Espresso background, logo, "Wellness, made personal" |

Key moments live in `src/timeline.ts`. UI transitions are 300ms (9 frames) with an ease-out curve and no overshoot.

## Editing

- **Copy** (name, treatment, price, captions, tagline): `src/copy.ts`
- **Palette and fonts**: `src/theme.ts` (Playfair Display and Inter are bundled in `public/fonts`)
- **Logo**: `src/components/EndCard.tsx` currently shows a placeholder monogram and wordmark. Swap in the real logo asset there.
- **Treatment image**: the placeholder is in `src/screens/DetailScreen.tsx`. Drop an image in `public/` and use `<Img src={staticFile(...)} />`.
- **Film grain and vignette**: `src/components/Grain.tsx`

---

# Wai: brand film (vertical)

A 30-second vertical video (1080×1920, 30fps) for Wai. It follows the structure and pacing of the reference edit: quick real-life cuts, then an app screen, more footage, a photo/card collage, a results screen, a hero shot, and the end card.

**Rendered file:** [`renders/wai-brand-film.mp4`](renders/wai-brand-film.mp4)

```bash
npm run render:wai   # writes out/wai-brand-film.mp4
```

| Time | Shot | Caption |
|---|---|---|
| 0.0–2.4s | Footage: lacing trainers | health isn't |
| 2.4–4.2s | Footage: sunrise run | another app |
| 4.2–6.0s | Footage: glass of water | it's the small things |
| 6.0–8.4s | App: "Today" tracker, habits tick off | |
| 8.4–12.0s | Footage: stretch, breakfast | |
| 12.0–14.0s | Footage: clinic | tracked, |
| 14.0–19.4s | Collage on caramel: photos and result cards | …understood, improved |
| 19.4–21.6s | App: vitamin D result rising into optimal range | |
| 21.6–25.8s | Footage: golden-hour walk | one place / that actually gets it |
| 25.8–30.0s | End card: Wai logo on espresso | medical intelligence, made personal |

**Footage:** the real-life shots are placeholders until clips are added. See `public/wai/footage/README.md` for filenames and the shot list. The grade (warm highlights, espresso shadows, film grain, vignette) is applied automatically in `src/wai/Footage.tsx`.

Shot timings and captions are in `src/wai/timeline.ts`. The logo is `public/wai/wai-logo-cream.png`.

---

# Wai: "11 Seconds" (landscape)

A 34-second 16:9 film (1920×1080, 30fps) in an editorial collage style: grid backgrounds, halftone scraps, floating cutouts, kinetic scattered type, a gradient statement slide, a chat-bubble UI beat and a dark end card. No people and no voiceover. The soundtrack is music only.

**Rendered file:** [`renders/eleven-seconds.mp4`](renders/eleven-seconds.mp4) · `npm run render:eleven`

| Time | Beat | Music |
|---|---|---|
| 0.0–7.7s | Stopwatch ticks to 11, then the stat and its source (J Gen Intern Med, 2018) | Light, bouncy intro: Rhodes, snaps, shaker |
| 7.7–14.7s | Consultation objects; the screen and keyboard drift between the speech bubbles | Bass and hats come in, then a snare build and a short cut |
| 14.7–17.7s | Gradient slide: "What if no one had to?" | The drop: full groove |
| 17.7–26.7s | Waveform bubble; the note, letter and coding cards draft themselves | Groove, with the lead hook |
| 26.7–30.2s | The stopwatch returns, stopped: "Take all the time you need." | Drums drop out and the sound softens |
| 30.2–34.0s | End card: logo, "Care, uninterrupted.", wellnessa-i.com | Final chord rings out |

The visuals are in `src/eleven/ElevenSeconds.tsx`, with the beat timings at the top. The logo is `public/wai/wai-logo-white.webp`.

## Music

`scripts/make_eleven_audio.py` writes `public/eleven/soundtrack.wav`. It's a warm, upbeat groove at 104 BPM in F major: Rhodes comping and a warm pad played through FluidSynth with the FluidR3 GM soundfont, plus a funky octave synth bass, a soft analogue-style lead hook, swung drums and sidechain pump, all made in code. If you change the beat timings, update `B1`–`B6` and re-run it. To use a licensed track instead, replace the WAV.
