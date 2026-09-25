---
name: wai-video
description: Branded video creation and editing for Wai (wellnessa-i.com), built on video-use. Use whenever making, editing, or cutting videos for Wai content.
---

# wai-video

Wraps video-use with Wai's brand and content rules so every output is on-brand by default.

## Requires
- video-use installed and linked in ~/.claude/skills/video-use
- ELEVENLABS_API_KEY set in environment secrets
- Wai logo file available in the working directory

## Brand rules (non-negotiable)
- Visual style: premium dark-mode UI, one warm accent color, typography-led, no people or stock footage unless explicitly asked
- Evidence leads: every claim carries its source on screen (study, journal, year, sample size)
- The product is the answer: the story's problem resolves into what Wai does - never leave the problem hanging
- CTA always: end card is the Wai logo + wellnessa-i.com
- No AI-sounding copy: short, human, confident lines. If a line sounds like a chatbot wrote it, cut it

## Content rules
- Hook in the first 3 seconds: a stat, a question, or a pattern interrupt
- One clear line of thinking from hook to CTA
- Data visualized as interface motion (bars, cards, timelines), not talking heads
- Landscape 16:9 by default; vertical 9:16 only when asked for Reels/TikTok

## Pipeline
Script/stats confirmed --> video-use transcribe + pack --> cut on word boundaries --> brand check (logo, CTA, sources) --> self-eval --> render

## Usage
/wai-video <source video, script, or stats> - produces a branded Wai video end to end
