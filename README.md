# camerongoodman.github.io

Personal site of Cam Goodman at [www.camgoodman.com](https://www.camgoodman.com/): one page, styled as a split-flap departures board, with my name, a Vancouver clock and my contact links.

Built with [Hugo](https://gohugo.io/) (no theme, no npm packages) and deployed to GitHub Pages via GitHub Actions.

## Prerequisites

- [Node.js](https://nodejs.org/) 24 (only to run the npm scripts)
- [Hugo Extended](https://gohugo.io/installation/) v0.168.0+

## Local development

```bash
npm run dev   # or: hugo server -D
```

## Build for production

```bash
npm run build   # or: hugo --gc --minify
```

## Where things live

- `hugo.toml`: site title, description, address, analytics ID and the contact links.
- `layouts/`: page templates. `home.html` and `404.html` both render `_partials/board.html`; `_partials/flaps.html` builds the flap cells and `_partials/icon.html` holds the contact icons.
- `assets/css/main.css`: all styles. Board sizes scale with the board's width, and narrower screens drop the address, then status, columns.
- `assets/js/board.js`: the flip animation, the hover "boarding" effect and the clock (Vancouver time, fixed at UTC−7 / PCT; the offset is set here).
- `static/`: favicons, the self-hosted Archivo font, and `og.png`, the 1200×630 link-preview image (a screenshot of the home page; retake it if the design changes).

## Editing the board

Contact rows come from `[[params.contacts]]` in `hugo.toml`. Each row's label must fit 8 cells and its address 25 cells; on phones only the label shows. The name rows (`CAM` / `GOODMAN`) are set in `layouts/home.html` and fit 7 cells each.

## Adding a blog later

Remove `"section"` and `"rss"` from `disableKinds` in `hugo.toml`, add `layouts/list.html` and `layouts/single.html`, then `hugo new content posts/my-post.md`.

## Deploy

Push to `main`; `.github/workflows/main.yml` builds and deploys. The custom domain is set in the repository's Pages settings.
