import { deleteSite } from '@firebase/client/site/deleteSite';
import type { Site } from '@schemas/SiteSchema';
import { pushSessionSnack, pushSnack } from '@utils/client/snackUtils';
import { t } from '@utils/i18n';
import { type Component, createSignal } from 'solid-js';

export const DangerZoneSection: Component<{ site: Site }> = (props) => {
  const [deleteConfirm, setDeleteConfirm] = createSignal('');
  const deleteConfirmPhrase = 'Olen Aivan Varma';

  async function onSubmit(e: Event) {
    e.preventDefault();

    if (deleteConfirm() !== deleteConfirmPhrase) {
      //logDebug('Delete confirm phrase does not match');
      return;
    }
    try {
      await deleteSite(props.site);
      pushSessionSnack('site:snacks.siteDeleted', { name: props.site.name });
      window.location.href = '/library';
    } catch (error) {
      //logDebug('Error deleting site', error);
      pushSnack('site:snacks.errorDeletingSite');
    }
  }

  return (
    <section class="elevation-1 border-radius p-1">
      <h2>{t('app:meta.dangerZone')}</h2>
      <h4>{t('site:dangerZone.title')}</h4>
      <p class="italic">{t('site:dangerZone.description')}</p>
      <form onsubmit={onSubmit}>
        <input
          type="text"
          name="deleteConfirm"
          placeholder={deleteConfirmPhrase}
          onInput={(e: Event) => {
            setDeleteConfirm((e.target as HTMLInputElement).value);
          }}
        />
        <div class="toolbar">
          <div />
          <button
            class="call-to-action notify"
            type="submit"
            disabled={deleteConfirm() !== deleteConfirmPhrase}
          >
            {t('site:dangerZone.deleteSiteAction')}
          </button>
          <div />
        </div>
      </form>
    </section>
  );
};
