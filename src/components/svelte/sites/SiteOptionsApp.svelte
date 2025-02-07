<script lang="ts">
import { CyanToggleButton } from '@11thdeg/cyan-next';
import type { Site } from '@schemas/SiteSchema';
import { t } from '@utils/i18n';
import { site, update } from '../../../stores/site';

interface Props {
  site: Site;
}
const { site: initialSite }: Props = $props();
$site = initialSite;

async function setOption(
  option: 'useClocks' | 'useHandouts' | 'useRecentChanges' | 'useSidebar',
  value: boolean,
) {
  update({ [option]: value });
}
</script>

<div class="content-columns">
  <article>
    <h2>{t('site:options.title')}</h2>

    <p class="downscaled">{t('site:options.description')}</p>

    <cn-toggle-button 
      label={t('site:options.useClocks')}
      pressed={$site.useClocks || undefined}
      onchange={(e: Event) => setOption('useClocks', (e.target as CyanToggleButton).pressed)}
    ></cn-toggle-button>

    <cn-toggle-button 
      label={t('site:options.useHandouts')}
      pressed={$site.useHandouts || undefined}
      onchange={(e: Event) => setOption('useHandouts', (e.target as CyanToggleButton).pressed)}
    ></cn-toggle-button>

    <cn-toggle-button 
      label={t('site:options.useRecentChanges')}
      pressed={$site.useRecentChanges || undefined}
      onchange={(e: Event) => setOption('useRecentChanges', (e.target as CyanToggleButton).pressed)}
    ></cn-toggle-button>

    <cn-toggle-button 
      label={t('site:options.useSidebar')}
      pressed={$site.useSidebar || undefined}
      onchange={(e: Event) => setOption('useSidebar', (e.target as CyanToggleButton).pressed)}
    ></cn-toggle-button>

  </article>
</div>