import { labelFromToken } from '../lib/formatters.js';

export default function PlayerPage({ story, onBack }) {
  const previewParagraphs = story.paragraphs.slice(0, 5);

  return (
    <section className="player-page" aria-labelledby="player-title">
      <button className="quiet-link" type="button" onClick={onBack}>
        Back to library
      </button>

      <div className="player-layout">
        <div className="player-panel">
          <p className="eyebrow">Now resting on the lantern shelf</p>
          <h1 id="player-title">{story.title}</h1>
          <p>{story.summary}</p>

          <dl className="story-details">
            <div>
              <dt>Length</dt>
              <dd>
                {labelFromToken(story.length)} · {story.estimated_minutes} min
              </dd>
            </div>
            <div>
              <dt>Mood</dt>
              <dd>{labelFromToken(story.mood)}</dd>
            </div>
            <div>
              <dt>Voice hint</dt>
              <dd>{labelFromToken(story.voice_hint)}</dd>
            </div>
            <div>
              <dt>Recommended rate</dt>
              <dd>{story.recommended_rate}</dd>
            </div>
          </dl>

          <div className="player-controls" aria-label="Playback controls">
            <button type="button">Play later</button>
            <button type="button">Pause later</button>
            <button type="button">Stop later</button>
          </div>
        </div>

        <article className="story-reader">
          {previewParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </article>
      </div>
    </section>
  );
}
