import type { CnDialog } from '@11thdeg/cyan-next';
import { useStore } from '@nanostores/solid';
import { t } from '@utils/i18n';
import { logDebug, logWarn } from '@utils/logHelpers';
import { toFid } from '@utils/toFid';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { type Component, type JSX, createSignal, onMount } from 'solid-js';
import { auth, db } from 'src/firebase/client';
import { generateUsername } from 'src/firebase/client/generateUsername';
import { parseAccount } from 'src/schemas/AccountSchema';
import { parseProfile } from 'src/schemas/ProfileSchema';
import { $account, $profile, $requiresEula, $uid, logout } from 'src/stores/sessionStore';

type DialogProps<P = Record<string, unknown>> = P & { children?: JSX.Element };

/**
 * This is a solid-js component, that displays a cn-dialog, when there is a logged in user,
 * that has not accepted the EULA yet.
 */
export const EulaDialog: Component = (props: DialogProps) => {
  const [nickname, setNickname] = createSignal('');
  const [username, setUsername] = createSignal('' as string);
  const [avatarSrc, setAvatarSrc] = createSignal('');
  const oldProfile = useStore($profile);
  const userKey = useStore($uid);
  const openDialog = useStore($requiresEula);

  onMount(() => {
    // Listen to auth changes
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Get an unique default nickname for the user
        const nickname = await generateUsername(
          user.displayName || '',
          user.email || '',
        );

        // Load the account data
        setNickname(nickname);
        setUsername(nickname);

        // Load the avatar
        const avatar = user.photoURL || '';
        setAvatarSrc(avatar);

        if (oldProfile().nick) {
          logWarn('User already has a profile, restoring nickname');
          setNickname(oldProfile().nick);
        }
      }
    });
  });

  async function oncancel() {
    console.log('User declined the EULA, logging out');
    // When the user cancels the dialog, sign out
    await logout();
    (document.getElementById('eulaDialog') as CnDialog).close();
  }

  async function onaccept() {
    const key = userKey();
    logDebug(
      'User',
      key,
      'accepted the EULA, storing to db, and refreshing local state',
    );
    // When the user accepts the EULA, store the acceptance to the db
    const accountRef = doc(db, 'account', key);
    await setDoc(accountRef, {
      ...$account.get(),
      uid: key,
      lastLogin: serverTimestamp(),
      updatedAt: serverTimestamp(),
      eulaAccepted: true,
      nick: nickname(),
      lightMode: window.matchMedia('(prefers-color-scheme: light)').matches
        ? 'light'
        : 'dark',
      language: 'fi',
    });
    const newAccount = await getDoc(accountRef);
    if (newAccount.exists()) {
      const account = parseAccount(newAccount.data(), newAccount.id);
      $account.set(account);
      logDebug('User data stored to db', account, 'and stored to local state');

      // Create a new profile to DB
      const profile = {
        ...$profile.get(),
        nick: nickname(),
        avatarURL: avatarSrc(),
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      };

      const profileRef = doc(db, 'profiles', key);
      await setDoc(profileRef, profile);

      const newProfile = await getDoc(profileRef);
      if (newProfile.exists()) {
        $profile.set(parseProfile(newProfile.data(), newProfile.id));
        logDebug(
          'Profile data stored to db',
          profile,
          'and stored to local state',
        );
      } else {
        throw new Error('Failed to store profile data to db');
      }

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
        open={openDialog()}
      >
        {props.children}
        <section class="elevation-1 border-radius p-1 flex flex-row">
          <cn-avatar nick={nickname()} src={avatarSrc()} />
          <div>
            <div class="field-grid">
              <strong>{t('entries:profile.nick')}:</strong>
              <span>{nickname()}</span>

              <strong>{t('entries:profile.username')}:</strong>
              <span>{toFid(username())} </span>
            </div>
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
