import { t } from '@utils/i18n';
import { toFid } from '@utils/toFid';
import type { Component } from 'solid-js';
import { NickNameInput } from './NickNameInput';

interface ProfileCreationCardProps {
  nickname: string;
  avararUrl?: string;
  setNickname: (nickname: string) => void;
}

/**
 * A Solid-js wrapper for the profile creation card, containing field
 * for the nickname, and preview of the profile data to be created based
 * on the SSO data.
 */
export const ProfileCreationCard: Component<ProfileCreationCardProps> = (
  props,
) => {
  return (
    <section class="border border-radius p-1 flex flex-row mt-2">
      <cn-avatar nick={props.nickname} src={props.avararUrl} />
      <div>
        <fieldset>
          <legend>{t('entries:profile.meta.title')}</legend>
          <NickNameInput
            nickname={props.nickname}
            setNickname={props.setNickname}
          />
          <p>
            <strong>{t('entries:profile.username')}:</strong>
            <span>{toFid(props.nickname)} </span>
          </p>
        </fieldset>
        <p class="text-caption">{t('login:eula.profileInfo')}</p>
      </div>
    </section>
  );
};
