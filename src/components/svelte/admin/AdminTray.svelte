<script lang="ts">
import { uid } from '@stores/sessionStore'
import { appMeta } from '@stores/metaStore/metaStore'
  import WithAuth from '@svelte/app/WithAuth.svelte';

$: visible = $appMeta.admins.includes($uid)
</script>
<WithAuth allow="{visible}">
  <h2>Tools</h2>
  <ul>
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
  </ul>
</WithAuth>

