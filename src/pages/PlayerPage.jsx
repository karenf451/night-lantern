import { useEffect, useMemo, useRef, useState } from 'react';
import { labelFromToken } from '../lib/formatters.js';
import {
  chooseDefaultVoice,
  findVoiceByURI,
  getStoryVoiceOptions,
  formatVoiceLabel,
  getSpeechSynthesis,
} from '../lib/speech.js';

const storedRateKey = 'night-lantern.playback-rate';
const storedVoiceKey = 'night-lantern.voice-uri';

export default function PlayerPage({ story, onBack }) {
  const synthRef = useRef(null);
  const utteranceRef = useRef(null);
  const currentParagraphRef = useRef(null);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState(readStoredVoiceURI);
  const [rate, setRate] = useState(() =>
    readStoredRate(story.recommended_rate ?? 0.92),
  );
  const [playbackState, setPlaybackState] = useState('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);
  const isPlaybackActive =
    playbackState === 'playing' || playbackState === 'paused';

  const voiceOptions = useMemo(
    () => getStoryVoiceOptions(voices, story.language),
    [voices, story.language],
  );

  const selectedVoice = useMemo(
    () => findVoiceByURI(voices, selectedVoiceURI),
    [voices, selectedVoiceURI],
  );

  useEffect(() => {
    const synth = getSpeechSynthesis();
    synthRef.current = synth;

    if (!synth) {
      setIsSpeechSupported(false);
      setStatusMessage('Speech playback is not available in this browser.');
      return undefined;
    }

    setIsSpeechSupported(true);

    function refreshVoices() {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);
      setSelectedVoiceURI((currentVoiceURI) => {
        if (
          currentVoiceURI &&
          availableVoices.some((voice) => voice.voiceURI === currentVoiceURI)
        ) {
          return currentVoiceURI;
        }
        const storyVoices = getStoryVoiceOptions(availableVoices, story.language);
        const defaultVoice =
          chooseDefaultVoice(storyVoices, story.language) ??
          chooseDefaultVoice(availableVoices, story.language);
        return defaultVoice?.voiceURI ?? '';
      });
    }

    refreshVoices();
    synth.addEventListener?.('voiceschanged', refreshVoices);
    synth.onvoiceschanged = refreshVoices;

    return () => {
      synth.removeEventListener?.('voiceschanged', refreshVoices);
      if (synth.onvoiceschanged === refreshVoices) {
        synth.onvoiceschanged = null;
      }
      utteranceRef.current = null;
      synth.cancel();
    };
  }, [story.language]);

  useEffect(() => {
    const synth = synthRef.current;
    utteranceRef.current = null;
    synth?.cancel();
    setCurrentParagraphIndex(0);
    setPlaybackState('idle');
    setStatusMessage('');
  }, [story.id]);

  useEffect(() => {
    if (
      (playbackState === 'playing' || playbackState === 'paused') &&
      currentParagraphRef.current
    ) {
      currentParagraphRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentParagraphIndex, playbackState]);

  function playStory() {
    const nextParagraphIndex =
      playbackState === 'finished' ? 0 : currentParagraphIndex;
    startPlaybackAt(nextParagraphIndex);
  }

  function startOver() {
    startPlaybackAt(0);
  }

  function startPlaybackAt(paragraphIndex) {
    const synth = synthRef.current;

    if (!synth) {
      setStatusMessage('Speech playback is not available in this browser.');
      return;
    }

    const safeParagraphIndex = getSafeParagraphIndex(
      paragraphIndex,
      story.paragraphs.length,
    );
    utteranceRef.current = null;
    synth.cancel();
    setCurrentParagraphIndex(safeParagraphIndex);
    setPlaybackState('playing');
    setStatusMessage(
      `Playing paragraph ${safeParagraphIndex + 1} of ${story.paragraphs.length}.`,
    );
    speakParagraph(safeParagraphIndex);
  }

  function speakParagraph(paragraphIndex) {
    const synth = synthRef.current;
    const paragraph = story.paragraphs[paragraphIndex];

    if (!synth || !paragraph) {
      setPlaybackState('idle');
      setStatusMessage('Nothing to play.');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(paragraph);
    utterance.rate = rate;
    utterance.pitch = 1;
    utterance.lang = story.language ?? 'en';

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    }

    utterance.onstart = () => {
      if (utteranceRef.current !== utterance) {
        return;
      }
      setPlaybackState('playing');
      setCurrentParagraphIndex(paragraphIndex);
      setStatusMessage(
        `Playing paragraph ${paragraphIndex + 1} of ${story.paragraphs.length}.`,
      );
    };

    utterance.onpause = () => {
      if (utteranceRef.current !== utterance) {
        return;
      }
      setPlaybackState('paused');
      setStatusMessage('Paused.');
    };

    utterance.onresume = () => {
      if (utteranceRef.current !== utterance) {
        return;
      }
      setPlaybackState('playing');
      setStatusMessage(
        `Playing paragraph ${paragraphIndex + 1} of ${story.paragraphs.length}.`,
      );
    };

    utterance.onend = () => {
      if (utteranceRef.current !== utterance) {
        return;
      }

      const nextParagraphIndex = paragraphIndex + 1;

      if (nextParagraphIndex < story.paragraphs.length) {
        setCurrentParagraphIndex(nextParagraphIndex);
        speakParagraph(nextParagraphIndex);
        return;
      }

      utteranceRef.current = null;
      setPlaybackState('finished');
      setStatusMessage('Finished.');
    };

    utterance.onerror = () => {
      if (utteranceRef.current !== utterance) {
        return;
      }

      utteranceRef.current = null;
      setPlaybackState('idle');
      setStatusMessage('Speech playback stopped unexpectedly.');
    };

    utteranceRef.current = utterance;
    synth.speak(utterance);
  }

  function pauseStory() {
    const synth = synthRef.current;

    if (synth?.speaking && !synth.paused) {
      synth.pause();
      setPlaybackState('paused');
      setStatusMessage('Paused.');
    }
  }

  function resumeStory() {
    const synth = synthRef.current;

    if (synth?.paused) {
      synth.resume();
      setPlaybackState('playing');
      setStatusMessage(
        `Playing paragraph ${currentParagraphIndex + 1} of ${story.paragraphs.length}.`,
      );
    }
  }

  function stopStory() {
    const synth = synthRef.current;

    if (synth?.speaking || synth?.paused) {
      utteranceRef.current = null;
      synth.cancel();
      setPlaybackState('idle');
      setStatusMessage('Stopped.');
    }
  }

  function handleVoiceChange(event) {
    const nextVoiceURI = event.target.value;
    setSelectedVoiceURI(nextVoiceURI);
    storePreference(storedVoiceKey, nextVoiceURI);
  }

  function handleRateChange(event) {
    const nextRate = Number.parseFloat(event.target.value);
    setRate(nextRate);
    storePreference(storedRateKey, nextRate.toString());

    if (playbackState === 'playing' || playbackState === 'paused') {
      setStatusMessage('Speed will change the next time playback starts.');
    }
  }

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
          </dl>

          <div className="player-controls" aria-label="Playback controls">
            <button
              type="button"
              onClick={playStory}
              disabled={!isSpeechSupported || isPlaybackActive}
            >
              Play
            </button>
            <button
              type="button"
              onClick={pauseStory}
              disabled={!isSpeechSupported || playbackState !== 'playing'}
            >
              Pause
            </button>
            <button
              type="button"
              onClick={resumeStory}
              disabled={!isSpeechSupported || playbackState !== 'paused'}
            >
              Resume
            </button>
            <button
              type="button"
              onClick={stopStory}
              disabled={
                !isSpeechSupported ||
                (playbackState !== 'playing' && playbackState !== 'paused')
              }
            >
              Stop
            </button>
            <button type="button" onClick={startOver} disabled={!isSpeechSupported}>
              Start over
            </button>
          </div>

          <div className="playback-settings">
            <label className="control-field" htmlFor="voice-select">
              <span>Voice</span>
              <select
                id="voice-select"
                value={selectedVoiceURI}
                onChange={handleVoiceChange}
                disabled={!isSpeechSupported || voices.length === 0 || isPlaybackActive}
              >
                <option value="">Browser default</option>
                {voiceOptions.length > 0 &&
                  voiceOptions.map((voice) => (
                    <option key={voice.voiceURI} value={voice.voiceURI}>
                      {formatVoiceLabel(voice)}
                    </option>
                  ))}
              </select>
            </label>

            <label className="control-field" htmlFor="rate-control">
              <span>Bedtime speed {rate.toFixed(2)}x</span>
              <input
                id="rate-control"
                type="range"
                min="0.75"
                max="1.1"
                step="0.05"
                value={rate}
                onChange={handleRateChange}
                disabled={!isSpeechSupported}
              />
              {Number.isFinite(story.recommended_rate) ? (
                <span className="control-hint">
                  Suggested for this story: {story.recommended_rate.toFixed(2)}x
                </span>
              ) : null}
            </label>
          </div>

          <p className="device-note">
            Voices come from your browser and device, so the list may differ on
            desktop and iPhone.
          </p>

          <p className="playback-status" aria-live="polite">
            {statusMessage ||
              (voices.length === 0 && isSpeechSupported
                ? 'Looking for browser voices.'
                : 'Ready when you are.')}
          </p>
        </div>

        <article className="story-reader">
          {story.paragraphs.map((paragraph, index) => (
            <p
              ref={index === currentParagraphIndex ? currentParagraphRef : null}
              className={
                index === currentParagraphIndex
                  ? 'story-reader__paragraph story-reader__paragraph--current'
                  : 'story-reader__paragraph'
              }
              aria-current={index === currentParagraphIndex ? 'true' : undefined}
              key={paragraph}
            >
              {paragraph}
            </p>
          ))}
        </article>
      </div>
    </section>
  );
}

function readStoredVoiceURI() {
  if (typeof window === 'undefined') {
    return '';
  }

  try {
    return window.localStorage.getItem(storedVoiceKey) ?? '';
  } catch {
    return '';
  }
}

function getSafeParagraphIndex(paragraphIndex, paragraphCount) {
  if (paragraphCount <= 0) {
    return 0;
  }

  return Math.min(paragraphCount - 1, Math.max(0, paragraphIndex));
}

function readStoredRate(fallbackRate) {
  if (typeof window === 'undefined') {
    return fallbackRate;
  }

  let storedRate = Number.NaN;

  try {
    storedRate = Number.parseFloat(
      window.localStorage.getItem(storedRateKey) ?? '',
    );
  } catch {
    return fallbackRate;
  }

  if (Number.isNaN(storedRate)) {
    return fallbackRate;
  }

  return Math.min(1.1, Math.max(0.75, storedRate));
}

function storePreference(key, value) {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // Playback preferences are nice-to-have; the controls still work without storage.
    }
  }
}
