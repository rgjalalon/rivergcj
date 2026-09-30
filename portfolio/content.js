/*
  PORTFOLIO CONTENT — edit this file to update the site.

  PROFILE is the "About / details" template. Every field marked
  `// TODO` holds filler text for now: replace it with your own details.
  Remove a list item to hide it; empty lists hide their whole block.

  PROJECTS drives the Work view. Each project points at images in
  assets/work/ named `<id>-01.jpg`, `<id>-02.jpg`, ... (4:5, 800×1000).
  To add a project: export its frames at 4:5, drop them in assets/work/,
  and add an entry below with `frames` set to how many there are.
*/

window.PROFILE = {
  name: "River Geoff",
  role: "Graphic designer · social & brand",               // TODO
  status: "Open to freelance work",                         // TODO — or "Not taking projects"
  location: "Davao City, Philippines",
  photo: "assets/profile.jpg",
  intro:
    "I design social campaigns and brand systems for health and wellness companies. " +
    "Most of my work turns clinical ideas into posts people stop for.", // TODO
  bio: [
    // TODO — write 2–3 short paragraphs in your own voice.
    "I'm a designer who works best when the brief is clear and the audience is specific. " +
      "Lately that has meant carousels for a private health clinic and launch content for a medical AI product.",
    "I care about pacing: what the first frame promises, what each swipe adds, and where the reader lands. " +
      "Good design doesn't shout. It flows, connects, and leaves something behind.",
  ],
  facts: [
    // label / value pairs shown in the details card
    { label: "Based in", value: "Davao City, PH" },
    { label: "Focus", value: "Social carousels, brand identity" },   // TODO
    { label: "Education", value: "BS Psychology, Mapúa MCM" },         // TODO
    { label: "Available", value: "Remote · part-time" },               // TODO
  ],
  experience: [
    // newest first
    { years: "2025 – now", title: "Graphic designer", org: "Freelance — The Wellness, Wai" },   // TODO
    { years: "2023", title: "Creative head", org: "MaPsyA" },                                   // TODO
    { years: "2022", title: "Creative committee", org: "MMCM College of Arts & Sciences" },     // TODO
    { years: "2020 – 2021", title: "Layout artist", org: "The Revolver" },                      // TODO
  ],
  skills: [
    "Social carousels", "Brand identity", "Layout & editorial", "Infographics",
    "Motion & video editing", "Mock-ups", "Art direction",
  ],
  tools: ["Canva", "Figma", "Photoshop", "Illustrator", "Premiere Pro", "CapCut"], // TODO
  contact: [
    // shown as copyable text; `href` is optional
    { label: "Email", value: "hello@yourname.com", href: "mailto:hello@yourname.com" },        // TODO
    { label: "Phone", value: "+63 900 000 0000" },                                               // TODO
    { label: "Instagram", value: "@yourhandle", href: "https://instagram.com/" },               // TODO
    { label: "Behance", value: "behance.net/yourname", href: "https://www.behance.net/" },      // TODO
  ],
};

