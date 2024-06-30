import { useStore } from '@nanostores/solid';
import { type Component, createMemo } from 'solid-js';
import { $site } from 'src/stores/activeSiteStore';
import { $account } from 'src/stores/sessionStore';

export const SiteSettingsButton: Component = () => {
  const site = useStore($site);
  const account = useStore($account);

  const visible = createMemo(() => site().owners.includes(account().uid));

  return (
    <>
      {visible() && (
        <a href={`/sites/${site().key}/settings`} class="button">
          Settings
        </a>
      )}
    </>
  );
};
