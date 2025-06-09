<script lang="ts">
import type { PageHistory } from '@schemas/PageHistorySchema';
import type { Page } from '@schemas/PageSchema';
import { t } from '@utils/i18n';
import { logDebug } from '@utils/logHelpers';
import { type Change, applyPatch, diffLines } from 'diff';

interface Props {
  page: Page;
  diff: PageHistory;
  // The revision number to display (e.g., 1 is the most recent change, 0 is the current version)
  revision: number;
}
const { page, revision, diff }: Props = $props();

// --- Component State ---
let isLoading = $state(true);
let error = $state<string | null>(null);
let diffParts = $state<Change[]>([]);
let revisionDetails = $state<{ author: string; createdAt: number } | null>(
  null,
);

$effect(() => {
  async function loadAndDiff() {
    logDebug(
      'PageHistoryArticle',
      'Loading history for page',
      page.key,
      'revision',
      revision,
    );
    isLoading = true;
    error = null;
    diffParts = [];
    revisionDetails = null;

    if (!page?.key) {
      error = t('site:page.history.errors.missing_key');
      isLoading = false;
      return;
    }

    try {
      const historyArray = diff.history;
      const revisionCount = diff.history.length;

      if (revision > revisionCount || revision < 1) {
        // This case handles when the revision number is invalid or points
        // to the "current" version, which has no diff to show against itself.
        isLoading = false;
        return;
      }

      // 2. Reconstruct the historical state by applying patches sequentially.
      let reconstructedOldContent = page.markdownContent ?? '';
      const startIndex = revisionCount - 1; // Index of newest revision
      const endIndex = revisionCount - revision; // Index of the target revision

      // Loop from the most recent change back to the one we are targeting.
      for (let i = startIndex; i >= endIndex; i--) {
        const loopRevision = historyArray[i];
        if (!loopRevision?.change) {
          throw new Error(
            t('site:page.history.errors.invalid_revision_at', { index: i }),
          );
        }

        const result = applyPatch(reconstructedOldContent, loopRevision.change);

        if (result === false) {
          throw new Error(
            t('site:page.history.errors.patch_failed_at', { index: i }),
          );
        }
        reconstructedOldContent = result;
      }

      // 3. Get details from the target revision for the header
      const selectedRevision = historyArray[endIndex];
      if (!selectedRevision) {
        throw new Error(t('site:page.history.errors.invalid_revision'));
      }
      revisionDetails = {
        author: selectedRevision.author,
        createdAt: selectedRevision.createdAt,
      };

      // 4. Calculate the final diff between the fully reconstructed old
      // content and the current live content.
      diffParts = diffLines(
        reconstructedOldContent,
        page.markdownContent ?? '',
      );
    } catch (e) {
      error = e instanceof Error ? e.message : 'An unknown error occurred';
    } finally {
      isLoading = false;
    }
  }

  loadAndDiff();
});
</script>

<section class="column-l">
  <header class="surface mb-1 p-2">
    <span>{t('site:page.history.revision', { index: revision })}</span>
    {#if revisionDetails}
      <span class="text-sm text-gray-500 ml-4">
        {t('site:page.history.by', { author: revisionDetails.author, date: new Date(revisionDetails.createdAt).toLocaleString() })}
      </span>
    {/if}
  </header>

  <article class="surface p-2" style="overflow: auto;">
    {#if isLoading}
      <p>{t('site:page.history.loading')}</p>
    {:else if error}
      <p class="error">{error}</p>
    {:else if diffParts.length === 0}
      <p>{t('site:page.history.current_version')}</p>
    {:else}
      <div class="diff-container">
        {#each diffParts as part}
          <pre class:added={part.added} class:removed={part.removed} class="diff-line">
            {#if part.added}<span class="diff-indicator">+</span>{/if}
            {#if part.removed}<span class="diff-indicator">-</span>{/if}
            {part.value}
          </pre>
        {/each}
      </div>
    {/if}
  </article>
</section>

<style>
  .diff-container {
    font-family: monospace;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 1rem;
    white-space: pre-wrap;
    overflow-x: auto;
  }

  .diff-line {
    margin: 0;
    padding: 0.25rem 0.5rem;
    display: block;
  }
  
  .diff-indicator {
    display: inline-block;
    width: 1em;
  }

  .added {
    background-color: var(--color-notify);
    color: var(--color-on-notify);
  }

  .removed {
    background-color: var(--color-alert);
    color: var(--color-on-alert);
    text-decoration: line-through;
  }

  .error {
    color: var(--color-alert);
  }
</style>
