import { labelFromToken } from '../lib/formatters.js';

export default function StoryCard({ story, onOpen }) {
  return (
    <article className="story-card">
      <div className="story-card__meta">
        <span>{labelFromToken(story.length)}</span>
        <span>{story.estimated_minutes} min</span>
        <span>{labelFromToken(story.mood)}</span>
      </div>

      <h2>{story.title}</h2>
      <p>{story.summary}</p>

      <div className="story-card__footer">
        <span>{labelFromToken(story.genre)}</span>
        <button type="button" onClick={() => onOpen(story.id)}>
          Open story
        </button>
      </div>
    </article>
  );
}
