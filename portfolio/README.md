# Portfolio '26

River Geoff's portfolio, laid out like a design-tool workspace: projects in a layers panel on the left, the work on a dotted canvas in the middle, and specs, palette and brief in an inspector on the right.

- **Work** shows every carousel as a card. Open one to see its frames side by side, the way they read when swiped. Use ← → to step through frames.
- **Motion** holds The Wellness app walkthrough and the Wai brand film stills.
- **About** is the details template.

## Preview locally

```bash
cd portfolio
python3 -m http.server 8000   # then open http://localhost:8000
```

It's a static site (plain HTML, CSS and JS, no build step), so any static host works, including GitHub Pages, Netlify and Vercel.

## Fill in your details

Everything on the About page comes from `PROFILE` in [`content.js`](content.js). Lines marked `// TODO` hold filler text:

| Field | What goes there |
|---|---|
| `name`, `role`, `status`, `location` | Header of the profile card. Set `status` to something like "Not taking projects" when you're booked. |
| `photo` | Path to a portrait (4:5 works best). |
| `intro` | The one-to-two sentence line on the Work page. |
| `bio` | 2–3 short paragraphs. |
| `facts` | Label/value tiles (Based in, Focus, Education…). |
| `experience` | Newest first: `years`, `title`, `org`. |
| `skills`, `tools` | Lists of chips. |
| `contact` | `label`, `value`, optional `href`. Each row gets a Copy button. |

An empty list hides its whole block.

## Add a project

1. Export the carousel frames from Canva at 4:5 (1080 × 1350).
2. Save them as `assets/work/<id>-01.jpg`, `<id>-02.jpg`, … (800 × 1000 is plenty).
3. Add an entry to `PROJECTS` in `content.js` with the same `id` and a `frames` count.

The work images were cut from the "Contents to be approved" Canva board. The app video is a web-sized encode of `renders/the-wellness-app.mp4`.
