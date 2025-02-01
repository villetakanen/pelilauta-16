<script lang="ts">
import { appMeta } from '@stores/metaStore/metaStore';
import { uid } from '@stores/session';
import WithAuth from '@svelte/app/WithAuth.svelte';

type Props = {
  showLocalTools: boolean;
};
const { showLocalTools }: Props = $props();
const visible = $derived.by(() => $appMeta.admins.includes($uid));
</script>

<WithAuth allow={visible}>
  <h2>Tools</h2>
  <ul>
    {#if showLocalTools}  
      <li>
        <a href="/admin/users">
          <cn-icon noun="adventurer" small></cn-icon> Users
        </a>
      </li>
      <li>
        <a href="/admin">
          <cn-icon noun="discussion" small></cn-icon> Channels
        </a>
      </li>
    {/if}
    <li>
      <a href="/admin/sites">
        <cn-icon noun="mekanismi" small></cn-icon> Site activity
      </a>
    </li>
  </ul>
</WithAuth>

