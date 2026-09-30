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

**Footage:** `public/wai/footage/*.mp4` holds seven real clips (Mixkit — note: several are under the Mixkit Restricted License, personal use only; license via Envato or swap before commercial release), graded warm on render by `src/wai/Footage.tsx`. The clinic shot is a bright kitchen consultation rather than a hospital exam room, to keep the film feeling personal rather than clinical. See `public/wai/footage/README.md` for filenames and the shot list if you want to swap in Wai's own footage later.

**Score:** `public/wai/audio/theme.mp3` ("Finding Myself," Mixkit Free License) fades in under the opening cut, dips slightly through the collage so the captions read clearly, and swells again into the end card. Volume envelope lives in `src/wai/WaiFilm.tsx`.

Shot timings and captions are in `src/wai/timeline.ts`. The logo is `public/wai/wai-logo-cream.png`.

---

# Wai: origin film (vertical)

A 105.6-second vertical film (1080×1920, 30fps) matching the length, beat count, and pacing of a second reference edit — which turned out to be Andreessen Horowitz's own brand film (it closes on the a16z logo), built from real footage of Steve Jobs, Steve Wozniak, Elon Musk, the Collison brothers, and other companies' trademarks (Coinbase, Slack, SpaceX, NYSE). None of that is reusable for Wai. This film keeps the reference's structure — a history-of-the-field opener, a breakthrough montage, builders at work, a symbolic spark-to-scale sequence, the product taking shape, and a triumphant close — but rewrites every beat as Wai's own story, with generic licensed footage and Wai's own product UI standing in for anything that was borrowed likeness or trademark in the original.

**Rendered file:** [`renders/wai-origin.mp4`](renders/wai-origin.mp4)

```bash
npm run render:wai-origin   # writes out/wai-origin.mp4
```

| Time | Beat | Reference equivalent |
|---|---|---|
| 0.0–6.6s | A microscope on a bench, slow push in, dark dramatic light | The book opening |
| 6.6–9.0s | Flash: a hand-drawn brain illustration, then cells under magnification | Patent drawing, punch-card computer |
| 9.0–19.3s | Colleagues working intently around a screen | Young Jobs & Wozniak in the office |
| 19.3–20.7s | Hands close on a keyboard | Close working shot |
| 20.7–21.9s | Wai's own early product UI — a single unified record | The Airbnb website flash |
| 21.9–31.0s | Flame → sun rays → Earth from orbit | Prometheus torch, golden light, Earth |
| 31.0–37.7s | A hand sketching — an idea taking shape | Hand with phone, hand sketching |
| 37.7–48.9s | Drone over green hills, then "Ask Wai anything" chat UI | Drone shot, AI-chat screenshot |
| 48.9–58.4s | A researcher at close, focused work | UI screenshots, reflection shot |
| 58.4–66.3s | A hand holding a smaller hand | Robotic hand meets human hand |
| 66.3–74.0s | Drone over a river valley, then a clinician's confident portrait | Landscape drone, founder portraits |
| 74.0–83.5s | Precision assembly line, then a drone lifting off | Robotics factory, rocket/plane footage |
| 83.5–89.2s | A toast among friends | Office celebration |
| 89.2–95.5s | Sun rays return — a callback into the reveal | Portfolio logo wall |
| 95.5–105.6s | End card: Wai logo on espresso, "medical intelligence, made personal" | A16Z logo hold |

**Footage:** `public/wai/origin/*.mp4` — seventeen Mixkit clips (several are Restricted License, personal use only — see public/wai/manifesto/CREDITS.md), graded with a heavier, more documentary contrast than the lifestyle brand film above (`src/wai-origin/OriginFootage.tsx`). The two product-UI beats (`src/wai-origin/ProductUi.tsx`) are original Wai screens, not screenshots of anyone else's software.

**Score:** `public/wai/origin/theme-origin.mp3` ("The Journey," Mixkit Free License), a single building cue close to the reference's own runtime. Volume envelope is in `src/wai-origin/WaiOrigin.tsx`.

Shot timings live in `src/wai-origin/timeline.ts`. The end card reuses `src/wai/EndCard.tsx` so both Wai films close the same way.

---

# Wai: manifesto (4:3)

A 105.6s, 1440×1080 beat-for-beat reinterpretation of the a16z brand film as Wai's story of medicine: public-domain archival medical footage, narration with genuine archival soundbites, an Asclepius engraving and gilded statue for the "spark", Wai's own product UI, and a mosaic that resolves into a gold Wai logo.

**Rendered file:** [`renders/wai-manifesto.mp4`](renders/wai-manifesto.mp4) · `npm run render:wai-manifesto`

Shots (each pinned to a reference cut) live in `src/wai-manifesto/timeline.ts`. **Licensing:** see `public/wai/manifesto/CREDITS.md`. The narration is scratch TTS, and many modern clips are Mixkit Restricted, so both need replacing or licensing before public release.
