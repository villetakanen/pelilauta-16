import { useStore } from '@nanostores/solid';
import { $owners } from '@stores/SitesApp';
import { updatePage } from '@stores/SitesApp/pagesStore';
import { $uid } from '@stores/session';
import { t } from '@utils/i18n';
import { type Component, createMemo } from 'solid-js';
import TurndownService from 'turndown';

export const MigrateContentPanel: Component<{
  siteKey: string;
  pageKey: string;
  htmlContent: string;
}> = (props) => {
  const owners = useStore($owners);
  const uid = useStore($uid);

  const show = createMemo(() => owners().includes(uid()));

  function migrateContents() {
    const turndownService = new TurndownService();
    const markdownContent = turndownService.turndown(props.htmlContent);
    updatePage(
      props.siteKey,
      props.pageKey,
      { markdownContent },
      { silent: true },
    );
  }

  return (
    <>
      {show() && (
        <section class="elevation-2 alert toolbar">
          <p>{t('site:page.migrateContentInfo')}</p>
          <button
            type="button"
            class="button text"
            style="flex-shrink:0"
            onClick={migrateContents}
          >
            {t('site:page.migrateContent')}
          </button>
        </section>
      )}
      <div innerHTML={props.htmlContent} />
    </>
  );
};
