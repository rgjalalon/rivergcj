# "18:00" live-action footage

The live-action shots use real footage from [Mixkit](https://mixkit.co). It is free for commercial use under the [Mixkit Stock Video Free License](https://mixkit.co/license/#videoFree). The clips are **not committed** because that licence doesn't allow redistributing them as standalone files. Fetch them before rendering:

```bash
./scripts/fetch-clinic-footage.sh   # downloads into public/wai/clinic/footage/
```

One doctor carries the film: clips 6434, 15048 and 6595 come from the same shoot, with the same doctor in the same consulting room.

| Shot | Clip | What's on screen |
|---|---|---|
| `ext-window` | [22255](https://mixkit.co/free-stock-video/lights-switching-on-and-off-in-an-apartment-22255/) | Windows across a building going dark at nightfall |
| `walk-away`, `walk-home` | [4629](https://mixkit.co/free-stock-video/backlit-woman-walking-at-sunset-4629/) | Silhouette walking at sunset |
| `desk-1800`, `laptop-close` | [42653](https://mixkit.co/free-stock-video/woman-finishes-working-on-her-computer-42653/) | Hands on a laptop, then the lid closes (lid logo blurred) |
| `office-1410` | [6434](https://mixkit.co/free-stock-video/doctor-working-in-her-office-6434/) | The doctor in her consulting room |
| `back-to-desk`, `lean-back` | [15048](https://mixkit.co/free-stock-video/tired-doctor-working-at-their-desk-15048/) | The same doctor at her desk, typing, then sitting back |
| `jots` | [29975](https://mixkit.co/free-stock-video/doctor-writing-down-a-prescription-29975/) | A doctor's hand writing on a pad |
| `high-five` | [6595](https://mixkit.co/free-stock-video/doctor-giving-a-child-a-high-five-6595/) | The same doctor high-fives a girl, with her mother |

The in and out points, crop focus and logo blur for each shot are set in `src/clinic/timeline.ts`, under `live`. To use your own shoot instead, drop a clip at `footage/<clip>.mp4` or point a shot at a new clip ID. If a file is missing, that shot renders as a labelled placeholder.

The Mixkit files are 720p, so the 1080p cuts are upscaled. Final delivery should use a 1080p or 4K source: the paid versions of these clips, or your own shoot.

`sound-master.wav` and `sound-short.wav` are the generated sound beds: room tone, keys, clicks, a door and the laptop lid. There is no music and no voiceover. Rebuild them with `npm run clinic:audio`.
