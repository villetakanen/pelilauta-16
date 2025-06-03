<script lang="ts">
import { addPage } from '@firebase/client/page/addPage';
import { pageFrom } from '@schemas/PageSchema';
import type { Site } from '@schemas/SiteSchema';
import { uid } from '@stores/session';
import { pushSessionSnack } from '@utils/client/snackUtils';
import { t } from '@utils/i18n';
import { logDebug } from '@utils/logHelpers';
import { toMekanismiURI } from '@utils/mekanismiUtils';
import MembersOnly from './MembersOnly.svelte';

/* Progressive enhancement for the creating a page for a site */

interface Props {
  site: Site;
  name?: string;
}
const { site, name }: Props = $props();

let title = $state(name || '');
const key = $derived.by(() => {
  logDebug('Derived key', { site, title });
  if (site.usePlainTextURLs) return toMekanismiURI(title);
  return '_auto_';
});
const keyClash = $derived.by(() => {
  // If the site does not use plain text URLs, there can't be a clash
  if (!site.usePlainTextURLs) return undefined;

  // If the key is empty, there can't be a clash
  if (!key) return undefined;

  // If the key is already in use, there is a clash
  const clashingIndex =
    site.pageRefs?.findIndex((ref) => ref.key === key) ?? -1;
  return clashingIndex >= 0 ? true : undefined;
});

function setTitle(e: Event) {
  title = (e.target as HTMLInputElement).value;
}

async function onsubmit(e: Event) {
  e.preventDefault();

  const newPage = pageFrom({
    key: key || '',
    siteKey: site.key,
    name: title,
    markdownContent: `# ${title}\n\n`,
    owners: [$uid],
  });

  const slug = await addPage(
    site.key,
    newPage,
    site.usePlainTextURLs ? key : undefined,
  );

  pushSessionSnack(t('site:page.created', { key: `${site.key}/${slug}` }));
  window.location.href = `/sites/${site.key}/${slug}`;
}

function cancel() {
  history.back();
}
</script>

<div class="content-columns">
  <MembersOnly {site}>
    <section>
      <h2>{t('site:create.page.title')}</h2>

      <form {onsubmit}>
        {#if name}
          <p>
            <i>{t('site:create.page.missing', { name: `${name}` })}</i>
          </p>
        {:else}
          <label>
            {t('entries:page.name')}
            <input
              data-error={keyClash}
              oninput={setTitle}
              type="text"
              name="title"
              value={title} />
          </label>
          
          {#if keyClash}
            <p class="error p-1">
              {t('site:create.page.duplicateKey', { key: `${site.key}/${key}` })}
            </p>
            <p class="downscaled">
              <a href={`/sites/${site.key}/${key}`}>{t('site:create.page.duplicateKeyLink')}</a>
            </p>
          {:else}
            <p class="mt-1 break-all">
              <code class="p-1">{`https://pelilauta.social/sites/${site.key}/${site.usePlainTextURLs ? key || '...' : '[auto]'}`}</code>
            </p>
          {/if}
        {/if}
        
        <div class="toolbar justify-end">
          <button type="button" class="text" onclick={cancel}>
            {t('actions:cancel')}
          </button>
          <button type="submit">
            <cn-icon noun="add"></cn-icon>
            <span>{t('actions:create.page')}</span>
          </button>
        </div>
      </form>

    </section>
  </MembersOnly>
</div>