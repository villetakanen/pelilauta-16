<script lang="ts">
import { t } from '@utils/i18n';
import { logDebug } from '@utils/logHelpers';

interface NickNameInputProps {
  nick: string;
  setNick: (nickname: string) => void;
}
const { nick, setNick }: NickNameInputProps = $props();
let exists = $state(false);

async function onBlur(event: Event) {
  const target = event.target as HTMLInputElement;
  const nick = target.value;

  if (!nick) {
    return;
  }

  // This component is mounted with a auto-generated nickname, which
  // may be taken, so we need to check for duplicates
  const hasDuplicate = await checkForDuplicate(nick);

  logDebug('Checking for duplicate nick', nick, hasDuplicate);

  if (!hasDuplicate) {
    setNick(nick);
  }
}

async function checkForDuplicate(nickname: string) {
  const { getProfileByNick } = await import(
    '@firebase/client/profile/getPofileByNick'
  );

  const profile = await getProfileByNick(nickname);
  const hasDuplicate = !!profile;

  exists = hasDuplicate;
  return hasDuplicate;
}
</script>

<div>
  <label>
    {t('entries:profile.nick')}
    <input
      type="text"
      value={nick}
      onblur={onBlur}
      data-error={exists}
    />
  </label>
  {#if exists} 
    <p class="alert p-0 m-0">{t('login:eula.nickTaken')}</p>
  {/if}
</div>