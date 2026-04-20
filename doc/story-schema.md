# Bedtime Story App — Story Schema v0.2

This note defines the first practical story-file format for the bedtime story web app.

The goal is:
- simple enough to write by hand
- structured enough for the app to filter and display stories cleanly
- stable enough that React components can code against it without guesswork

## Format

Each story is a Markdown file with YAML front matter.

The file has two parts:
1. metadata in the front matter
2. the story body in ordinary Markdown paragraphs

---

## Canonical shape

```md
---
id: lantern-at-the-orchard-gate
version: 1
title: The Lantern at the Orchard Gate
summary: A quiet walk at dusk leads to a gate that should not be glowing.
length: short
estimated_minutes: 8
genre: gentle_fantasy
mood: calm
language: en
author: Karen Woodward
status: draft
tags:
  - lantern
  - orchard
  - twilight
recommended_rate: 0.92
voice_hint: warm
content_rating: all_ages
---

Mira had not meant to stay out so late.

The orchard path had always looked different at dusk...
```

---

## Required fields

These fields should exist in every story file for v1.

### `id`
- type: string
- purpose: stable machine-readable identifier
- rules:
  - lowercase
  - hyphen-separated
  - should not change once published

Example:
```yaml
id: lantern-at-the-orchard-gate
```

### `version`
- type: integer
- purpose: lets the app evolve the schema later
- v1 value:
```yaml
version: 1
```

### `title`
- type: string
- purpose: display title in the library and player

### `summary`
- type: string
- purpose: short one-line description for library cards
- guidance:
  - aim for 1 sentence
  - should feel inviting, not spoilery

### `length`
- type: enum
- allowed values:
  - `short`
  - `medium`
  - `long`
- purpose: supports user filtering and expectation-setting

### `estimated_minutes`
- type: integer
- purpose: estimated listening duration shown in the library
- guidance:
  - should reflect the intended pace, not max speed
  - keep it approximate, not obsessive

### `genre`
- type: enum
- purpose: broad story category for filtering
- use a controlled vocabulary

### `mood`
- type: enum
- purpose: emotional tone of the story
- this matters a lot for a bedtime app

### `language`
- type: string
- purpose: language code for future expansion
- v1 example:
```yaml
language: en
```

---

## Optional fields

These are useful, but not mandatory for v1.

### `author`
- type: string
- purpose: credit the writer

### `status`
- type: enum-like string
- suggested values:
  - `draft`
  - `published`
  - `archived`
- purpose: helps if the library grows later

### `tags`
- type: list of strings
- purpose: extra descriptors beyond genre and mood
- guidance:
  - keep sparse
  - use for flavor, not core filtering in v1

### `recommended_rate`
- type: number
- purpose: recommended speech playback rate
- guidance:
  - 1.0 = normal
  - values below 1.0 are slower
  - example: `0.92`

### `voice_hint`
- type: string
- purpose: human hint about the kind of voice that suits the story
- examples:
  - `warm`
  - `gentle`
  - `low`
  - `soft_clear`
- note:
  - this is a hint, not a guaranteed device voice match

### `content_rating`
- type: enum-like string
- suggested values:
  - `all_ages`
  - `older_children`
  - `teen`
  - `adult`
- purpose: helps avoid surprise tone mismatches later

---

## Body rules

The body is ordinary Markdown.

Guidelines:
- write in paragraphs
- avoid giant unbroken walls of text
- simple Markdown emphasis is fine
- do not rely on complex Markdown features in v1
- assume the app will split text by paragraph or small chunks for speech

Example:

```md
Mira had not meant to stay out so late.

The path beyond the orchard wall had always felt longer in the evening.

When she saw the lantern swinging from the gate, she stopped.
```

---

## v1 controlled simplicity

For v1, keep metadata intentionally small.

Do not add fields unless they clearly support:
- library display
- filtering
- playback quality
- future-safe migration

Good schema design for this app should feel calm, not bureaucratic.

---

## Validation rules for v1

A story file is valid for v1 if:
- all required fields are present
- `length` is one of the allowed values
- `genre` is from the controlled vocabulary
- `mood` is from the controlled vocabulary
- `estimated_minutes` is a positive integer
- body text exists and is not empty

---

## Recommendation

For the first version of the app:
- treat `id`, `title`, `summary`, `length`, `estimated_minutes`, `genre`, `mood`, and `language` as the main UI-facing fields
- treat `recommended_rate` and `voice_hint` as playback helpers
- ignore unsupported optional fields rather than failing noisily

That will keep the app flexible while still giving it a clear structure.
