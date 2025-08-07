import type { MarkedExtension, Tokens } from 'marked';

/**
 * Creates a marked extension to handle @profile tags.
 *
 * Supports:
 * - @profileName -> <a href="/profiles/profilename">@profileName</a>
 *
 * @param baseUrl The base URL of the application (e.g., 'https://example.com').
 * @returns A configured `MarkedExtension` object for profile tags.
 */
export function createProfileTagExtension(baseUrl: string): MarkedExtension {
  if (!baseUrl) {
    throw new Error('baseUrl is required for profile tag extension.');
  }

  type ProfileTagToken = Tokens.Generic & {
    tag: string;
  };

  return {
    async: false,
    extensions: [
      {
        name: 'profileTag',
        level: 'inline',
        start: (src: string) => {
          // Look for @ that is either at the start or preceded by whitespace
          let index = 0;
          while (index < src.length) {
            const atIndex = src.indexOf('@', index);
            if (atIndex === -1) return undefined;

            // Check if it's at the start or preceded by whitespace
            const isValidPosition =
              atIndex === 0 || /\s/.test(src[atIndex - 1]);
            if (!isValidPosition) {
              index = atIndex + 1;
              continue;
            }

            // Check if it looks like a profile tag (not email)
            const afterAt = src.substring(atIndex + 1);
            const profileMatch = /^[a-zA-Z0-9\u00C0-\u017F_-]+/.exec(afterAt);
            if (!profileMatch) {
              index = atIndex + 1;
              continue;
            }

            // Check if it's NOT an email (no dots followed by TLD)
            const fullMatch = profileMatch[0];
            const restAfterMatch = afterAt.substring(fullMatch.length);
            const isEmail = /^\.[a-zA-Z]{2,}/.test(restAfterMatch);

            if (!isEmail) {
              return atIndex;
            }

            index = atIndex + 1;
          }
          return undefined;
        },
        tokenizer(src: string): ProfileTagToken | undefined {
          // Match the profile tag pattern
          const rule = /^@([a-zA-Z0-9\u00C0-\u017F_-]+)/;
          const match = rule.exec(src);

          if (match) {
            // Double-check it's not an email by looking ahead
            const afterMatch = src.substring(match[0].length);
            if (/^\.[a-zA-Z]{2,}/.test(afterMatch)) {
              return undefined;
            }

            return {
              type: 'profileTag',
              raw: match[0],
              tag: match[1],
              tokens: [],
            };
          }
          return undefined;
        },
        renderer(token: Tokens.Generic): string {
          const profileToken = token as ProfileTagToken;
          const href = `${baseUrl}/profiles/${encodeURIComponent(
            profileToken.tag.toLowerCase(),
          )}`;
          return `<a href="${href}">${profileToken.raw}</a>`;
        },
      },
    ],
  };
}
