import { useStore } from '@nanostores/solid';
import { t } from '@utils/i18n';
import { onAuthStateChanged } from 'firebase/auth';
import { type Component, createSignal, onMount } from 'solid-js';
import { auth } from 'src/firebase/client';
import { $profile } from 'src/stores/sessionStore';
import { updateProfile } from 'src/stores/sessionStore/profile';

export const AuthzSection: Component = () => {
  const [uid, setUid] = createSignal<string | null>(null);
  const [email, setEmail] = createSignal<string | null>(null);
  const [avatarURL, setAvatarURL] = createSignal<string | null>(null);
  const [displayName, setDisplayName] = createSignal<string | null>(null);
  const profile = useStore($profile);

  onMount(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
        setEmail(user.email);
        setAvatarURL(user.photoURL);
        setDisplayName(user.displayName);
      }
    });
  });

  async function updateAvatar() {
    updateProfile({ avatarURL: `${avatarURL()}` });
  }

  return (
    <section>
      <h3>{t('settings:authz.title')}</h3>
      <p class="text-low-emphasis downscaled">{t('settings:authz.info')}</p>

      <div class="field-grid">
        <p>{t('settings:authz.fields.uid')}</p>
        <p>{uid()}</p>

        <p>{t('settings:authz.fields.displayName')}</p>
        <p>{displayName()}</p>

        <p>{t('settings:authz.fields.email')}</p>
        <p>{email()}</p>

        <p>{t('settings:authz.fields.avatarURL')}</p>
        <p>
          {avatarURL()}
          <br />
          <button
            type="button"
            disabled={!avatarURL() || avatarURL() === profile().avatarURL}
            onClick={updateAvatar}
          >
            <cn-icon noun="avatar" />
            <span>{t('settings:authz.updateAvatar')}</span>
          </button>
        </p>
      </div>

      <p class="text-low-emphasis downscaled">
        <a href="/docs/authz">{t('actions:learnMore')}</a>
      </p>
    </section>
  );
};
