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

# Wai: "18:00" (clinical assistant brand film)

This film follows one doctor through one afternoon. It opens on the outcome (lights off at 18:00), then rewinds to 14:10. After each patient leaves, the product drafts the follow-up work: the consultation note, the referral letter, the follow-up message and the next booking. In every step the doctor reads the draft, edits it on screen and approves it. The product name appears only in the last 3 seconds.

**Rendered files**
- [`renders/wai-18-00-master-60s.mp4`](renders/wai-18-00-master-60s.mp4): 60s master, 1920×1080
- [`renders/wai-18-00-cut-30s.mp4`](renders/wai-18-00-cut-30s.mp4): 30s cut-down, 1920×1080
- [`renders/wai-18-00-vertical-30s.mp4`](renders/wai-18-00-vertical-30s.mp4): 30s 9:16 cut, 1080×1920

```bash
./scripts/fetch-clinic-footage.sh   # real footage (not committed)
npm run render:clinic               # rebuilds the sound beds, then renders all three cuts into out/
```

**How it's made**
- **Real footage:** the live-action shots are real people, taken from Mixkit's free-licence library. One doctor appears throughout: the consulting room, her desk, and the high-five with the girl and her mother. Run `./scripts/fetch-clinic-footage.sh` before rendering. See `public/wai/clinic/README.md` for the clip list and licence.
- **Product screens** (`src/clinic/Screen.tsx`): each step is a draft marked "Draft · needs your approval". The doctor selects the wrong text and types the correction, which stays underlined and is logged as "Edited by you · 1 change". Then the doctor moves the cursor to Approve and clicks. Use them as the reference for the real build that is filmed on set.
- **Logos:** a manufacturer logo on a laptop lid is blurred out, so no other company is shown.

**Sound:** a score, "A New Life" by Eugenio Mininni (Mixkit Stock Music Free License, fetched with the footage), sits under a quiet room-tone bed. The bed has keys, clicks, a door and the laptop lid, synced to the picture by `scripts/clinic-audio.ts`. The music opens near-silent, builds through the workflow and fades out across the end card. There is no voiceover.

**Screens:** the camera is locked off, with a slow eased push and no shake. Every state change is continuous: the selection sweep, typing, the button hover and press, the draft-to-approved pill, and the check drawing on. The 9:16 cut uses a narrow, reflowed layout of the same app, so the text stays large on a phone.

**Rules the edit keeps:**
- There are no statistics or outcome claims.
- No other company is named or shown.
- An edit and an approval are visible in every workflow step.
- The name "Wai" appears only on the end card.

| 60s | Shot | On-screen text |
|---|---|---|
| 0:00–0:10 | Windows go dark · a silhouette walks off into the sunset · the laptop lid closes · cut back to the consulting room at 14:10 | 18:00 · 14:10 |
| 0:10–0:22 | The doctor turns back to the desk → note draft → "twice daily" edited to "once daily" → Approve & sign | You read every line. |
| 0:22–0:32 | The doctor writes on a pad → referral: "A routine appointment is fine." edited to "Please see within two weeks." → Approve & send | You change what’s wrong. |
| 0:32–0:41 | The doctor high-fives the girl → message to parent: "the patient" edited to "Maya" → Approve & send | You approve every word. |
| 0:41–0:49 | Booking: Wed 25 Nov 14:30 edited to Fri 27 Nov 09:00 → Approve & book → today's list, all approved | |
| 0:49–0:57 | The laptop closes · the doctor sits back · a silhouette walks on into the evening | 18:00 |
| 0:57–1:00 | End card | Wai logo |

The 30s and 9:16 cuts keep all four workflow steps, with each draft edited and approved in a single shot. Timings, shots and on-screen text are all in `src/clinic/timeline.ts`.
