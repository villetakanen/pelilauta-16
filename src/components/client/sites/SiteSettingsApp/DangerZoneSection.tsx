import { useStore } from '@nanostores/solid';
import { SITES_COLLECTION_NAME } from '@schemas/SiteSchema';
import { t } from '@utils/i18n';
import { logDebug } from '@utils/logHelpers';
import { deleteDoc, doc } from 'firebase/firestore';
import { type Component, createSignal } from 'solid-js';
import { db } from 'src/firebase/client';
import { $site } from 'src/stores/activeSiteStore';

export const DangerZoneSection: Component = () => {
  const site = useStore($site);
  const [deleteConfirm, setDeleteConfirm] = createSignal('');
  const deleteConfirmPhrase = 'Olen Aivan Varma';

  async function onSubmit(e: Event) {
    e.preventDefault();

    if (deleteConfirm() !== deleteConfirmPhrase) {
      logDebug('Delete confirm phrase does not match');
      return;
    }

    logDebug('Deleting site');
    const docRef = doc(db, SITES_COLLECTION_NAME, site().key);

    await deleteDoc(docRef);

    window.location.href = '/';
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
