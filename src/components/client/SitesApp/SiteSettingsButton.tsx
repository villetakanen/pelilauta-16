import { useStore } from '@nanostores/solid';
import { $site } from '@stores/SitesApp';
import { t } from '@utils/i18n';
import { type Component, createMemo } from 'solid-js';
import { $uid } from 'src/stores/sessionStore';

export const SiteSettingsButton: Component = () => {
  const site = useStore($site);
  const uid = useStore($uid);

  const visible = createMemo(() => site().owners.includes(uid()));

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
