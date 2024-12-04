<script lang="ts">
import { fetchProfileEntry } from '@stores/profilesStore';

interface Props {
  uid: string;
}
const { uid }: Props = $props();
</script>
{#await fetchProfileEntry(uid)}
    <cn-loader inline></cn-loader>
{:then profile}
  <a href="/profile/{profile.key}">{profile.nick}</a>
{:catch error}
  <p>{error.message}</p>
{/await}