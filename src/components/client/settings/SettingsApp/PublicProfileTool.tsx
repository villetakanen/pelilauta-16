import { useStore } from '@nanostores/solid';
import { t } from '@utils/i18n';
import { type Component, createSignal } from 'solid-js';
import { $profile } from 'src/stores/sessionStore';
import { updateProfile } from 'src/stores/sessionStore/profile';
import { AvatarButton } from './AvatarButton';

export const PublicProfileTool: Component = () => {
  const profile = useStore($profile);

  function updateNick(e: Event) {
    e.preventDefault();
    const nick = (e.target as HTMLInputElement).value;
    if (nick.length < 3) {
      console.log('Nickname must be at least 3 characters long');
      return;
    }
    updateProfile({ nick });
  }

  return (
    <>
      <h2>{t('settings:publicprofile.title')}</h2>
      <fieldset>
        <legend>{t('settings:publicprofile.legend')}</legend>
        <div>
          <p class="text-caption">{t('entries:profile.username')}</p>
          <p>{profile().username}</p>
        </div>
        <label>
          {t('entries:profile.nick')}
          <input
            type="text"
            onChange={updateNick}
            value={$profile.get().nick}
          />
        </label>
        <label>
          {t('entries:profile.avatar')}
          <AvatarButton />
        </label>
      </fieldset>
    </>
  );
};
