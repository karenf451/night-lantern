import lanternAtTheOrchardGate from '../../stories/lantern-at-the-orchard-gate.md?raw';
import lanternInTheLavender from '../../stories/lantern-in-the-lavender.md?raw';
import moonkeeperAtWillowPond from '../../stories/moonkeeper-at-willow-pond.md?raw';
import { parseStoryFile } from './parseStoryFile.js';

export const stories = [
  parseStoryFile(lanternAtTheOrchardGate, 'stories/lantern-at-the-orchard-gate.md'),
  parseStoryFile(lanternInTheLavender, 'stories/lantern-in-the-lavender.md'),
  parseStoryFile(
    moonkeeperAtWillowPond,
    'stories/moonkeeper-at-willow-pond.md',
  ),
];
