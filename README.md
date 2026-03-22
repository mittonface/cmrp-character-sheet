# CMRP Character Sheet

A web-based character sheet creator for roleplaying games, built with SvelteKit.

## Prerequisites

- [Bun](https://bun.sh/) (runtime & package manager)

## Setup

```sh
bun install
```

## Developing

Start a development server:

```sh
bun run dev

# or start the server and open the app in a new browser tab
bun run dev -- --open
```

## Testing

Unit tests (Vitest):

```sh
bun run test
bun run test:watch
```

E2E tests (Playwright — builds & previews the app automatically):

```sh
bun run test:e2e
```

To install/update Playwright browsers:

```sh
bunx playwright install
```

To run in headed mode or debug:

```sh
bunx playwright test --headed
bunx playwright test --ui
```

## Building

To create a production version of your app:

```sh
bun run build
```

You can preview the production build with `bun run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
