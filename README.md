# Combobox reproduction

## GitHub Pages deployment

The deployment workflow runs on pushes to `main` or manually from the Actions
tab. It installs dependencies with `npm ci`, builds the app with `npm run build`,
and publishes `dist` to the `gh-pages` branch using `GITHUB_TOKEN`.
The build sets Vite's base path to the repository name so assets work on the
GitHub Pages project site.

After the first successful workflow run, open **Settings > Pages**, select
**Deploy from a branch**, and choose **gh-pages** and **/ (root)**.
The site will be available at
https://pyryk.github.io/headlessui-combobox-repro/.
