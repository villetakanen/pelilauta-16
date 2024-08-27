import { useStore } from '@nanostores/solid';
import { $site, updateSite } from '@stores/SitesApp';
import { $profiles, fetchAllProfiles } from '@stores/profilesStore';
import { logWarn } from '@utils/logHelpers';
import {
  type Component,
  For,
  createMemo,
  createSignal,
  onMount,
} from 'solid-js';

export const AddSiteMemberForm: Component = () => {
  const site = useStore($site);
  const profiles = useStore($profiles);
  const [selected, setSelected] = createSignal<string | null>(null);

  onMount(() => {
    logWarn('Fetching all eglible profiles');
    // fetch all eligible profiles
    fetchAllProfiles();
  });

  const nonMembers = createMemo(() => {
    return Object.keys(profiles()).filter(
      (key) => !site().owners.includes(key),
    );
  });

  function handleSubmit(e: Event) {
    // submit the form
    e.preventDefault();
    const s = selected();
    if (s) {
      // add the selected member to the site
      console.log('adding', selected());
      const owners = [...site().owners];
      owners.push(s);
      updateSite({ owners });
    }
  }

  return (
    <form onSubmit={handleSubmit} class="toolbar">
      <select
        class="grow"
        onchange={(e) => setSelected((e.target as HTMLSelectElement).value)}
      >
        <option value="">Select a member</option>
        <For each={nonMembers()}>
          {(key) => <option value={key}>{profiles()[key].nick}</option>}
        </For>
      </select>
      <button type="submit">
        <cn-icon noun="add" />
      </button>
    </form>
  );
};
