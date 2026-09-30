# Rebuilding the Spark We Thought We Lost — LinkedIn carousel

A 10-page magazine-style essay for The Wellness LinkedIn page (1080×1350 portrait pages).

- **Upload this to LinkedIn:** `rebuilding-the-spark.pdf` (Add a document → give it a title)
- **Individual pages:** `pages/page-01.png` … `page-10.png` (2160×2700, for Instagram or image posts)
- **Source:** `article.html` (edit copy here), fonts and logo in `assets/`

Re-render after editing:

```bash
node make-logo-mask.mjs   # only if the logo file changes
node render.mjs
```

Type: Playfair Display (headlines), Newsreader (body), Inter (labels). Palette matches `src/theme.ts`.

## Suggested post caption

> There is a particular kind of grief that comes with losing one's spark.
>
> It rarely arrives dramatically. It shows up after an outcome that didn't match the effort, a loss, a dream that changed direction, or a long season of simply getting through the day.
>
> In this piece we look at what psychology says about that experience: how the stories we tell shape who we become, why looking back through nostalgia can move us forward, and why the goal may not be to recover the old spark but to create a new one.
>
> Swipe through to read. 📖
>
> #TheWellness #MentalHealth #Wellbeing #Psychology #PersonalGrowth #Resilience
