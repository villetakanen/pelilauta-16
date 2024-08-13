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
