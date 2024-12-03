<script lang="ts">
import { t } from '@utils/i18n';
import type { Snippet } from 'svelte';

interface Props {
  allow: boolean;
  message?: string;
  children?: Snippet;
}

const { allow, children, message }: Props = $props();
</script>

{#if allow}
<div>
  {@render children?.()}
</div>
{:else}
  <div class="content-columns">
    <article>
      <h1>{t('app:forbidden.title')}</h1>
      <p>{message || t('app:forbidden.message')}</p>
      <div class="toolbar">
        <a href="/login" class="button">
          {t('actions:login')}
        </a>
      </div>
    </article>
  </div>
{/if}

