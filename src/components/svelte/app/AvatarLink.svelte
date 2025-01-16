<script lang="ts">
import { fetchProfileEntry } from '@stores/profilesStore';

interface Props {
  uid: string;
}
const { uid }: Props = $props();
</script>
    {#await fetchProfileEntry(uid)}
        <cn-loader icon></cn-loader>
    {:then profile}
      <a href="/profiles/{profile.key}" aria-label="{profile.nick}">
        <cn-avatar
          style="margin-right: calc(-1 * var(--cn-gap)); padding: 0; margin-bottom: var(--cn-grid)"
          class="elevation-4"
          src={profile.avatarURL} 
          nick={profile.nick}
          size="small"></cn-avatar>
      </a>
    {/await}