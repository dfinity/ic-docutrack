# Docutrack dapp frontend

Frontend project of the DocuTrack dapp, made with [SvelteKit](https://kit.svelte.dev/) and [TailwindCSS](https://tailwindcss.com/).

## Pre-requisites

- node
- pnpm

Install packages:

```
pnpm install
```

## Development

The build process assumes the ID's of the canisters are available, so make sure you deploy the canisters first to the local replica:

```
dfx deploy
```

This will deploy all canisters, including the backend and Internet Identity canister.

Then from the project root, you can run:

```
pnpm --filter frontend run dev
```

Since the backend canister is deployed, the frontend can access it as if it was also deployed to a network.
