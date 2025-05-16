---
name: "Release notes"
shortname: 'Releases'
noun: 'monsters'
---
## Version 17

### 17.6.x (ongoing)
- FIX: Editor component is only loaded when needed as it's a heavy component
- FIX: Page API route error handling improved to avoid Vercel function timeout crashes.
- FIX: Patched editor view cn-editor max-height in overrides
- FIX: Page history dates are now correctly coerced to dates
- FIX: Page saving state microtransactions added to the page editor
- FIX: Forum Fabs are now on svelte
- FIX: Delete thread confirmation moved to svelte
- FIX: Thread fork moved to svelte
- FIX: Multiple small tread creation and cross-posting fixes
- Chore: added longer stale-while-revalidate cache to active user list
- Chore: pulled cn-editor to 2.0.0 from the submodule, added requirements to the package.json

### 17.6.0 (2025-05-09)
- FEAT: Reply dialog now lets you add images to the reply
- CHORE: removed some deprecated solid-js components from the project

## 17.5.1 (2025-05-08)
- FIX: moved the login page to astro and svelte
- FIX: moved the session authentication info section (in settings) to svelte
- FIX: disabled server island for front page sitelist, as it was causing issues with the server-side rendering at Vercel side
- FIX: deprecated thread editor solid-js component, and added thread update branch to the svelte alternative (making the the svelte version able tho handle both thread creation and thread updates)
- FIX: Export as .md tool works if the pages have only markdown content (ie. no rendered html for some reason)


## 17.5.0 (2025-05-01)
- FEAT: Added an onboarding article to the Channels and Channel -pages.
- FIX: Firestore subscribing stores init uses clent/db init correctly (instead of direct getFirestore call , which might not work due to race conditions)
- FIX: Admin tools visibility uses Nanostores derived store for better DX and performance
- FIX: Reply dialog widht regression issue fixed with component level css
- FIX: Challen page looks forum-like
- FIX: Channel page thread shows unread status like the front-page
- FIX: Updated Cyan design system to 1.0.14
- FIX: Faster front-page-load-times
- FIX: Channels/Forums -page layout more forum-like, loads faster
- FIX: Card notify effect no longer runs on anonymous sessions
- FIX: Moved static thread reply count from solid-js to SSR Astro
- CHORE: Removed some deprecated solid-js components no longer in use

## 17.4.0 (2025-04-29)
- FEAT: Channel info shown in channel page
- FIX: Channel items use server island for better performance (note: the page component still loads channel info, which could likely be moved to another server island)
- FIX: Channel page info polish
- FIX: Channel page supports poster images
- FIX: Channels -page fabs now on svelte
- FIX: Added moderator only button to reshare a thread on the social media feeds.
- FIX: Reactions entry is created as expected to new threads.
- CHORE: Added Sentry for error tracking.
- CHORE: Updated Cyan design system to 1.0.13 with enhanced tray ux.

## 17.3.0 (2025-04-23)
- FEAT: Bluesky integration added to the SSR. This requires setting bsky credentials in the env file.
- FEAT: App admins can post as "pelilauta.social" on bluesky through the app admin tools.
- FEAT: New threads are automatically shared via the app's bluesky account.

## 17.2.0 (2025-04-23)
- FEAT: Site text content license selection added to the site settings
- FEAT: Site text content license info added to page footer
- FEAT: Site text content license metadata added to schemas
- FIX: removed 3 deprecated solid-js components
- FIX: creating pages for a site with auto-generated urls works again
- FIX: site toc regeneration moved over to svelte
- FIX: page delete confirmation moved over to svelte
- FIX: removed extra logging
- FIX: moved table of contents and page sorting tools to svelte
- FIX: Asset upload asset upload fab moved to svelte
- FIX: Asset metadata editor moved to svelte
- FIX: Asset metadata editor license selection works as expected
- FIX: Asset metadata visible to all users, editor only for the site owners
- FIX: Moved syndicated login to svelte
- FIX: WithAuth component sections have surface
- FIX: Thread stream (frontpage) read-more link points to the channels page as expected
- CHORE: updated Cyan design system to version 1.0.12
- CHORE: L&L Wiki added to the list of links in the footer

## 17.1.0 (2025-04-05)
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

