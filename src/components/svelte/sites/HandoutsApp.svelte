<script lang="ts">
import type { Site } from '@schemas/SiteSchema';
import { t } from '@utils/i18n';
import MembersOnly from './MembersOnly.svelte';
import { site } from './siteStore';

interface Props {
  site: Site;
}
const { site: initialSite }: Props = $props();
$site = initialSite;
</script>

<div class="content-columns">
  <MembersOnly site={$site}>
    <article class="column-l">
      <h2>{t('site:handouts.title')}</h2>
      <p>{t('site:handouts.description')}</p>
      <div class="debug">
        <pre>{JSON.stringify($site, null, 2)}</pre>
      </div>
    </article>
  </MembersOnly>
</div>