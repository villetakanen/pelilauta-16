<script lang="ts">
import type { Site } from '@schemas/SiteSchema';
import { t } from '@utils/i18n';
import { site } from './siteStore';

interface Props {
  site: Site;
}
const { site: initialSite }: Props = $props();
$site = initialSite;
</script>

<div class="content-columns">
  <article class="border-radius p-2 surface">
    <h1>{t('app:forbidden.title')}</h1>
    <div class="flex justify-center">
      <cn-icon noun="monsters" xlarge></cn-icon>
    </div>
    <p>{t('app:forbidden.membersOnly')}</p>
  </article>
</div>