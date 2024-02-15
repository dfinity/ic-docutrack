# Landing page project

Home page for the DocuTrack dapp. It uses a more general tech stack with [astro](https://astro.build/) which is better suited for marketing-type pages.

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

Then from the project root, you can run:

```
pnpm --filter landing-page run dev
```
