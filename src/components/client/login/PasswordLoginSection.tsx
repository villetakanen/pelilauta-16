import { logDebug, logError } from '@utils/logHelpers';
import { FirebaseError } from 'firebase/app';
import { signInWithEmailAndPassword } from 'firebase/auth';
import type { Component } from 'solid-js';
import { auth } from 'src/firebase/client';

/**
 * A section for firebase password login.
 *
 * This feature is only used by the e2e test suite - and should be disabled
 * in the production build.
 */
export const PasswordLoginSection: Component = () => {
  async function loginWithPassword(e: Event) {
    e.preventDefault();

    const { email, password } = e.target as HTMLFormElement;

    try {
      logDebug(
        'Attempting to login with email and password',
        email.value,
        password.value,
      );
      await signInWithEmailAndPassword(auth, email.value, password.value);
      window.location.href = '/';
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        logError(error.code, error.message);
      }
    }
  }

  return (
    <section class="elevation-1 border-radius p-2 debug">
      <h2>Test user login form</h2>
      <p>
        This feature is not usable at the production, as the password login
        option is disabled in the production environmennt. The feature is only
        used by the e2e test suite. If you are seeing this in the production
        build, please contact the developers.
      </p>
      <form onsubmit={loginWithPassword}>
        <label>
          <span>Email</span>
          <input type="email" name="email" />
        </label>
        <label>
          <span>Password</span>
          <input type="password" name="password" />
        </label>
        <button type="submit" name="Login">
          Login
        </button>
      </form>
    </section>
  );
};
