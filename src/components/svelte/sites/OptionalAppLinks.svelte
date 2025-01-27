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
<nav class="border-top">
  <ul>
  {#if $site.useClocks}
    <li>
      <a href={`/sites/${$site.key}/clocks`} class="tray-button">
        <cn-icon noun="clock" xsmall></cn-icon>
        <span>{t('site:clocks.title')}</span>
      </a>
    </li>
  {/if}
  {#if $site.useHandouts}
    <li>
      <a href={`/sites/${$site.key}/handouts`} class="tray-button">
        <cn-icon noun="books" xsmall></cn-icon>
        <span>{t('site:handouts.title')}</span>
      </a>
    </li>
  {/if}
  </ul>
</nav>
          