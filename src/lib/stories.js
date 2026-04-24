import lanternAtTheOrchardGate from '../../stories/lantern-at-the-orchard-gate.md?raw';
import { parseStoryFile } from './parseStoryFile.js';

export const stories = [
  parseStoryFile(lanternAtTheOrchardGate, 'stories/lantern-at-the-orchard-gate.md'),
];
