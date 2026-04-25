import { useMemo } from 'react';
import StoryCard from '../components/StoryCard.jsx';
import { labelFromToken } from '../lib/formatters.js';

const allFilterValue = 'all';
const lengthOrder = ['short', 'medium', 'long'];
const moodOrder = ['calm', 'cozy', 'wistful', 'soft_eerie'];

export default function LibraryPage({
  stories,
  filters,
  onFiltersChange,
  onOpenStory,
}) {
  const lengthFilter = filters.length ?? allFilterValue;
  const moodFilter = filters.mood ?? allFilterValue;
  const lengthOptions = useMemo(
    () => getOrderedValues(stories, 'length', lengthOrder),
    [stories],
  );
  const moodOptions = useMemo(
    () => getOrderedValues(stories, 'mood', moodOrder),
    [stories],
  );
  const visibleStories = useMemo(
    () =>
      stories.filter(
        (story) =>
          matchesFilter(story.length, lengthFilter) &&
          matchesFilter(story.mood, moodFilter),
      ),
    [lengthFilter, moodFilter, stories],
  );
  const hasActiveFilters =
    lengthFilter !== allFilterValue || moodFilter !== allFilterValue;

  function updateFilter(key, value) {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  }

  function clearFilters() {
    onFiltersChange({
      length: allFilterValue,
      mood: allFilterValue,
    });
  }

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

      <div className="library-toolbar">
        <div className="library-filters" aria-label="Story filters">
          <label className="filter-field" htmlFor="length-filter">
            <span>Length</span>
            <select
              id="length-filter"
              value={lengthFilter}
              onChange={(event) => updateFilter('length', event.target.value)}
            >
              <option value={allFilterValue}>Any length</option>
              {lengthOptions.map((length) => (
                <option key={length} value={length}>
                  {labelFromToken(length)}
                </option>
              ))}
            </select>
          </label>

          <label className="filter-field" htmlFor="mood-filter">
            <span>Mood</span>
            <select
              id="mood-filter"
              value={moodFilter}
              onChange={(event) => updateFilter('mood', event.target.value)}
            >
              <option value={allFilterValue}>Any mood</option>
              {moodOptions.map((mood) => (
                <option key={mood} value={mood}>
                  {labelFromToken(mood)}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={clearFilters}
            disabled={!hasActiveFilters}
          >
            Clear
          </button>
        </div>

        <p className="library-count" aria-live="polite">
          {visibleStories.length === stories.length
            ? `${stories.length} stories`
            : `${visibleStories.length} of ${stories.length} stories`}
        </p>
      </div>

      {visibleStories.length > 0 ? (
        <div className="story-grid">
          {visibleStories.map((story) => (
            <StoryCard key={story.id} story={story} onOpen={onOpenStory} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No stories match those filters.</h2>
          <p>Clear the filters to bring the whole shelf back.</p>
        </div>
      )}
    </section>
  );
}

function matchesFilter(value, filter) {
  return filter === allFilterValue || value === filter;
}

function getOrderedValues(stories, key, preferredOrder) {
  const values = [...new Set(stories.map((story) => story[key]).filter(Boolean))];

  return values.sort((firstValue, secondValue) => {
    const firstIndex = preferredOrder.indexOf(firstValue);
    const secondIndex = preferredOrder.indexOf(secondValue);

    if (firstIndex !== -1 || secondIndex !== -1) {
      return getSortIndex(firstIndex) - getSortIndex(secondIndex);
    }

    return labelFromToken(firstValue).localeCompare(labelFromToken(secondValue));
  });
}

function getSortIndex(index) {
  return index === -1 ? Number.POSITIVE_INFINITY : index;
}
