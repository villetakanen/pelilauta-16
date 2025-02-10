<script lang="ts">
import type { CyanToggleButton } from '@11thdeg/cyan-next';
import { createSite } from '@schemas/SiteSchema';
import { uid } from '@stores/session';
import WithAuth from '@svelte/app/WithAuth.svelte';
import { pushSessionSnack, pushSnack } from '@utils/client/snackUtils';
import { t } from '@utils/i18n';
import { logError } from '@utils/logHelpers';
import SystemSelect from './SystemSelect.svelte';

/**
 * A form component used for new Site creation.
 */

let key = $state('');
let system = $state('homebrew');
let reservedSiteName = $state(false);
let usePlainTextURLs = $state(true);
let description = $state('');
let options = $state(false);
let hidden = $state(false);

const allow = $derived.by(() => {
  return !!$uid;
});

const valid = $derived.by(() => {
  return key.length > 3 && !reservedSiteName;
});

async function onNameBlur(e: FocusEvent) {
  const { toMekanismiURI } = await import('@utils/mekanismiUtils');
  const input = e.target as HTMLInputElement;
  const name = input.value;
  const proposedKey = toMekanismiURI(name);

  if (!proposedKey || proposedKey.length < 3) {
    key = '';
    reservedSiteName = false;
    return;
  }

  // Lets see if the key is available
  const siteResponse = await fetch(`/api/sites/${proposedKey}`);

  if (siteResponse.ok) {
    key = '';
    reservedSiteName = true;
    return;
  }

  reservedSiteName = false;
  key = proposedKey;
}

async function onsubmit(e: Event) {
  e.preventDefault();

  const site = createSite({
    key,
    system,
    description,
    hidden,
    usePlainTextURLs,
    owners: [$uid],
  });

  const { createSite: createSiteToDB } = await import(
    '@firebase/client/site/createSite'
  );

  try {
    const id = await createSiteToDB(site);
    pushSessionSnack(t('site:snacks.siteCreated'), { siteName: site.name });
    window.location.href = `/sites/${id}`;
  } catch (error) {
    pushSnack(t('site:create.snacks.errorCreatingSite'));
    logError(error);
  }
}

function setSystem(s: string) {
  system = s;
}

function setDescription(e: Event) {
  description = (e.target as HTMLTextAreaElement).value;
}

function setOptions(e: Event) {
  options = (e.target as CyanToggleButton).pressed;
}

function setHidden(e: Event) {
  hidden = (e.target as CyanToggleButton).pressed;
}

function setUsePlainTextURLs(e: Event) {
  usePlainTextURLs = (e.target as CyanToggleButton).pressed;
}
</script>

<WithAuth {allow}>
  <div class="content-columns">
    <section class="column">
      <h1>{t('site:create.title')}</h1>
      <p class="downscaled">
        {t('site:create.description')}
        <a href="/docs/31-create-site">{t('actions:learnMore')}</a>
      </p>
      <form onsubmit={onsubmit}>
        <label>
          {t('entries:site.name')}
          <input
            type="text"
            name="name"
            minlength="3"
            required
            onblur={onNameBlur}
            data-error={reservedSiteName ? t('entries:site.errors.reserved') : undefined}
            placeholder={t('entries:site.placeholders.name')}        
          />
        </label>
        {#if reservedSiteName}
          <p class="error p-1 downscaled">
            {t('site:create.errors.reserved')}
          </p>
        {/if}
        <p class="mt-1 break-all">
          <code class="p-1">{`https://pelilauta.social/sites/${usePlainTextURLs ? key : '[auto]'}`}</code>
        </p>

        <label>
          {t('entries:site.description')}
          <textarea
            name="description"
            rows="3"
            onblur={setDescription}
            placeholder={t('entries:site.placeholders.description')}></textarea>
        </label>

        <SystemSelect {system} {setSystem}/>
        <p class="downscaled mt-0 pt-0">
          {t('site:create.system.description')}
        </p>

        

        <cn-toggle-button
          label={t('actions:show.options')}
          pressed={options}
          onchange={setOptions}
        ></cn-toggle-button>

        {#if options}
        <div class="border border-radius p-1">
          <cn-toggle-button
            label={t('entries:site.hidden')}
            pressed={hidden}
            onChange={setHidden}></cn-toggle-button>
          <p class="downscaled mt-0 pt-0 px-1">
            {t('site:create.hidden.description')}
          </p>

          <cn-toggle-button
            label={t('entries:site.customPageKeys')}
            pressed={usePlainTextURLs}
            onchange={setUsePlainTextURLs}></cn-toggle-button>

          <p class="downscaled mt-0 pt-0 px-1">
            {t('site:create.plaintexturls.description')}
          </p>
        </div>
        {/if}

        <div class="toolbar justify-end">
          <a href="/library" class="button text">
            {t('actions:cancel')}
          </a>
          <button 
            disabled={!valid}
            type="submit" 
            class="call-to-action">
            {t('actions:create.site')}
          </button>
        </div>

      </form>
      <div class="debug">
        <pre>{JSON.stringify({ key, usePlainTextURLs, system, description, hidden }, null, 2)}</pre>
      </div>    
    </section>
  </div>
</WithAuth>