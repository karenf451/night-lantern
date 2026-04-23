# Bedtime Story App — Controlled Vocabulary v0.1

This note defines the tiny controlled vocabulary for story metadata in v1.

The goal is not completeness.
The goal is stability, clarity, and calm.

---

## Length

Allowed values:
- `short`
- `medium`
- `long`

Suggested interpretation:
- `short`: about 5–10 minutes
- `medium`: about 10–20 minutes
- `long`: about 20–35 minutes

Note:
`estimated_minutes` is the more precise field.
`length` is mainly for simple filtering and expectation.

---

## Genre

Allowed values for v1:
- `gentle_fantasy`
- `quiet_mystery`
- `reflective`

### `gentle_fantasy`
Use for:
- magical but soothing stories
- dreamlike settings
- non-combat wonder

Examples:
- lanterns in orchards
- chapels in trees
- forgotten roads

### `quiet_mystery`
Use for:
- soft uncertainty
- strangeness without panic
- unanswered questions that do not become harsh or chaotic

Examples:
- a door found open
- a bell heard at dusk
- a path that should not be there

### `reflective`
Use for:
- inward, thoughtful, low-event stories
- memory, meaning, rest, companionship
- very little plot pressure

Examples:
- a late-night train ride
- an old letter reread
- a solitary walk and a realization

---

## Mood

Allowed values for v1:
- `calm`
- `cozy`
- `wistful`
- `eerie_soft`

### `calm`
Use for stories that are steady, gentle, and low-stimulation.

### `cozy`
Use for stories that feel warm, sheltered, domestic, companionable, or hearth-like.

### `wistful`
Use for stories with a soft ache, memory, distance, or longing, without becoming distressing.

### `eerie_soft`
Use for stories that are strange or slightly uncanny, but still safe for bedtime listening.
This should feel like twilight, not horror.

---

## Content rating

Suggested values:
- `all_ages`
- `older_children`
- `teen`
- `adult`

For the first version, `all_ages` is probably the easiest default unless the story clearly needs something else.

---

## Voice hint

Suggested values:
- `warm`
- `gentle`
- `soft_clear`
- `low`

This field is advisory only.
It is not a strict device capability.

---

## Recommendation for v1 authorship

If uncertain, choose:
- a small number of genres
- a small number of moods
- fewer tags rather than more

The app should feel curated, not taxonomically obsessed.
