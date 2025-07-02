<script lang="ts">
import type { Snippet } from 'svelte';

interface Props {
  loading: boolean;
  children?: Snippet;
}

const { loading, children }: Props = $props();
</script>

{#if loading}
  <div class="content-columns">
    <div class="flex justify-center p-4">
      <cn-loader></cn-loader>
    </div>
  </div>
{:else}
  {@render children?.()}
{/if}
