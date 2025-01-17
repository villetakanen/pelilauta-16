---
name: "Release notes"
shortname: 'Releases'
noun: 'monsters'
---
## Version 16

### 16.9.x (ongoing)
- FIX: links with protocol are no longer treated as wikilinks.
- FIX: Library shows public sites link in the tray

### 16.9.0 (2024-01-13)
- Restored admin functionality for freezing users.
- Active users widget added to the front page.
- <strike>Docs disabled temporarily</strike>

### 16.8.0 (2024-01-07)
- Legacy thread and reply content is now rendered in thread view.
- Footnotes are now used GFM style, and are rendered in the page view.
- ProfileApp moved to SSR Astro component, reduntant profile info styling removed.
- ProfileApp shows the user's latest sites
- ProfileApp shows the user's latest posts

### 16.7.0 (2024-01-03)
- CnEditor uses native events and bubbling for better performance.
- Page editor no longer crashes when saving a page with tags.
- Thread editor moved to Svelte.
- Thread editor supports tags and live-highlights them in the content.
- Tag listing page supports both wiki and thread tags.
- CnLightbox addon is used for images in Thread editor and viewer.
- \[BUG]: Thread editor does not load or save changes to an existing threads. This is intentional, as the old functionality was not working - so disabling edits let us release the new editor, without loss of (working as intented) functionality.

### 16.6.0
- Moved the Page-editor over to Svelte.
- Page-editor category selector is now hidden, if the site does not use categories.
- Page-editor supports the tags functionality, and live-higlights the tags in the page content.
- Page-editor updates the Site.pageRef on save as expected.
- Page-editor auto-migrates pre-markdown content on page load.
- Page view tags now link to tag listing pages.
- Astro 5 upgrade.
- Users site listing orders by flow-time by default.
- Users site listing can be ordered by flow-time, and name.
- Tag support for wiki pages.
- Tag listing pages for wiki pages.

### 16.5.0
- Cross-linked personal and public sites.
- Cyan updates for light mode, headings, cards, icons and notifications.
- Entroll fixes for a non-returning user
- Mass-import supports overwriting existing pages
- Fixed 404 wikipage functionality (opens create a new page view for owners and editors of a site)
- Created a new `page` view uses correct button type for canceling the page creation
- Page editor no longer "forgets" the page category when loading the form
- Light mode contrast and usability overrides polish
- Syndicated blog post header links correctly to the original post
- Added latest-changes section for the site sidebar

### 16.4.0
- Added support for svelte based components in the layout.
- Fixed latest login and enrollment page functionality.
- Added admin page for managing users (not available in the public version).
- Added feature for mass-imports of markdown files to a site.

### 16.3.0
- Moved overrides back to the Cyan design system.
- Added poster slot on the layout with a side tray.
- Copy paste to editor fixed in page editor.
- Copy paste to editor fixed in thread editor.
- Restored onboarding card for new users.
- Client side `marked` is now imported dynamically to reduce bundle size.
- Site and Site Page social share and searchability improvements.
- Import one or more pages from markdown files to a site [Read more](/docs/fi/11-imports)
- Personal site-library cached to local storage for faster loading.

### 16.2.0
- Cyan design system updates for mobile use.
- Various small bug fixes and improvements.
- Refactored enrollment and login pages and stores for faster loading.
- Added support for "posters", e.g. bacground images for pages, sites and all of the static pages.
- Merged site branding assets with the site assets, all assets and branding assets are now managed in the same views.

### 16.1.0
- Added RSS feeds for all posts and channels. [Read more](/docs/fi/01-index)
- Mekanismi `dice:X[:Y]` notation support in Sites. [Read more](/docs/fi/10-wikisyntax)
- Editor for Site Asset properties. [Read more](/docs/fi/73-asset-management)
- Library page redirects to the public sites, if a user has not logged in.
