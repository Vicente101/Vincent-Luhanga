# Vincent Luhanga Portfolio

React-only portfolio built with Vite.

## Scripts

- `npm run dev` starts the local development server.
- `npm run build` creates a production build in `dist`.
- `npm run preview` serves the production build locally.

## GitHub Pages

This repo is configured for GitHub Pages at:

`https://vicente101.github.io/Vincent-Luhanga/`

Push to `main` and the workflow in `.github/workflows/deploy.yml` will build and deploy the React app from `dist`.

In repository settings, set **Pages > Build and deployment > Source** to **GitHub Actions**. Do not deploy from the branch root, because the root `index.html` is the Vite development entry and references `/src/main.jsx`.

## Netlify

The site can also be hosted on Netlify. `netlify.toml` builds it from the domain root (`VITE_BASE_PATH=/`) and sends every route to `index.html`, so no extra settings are needed when importing the repository. Pushes to `main` redeploy automatically.

## CV

The downloadable CV (`public/Vincent-Luhanga-CV.pdf`) is generated from `cv/Vincent-Luhanga-CV.html`. After editing the HTML, regenerate the PDF with Microsoft Edge:

```sh
msedge --headless=new --no-pdf-header-footer --print-to-pdf=public/Vincent-Luhanga-CV.pdf cv/Vincent-Luhanga-CV.html
```
