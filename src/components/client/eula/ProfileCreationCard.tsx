import { t } from '@utils/i18n';
import { toFid } from '@utils/toFid';
import type { Component } from 'solid-js';
import { NickNameInput } from './NickNameInput';

interface ProfileCreationCardProps {
  nickname: string;
  avararUrl?: string;
  setNickname: (nickname: string) => void;
  setInvalid?: (invalid: boolean) => void;
}

/**
 * A Solid-js wrapper for the profile creation card, containing field
 * for the nickname, and preview of the profile data to be created based
 * on the SSO data.
 * 
 * border border-radius p-2 mt-2
 */
export const ProfileCreationCard: Component<ProfileCreationCardProps> = (
  props,
) => {
  return (
    <section class="elevation-3 border-radius p-2 mt-2">
      <div class="flex flex-no-wrap">
        <cn-avatar nick={props.nickname} src={props.avararUrl} />
        <fieldset class="grow">
          <NickNameInput
            nickname={props.nickname}
            setNickname={props.setNickname}
            setInvalid={props.setInvalid}
          />
          <p>
            <strong>{t('entries:profile.username')}: </strong>
            <span>{toFid(props.nickname)} </span>
          </p>
        </fieldset>
      </div>
      <p class="text-caption">{t('login:eula.profileInfo')}</p>
    </section>
  );
};
