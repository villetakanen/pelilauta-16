import { useStore } from '@nanostores/solid';
import { t } from '@utils/i18n';
import { type Component, createMemo } from 'solid-js';
import { $site } from '@stores/SitesApp';
import { $account } from 'src/stores/sessionStore';

export const SiteSettingsButton: Component = () => {
  const site = useStore($site);
  const account = useStore($account);

  const visible = createMemo(() => site().owners.includes(account().uid));

  return (
    <>
      {visible() && (
        <a href={`/sites/${site().key}/settings`} class="button">
          <cn-icon noun="tools" small />
          <span>{t('site:settings.title')}</span>
        </a>
      )}
    </>
  );
};
