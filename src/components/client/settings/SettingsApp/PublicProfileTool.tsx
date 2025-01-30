import { useStore } from '@nanostores/solid';
import { $profile } from '@stores/session';
import { t } from '@utils/i18n';
import type { Component } from 'solid-js';

import { updateProfile } from '@firebase/client/profile/updateProfile';
import { AvatarButton } from './AvatarButton';

export const PublicProfileTool: Component = () => {
  const profile = useStore($profile);

  return (
    <>
      <h2>{t('settings:publicprofile.title')}</h2>
      <fieldset>
        <legend>{t('settings:publicprofile.legend')}</legend>
        <div>
          <p class="text-caption">{t('entries:profile.username')}</p>
          <p>{profile()?.username}</p>
        </div>
        <label>
          {t('entries:profile.nick')}
          <input type="text" disabled />
        </label>
        <label for="avatarButton">
          {t('entries:profile.avatar')}
          <AvatarButton />
        </label>
        <label>
          {t('entries:profile.bio')}
          <textarea
            value={profile()?.bio}
            onBlur={(e) =>
              updateProfile(
                { bio: (e.target as HTMLTextAreaElement).value },
                `${profile()?.key}`,
              )
            }
          />
        </label>
      </fieldset>
    </>
  );
};
