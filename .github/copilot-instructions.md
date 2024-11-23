# Copilot instructions

We are creating a role playing games community site with Astro, Lit and Solid-js. The application
will be deployed to Vercel using Github integration.

## SSR with Astro

We want to render all stateless components, and components that share the state with the server. These
components will be progressively enhanced with Solid-js on the client side.

Where a microfrontend or a sub-app is completely stateful, and requires an authenticated user, we will
do those parts fully client-side with Solid-js.

## Solid-js

Client side interacitvity is done with Solid-js. The Solid Apps use nano stores for shared state management,
if a shared state is needed. Mostly, we want to do as little state as possible, as we are enhancing the
app, not replacing it.

## Lit

The Lit components, for now, are installed via NPM, and are not modified directly here.

## Google Firebase

The backend is Google Firebase, and we are using the Auth, Firestore and Storage services. Firestore and
storage methods should always be imported dynamically on the client side, for code splitting.

## Biome

Biome is used for linting and formatting. We are using the default settings.