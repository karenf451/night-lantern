export function parseStoryFile(rawFile, sourcePath) {
  const match = rawFile.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);

  if (!match) {
    throw new Error(`Story file is missing front matter: ${sourcePath}`);
  }

  const [, frontMatter, rawBody] = match;
  const metadata = parseFrontMatter(frontMatter);
  const body = stripMatchingTitleHeading(rawBody.trim(), metadata.title);
  const paragraphs = body
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return {
    ...metadata,
    sourcePath,
    body,
    paragraphs,
  };
}

function stripMatchingTitleHeading(body, title) {
  const headingMatch = body.match(/^#\s+(.+?)\s*\n+/);

  if (!headingMatch || !title) {
    return body;
  }

  const [, headingTitle] = headingMatch;

  if (normalizeTitle(headingTitle) !== normalizeTitle(title)) {
    return body;
  }

  return body.slice(headingMatch[0].length).trim();
}

function normalizeTitle(title) {
  return String(title).trim().replace(/\s+/g, ' ').toLowerCase();
}

function parseFrontMatter(frontMatter) {
  const metadata = {};
  const lines = frontMatter.split('\n');

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const keyValueMatch = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);

    if (!keyValueMatch) {
      continue;
    }

    const [, key, rawValue] = keyValueMatch;

    if (rawValue === '') {
      const list = [];

      while (index + 1 < lines.length) {
        const nextLine = lines[index + 1];
        const listMatch = nextLine.match(/^\s+-\s+(.+)$/);

        if (!listMatch) {
          break;
        }

        list.push(coerceValue(listMatch[1]));
        index += 1;
      }

      metadata[key] = list;
      continue;
    }

    metadata[key] = coerceValue(rawValue);
  }

  return metadata;
}

function coerceValue(value) {
  const trimmed = value.trim();

  if (/^\d+$/.test(trimmed)) {
    return Number.parseInt(trimmed, 10);
  }

  if (/^\d+\.\d+$/.test(trimmed)) {
    return Number.parseFloat(trimmed);
  }

  return trimmed.replace(/^['"]|['"]$/g, '');
}
