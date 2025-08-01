<script lang="ts">
import { completeAuthFlow } from '@utils/client/authUtils';
import { pushSessionSnack } from '@utils/client/snackUtils'; // For user feedback
import { t } from '@utils/i18n'; // For potential future translations
// Import utilities
import { logError } from '@utils/logHelpers';
import { FirebaseError } from 'firebase/app';

// No props needed
// interface Props {}
// const {}: Props = $props();

// Component state
let email = $state('');
let password = $state('');
let loading = $state(false);

// No derived state needed

/**
 * Handles login with email and password.
 * Dynamically imports Firebase Auth functions and instance.
 */
async function loginWithPassword(e: SubmitEvent) {
  e.preventDefault();
  if (!email || !password) {
    pushSessionSnack(t('login:error.credentialsRequired'), { type: 'error' }); // Add i18n key
    return;
  }
  loading = true;

  try {
    // Dynamically import Firebase Auth function and instance
    const { signInWithEmailAndPassword } = await import('firebase/auth');
    const { auth } = await import('@firebase/client');

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );

    // Complete the authentication flow (save session + redirect)
    await completeAuthFlow(userCredential.user);

    email = ''; // Clear email after successful login
    password = ''; // Clear password after successful login
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      logError('Password Sign-In Error:', error.code, error.message);
      // Provide user feedback based on common errors
      if (
        error.code === 'auth/invalid-credential' ||
        error.code === 'auth/invalid-email' ||
        error.code === 'auth/wrong-password'
      ) {
        pushSessionSnack(t('login:error.invalidCredentials'), {
          type: 'error',
        }); // Add i18n key
      } else {
        pushSessionSnack(t('common:error.generic'), { type: 'error' });
      }
    } else {
      logError('Password Sign-In Error:', error);
      pushSessionSnack(t('common:error.generic'), { type: 'error' });
    }
    loading = false; // Reset loading state only on error
  }
}
</script>
  
  <section class="elevation-1 border-radius p-2 debug">
    <h2>Test user login form</h2>
    <p>
      This feature is not usable at the production, as the password login
      option is disabled in the production environment. The feature is only
      used by the e2e test suite. If you are seeing this in the production
      build, please contact the developers.
    </p>
    <form onsubmit={loginWithPassword}>
      <div class="form-field">
        <label for="password-email">Email</label>
        <input id="password-email" type="email" name="email" bind:value={email} required />
      </div>
      <div class="form-field">
        <label for="password-password">Password</label>
        <input id="password-password" type="password" name="password" bind:value={password} required />
      </div>
      <div class="toolbar justify-end">
        <button type="submit" disabled={loading}>
          {#if loading}
            <cn-loader></cn-loader>
          {/if}
          <span>Login</span>
        </button>
      </div>
    </form>
  </section>
  