window.PROJECTS = [
  {
    id: "cortisol",
    client: "The Wellness",
    title: "Have you tried the cortisol cocktail?",
    kind: "Carousel",
    frames: 7,
    year: "2026",
    summary:
      "A trend-response carousel that meets a viral drink on its own terms, then explains what cortisol actually does across the day and ends on a booking prompt.",
    palette: ["#f7f5f1", "#e8a032", "#9a5a1c", "#3a2414"],
    tags: ["Health education", "Trend response"],
  },
  {
    id: "bloodtest-prep",
    client: "The Wellness",
    title: "5 things to get right before your next blood test",
    kind: "Carousel",
    frames: 7,
    year: "2026",
    summary:
      "A numbered checklist carousel. Each frame carries one instruction with the reason behind it, and the last frame collects all five as a save-for-later summary.",
    palette: ["#f6f5f3", "#c4552a", "#6b5646", "#1d1512"],
    tags: ["Checklist", "Patient prep"],
  },
  {
    id: "athletes",
    client: "The Wellness",
    title: "The science Gisele, David, Steph & Serena build their lives on",
    kind: "Carousel",
    frames: 7,
    year: "2026",
    summary:
      "Four elite performers, four evidence-based habits. Each athlete gets one frame with a principle and a single research-backed number.",
    palette: ["#ffffff", "#d7e84a", "#af9577", "#35261f"],
    tags: ["Editorial", "Data callouts"],
  },
  {
    id: "heart-family",
    client: "The Wellness",
    title: "You inherit your eye colour. And maybe this.",
    kind: "Carousel",
    frames: 6,
    year: "2026",
    summary:
      "A heart-health carousel about family history. Deep reds carry the theme of inheritance, and a mock chat frame turns the ask into something readers can send home.",
    palette: ["#f5f4f0", "#b2262a", "#6e1210", "#e9772e"],
    tags: ["Heart health", "Conversation starter"],
  },
  {
    id: "hair",
    client: "The Wellness",
    title: "Your hair isn't falling out. It's on schedule.",
    kind: "Carousel",
    frames: 7,
    year: "2026",
    summary:
      "Seasonal shedding explained as a calendar. A 100-day timeline frame shows the hair cycle, followed by care steps and a checklist for when to see a GP.",
    palette: ["#f8f7f5", "#b98252", "#785e4e", "#1c120b"],
    tags: ["Seasonal", "Timeline"],
  },
  {
    id: "fuller-picture",
    client: "The Wellness",
    title: "Your blood test says “normal”. So why do you still feel off?",
    kind: "Carousel",
    frames: 7,
    year: "2026",
    summary:
      "Leads with a 92% statistic and moves from snapshot to trend, making the case for a fuller panel and a personal plan in the app.",
    palette: ["#f8f8f8", "#d2452a", "#8f5e47", "#270f0c"],
    tags: ["Statistic-led", "Product tie-in"],
  },
  {
    id: "glyca",
    client: "The Wellness",
    title: "The inflammation signal your standard blood test misses",
    kind: "Carousel",
    frames: 6,
    year: "2026",
    summary:
      "Introduces GlycA, a steadier inflammation marker. Includes a UI-style frame of three questions to bring to your next health check.",
    palette: ["#f7f6f4", "#b4a195", "#745543", "#361f17"],
    tags: ["Science explainer", "UI frame"],
  },
  {
    id: "wai-doctors",
    client: "Wai",
    title: "81% of doctors use AI at work. Which one are you using?",
    kind: "Carousel",
    frames: 4,
    year: "2026",
    summary:
      "Launch content for a medical AI assistant. Two questions to ask any AI tool, then an annotated product frame showing sources and doctor approval.",
    palette: ["#f3f3f1", "#8c2b24", "#3b5bab", "#1e1a19"],
    tags: ["Product launch", "Annotated UI"],
  },
  {
    id: "wai-workweek",
    client: "Wai",
    title: "How physicians spend a 57.8-hour workweek",
    kind: "Infographic",
    frames: 1,
    year: "2026",
    summary:
      "A single-frame infographic: a donut chart splitting direct patient care from admin work, set over a warm photographic backdrop.",
    palette: ["#f3f0ec", "#9c8a80", "#382c24", "#0b0503"],
    tags: ["Infographic", "Data viz"],
  },
];

window.MOTION = [
  {
    id: "wellness-app",
    client: "The Wellness",
    title: "App walkthrough",
    detail: "30s · 1920×1080 · Remotion",
    video: "assets/motion/the-wellness-app.mp4",
    poster: "assets/motion/the-wellness-app-poster.jpg",
    summary:
      "A 30-second product film for the clinic app: home, booking calendar, treatment detail and confirmation, with 300 ms ease-out UI transitions.",
  },
  {
    id: "wai-film",
    client: "Wai",
    title: "Brand film stills",
    detail: "Vertical film · key frames",
    stills: [
      "assets/motion/wai-film-explain.jpg",
      "assets/motion/wai-film-city.jpg",
      "assets/motion/wai-film-paperwork.jpg",
    ],
    summary:
      "Key frames from the Wai brand film: a patient's words typing out over everyday objects, a city at night, and the paperwork headline that sets up the problem.",
  },
];
