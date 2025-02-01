# Copilot instructions

We are creating a role playing games community site with Astro, Lit and Svelte. The application
will be deployed to Vercel using a Github integration.

## SSR with Astro

We want to render all stateless components, and components that share the state with the server. These
components will be progressively enhanced with Svelte or Solid-js on the client side.

Where a microfrontend or a sub-app is completely stateful, and requires an authenticated user, we will
do those parts fully client-side with Svelte or Solid-js.

## Solid-js

Client side interacitvity was originally with Solid-js. The Solid Apps use nano stores for shared state management,
if a shared state is needed. Mostly, we want to do as little state as possible, as we are enhancing the
app, not replacing it.

## Svelte 

Most of the client side interactivity is now done with Svelte. We use the same nano store pattern for shared
state management as the previous Solid-js components. Switch over to svelte is done for lit-element and performance
reasons.

Svelte uses runes mode, typescript and we want to model the componets as
```
<script lang="ts">

interface Props {
  [propName: string]: [type],
  ...   // other props
}
const { propName, ... }: Props = $props;
...
</script>

<style>
...if any
</style>

[html ...]
```

## TyopeScript

We use shorhands for library paths. E.g. `import SectionComponent from '@svelte/app/SectionComponent.svelte'`

## Lit

The Lit components, for now, are installed via NPM or Git Submodules. 

## Google Firebase

The backend is Google Firebase, and we are using the Auth, Firestore and Storage services. Firestore and
storage methods should always be imported dynamically on the client side, for code splitting.

## Biome

Biome is used for linting and formatting. We are using the default settings, with 2 spaces as intentation.