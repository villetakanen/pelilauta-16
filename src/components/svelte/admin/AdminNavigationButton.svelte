<script lang="ts">
import { showAdminTools } from '@stores/session';
</script>

{#if $showAdminTools}
  <a href="/admin" aria-label="Admin">
    <cn-navigation-icon noun="admin" label="Admin"></cn-navigation-icon>
  </a>
{/if}