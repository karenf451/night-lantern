# Bedtime Story App — React Components, Folder Layout, and Repo Workflow (v0.1)

## Recommendation: create the GitHub repo now

Yes — create the GitHub repo now.

That gives us a few advantages immediately:

- one canonical home for the latest project files
- a place for Codex to work against the same current material
- a clean history of changes to schema, vocabulary, and app structure
- an easy path to Vercel deployment later
- a shared project memory that is more stable than pasting things back and forth

## How to use the repo well

I would treat the repo as the **working source of truth** for project documents.

Obsidian can still be your thinking space and long-form design notebook, but the repo should hold the current project files that the app and tooling depend on.

A good practical split is:

- **Obsidian**: private notes, brainstorming, longer reflections, side ideas, rough drafts
- **GitHub repo**: active project docs, schema, vocabulary, canonical sample stories, implementation notes, app code

If a note affects the actual app or build, it should probably live in the repo.

## Suggested repo communication pattern

You mentioned possibly using GitHub as one way of communicating. That can work, but keep it simple.

Good options:

1. `docs/notes/next-steps.md`
   - current priorities
   - open questions
   - decisions recently made

2. `docs/notes/dev-log.md`
   - short dated notes
   - what changed
   - what to do next

3. Git commits and commit messages
   - often enough for ordinary development history

I would **not** make the repo into a complicated correspondence system.
Use it as a project workspace, not a Victorian letter chest.

## First React build: component list

For the first build, keep the number of components small and obvious.

### App-level

#### `App`
The root component.
Responsibilities:
- load story metadata
- hold current app state
- switch between library view and player view

### Library side

#### `LibraryPage`
The landing page.
Responsibilities:
- display title/subtitle
- show filters
- render story list

#### `FilterBar`
Responsibilities:
- choose length filter
- choose genre or mood filter
- clear filters

#### `StoryList`
Responsibilities:
- render visible stories
- pass story selection events upward

#### `StoryCard`
Responsibilities:
- show title
- show summary
- show estimated minutes
- show length
- show mood/genre
- allow user to open the story

### Player side

#### `PlayerPage`
The playback screen.
Responsibilities:
- display story title and metadata
- show controls
- show story text if desired
- host playback state

#### `VoiceSelector`
Responsibilities:
- list available browser/device voices
- allow user to choose a voice
- show fallback message if needed

#### `PlaybackControls`
Responsibilities:
- play
- pause
- stop
- speed adjustment

#### `StoryText`
Responsibilities:
- render story text cleanly
- optionally highlight current paragraph later
- remain visually calm and readable

### Small support components

#### `Header`
Optional.
Could be used to keep title/navigation consistent.

#### `EmptyState`
Shown when no stories match filters or no voices are available.

#### `HelpPanel`
Very small help/settings area.
Can explain voice availability and basic usage.

## State for the first build

Keep state simple.

Likely app state:

- `stories`
- `selectedStory`
- `view` (`library` or `player`)
- `lengthFilter`
- `genreFilter` or `moodFilter`
- `availableVoices`
- `selectedVoice`
- `rate`
- `isPlaying`
- `isPaused`

That is enough for v1.

## Suggested folder layout

```text
bedtime-story-app/
  README.md
  .gitignore
  package.json
  vite.config.js
  public/
    favicon.svg
  src/
    main.jsx
    App.jsx
    styles/
      globals.css
      theme.css
    components/
      Header.jsx
      FilterBar.jsx
      StoryList.jsx
      StoryCard.jsx
      VoiceSelector.jsx
      PlaybackControls.jsx
      StoryText.jsx
      EmptyState.jsx
      HelpPanel.jsx
    pages/
      LibraryPage.jsx
      PlayerPage.jsx
    data/
      stories/
        lantern-at-the-orchard-gate.md
      storyIndex.js
    lib/
      parseStoryFile.js
      speech.js
      filters.js
      time.js
    hooks/
      useSpeechSynthesis.js
    docs/
      bedtime-story-app-plan.md
      bedtime-story-schema-v0.2.md
      bedtime-story-controlled-vocabulary-v0.1.md
    assets/
      cover-placeholder.png
  docs/
    notes/
      next-steps.md
      dev-log.md
```

## What each folder is for

### `src/components`
Reusable visual pieces.

### `src/pages`
Top-level screens.

### `src/data/stories`
Canonical story files for the app.

### `src/lib`
Small plain-JavaScript helper functions.
Examples:
- parse Markdown front matter
- filter stories
- convert metadata to display strings
- chunk story text for speech

### `src/hooks`
React hooks for logic that would otherwise clutter components.
For example, speech synthesis state and control.

### `src/styles`
Global appearance and theme tokens.

### `docs`
Project docs that belong with the codebase.

## Build order

### Step 1
Create the app shell with:
- `App`
- `LibraryPage`
- `PlayerPage`
- placeholder sample data

### Step 2
Render one sample story card from hardcoded data.

### Step 3
Replace hardcoded sample data with parsed Markdown story metadata.

### Step 4
Add the player page and display the selected story.

### Step 5
Add browser voice loading and voice selection.

### Step 6
Add play / pause / stop.

### Step 7
Add speed control.

### Step 8
Make the visuals calm and tidy.

### Step 9
Deploy.

## Practical note about story files in the repo

Yes — put the schema docs and canonical sample story in the repo.
That is exactly where they belong.

At minimum, I would commit:

- `docs/bedtime-story-app-plan.md`
- `docs/bedtime-story-schema-v0.2.md`
- `docs/bedtime-story-controlled-vocabulary-v0.1.md`
- `stories/lantern-at-the-orchard-gate.md`

That way the project docs and the working app content live together.

## Recommended immediate next action

Create the repo, add the docs, and then have Codex help bootstrap:

- React
- Vite
- the folder structure
- one sample page with one sample story card

That is the right first tangible foothold.
