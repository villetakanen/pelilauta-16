<script lang="ts">
import type { Handout } from '@schemas/HandoutSchema';
import type { Site } from '@schemas/SiteSchema';
import { uid } from '@stores/sessionStore';
import WithAuth from '@svelte/app/WithAuth.svelte';
import { t } from '@utils/i18n';

interface Props {
  handout: Handout;
  site: Site;
}

const { site, handout }: Props = $props();

const visible = $derived.by(() => {
  if (site.owners.includes($uid)) return true;
  return false;
});
</script>
<WithAuth allow={visible}>
  <form class="content-editor">
    <label>
        {t('entries:handout.title')}
      <input type="text" value={handout.title} />
    </label>
    <div class="grow">
      <label for="markdown-editor">
        {t('entries:handout.markdownContent')}
        <cn-editor id="markdown-editor"></cn-editor>
      </label>
    </div>
    <div class="toolbar justify-end">
      <a href={`/sites/${site.key}/handouts/${handout.key}`} class="text button">
        {t('actions:cancel')}
      </a>
        <button type="submit" class="button" disabled>
            {t('actions:save')}
        </button>
    </div>
  </form>
</WithAuth>