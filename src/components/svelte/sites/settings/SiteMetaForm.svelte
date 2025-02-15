<script lang="ts">
import type { Site } from '@schemas/SiteSchema';
import { t } from '@utils/i18n';

interface Props {
  site: Site;
}
const { site }: Props = $props();
let name = $state(site.name);
const dirty = $derived.by(() => {
  return name !== site.name;
});
function nameChanged(e: Event) {
  name = (e.target as HTMLInputElement).value;
}
function reset() {
  name = site.name;
}
</script>

<section>
  <form>
    <h2>{t('site:settings.meta.title')}</h2>
    <fieldset>
      <label>{t('entries:site.name')}
        <input
          type="text"
          value={name}
          placeholder={t('entries:site.placeholders.name')}
          required
          name="name"
          minlength="3"
          oninput={nameChanged}
        />
        </label>
    </fieldset>
    <div class="toolbar justify-end">
      <button type="button" onclick={reset} class="text" disabled={!dirty}>{t('actions:reset')}</button>
      <button type="submit" disabled={!dirty}>{t('actions:save')}</button>
    </div>
  </form>
</section>