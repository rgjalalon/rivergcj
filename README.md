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

# Wai: "paperwork" film (re-edit)

A 42-second landscape film (1920×1080, 30fps) built from the original 39-second Wai cut. The source footage, product capture and music are kept. The hook, typography, grade, camera and sound design are new.

**Rendered file:** [`renders/wai-paperwork-film.mp4`](renders/wai-paperwork-film.mp4)

```bash
npm run render:paperwork   # writes out/wai-paperwork-film.mp4
python3 scripts/make_paperwork_sfx.py   # rebuilds public/wai-paperwork/sfx.wav (needs numpy, scipy)
```

| Time | Scene | What changed from the original |
|---|---|---|
| 0.0–4.5s | **New hook.** "For every 1 hour with a patient," → the digit rolls to **2** "hours on *paperwork*." → sheets of paper bury the frame → "It's driving *doctors out*." | Replaces the generated news-headline montage (which carried fake mastheads such as "AP WIRE"). The stat is cited on screen (Sinsky et al., Annals of Internal Medicine, 2016). |
| 4.5–7.2s | Typing footage: "What if AI could *carry* some of the load?" | Graded monochrome with a warm split tone, 2.39:1 letterbox, slow push. The baked-in yellow caption is hidden under a frosted band and the line is re-typed in large serif, synced to the original key sounds. |
| 7.2–9.0s | "Not ~~replace~~ the clinician. / But *support* them." | Espresso type cards with a drawn strike-through. |
| 9.0–12.5s | Logo reveal | Cream logo on espresso: blur-to-sharp wipe, glow, light sweep on the music swell. |
| 12.5–15.6s | "wai drafts while you *carry on*." | The logo slides into the lockup, then a paper-coloured wipe leads into the product. |
| 15.6–37.7s | Product: worklist → note → signed → letter → paper storm | The capture is multiplied onto warm paper, with a virtual camera (push-ins, tilt that settles) and serif captions. Ends on "Your time, *back*." |
| 37.7–42.0s | End card | Espresso iris, logo, "Less paperwork. *More medicine.*", fade to black. |

From 4.5s onward the source runs continuously, so the original music and typing sounds stay in sync. Cues are written in source seconds in `src/waiPaperwork/timeline.ts` (`src()` converts them to film frames). The copy, captions and camera keyframes all live there too.

Assets in `public/wai-paperwork/`: `source.mp4` is the original video stream, `source-audio.m4a` is its soundtrack, and `sfx.wav` is the generated hook and transition sound design.
