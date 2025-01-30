<script lang="ts">
import { uid } from '@stores/session';
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
  {@render children?.()}
{:else}
  <div class="content-columns">
    <article>
      <h1>{t('app:forbidden.title')}</h1>
      <div class="flex justify-center">
        <cn-icon noun="monsters" xlarge></cn-icon>
      </div>
      <p>{message || t('app:forbidden.message')}</p>
      {#if !$uid}
      <div class="toolbar justify-center">
        <a href="/login" class="button">
          {t('actions:login')}
        </a>
      </div>
      {/if}
    </article>
  </div>
{/if}

