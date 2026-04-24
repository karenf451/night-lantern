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

export function findVoiceByURI(voices, voiceURI) {
  return voices.find((voice) => voice.voiceURI === voiceURI) ?? null;
}

export function formatVoiceLabel(voice) {
  const parts = [voice.name, voice.lang];

  if (voice.default) {
    parts.push('default');
  }

  return parts.join(' - ');
}
