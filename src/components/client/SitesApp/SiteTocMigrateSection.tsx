// import { useStore } from '@nanostores/solid';
import type { Site } from '@schemas/SiteSchema';
import { recreatePageRefs } from '@stores/SitesApp/recreatePageRefs';
// import { $account } from '@stores/sessionStore';
import { t } from '@utils/i18n';
import { type Component, createMemo } from 'solid-js';

export const SiteTocMigrateButton: Component<{ site: Site }> = (props) => {
  const site = createMemo(() => props.site);
  /*const account = useStore($account);

    const hasAdminAccess = createMemo(() => {
    return site().owners.includes(account().uid);
  });*/

  const showRepairButton = createMemo(() => {
    return true;
    // return hasAdminAccess() && !site().pageRefs?.length;
  });

  async function repairIndex() {
    await recreatePageRefs(site().key);
    window.dispatchEvent(
      new CustomEvent('cn-snackbar-add', {
        detail: { message: t('site:toc.repaired') },
      }),
    );
  }

  return (
    <>
      {showRepairButton() && (
        <section>
          <p>{t('site:toc.missing')}</p>
          <button type="button" class="button" onClick={repairIndex}>
            {t('site:toc.repair')}
          </button>
        </section>
      )}
    </>
  );
};
