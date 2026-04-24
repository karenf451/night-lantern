const noveltyVoiceNames = [
  'bad news',
  'bahh',
  'bells',
  'boing',
  'bubbles',
  'cellos',
  'good news',
  'jester',
  'organ',
  'superstar',
  'trinoids',
  'whisper',
  'wobble',
  'zarvox',
];

export function getSpeechSynthesis() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return null;
  }

  return window.speechSynthesis;
}

export function chooseDefaultVoice(voices, language = 'en') {
  if (!voices.length) {
    return null;
  }

  const languageRoot = language.split('-')[0].toLowerCase();
  const matchingVoices = voices.filter((voice) =>
    voice.lang.toLowerCase().startsWith(languageRoot),
  );

  return (
    matchingVoices.find((voice) => voice.default) ??
    matchingVoices.find((voice) => voice.localService) ??
    matchingVoices[0] ??
    voices.find((voice) => voice.default) ??
    voices[0]
  );
}

export function getStoryVoiceOptions(voices, language = 'en') {
  const languageRoot = language.split('-')[0].toLowerCase();
  const matchingVoices = voices.filter((voice) => {
    const voiceName = voice.name.toLowerCase();

    return (
      voice.lang.toLowerCase().startsWith(languageRoot) &&
      !noveltyVoiceNames.some((name) => voiceName.includes(name))
    );
  });

  return [...matchingVoices].sort((firstVoice, secondVoice) => {
    if (firstVoice.default !== secondVoice.default) {
      return firstVoice.default ? -1 : 1;
    }

    if (firstVoice.localService !== secondVoice.localService) {
      return firstVoice.localService ? -1 : 1;
    }

    return firstVoice.name.localeCompare(secondVoice.name);
  });
}

export function findVoiceByURI(voices, voiceURI) {
  return voices.find((voice) => voice.voiceURI === voiceURI) ?? null;
}

export function formatVoiceLabel(voice) {
  const parts = [voice.name, formatLanguageLabel(voice.lang)];

  if (voice.default) {
    parts.push('default');
  }

  return parts.join(' - ');
}

function formatLanguageLabel(language) {
  try {
    return new Intl.DisplayNames(['en'], { type: 'language' }).of(language) ?? language;
  } catch {
    return language;
  }
}
