<script lang="ts">
import { createAccount } from '@firebase/client/account/createAccount';
import { updateAccount } from '@firebase/client/account/updateAccount';
import { createProfile } from '@firebase/client/profile/createProfile';
import type { Account } from '@schemas/AccountSchema';
import type { Profile } from '@schemas/ProfileSchema';
import { uid } from '@stores/session';
import { requiresEula } from '@stores/session/account';
import { profile } from '@stores/session/profile';
import { pushSnack } from '@utils/client/snackUtils';
import { t } from '@utils/i18n';
import { logDebug, logWarn } from '@utils/logHelpers';
import { toFid } from '@utils/toFid';
import { type Snippet, onMount } from 'svelte';
import NickNameInput from './NickNameInput.svelte';

interface Props {
  children?: Snippet;
}
const { children }: Props = $props();
let dialog: HTMLDialogElement;
let nick = $state('');
let avararUrl = $state('');
const valid = $derived.by(() => {
  if ($profile?.nick) return true;
  return !!nick;
});
const handle = $derived.by(() => {
  if ($profile?.nick) return toFid($profile.nick);
  if (nick) return toFid(nick);
  return '–';
});

logDebug('EulaDialog loaded');

onMount(() => {
  const d = document.getElementById('eula-dialog');
  if (d) dialog = d as HTMLDialogElement;
  logDebug('EulaDialog mounted', dialog);
  getAvatarUrl();
});

$effect(() => {
  $requiresEula && dialog.showModal();
});

async function getAvatarUrl() {
  const { getAuth } = await import('firebase/auth');
  const user = getAuth().currentUser;
  if (!user) return;
  avararUrl = user.photoURL || '';
}

async function handleSubmit(e: Event) {
  e.preventDefault();
  dialog.close();

  // Update Account data to DB
  const account: Partial<Account> = { eulaAccepted: true };
  try {
    await createAccount(account, $uid);
    pushSnack(t('snacks:account.created'));
  } catch (error) {
    await updateAccount(account, $uid);
    pushSnack(t('snacks:eula.accepted'));
  }

  // Assuming either of the above operations succeeded,
  // we can now create a profile for the user, if it does not
  // exist
  if (!$profile?.nick) {
    const profileData: Partial<Profile> = {};
    profileData.nick = nick;
    if (avararUrl) {
      profileData.avatarURL = avararUrl;
    }
    createProfile(profileData, $uid);
    pushSnack(t('snacks:profile.created'));
  } else {
    logWarn('User has a profile, skipping profile creation');
  }

  // Close the dialog
  dialog?.close();
}

function handleCancel(e?: Event) {
  e?.preventDefault();
  dialog.close();
}

function setNick(n: string) {
  nick = n;
}
</script>

<dialog id="eula-dialog" class="eula-dialog">
  <h2>{t('login:eula.title')}</h2>
  <section class="downscaled">
    {@render children?.()}
  </section>
  <form onsubmit={handleSubmit}>
    <section class="elevation-3 border-radius p-2 mt-2">
    {#if $profile?.nick}
      <!-- LEGACY PROFILE UPGRADE -->
      <h3 class="downscaled mt-0">
        {t('login:eula.updateNotice.title')}
      </h3>
      <p class="text-small">
        {t('login:eula.updateNotice.description')}
      </p>
    {:else}
      <div class="flex flex-no-wrap">
        <cn-avatar nick={nick} src={avararUrl}></cn-avatar>
        <fieldset class="grow">
          <NickNameInput
            {nick}
            {setNick}
          />
          <p>
            <strong>{t('entries:profile.username')}: </strong>
            <span>{handle}</span>
          </p>
        </fieldset>
      </div>
      <p class="text-caption">{t('login:eula.profileInfo')}</p>
    {/if}
    </section>
    <div class="flex toolbar justify-end">
      <button type="button" class="text" onclick={handleCancel}>
        {t('login:eula.decline')}
      </button>
      <button
        class="cta"
        disabled={!valid}
        type="submit"
        >
      {t('login:eula.accept')}
    </button>
  </div>
</dialog>