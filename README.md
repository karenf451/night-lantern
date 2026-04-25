# Night Lantern

A gentle story app for sleep.

## Project status

V1 candidate. The first working milestone is complete: the app loads a small
story library, opens stories, reads them aloud with browser speech synthesis,
supports voice and speed controls, and keeps the interface calm.

## Current direction

Night Lantern is a small web app for listening to calming bedtime stories.
Stories are stored as Markdown files with structured front matter.
The first version is focused on a simple library, calm playback, adjustable speed, and a quiet interface.

## Repository structure

- `docs/` — planning and implementation notes
- `stories/` — canonical story files and examples
- `src/` — React app source
- `public/` — static app assets

## Local development

```bash
npm install
npm run dev
```

Open the local URL Vite prints, usually:

```text
http://localhost:5173/
```

To test from an iPhone on the same Wi-Fi network:

```bash
npm run dev -- --host 0.0.0.0
```

Then open the network URL Vite prints in iPhone Safari.

## Build check

```bash
npm run build
```

The production build outputs to `dist/`.

## Deployment notes

Night Lantern is a static Vite app. A simple public deployment can use Vercel,
Netlify, or another static host.

Suggested settings:

- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `dist`

## Story files

Stories live in `stories/` as Markdown files with front matter. The app validates
that each story has the required v1 metadata fields and at least one body
paragraph.

If the story body starts with a matching `# Title`, the app skips that heading
for playback so the title is not read twice.

## Manual test checklist

- Library shows all stories.
- Length and mood filters work, including the empty state.
- A story opens from the library.
- Play, Pause, Resume, Stop, and Start over behave clearly.
- The current paragraph marker follows playback.
- Voice selection and speed controls work before playback starts.
- Voice selection is disabled during playback.
- iPhone Safari has comfortable top and bottom spacing.

## Notes

This project is being developed as a small, story-first web app, with a public demo in mind.
