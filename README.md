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

# Wai: "The Other 8,759" (16:9)

A 33-second landscape film (1920×1080, 30fps, no audio). It's built as one real-time 3D scene in Three.js, via `@remotion/three`: 8,760 glossy rounded cubes, one for every hour of the year. Kinetic chrome type sits on top, and it ends on a glossy logo card.

**Rendered file:** [`renders/the-other-8759.mp4`](renders/the-other-8759.mp4)

```bash
npm run render:other   # writes out/the-other-8759.mp4 (uses --gl=angle for WebGL in headless Chrome)
```

| Time | Beat | On screen |
|---|---|---|
| 0.0–4.0s | 1 | Rows of cubes rise out of the dark toward the horizon while the camera drifts; faint grid glow. Caption: 1 year = 8,760 hours |
| 4.0–9.5s | 2 | One cube lifts and ignites amber. "The average person spends about an hour a year with a doctor." + tag "CDC: ~3 visits a year, minutes each." |
| 9.5–13.0s | 3 | The camera sweeps back over the field as the cubes breathe. "Your health doesn't happen in that hour." |
| 13.0–17.0s | 4 | Glossy vignettes pop out of the field: moon, plate, lightning bolt, question mark, each with a label |
| 17.0–21.0s | 5 | "It happens in the other 8,759" (the number counts up). "That's where the signals live." |
| 21.0–25.0s | 6 | A warm wave rolls out from the hour cube. Glowing paths join each vignette to one heartbeat line of lifted cubes |
| 25.0–28.6s | 7a | "Wai. Care for the other 8,759 hours." then a warm flash |
| 28.6–33.0s | 7b | End card: the extruded chrome Wai logo rises with a sheen and a floor reflection |

Timing, camera keyframes and vignette positions are in `src/other/timeline.ts`. The 3D scene is in `src/other/Field.tsx`, the type in `src/other/Type.tsx`, and copy plus the end card in `src/other/Film.tsx`. The logo is `public/wai/wai-logo-white.png`.
