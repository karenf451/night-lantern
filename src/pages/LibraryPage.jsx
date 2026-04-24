import StoryCard from '../components/StoryCard.jsx';

export default function LibraryPage({ stories, onOpenStory }) {
  return (
    <section className="library-page" aria-labelledby="library-title">
      <div className="page-intro">
        <p className="eyebrow">Library</p>
        <h1 id="library-title">Choose a quiet story.</h1>
        <p>
          A small shelf of low-stimulation bedtime stories, kept simple for
          reading or listening before sleep.
        </p>
      </div>

      <div className="story-grid">
        {stories.map((story) => (
          <StoryCard key={story.id} story={story} onOpen={onOpenStory} />
        ))}
      </div>
    </section>
  );
}
