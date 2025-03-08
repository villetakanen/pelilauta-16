<script lang="ts">
import { isAdmin } from '@stores/metaStore/metaStore';
import { uid } from '@stores/session';

const visible = $derived.by(() => {
  return isAdmin($uid);
});
</script>
{#if visible}
  <a href="/admin" aria-label="Admin">
    <cn-navigation-icon noun="admin" label="Admin"></cn-navigation-icon>
  </a>
{/if}