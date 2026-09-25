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

A 43-second 16:9 film (1920×1080, 30fps, music only). It follows the reference edit's structure scene for scene, with calmer pacing so every line has time to land. [`renders/eleven-seconds-vs-reference.jpg`](renders/eleven-seconds-vs-reference.jpg) compares matching moments side by side.

**Rendered file:** [`renders/eleven-seconds.mp4`](renders/eleven-seconds.mp4) · `npm run render:eleven`

| Time | Scene | On screen |
|---|---|---|
| 0.0–3.7s | Collage (grid, typed words, cutouts) | "A patient starts to explain why they can't sleep." |
| 3.2–6.0s | Blue halftone: 3D alarm clock swings in | Glass pill counts 0:01 → 0:11, then "Interrupted" |
| 5.5–8.1s | Collage | "Another tries to describe the pain." + a "Save note" button being clicked |
| 7.6–10.2s | Blue halftone: 3D pocket watch | "0:11 Interrupted" |
| 9.7–12.3s | Collage | "Another just wants to ask a question." |
| 11.8–14.4s | Blue halftone: 3D laptop typing a note | "0:11 Interrupted" |
| 13.9–18.0s | Collage, pulling back | "It's not rudeness. Someone has to write the note." |
| 17.5–20.0s | Red halftone, shrinking to a circle | "What if no one had to?" |
| 20.0–22.3s | Glowing orb with rings (Wai), where the music drops | |
| 22.3–31.0s | Orb opens into a green glass chat | Wai: "I've got the notes. Go ahead." · Patient: "It started last week…" · Doctor: "Take all the time you need." |
| 30.5–34.5s | Type on black, outline draws around it | "Wai writes it all. You get heard." |
| 34.5–37.8s | Three glass cards | Clinical note: Drafted while you talk · Letters: Ready to sign · Coding: Done for you |
| 37.8–43.3s | Cards merge to a line, logo glows up | Wai logo · "Care, uninterrupted." · wellnessa-i.com |

The stat source ("J Gen Intern Med, 2018") sits as a footnote on the three halftone scenes. Transitions between scenes are soft pixel-block dissolves on the 120px background grid. The blocks open in a staggered wave with a brief tinted flash, the outgoing scene drifts forward, and the incoming one settles from a slight zoom.

## Code

- `src/eleven/ElevenSeconds.tsx`: the timeline (scene windows in frames), per-scene pacing and transitions
- `src/eleven/scenes.tsx`: the collages, halftone hero scenes, red-to-orb bloom, chat and outro
- `src/eleven/parts.tsx`: shared pieces (grid, canvas halftone, block wipe, typed text, cutout tiles, glass pill)

## Assets

All CC0. Credits are in [`public/eleven/CREDITS.md`](public/eleven/CREDITS.md).

- `public/eleven/obj/`: cutouts. Most are Poly Haven studio renders, plus two rawpixel photos with the background removed.
- `public/eleven/3d/`: 72-frame rotations of the alarm clock, pocket watch and laptop. I rendered these from Poly Haven's glTF models with three.js, with the clock hands set to 10:10:11 and a note on the laptop screen.
- `scripts/eleven-assets/`: rebuilds all of the above (`fetch_assets.py`, `render.mjs`).

## Music

`scripts/make_eleven_audio.py` writes `public/eleven/soundtrack.wav`: a warm, upbeat groove at 104 BPM in F major. It stays light through the collages, cuts out for a moment, drops into the full groove when the orb appears (as the reference does), and ends on a chord under the logo. There's no voiceover and there are no sound effects. To use a licensed track instead, replace the WAV.
