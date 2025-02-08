<script lang="ts">
import type { Site } from '@schemas/SiteSchema';
import { site } from '@stores/site';
import { t } from '@utils/i18n';
import MembersOnly from '../MembersOnly.svelte';
import HandoutList from './HandoutList.svelte';

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

      <HandoutList />

    </article>
  </MembersOnly>
</div>