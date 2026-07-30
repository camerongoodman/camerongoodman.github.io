# camgoodman.com
My personal site — DevOps, CI/CD, automation, AI, and development.

Built with [Hugo](https://gohugo.io/) and the [PaperMod](https://github.com/adityatelange/hugo-PaperMod) theme. Deployed to GitHub Pages via GitHub Actions.

## Prerequisites

- [Node.js](https://nodejs.org/) 24
- [Hugo Extended](https://gohugo.io/installation/) v0.164.0+

## Local development

```bash
# clone (the theme is a git submodule)
git clone --recurse-submodules https://github.com/camerongoodman/camerongoodman.github.io.git

# start the dev server
npm run dev   # or: hugo server -D
```

## Build for production

```bash
npm run build   # or: hugo --gc --minify
```

## Add a post

```bash
hugo new content posts/my-post.md
```

## Update the theme

```bash
git submodule update --remote themes/PaperMod
```

## Deploy

Push to `main` — the workflow in `.github/workflows/main.yml` builds and deploys automatically.
