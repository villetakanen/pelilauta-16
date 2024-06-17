import { t } from '@utils/i18n';
import { logDebug, logError } from '@utils/logHelpers';
import {
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailLink,
} from 'firebase/auth';
import type { Component } from 'solid-js';
import { createSignal, onMount } from 'solid-js';
import { auth } from 'src/firebase/client';

export const EmailLoginSection: Component = () => {
  const [email, setEmail] = createSignal('');
  const [suspend, setSuspend] = createSignal(false);
  const [sent, setSent] = createSignal(false);
  const actionCodeSettings = {
    url: window.location.href,
    handleCodeInApp: true,
  };

  const verifyLink = async () => {
    try {
      const email = window.localStorage.getItem('emailForSignIn');
      const loginRedirectRoute =
        window.localStorage.getItem('loginRedirectRoute');
      if (!email) {
        logError('No email found in local storage - aborting verification.');
        return;
      }

      const userCredential = await signInWithEmailLink(
        auth,
        email,
        window.location.href,
      );

      // If we later want to initiate server side session, it should be done here
      logDebug('User signed in with email link:', userCredential);

      // Clear email from storage.
      window.localStorage.removeItem('emailForSignIn');

      // Handle success (e.g., redirect to the dashboard)
      window.location.href = loginRedirectRoute || '/';
    } catch (error) {
      logError(error);
    }
  };

  const sendLink = async (e: Event) => {
    e.preventDefault();
    setSuspend(true);
    try {
      logDebug('Sending sign-in link to email:', email());
      logDebug('Action code settings:', actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email());
      await sendSignInLinkToEmail(auth, email(), actionCodeSettings);
      // Inform the user to check their email
      setSent(true);
    } catch (error) {
      // Handle errors (e.g., invalid email)
      logError(error);
    }
    setSuspend(false);
  };

  onMount(() => {
    // Check if the user is coming from a login with email link
    if (isSignInWithEmailLink(auth, window.location.href)) {
      verifyLink(); // Your verification logic
    }
  });

  return (
    <section class="elevation-1 border-radius p-2" style="position: relative">
      <h2>{t('login:withEmail.title')}</h2>
      <p>{t('login:withEmail.info')}</p>
      {!sent() && (
        <form onSubmit={sendLink}>
          <input
            type="email"
            placeholder={t('login:withEmail.placeholder')}
            value={email()}
            onInput={(e) => setEmail(e.target.value)}
          />
          <button type="submit" disabled={suspend()}>
            {t('actions:submit')}
          </button>
        </form>
      )}
      {sent() && <p>{t('login:withEmail.sent')}</p>}
    </section>
  );
};
