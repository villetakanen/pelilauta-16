import { t } from '@utils/i18n';
import { type Component, createSignal, onMount } from 'solid-js';

interface NickNameInputProps {
  nickname: string;
  setNickname: (nickname: string) => void;
  setInvalid?: (invalid: boolean) => void;
  disabled?: boolean;
}

/**
 * A Solid js wrapper for the nickname input field.
 *
 * On blue checksif the nickname is already taken and displays an error
 * message if it is.
 */
export const NickNameInput: Component<NickNameInputProps> = (props) => {
  const [exists, setExists] = createSignal(false);

  onMount(() => {
    // This component is mounted with a auto-generated nickname, which
    // may be taken, so we need to check for duplicates
    checkForDuplicate(props.nickname);
  });

  async function checkForDuplicate(nickname: string) {
    const { getProfileByNick } = await import(
      '@firebase/client/profile/getPofileByNick'
    );

    const profile = await getProfileByNick(nickname);
    const hasDuplicate = !!profile;

    setExists(hasDuplicate);
    props.setInvalid?.(hasDuplicate);
    return hasDuplicate;
  }

  async function onBlur(event: Event) {
    const target = event.target as HTMLInputElement;
    const nickname = target.value;

    if (!nickname) {
      return;
    }

    const doSet = await checkForDuplicate(nickname);
    if (!doSet) {
      props.setInvalid?.(false);
      props.setNickname(nickname);
    }
  }

  return (
    <div>
      <label>
        {t('entries:profile.nick')}
        <input
          type="text"
          value={props.nickname}
          onBlur={onBlur}
          data-error={exists}
        />
      </label>
      {exists() && <p class="alert p-0 m-0">{t('login:eula.nickTaken')}</p>}
    </div>
  );
};
