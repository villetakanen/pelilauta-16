<script lang="ts">
// Import utilities and i18n function
import { completeAuthFlow } from '@utils/client/authUtils';
import { pushSessionSnack } from '@utils/client/snackUtils';
import { t } from '@utils/i18n';

interface Props {
  redirect?: string;
}
const { redirect = '/' }: Props = $props();

// State for loading indicator
let loading = $state(false);

/**
 * Handles login with Google provider.
 * Dynamically imports Firebase Auth modules and instance.
 */
async function loginWithGoogle(e: SubmitEvent) {
  e.preventDefault();
  loading = true;

  try {
    // Dynamically import Firebase Auth functions and instance
    const { GoogleAuthProvider, signInWithPopup } = await import(
      'firebase/auth'
    );
    const { auth } = await import('@firebase/client');

    const provider = new GoogleAuthProvider();
    provider.addScope('email'); // Request email scope

    // 1. Capture the result of the sign-in
    const userCredential = await signInWithPopup(auth, provider);

    // 2. Complete the authentication flow (save session + redirect)
    await completeAuthFlow(userCredential.user, redirect);
  } catch (error: unknown) {
    console.error('Google Sign-In Error:', error);
    // Provide user feedback on error using snack utility
    pushSessionSnack(t('login:error.provider', { provider: 'Google' }), {
      type: 'error',
    });
    loading = false; // Reset loading state on error
  }
}
</script>
  
  <section class="elevation-1 border-radius p-2" style="position: relative">
    <h2>{t('login:withProvider.title')}</h2>
    <p>{t('login:withProvider.info')}</p>
    <form onsubmit={loginWithGoogle}>
      <button type="submit" disabled={loading}>
        {#if loading}
          <cn-loader noun="google"></cn-loader> 
        {:else}
          <cn-icon noun="google"></cn-icon> 
        {/if}
        <span>{t('login:withGoogle.action')}</span>
      </button>
    </form>
  </section>
  
  <style>
    button {
      /* Ensure button content aligns nicely with the loader/icon */
      display: inline-flex;
      align-items: center;
      gap: 0.5em; /* Adjust gap as needed */
    }
  </style>