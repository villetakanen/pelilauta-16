---
name: "Release notes"
shortname: 'Releases'
noun: 'monsters'
---
## Version 17

## 17.1.x (ongoing)
- FIX: updated Cyan design system to 1.0.9
- FIX: removed 3 deprecated solid-js components
- FIX: creating pages for a site with auto-generated urls works again

## 17.1.0 (5.4.2025)
- FEAT: Asset tag can be copied to clipboard from the asset lists
- FIX: Onboarding card no longer part of sites-stream to avoid unnecessary css-hacks.
- FIX: Thread creators comments can now be loved (in addition to the other responses).
- CHORE: Removed a lot of deprecated solid-js components from the project.

### 17.0.0 (2025-03-24)

- BREAKING: Thread reactions are now stored in the new Reactions data structure.
- FIX: Local notifications cache is cleared when notifications are loaded.
- FIX: Reactions do not send notification to self
- FIX: Can not like own entries
- FIX: Deprecated profile lovedThreads
- FIX: Deprecated reply lovers array
- CHORE: updated cyan design system to 1.0.7 for better support of speech bubbles
- FIX: removed all solid-js components related to discussions
- FIX: removing a reply decrements the reply count of the parent thread
- FIX: removing a reply deletes the corresponding reactions-entry

## Version 16

### 16.16.6 (2025-03-10)
- FIX: Handout editor save opens the handout page as expected.
- FIX: Handout editor oninput event now updates the handout content as expected.
- FIX: Handout list ordered by name.
- FIX: Export tool moved to a separate page, and converted to Svelte.
- FIX: Export tool supports again exporting all pages as a collated `.md` in addition to a `.zip` of the markdonwn -pages.
- FIX: added a new-style store for the subscription data. This will be used on the svelte-based components that need "notifications" on new updates (i.e. can be subscribed to)
- FIX: removed the old solid-js channels index page, as we already had a functional svelte version (but were sometimes linking to the old one)
- FIX: removed deprecated solid-js parts from library/sites page, and replaced them with svelte components where needed
- FIX: admin rail button moved to svelte
- FIX: removed deprecated SiteCard solid-js component from the project
- FIX: moved OnboardingCard to svelte
- FIX: small polish to app locales
- FIX: forum front page SSR
- FIX: moved cardsubsctiption to svelte

See: https://github.com/villetakanen/pelilauta-16/blob/v16.6.6/src/docs/80-release-notes.md for older releases.

