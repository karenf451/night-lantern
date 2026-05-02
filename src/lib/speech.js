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

export function getAvailableVoiceOptions(voices) {
  return [...voices].sort(compareVoices);
}

export function getSuggestedVoiceGroups(
  voices,
  storyLanguage = 'en',
  preferredLanguages = [],
) {
  const sortedVoices = getAvailableVoiceOptions(voices);
  const languagePreferences = getLanguagePreferences(
    storyLanguage,
    preferredLanguages,
  );

  if (!languagePreferences.length) {
    return {
      suggestedVoices: sortedVoices,
      otherVoices: [],
    };
  }

  const suggestedVoices = sortedVoices.filter((voice) =>
    getVoiceLanguageScore(voice, languagePreferences) && !isNoveltyVoice(voice),
  );
  const otherVoices = sortedVoices.filter(
    (voice) => !suggestedVoices.includes(voice),
  );

  return {
    suggestedVoices: suggestedVoices.sort((firstVoice, secondVoice) => {
      const firstScore = getVoiceLanguageScore(firstVoice, languagePreferences);
      const secondScore = getVoiceLanguageScore(secondVoice, languagePreferences);

      if (firstScore !== secondScore) {
        return firstScore - secondScore;
      }

      return compareVoices(firstVoice, secondVoice);
    }),
    otherVoices,
  };
}

export function getBrowserLanguagePreferences() {
  if (typeof window === 'undefined') {
    return [];
  }

  const languages = window.navigator.languages?.length
    ? window.navigator.languages
    : [window.navigator.language];

  return languages.filter(Boolean);
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

function compareVoices(firstVoice, secondVoice) {
  if (firstVoice.default !== secondVoice.default) {
    return firstVoice.default ? -1 : 1;
  }

  if (firstVoice.localService !== secondVoice.localService) {
    return firstVoice.localService ? -1 : 1;
  }

  const languageComparison = firstVoice.lang.localeCompare(secondVoice.lang);

  if (languageComparison !== 0) {
    return languageComparison;
  }

  return firstVoice.name.localeCompare(secondVoice.name);
}

function getLanguagePreferences(storyLanguage, preferredLanguages) {
  const languages = [storyLanguage, ...preferredLanguages];
  const seenLanguageKeys = new Set();

  return languages
    .map((language) => normalizeLanguage(language))
    .filter((language) => {
      if (!language || seenLanguageKeys.has(language.base)) {
        return false;
      }

      seenLanguageKeys.add(language.base);
      return true;
    });
}

function getVoiceLanguageScore(voice, languagePreferences) {
  const voiceLanguage = normalizeLanguage(voice.lang);

  if (!voiceLanguage) {
    return null;
  }

  for (const [index, preference] of languagePreferences.entries()) {
    if (voiceLanguage.base === preference.base) {
      return index * 2 + 1;
    }

    if (voiceLanguage.root === preference.root) {
      return index * 2 + 2;
    }
  }

  return null;
}

function normalizeLanguage(language) {
  if (!language) {
    return null;
  }

  const base = language.toLowerCase();
  const root = base.split('-')[0];

  return { base, root };
}

function isNoveltyVoice(voice) {
  const voiceName = voice.name.toLowerCase();

  return noveltyVoiceNames.some((name) => voiceName.includes(name));
}

function formatLanguageLabel(language) {
  try {
    return new Intl.DisplayNames(['en'], { type: 'language' }).of(language) ?? language;
  } catch {
    return language;
  }
}
