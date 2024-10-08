export function toDisplayString(date: Date | number | undefined): string {
  if (!date) return 'N/A';
  return new Date(date).toISOString().substring(0, 10);
}

/**
 * Takes in a string of markdown content and extracts tags (#tag) from it.
 * @param content
 */
export function extractTags(content: string): string[] {
  return content.match(/#[a-zA-Z0-9äöüÄÖÜ]+/g) || [];
}

/**
 * Creates a [120] character long snippet from a markdown content.
 *
 * Changes all topics to bold, and removes all other markdown.
 *
 * Adds an ellipsis at the end if the snippet is cut off.
 */
export function createSnippet(content: string, lenght = 120): string {
  // const tags = extractTags(content);
  const snippet = content.replace(/#([a-zA-Z0-9äöüÄÖÜ]+)/g, '<b>$1</b>');
  const plainText = snippet.replace(/<[^>]*>/g, '');
  return plainText.length > lenght
    ? `${plainText.substring(0, lenght)}...`
    : plainText;
}
