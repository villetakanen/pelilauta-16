import { computed } from 'nanostores';
import { persistentAtom } from '@nanostores/persistent';
import type { Account } from 'src/schemas/AccountSchema';
import type { Profile } from 'src/schemas/ProfileSchema';


export const $uid = persistentAtom<string>('uid', '');

// Account of the current user
export const $account = persistentAtom<Account>(
  'account',
  {
    uid: '',
    eulaAccepted: false,
  },
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  },
);

export const requiresEula = computed($account, account => (!!$uid.get() && !account.eulaAccepted))

// Profile of the current user
export const $profile = persistentAtom<Profile>(
  'profile',
  {
    nick: '',
    avatarURL: '',
    bio: '',
  },
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  },
);
