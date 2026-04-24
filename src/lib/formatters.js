export function labelFromToken(value) {
  if (!value) {
    return '';
  }

  return String(value)
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
