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
  <a href="/profiles/{profile.key}" aria-label="{profile.nick}" 
    style="display: block; text-decoration: none;margin-right: calc(-2 * var(--cn-grid));border:solid 2px var(--color-surface);border-radius:50%;">
  <cn-avatar
    style="padding: 0; margin-bottom: var(--cn-grid)"
    src={profile.avatarURL} 
    nick={profile.nick}
    elevation="1"
    size="small"></cn-avatar>
  </a>
{/await}