# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn serve    # Start dev server with hot reload
yarn build    # Production build
yarn lint     # ESLint + Prettier
```

`serve` and `build` use `NODE_OPTIONS=--openssl-legacy-provider` to work around the OpenSSL incompatibility between Node 17+ and the webpack 4 version bundled with `@vue/cli-service ~4.5`.

No test suite is configured.

## Architecture

**Cryptic** is a Vue 2 SPA for cryptocurrency market data, pulling from the CoinCap.io v3 API (`https://api.coincap.io/v3`). There is no backend — all data fetching is done client-side.

### Stack
- Vue 2.6 + Vue Router 3 (history mode)
- Chart.js 2.9 via Vue-Chartkick (area charts for price history)
- TailwindCSS 1.1
- Vue CLI (build tooling)

### Data Flow
No Vuex. State is component-local. Views fetch data on mount via `src/services/api.js` (native `fetch`), store results in `data()`, and pass to child components via props.

### Key Files
- `src/services/api.js` — all API calls (`getAssets`, `getAsset`, `getAssetHistory`, `getMarkets`, `getExchange`). Returns `false` on error.
- `src/filters.js` — global Vue filters registered in `main.js`: `dollar`, `percent`, `rank`, `fixed4`
- `src/router.js` — four routes: `/` (Home), `/coin/:id` (CoinDetail), `/about`, and catch-all Error
- `src/assets/js/cryptoAssetColors.js` — symbol→color map used for chart coloring

### Views
- **Home.vue** — sortable/filterable table of top 100 assets; sorting logic and loading state managed here
- **CoinDetail.vue** — single coin detail: price info, 24h line chart, currency converter, best exchange rates; all fetched in parallel on mount
- **PxAssetsTable.vue** — presentational table component; emits sort events upward; has local search filter