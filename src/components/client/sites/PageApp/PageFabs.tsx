import { useStore } from '@nanostores/solid';
import { t } from '@utils/i18n';
import { type Component, createMemo } from 'solid-js';
import { Portal } from 'solid-js/web';
import { $site } from 'src/stores/activeSiteStore';
import { $account } from 'src/stores/sessionStore';

/**
 * Fabs available for the site owners and players
 */
export const PageFabs: Component<{ pageKey: string }> = (props) => {
  const site = useStore($site);
  const account = useStore($account);

  const editor = createMemo(
    () => site()?.owners.includes(account().uid) || false,
  );

  return (
    <>
      {editor() && (
        <Portal mount={document.querySelector('#fab-tray') || document.body}>
          <a
            href={`/sites/${site().key}/create/page`}
            class="fab secondary small"
          >
            <cn-icon noun="add" small />
            <span>{t('actions:create.page')}</span>
          </a>
          <a href={`/sites/${site().key}/${props.pageKey}/edit`} class="fab">
            <cn-icon noun="edit" small />
            <span>{t('actions:edit')}</span>
          </a>
        </Portal>
      )}
    </>
  );
};
