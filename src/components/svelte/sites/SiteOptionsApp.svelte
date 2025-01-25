<script lang="ts">
import { CyanToggleButton } from '@11thdeg/cyan-next';
import type { Site } from '@schemas/SiteSchema';
import { t } from '@utils/i18n';
import { site, update } from './siteStore';

interface Props {
  site: Site;
}
const { site: initialSite }: Props = $props();
$site = initialSite;

async function setOption(option: 'useClocks', value: boolean) {
  update({ [option]: value });
}
</script>

<div class="content-columns">
  <article>
    <h4>{t('site:options.title')}</h4>

    <cn-toggle-button 
      label={t('site:options.useClocks')}
      pressed={$site.useClocks || undefined}
      onchange={(e: Event) => setOption('useClocks', (e.target as CyanToggleButton).pressed)}
    ></cn-toggle-button>

    <p>useClocks : { $site.useClocks }</p>

    <p>usePlayers : { $site.usePlayers }</p>
  </article>
</div>