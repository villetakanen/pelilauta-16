/**
 * A solid-js app for viewing wiki/game pages
 */

import { useStore } from '@nanostores/solid';
import { createPage } from '@schemas/PageSchema';
import { t } from '@utils/i18n';
import { type Component, createMemo, onMount } from 'solid-js';
import { Portal } from 'solid-js/web';
import { $site, load } from 'src/stores/activeSiteStore';
import { $pages } from 'src/stores/activeSiteStore/pagesStore';
import { $account } from 'src/stores/sessionStore';

export const PageApp: Component<{ pageKey: string; siteKey?: string }> = (
  props,
) => {
  const site = useStore($site);
  const pages = useStore($pages);
  const account = useStore($account);

  const page = createMemo(
    () => pages().find((p) => p.key === props.pageKey) || createPage('', ''),
  );
  const editor = createMemo(
    () => site()?.owners.includes(account().uid) || false,
  );

  onMount(() => {
    load(props.siteKey || '');
  });

  return (
    <>
      <div>
        <h1>{page().name}</h1>
      </div>
      {editor() && (
        <Portal mount={document.querySelector('#fab-tray') || document.body}>
          <a
            href={`/sites/${props.siteKey}/create/page`}
            class="fab secondary small"
          >
            <cn-icon noun="add" small />
            <span>{t('actions:create.page')}</span>
          </a>
          <a
            href={`/sites/${props.siteKey}/${props.pageKey}/edit`}
            class="fab"
          >
            <cn-icon noun="edit" small />
            <span>{t('actions:edit')}</span>
          </a>
        </Portal>
      )}
    </>
  );
};
