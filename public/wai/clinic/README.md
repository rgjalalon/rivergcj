# "18:00" live-action slots

Drop each clip here under its exact filename. On the next render it replaces its placeholder and gets the film's grade (warm, desaturated, soft blacks). Shoot 16:9 for the master and 30s cut. The vertical cut crops the same clips to fill the frame, so keep the action near the centre line.

| File | Used in | Shot |
|---|---|---|
| `ext-window.mp4` | 60s | Exterior wide from across the street, locked off. Dusk. One lit window goes dark. |
| `corridor-switch.mp4` | 60s (twice), 30s | Corridor, medium, slow handheld drift back. Coat over arm, hand to the switch, light off. |
| `desk-1800.mp4` | 60s | Desk close-up, static, last amber light. Closed laptop, empty tray, pen squared. |
| `switch-on.mp4` | 60s, 30s | Match cut: same hand, same switch. Light on, blinds open to hard afternoon light. |
| `bell-leaves.mp4` | 60s, 30s | Consult room, medium wide. An older man leaves, the door clicks shut, the doctor turns back to the desk. |
| `nair-leaves.mp4` | 60s | Medium, handheld. A woman in her forties shakes hands and leaves. The doctor jots one word on a pad. |
| `kaur-leaves.mp4` | 60s, 30s | Doorway, medium wide. A mother and child leave. The child waves, the doctor waves back. |
| `desk-close.mp4` | 60s, 30s | Desk, medium, static, low sun. The laptop closes, the pen is squared. |
| `ext-exit.mp4` | 60s, 30s | Exterior wide at dusk, locked off. The window goes dark; the doctor walks out into the street. |

`sound-master.wav` and `sound-short.wav` are the generated sound beds: room tone, keys, clicks, doors and switches. There is no music and no voiceover. Rebuild them with `npm run clinic:audio` after changing the timeline. Replace them with production sound when you have it.

## On set
- Screens: the monitor must run the real product build. No UI added in post. Cover every hardware and OS logo.
- The product name must not appear on screen or in the interface before the end card.
- Use fictional patient records, with consent from every actor.
