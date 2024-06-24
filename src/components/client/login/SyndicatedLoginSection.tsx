import { t } from '@utils/i18n';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import type { Component } from 'solid-js';
import { auth } from 'src/firebase/client';

export const SyndicatedLoginSection: Component = () => {
  async function loginWithGoogle(e: Event) {
    e.preventDefault();
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    await signInWithPopup(auth, provider);
    window.location.assign('/');
  }

  return (
    <section class="elevation-1 border-radius p-2" style="position: relative">
      <h2>{t('login:withProvider.title')}</h2>
      <p>{t('login:withProvider.info')}</p>
      <form onSubmit={loginWithGoogle}>
        <button type="submit">
          <cn-icon noun="google" />
          <span>{t('login:withGoogle.action')}</span>
        </button>
      </form>
    </section>
  );
};
