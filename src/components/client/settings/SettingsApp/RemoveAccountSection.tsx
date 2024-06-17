import { handleLogout } from '@client/ProfileButton/handleLogout';
import { useStore } from '@nanostores/solid';
import { t } from '@utils/i18n';
import { logWarn } from '@utils/logHelpers';
import { deleteDoc, doc } from 'firebase/firestore';
import { type Component, createSignal } from 'solid-js';
import { db } from 'src/firebase/client';
import { $account } from 'src/stores/sessionStore';

export const RemoveAccountSection: Component = () => {
  const [showVerify, setShowVerify] = createSignal(false);
  const [verify, setVerify] = createSignal('');

  const account = useStore($account);

  async function deRegister(e: Event) {
    e.preventDefault();

    logWarn('Removing user data from the platform, this cannot be undone');
    // if (!veryfy() === 'olen aivan varma') {
    //     return;
    //}
    const key = account().uid;

    await deleteDoc(doc(db, 'profiles', key));
    logWarn('Profile removed from the DB');

    await deleteDoc(doc(db, 'account', key));
    logWarn('Account removed from the DB');

    await handleLogout();

    window.location.href = '/';
  }

  return (
    <section class="elevation-1 p-2 my-1">
      <h4>{t('settings:profile.dangerZone.title')}</h4>
      <p>{t('settings:profile.dangerZone.info')}</p>
      <button type="submit" class="text" onclick={() => setShowVerify(true)}>
        {t('actions:deregister')}
      </button>
      {showVerify() && (
        <form onsubmit={deRegister} class="elevation-2 p-2 mt-1 border-radius">
          <label>
            {t('settings:profile.dangerZone.confirm')}
            <input
              type="text"
              value={verify()}
              onInput={(e) => setVerify(e.currentTarget.value)}
            />
          </label>
          <div class="toolbar flex justify-end">
            <button disabled={verify() !== 'olen aivan varma'} type="submit">
              {t('actions:confirm')}
            </button>
          </div>
        </form>
      )}
    </section>
  );
};
