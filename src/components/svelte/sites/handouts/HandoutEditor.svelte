<script lang="ts">
import type { Handout } from '@schemas/HandoutSchema';
import type { Site } from '@schemas/SiteSchema';
import { uid } from '@stores/session';
import { update } from '@stores/site/handouts';
import WithAuth from '@svelte/app/WithAuth.svelte';
import { t } from '@utils/i18n';
import type { CnEditor } from 'cn-editor/src/cn-editor';

interface Props {
  handout: Handout;
  site: Site;
}

const { site, handout }: Props = $props();
let title = $state(handout.title);
let markdownContent = $state(handout.markdownContent);
const changed = $derived.by(() => {
  return handout.title !== title || handout.markdownContent !== markdownContent;
});

const visible = $derived.by(() => {
  if (site.owners.includes($uid)) return true;
  return false;
});

function titleChanged(e: Event) {
  title = (e.target as HTMLInputElement).value;
}
function markdownContentChanged(e: Event) {
  markdownContent = (e.target as CnEditor).value;
}

async function handleSubmit(e: Event) {
  e.preventDefault();
  if (!changed) return;

  await update({
    ...handout,
    title,
    markdownContent,
  });

  window.location.href = `/sites/${site.key}/handouts/${handout.key}`;
}
</script>

<WithAuth allow={visible}>
  <form class="content-editor" onsubmit={handleSubmit}>

    <div class="toolbar">
      <label class="grow">
        {t('entries:handout.title')}
        <input type="text" value={handout.title}  oninput={titleChanged}/>
      </label>
    </div>
    
    <cn-editor
      value={handout.markdownContent}
      oninput={markdownContentChanged}
    ></cn-editor>

    <div class="toolbar justify-end">
      <a href={`/sites/${site.key}/handouts/${handout.key}`} class="text button">
        {t('actions:cancel')}
      </a>
      <button type="submit" class="button" disabled={!changed}>
        {t('actions:save')}
      </button>
    </div>

  </form>
</WithAuth>