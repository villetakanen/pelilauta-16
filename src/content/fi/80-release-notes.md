---
name: "Release notes"
shortname: 'Releases'
noun: 'monsters'
---
## Version 16

### 16.4.x (ongoing)
- Cross-linked personal and public sites.
- Cyan updates for light mode, headings
- Entroll fixes for a non-returning user
- Mass-import supports overwriting existing pages
- Fixed 404 wikipage functionality (opens create a new page view for owners and editors of a site)
- Created a new `page` view uses correct button type for canceling the page creation
- Page editor no longer "forgets" the page category when loading the form
- Light mode contrast and usability overrides polish
- Syndicated blog post header links correctly to the original post

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
