import { useEffect, useMemo, useRef, useState } from 'react';
import { labelFromToken } from '../lib/formatters.js';
import {
  chooseDefaultVoice,
  findVoiceByURI,
  formatVoiceLabel,
  getSpeechSynthesis,
} from '../lib/speech.js';

export default function PlayerPage({ story, onBack }) {
  const synthRef = useRef(null);
  const utteranceRef = useRef(null);
  const stopRequestedRef = useRef(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState('');
  const [rate, setRate] = useState(story.recommended_rate ?? 0.92);
  const [playbackState, setPlaybackState] = useState('idle');
  const [statusMessage, setStatusMessage] = useState('');

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
        if (currentVoiceURI) {
          return currentVoiceURI;
        }
        const defaultVoice = chooseDefaultVoice(availableVoices, story.language);
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
      synth.cancel();
    };
  }, [story.language]);

  function playStory() {
    const synth = synthRef.current;

    if (!synth) {
      setStatusMessage('Speech playback is not available in this browser.');
      return;
    }

    stopRequestedRef.current = false;
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(story.body);
    utterance.rate = rate;
    utterance.pitch = 1;
    utterance.lang = story.language ?? 'en';

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    }

    utterance.onstart = () => {
      setPlaybackState('playing');
      setStatusMessage('Playing softly.');
    };

    utterance.onpause = () => {
      setPlaybackState('paused');
      setStatusMessage('Paused.');
    };

    utterance.onresume = () => {
      setPlaybackState('playing');
      setStatusMessage('Playing softly.');
    };

    utterance.onend = () => {
      utteranceRef.current = null;
      setPlaybackState('idle');
      setStatusMessage(stopRequestedRef.current ? 'Stopped.' : 'Finished.');
      stopRequestedRef.current = false;
    };

    utterance.onerror = () => {
      utteranceRef.current = null;
      setPlaybackState('idle');
      setStatusMessage(
        stopRequestedRef.current ? 'Stopped.' : 'Speech playback stopped unexpectedly.',
      );
      stopRequestedRef.current = false;
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
      setStatusMessage('Playing softly.');
    }
  }

  function stopStory() {
    const synth = synthRef.current;

    if (synth?.speaking || synth?.paused) {
      stopRequestedRef.current = true;
      synth.cancel();
      utteranceRef.current = null;
      setPlaybackState('idle');
      setStatusMessage('Stopped.');
    }
  }

  function handleRateChange(event) {
    const nextRate = Number.parseFloat(event.target.value);
    setRate(nextRate);

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
            <div>
              <dt>Recommended rate</dt>
              <dd>{story.recommended_rate}</dd>
            </div>
          </dl>

          <div className="player-controls" aria-label="Playback controls">
            <button type="button" onClick={playStory} disabled={!isSpeechSupported}>
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
          </div>

          <div className="playback-settings">
            <label className="control-field" htmlFor="voice-select">
              <span>Voice</span>
              <select
                id="voice-select"
                value={selectedVoiceURI}
                onChange={(event) => setSelectedVoiceURI(event.target.value)}
                disabled={!isSpeechSupported || voices.length === 0}
              >
                {voices.length === 0 ? (
                  <option value="">Browser default voice</option>
                ) : (
                  voices.map((voice) => (
                    <option key={voice.voiceURI} value={voice.voiceURI}>
                      {formatVoiceLabel(voice)}
                    </option>
                  ))
                )}
              </select>
            </label>

            <label className="control-field" htmlFor="rate-control">
              <span>Speed {rate.toFixed(2)}x</span>
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
            </label>
          </div>

          <p className="playback-status" aria-live="polite">
            {statusMessage ||
              (voices.length === 0 && isSpeechSupported
                ? 'Looking for browser voices.'
                : 'Ready when you are.')}
          </p>
        </div>

        <article className="story-reader">
          {story.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </article>
      </div>
    </section>
  );
}
