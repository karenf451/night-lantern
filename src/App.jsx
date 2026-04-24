import { useMemo, useState } from 'react';
import Header from './components/Header.jsx';
import LibraryPage from './pages/LibraryPage.jsx';
import PlayerPage from './pages/PlayerPage.jsx';
import { stories } from './lib/stories.js';

export default function App() {
  const [selectedStoryId, setSelectedStoryId] = useState(null);

  const selectedStory = useMemo(
    () => stories.find((story) => story.id === selectedStoryId) ?? null,
    [selectedStoryId],
  );

  function openStory(storyId) {
    setSelectedStoryId(storyId);
  }

  function returnToLibrary() {
    setSelectedStoryId(null);
  }

  return (
    <div className="app-shell">
      <Header onHome={returnToLibrary} />
      <main className="app-main">
        {selectedStory ? (
          <PlayerPage story={selectedStory} onBack={returnToLibrary} />
        ) : (
          <LibraryPage stories={stories} onOpenStory={openStory} />
        )}
      </main>
    </div>
  );
}
