<script lang="ts">
import { uid } from '@stores/session';
import { t } from '@utils/i18n';
</script>
{#if $uid}
<a class="fab" href="/create/character">
  <cn-icon noun="add" small ></cn-icon>
    <span class="sm-hidden">{t('actions:create.character')}</span>
  </a>
{/if}