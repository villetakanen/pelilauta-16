import type { Component } from "solid-js";
import { auth } from "src/firebase/client";

export const ProfileSection: Component = (props) => {
  async function handleLogout() {
    await auth.signOut();
    // Logout user
    window.location.href = '/';
  }

    return (
        <section>
        <h3>Profile</h3>
        <button type="submit" onclick={handleLogout}>Logout</button>
        </section>
    );
}