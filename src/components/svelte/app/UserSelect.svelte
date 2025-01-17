<script lang="ts">
import {
  activeProfiles,
  fetchActiveProfiles,
} from '@stores/activeProfilesStore';
import { uid } from '@stores/sessionStore';
import { t } from '@utils/i18n';
import { onMount } from 'svelte';

interface Props {
  value: string;
  label?: string;
  onchange: (e: Event) => void;
}

const { value, onchange, label }: Props = $props();

/**
 * A Wrapper for <select> that provides a list of (active) users to select from.
 */
onMount(() => {
  console.log('UserSelect mounted');
  fetchActiveProfiles();
});

const profiles = $derived.by(() => {
  return [...$activeProfiles].sort((a, b) => a.nick.localeCompare(b.nick));
});
</script>
<label>
  {label ?? t('actions:select.user')}
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
</label>