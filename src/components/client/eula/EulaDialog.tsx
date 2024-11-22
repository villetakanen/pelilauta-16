import type { CnDialog } from '@11thdeg/cyan-next';
import { createAccount } from '@firebase/client/account/createAccount';
import { updateAccount } from '@firebase/client/account/updateAccount';
import { createProfile } from '@firebase/client/profile/createProfile';
import { useStore } from '@nanostores/solid';
import type { Account } from '@schemas/AccountSchema';
import { pushSnack } from '@utils/client/snackUtils';
import { t } from '@utils/i18n';
import { logWarn } from '@utils/logHelpers';
import { toFid } from '@utils/toFid';
import { type Component, type JSX, createEffect, createSignal } from 'solid-js';
import { auth } from 'src/firebase/client';
import { generateUsername } from 'src/firebase/client/generateUsername';
import type { Profile } from 'src/schemas/ProfileSchema';
import { $profile, $requiresEula, $uid, logout } from 'src/stores/sessionStore';
import { ProfileCreationCard } from './ProfileCreationCard';

type DialogProps<P = Record<string, unknown>> = P & { children?: JSX.Element };

/**
 * This is a solid-js component, that displays a dialog, when there is a
 * logged in user, that has not accepted the EULA yet.
 * 
 * Depending on the users profile status, it will either allow accepting
 * the EULA for an existing profile, or additionally create a new profile
 * for the user.
 */
export const EulaDialog: Component = (props: DialogProps) => {
  const [nickname, setNickname] = createSignal('');
  let dialog: HTMLDialogElement | undefined;

  const uid = useStore($uid);
  const openDialog = useStore($requiresEula);
  const legacyProdile = useStore($profile);

  // If the app wants to open this dialog, it needs to set the
  // $requiresEula store value to true
  createEffect(() => {
    if (openDialog()) {
      // Initialize the state, only if the eula is required
      initValues();
      dialog?.showModal();
    }
  });

  async function initValues() {
    if (legacyProdile().nick) {
      // The user has already accepted an earlier EULA, no need reset the nick.
      return;
    }
    const user = auth.currentUser;

    // Get an unique default nickname for the user
    const nickname = await generateUsername(
      user?.displayName || '',
      user?.email || '',
    );

    // Load the account data
    setNickname(nickname);
  }

  async function oncancel() {
    console.log('User declined the EULA, logging out');
    // When the user cancels the dialog, sign out
    await logout();
    (document.getElementById('eulaDialog') as CnDialog).close();
  }

  async function onaccept() {
    // Update Account data to DB
    const account: Partial<Account> = { eulaAccepted: true };
    try {
      await createAccount(account, uid());
      pushSnack(t('snacks:account.created'));
    } catch (error) {
      await updateAccount(account, uid());
      pushSnack(t('snacks:eula.accepted'));
    }

    // Assuming either of the above operations succeeded,
    // we can now create a profile for the user, if it does not
    // exist
    if (!legacyProdile().nick) {
      const profileData: Partial<Profile> = {};
      profileData.nick = nickname();
      if (auth.currentUser?.photoURL) {
        profileData.avatarURL = auth.currentUser.photoURL;
      }
      createProfile(profileData, uid());
      pushSnack(t('snacks:profile.created'));
    } else {
      logWarn('User has a profile, skipping profile creation');
    }

    // Close the dialog
    dialog?.close();
  }

  function avatarSrc() {
    return auth.currentUser?.photoURL || '';
  }

  function username() {
    return toFid(nickname());
  }

  return (
    <dialog ref={dialog}>
      <h2>{t('login:eula.title')}</h2>
      <section class="downscaled">
        {props.children}
      </section>
      {legacyProdile()?.nick ? null : (
        <ProfileCreationCard nickname={nickname()} setNickname={setNickname} />
      )}
      <div class="flex toolbar justify-end">
        <button type="button" class="text" onclick={oncancel}>
          {t('login:eula.decline')}
        </button>
        <button class="cta" type="submit" onclick={onaccept}>
          {t('login:eula.accept')}
        </button>
      </div>
    </dialog>
  );
};
