# Bedtime Story App — v1 Plan

## One-sentence concept
A small, calm web app that reads bedtime stories aloud from Markdown files, with simple filtering, voice choice, speed control, and a dark, soothing interface.

## v1 goal
On iPhone or desktop browser, a user can:
1. open the app,
2. choose a story,
3. hear it read aloud,
4. adjust speed,
5. stop playback,
6. optionally use a simple timer if we include it in v1.

## Product identity
This is **not** a general text-reader app.
Its identity is: **a gentle story player for sleep**.

## Keep v1 small
Include:
- story library screen
- basic filters: short / medium / long
- maybe one extra filter: mood or genre
- player screen
- voice selection
- speed control
- dark, calm styling
- a handful of built-in stories

Leave out:
- AI generation
- branching stories
- user accounts
- cloud sync
- social/community features
- importing user stories in the proof-of-concept build
- fancy animations
- monetization decisions

## Suggested screens

### 1) Library screen
Purpose: calm landing page.

Show:
- app title
- one-line description
- filters
- story cards

Each story card should show:
- title
- short summary
- length
- mood or genre
- estimated minutes

### 2) Player screen
Purpose: quiet playback view.

Show:
- story title
- voice dropdown
- speed control
- play / pause / stop
- optional timer
- optional simple progress indicator later

Visual rules:
- dark background
- low-contrast but readable text
- no clutter
- no bright accent colors unless very restrained

### 3) Tiny help/settings area
Show:
- how voices work on this device
- what to do if no good voices appear
- brief troubleshooting notes

## Story file format
Use Markdown with front matter.

Example:

```md
---
id: lantern-orchard-gate
title: The Lantern at the Orchard Gate
author: Karen Woodward
length: short
genre: fantasy
mood: calm
tags:
  - orchard
  - twilight
recommended_rate: 0.92
summary: A quiet walk at dusk leads to a gate that should not be glowing.
---

Mira had not meant to stay out so late.

The path beyond the orchard wall was one she had walked before...
```

## Suggested metadata fields
Required:
- `id`
- `title`
- `author`
- `length`
- `genre`
- `mood`
- `summary`

Optional:
- `tags`
- `recommended_rate`

## Controlled values for v1
Keep categories tiny.

### length
- short
- medium
- long

### genre
- fantasy
- mystery
- reflective

### mood
- calm
- cozy
- wistful
- soft_eerie

## Estimated reading time
For v1, estimate reading time from word count.
Example rough bands:
- short: about 5–10 minutes
- medium: about 10–20 minutes
- long: about 20–35 minutes

Later, use actual word count + chosen speech rate for better estimates.

## Playback model
Do not send the whole story as one giant speech block.
Split by paragraph or small chunks.

Benefits:
- easier stop/pause behavior
- better control
- simpler future progress tracking
- easier future resume support

## Recommended tech stack
- React
- Vite
- browser `speechSynthesis`
- Markdown parser
- simple CSS

## Why this stack
- easy to demo publicly
- easy to test on phone
- no backend needed for v1
- stories can live in the repo as files
- gives a path to later wrapping as an iPhone app

## Suggested folder structure

```text
bedtime-story-app/
  public/
  src/
    components/
      StoryCard.jsx
      FilterBar.jsx
      PlayerControls.jsx
      VoicePicker.jsx
    data/
      stories/
        lantern-orchard-gate.md
        second-story.md
    lib/
      parseStory.js
      estimateMinutes.js
      speech.js
    pages/
      LibraryPage.jsx
      PlayerPage.jsx
    App.jsx
    main.jsx
    styles.css
  package.json
  README.md
```

## First components to build
1. `LibraryPage`
2. `StoryCard`
3. `PlayerPage`
4. `PlayerControls`
5. `VoicePicker`
6. small speech helper module

## Build order

### Step 1
Create app shell and dark styling.

### Step 2
Load one hard-coded sample story.

### Step 3
Parse front matter + body from Markdown.

### Step 4
Render story library with 2–3 sample stories.

### Step 5
Add speech playback.

### Step 6
Add voice selection.

### Step 7
Add speed control.

### Step 8
Add simple filters.

### Step 9
Test on iPhone Safari.

### Step 10
Deploy publicly.

## Definition of done for first working milestone
- app loads in browser
- at least 3 stories appear in library
- user can open a story
- app reads story aloud
- user can choose from available voices
- user can change speed
- playback can be stopped cleanly
- app looks calm and intentional on phone

## Questions to decide soon
- timer in true v1, or version 1.1?
- do we show estimated minutes on cards only, or also in player?
- do we start with 3 stories or 6?
- what exact moods/genres do we want?
- what visual tone: night-sky, lamp-light, woodland, minimal charcoal?

## Nice future directions
- import local user story files
- favorites / last played
- better voice guidance
- actual app icon / installable feel
- Capacitor wrapper for iPhone
- branching bedtime stories
- optional AI-generated stories later

## One-line public description draft
A quiet web app for sleep: choose a gentle story, pick a voice, and let it read to you.
