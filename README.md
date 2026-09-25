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

A 30-second vertical video (1080×1920, 30fps) for Wai. Cut points, dissolves and caption rhythm follow the reference edit frame for frame: close-up → wide → paper checklist → phone, screen, hands and still life dissolving into each other → lacing → photo collage on a flat colour → the plan on a screen → the same plan printed and taped up → end card.

**Rendered file:** [`renders/wai-brand-film.mp4`](renders/wai-brand-film.mp4)

```bash
npm run render:wai   # writes out/wai-brand-film.mp4
```

| Time | Shot | Caption |
|---|---|---|
| 0.00–2.37s | Footage: trainers mid-stride, close-up | health isn't (from 1.1s) |
| 2.37–3.37s | Footage: wide, legs walking | another app |
| 3.37–5.23s | Footage: pen ticking a habit list | it's the |
| 5.23–6.27s | App: "Today" tracker, habits tick off | small things |
| 6.27–8.00s | ⤫ App: vitamin D result rising into range | small things |
| 8.00–9.53s | ⤫ Footage: hands, vitamins and water | small things |
| 9.53–11.77s | ⤫ Footage: trainers on a sunlit floor | |
| 11.77–13.87s | Footage: lacing trainers | |
| 13.87–19.40s | Collage on caramel, six photos cut on one by one | tracked, / understood, / improved |
| 19.40–21.20s | The plan on a laptop screen | one place |
| 21.20–25.83s | The plan printed and taped to the wall | that actually gets it |
| 25.83–30.00s | End card: Wai logo on espresso | medical intelligence, made personal |

⤫ = dissolve. Everything else is a hard cut, and captions cut on and off with the picture.

**Footage:** the real-life shots are placeholders until clips are added. See `public/wai/footage/README.md` for filenames and the shot list. The grade (warm highlights, espresso shadows, film grain, vignette) is applied automatically in `src/wai/Footage.tsx`.

Shot timings, collage beats and captions are in `src/wai/timeline.ts`. The logo is `public/wai/wai-logo-cream.png`.

---

# Wai: "The 30 hours" (16:9)

A 29-second landscape kinetic-type film (1920×1080, 30fps). White UI with blue as the hero colour (patient care, flood, logo) and orange used sparingly (carets, ticks on cleared cards, the word "not"), soft drifting blue gradient, subtle grid, no voiceover. Motion follows the reference edit: type at huge scale that pulls back, a camera that keeps drifting (push-ins, 3D tilt, depth blur, motion blur on fast moves), zoom-through transitions, and a glass prompt bar with a cursor click.

**Rendered file:** [`renders/wai-the-30-hours.mp4`](renders/wai-the-30-hours.mp4) · `npm run render:wai-30h`

| Time | Beat |
|---|---|
| 0–5s | Over the lily backdrop (`public/wai/lily.jpg`, cropped to 16:9 with a slow push), the counter fills the frame and the camera pulls back as the bar fills to 57.8 h; the lily dissolves to white by 5s |
| 5–8s | Push in on the split: 27.2 h patient care glows, 30.6 h gray |
| 8–13s | Camera tilts into 3D as task cards pile up and squeeze the care segment, then whips into a card |
| 13.7–16.5s | "Every hour spent on a form…" word by word |
| 16.5–19.7s | Glass prompt: "Clear this week's backlog" types, cursor clicks send, camera flies through the button |
| 19.7–23s | Cards tick off in quick succession; care segment floods the frame |
| 23–29s | Closing line, then the Wai logo fades in bottom-centre |

**Sound:** an original synthesised score (pad chords D → G → Bm → G → A → D, sub pulse, glass arpeggio) with effects timed to the frame: typing ticks, whooshes on camera moves, thumps as cards land, a click on send, rising pentatonic plucks as each card clears, an impact on the flood and a chime under the logo. Regenerate with `pip install numpy scipy && python3 scripts/wai-30h-audio.py` (writes `public/wai/30h-score.wav`); cue frames mirror `src/wai/Backlog.tsx`.

All timing, camera keys and layout live in `src/wai/Backlog.tsx`. Logo: `public/wai/wai-logo-white.webp`.
