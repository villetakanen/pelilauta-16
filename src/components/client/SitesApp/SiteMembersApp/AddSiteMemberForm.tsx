import { useStore } from '@nanostores/solid';
import type { Site } from '@schemas/SiteSchema';
import { updateSite } from '@stores/SitesApp';
import { $profiles, fetchAllProfiles } from '@stores/profilesStore';
import { t } from '@utils/i18n';
import { logWarn } from '@utils/logHelpers';
import {
  type Component,
  For,
  createMemo,
  createSignal,
  onMount,
} from 'solid-js';

export const AddSiteMemberForm: Component<{ site: Site }> = (props) => {
  const profiles = useStore($profiles);
  const [selected, setSelected] = createSignal<string | null>(null);

  onMount(() => {
    logWarn('Fetching all eglible profiles');
    // fetch all eligible profiles
    fetchAllProfiles();
  });

  const nonMembers = createMemo(() => {
    return Object.keys(profiles()).filter(
      (key) => !props.site.owners.includes(key),
    );
  });

  function handleSubmit(e: Event) {
    // submit the form
    e.preventDefault();
    const s = selected();
    if (s) {
      // add the selected member to the site
      console.log('adding', selected());
      const owners = [...props.site.owners];
      owners.push(s);
      updateSite({ owners }, props.site.key);
    }
  }

  return (
    <form onSubmit={handleSubmit} class="toolbar">
      <select
        class="grow"
        onchange={(e) => setSelected((e.target as HTMLSelectElement).value)}
      >
        <option value="">{t('actions:choose')}</option>
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
