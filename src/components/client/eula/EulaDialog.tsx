import type { CnDialog } from '@11thdeg/cyan-next';
import { handleLogout } from '@client/ProfileButton/handleLogout';
import { makePersisted } from '@solid-primitives/storage';
import { t } from '@utils/i18n';
import { logDebug } from '@utils/logHelpers';
import { update } from 'firebase/database';
import {
  addDoc,
  collection,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
import {
  type Component,
  type JSX,
  children,
  createSignal,
  onMount,
} from 'solid-js';
import { createStore } from 'solid-js/store';
import { auth, db } from 'src/firebase/client';
import { type Account, parseAccount } from 'src/schemas/AccountSchema';

type DialogProps<P = Record<string, unknown>> = P & { children?: JSX.Element };

/**
 * This is a solid-js component, that displays a cn-dialog, when there is a logged in user,
 * that has not accepted the EULA yet.
 */
export const EulaDialog: Component = (props: DialogProps) => {
  const [account, setAccount] = makePersisted(createStore({} as Account), {
    name: 'account',
  });
  const [uid, setUid] = makePersisted(createSignal(''), {
    name: 'uid',
  });
  const [nickname, setNickname] = createSignal('');
  const [avatarSrc, setAvatarSrc] = createSignal('');

  onMount(() => {
    // Listen to auth changes
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Get the displayname, and change whitespace to underscore
        const nickname = user.displayName?.replace(/\s/g, '_');
        const defaultNick = nickname || user.email?.split('@')[0] || '-';

        // Load the account data
        setNickname(defaultNick);

        // Load the avatar
        const avatar = user.photoURL || '';
        setAvatarSrc(avatar);
      }
    });
  });

  async function oncancel() {
    console.log('User declined the EULA, logging out');
    // When the user cancels the dialog, sign out
    handleLogout();
    (document.getElementById('eulaDialog') as CnDialog).close();
  }

  async function onaccept() {
    logDebug(
      'User accepted the EULA, storing to db, and refreshing local state',
    );
    // When the user accepts the EULA, store the acceptance to the db
    const docRef = await addDoc(collection(db, 'account'), {
      ...account,
      lastLogin: serverTimestamp(),
      updatedAt: serverTimestamp(),
      eulaAccepted: true,
      nick: nickname(),
      lightMode: window.matchMedia('(prefers-color-scheme: light)').matches
        ? 'light'
        : 'dark',
      language: 'fi',
    });
    const newAccount = await getDoc(docRef);
    if (newAccount.exists()) {
      const account = parseAccount(newAccount.data(), newAccount.id);
      setAccount(account);
      logDebug('User data stored to db', account, 'and stored to local state');
      (document.getElementById('eulaDialog') as CnDialog).close();
    } else {
      throw new Error('Failed to store user data to db');
    }
  }

  return (
    <>
      <cn-dialog
        id="eulaDialog"
        title={t('login:eula.title')}
        open={!account?.eulaAccepted && !!uid()}
      >
        {props.children}
        <section class="elevation-1 border-radius p-1 flex flex-row">
          <cn-avatar nick={nickname()} src={avatarSrc()} />
          <div>
            <p class="mt-0">
              <strong>{t('entries:profile.nick')}:</strong> {nickname()}
            </p>
            <p class="text-caption">{t('login:eula.profileInfo')}</p>
          </div>
        </section>
        <div class="flex toolbar justify-end">
          <button type="button" onclick={oncancel}>
            {t('login:eula.decline')}
          </button>
          <button class="call-to-action" type="submit" onclick={onaccept}>
            {t('login:eula.accept')}
          </button>
        </div>
      </cn-dialog>
    </>
  );
};
