<script lang="ts">
import { onMount } from "svelte";
import { fetchActiveProfiles, activeProfiles } from "@stores/activeProfilesStore";
  import { uid } from "@stores/sessionStore";

interface Props {
  value: string;
  onchange: (e: Event) => void;
}

const { value, onchange }: Props = $props();

/**
 * A Wrapper for <select> that provides a list of (active) users to select from.
 */
onMount(() => {
  console.log("UserSelect mounted");
  fetchActiveProfiles();
});

const profiles = $derived.by(() => {
  return [...$activeProfiles].sort((a, b) => a.nick.localeCompare(b.nick));
})

</script>

<select
  class="grow"
  {value}
  {onchange}
>
  <option value="-" selected> – </option>
{#each profiles as profile}
  {#if profile.key !== $uid}
    <option value={profile.key}>{profile.nick}</option>
  {/if}
{/each}
</select>