import { useStore } from '@nanostores/solid';
import { t } from '@utils/i18n';
import type { Component } from 'solid-js';
import { $profile } from 'src/stores/sessionStore';

export const PublicProfileTool: Component = () => {
  const profile = useStore($profile);
  // const account = useStore($account);

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
          <input type="text" onChange={(e) => console.log(e.target.value)} />
        </label>
      </fieldset>
    </>
  );
};
