# S&S Sports & Supplements

A responsive, multi-brand supplement storefront for S&S in Banaswadi, Bengaluru. Includes a React hero carousel, GSAP scroll animation, optional Three.js product detail decoration, five goal collections, product pages, customer reviews and a local enquiry bag.

## Run locally

Requires Node.js 22 or later.

```sh
npm ci
npm run build
npm run dev -- --host 0.0.0.0
```

## Deploy

Run `npm run build`, then publish the `dist` directory to a static host. All routes have their own `index.html`; configure directory index serving. The included `.openai/hosting.json` connects the original Sites publication and is not needed for other hosts.

## Editing

- `dist/index.html`: home page and shared header/footer source. Preserve the goal-section markers; the build fills these automatically.
- `dist/style.css`, `dist/motion.css`, `dist/premium.css`, `dist/refinements.css`: stylesheet layers.
- `dist/app.js`: filters, shared navigation and enquiry bag.
- `src/products.json`, `src/goals.json`: catalog and goal collection data.
- `src/hero.jsx`, `src/reviews.jsx`, `src/effects.jsx`: React components.
- `src/scroll-motion.js`, `src/orbit.js`: scroll and WebGL effects.
- `src/pages.mjs`, `build.mjs`: page generation and bundling.
- `dist/assets`: local product photography; source URLs in `asset-sources.json`.

The complete deployable website is included in `dist`. Keep that directory: it also contains authored source assets. Run `npm run build` after source edits to regenerate pages and bundles.

## Verification

```sh
npm test
```

The JSDOM regression suite checks routes, filters, category collections, navigation, hero/review controls, product tabs and enquiry bag behavior. It does not replace visual checks on real devices.

## Store and content notes

Catalog entries are illustrative. Prices, stock, sizes and flavours must be confirmed with S&S. The bag is stored on the visitor's device and opens a WhatsApp enquiry; it does not process payments. The two review quotes and the Google rating are client-supplied content, not a live Google feed. Motion respects reduced-motion preferences; decorative WebGL is optional and disabled on small screens. Product images remain upright.

Product photography and trademarks belong to their respective owners. Source attribution does not confer a reuse licence; the store should confirm its publication rights. Site credit: [AIavro.com](https://AIavro.com).
