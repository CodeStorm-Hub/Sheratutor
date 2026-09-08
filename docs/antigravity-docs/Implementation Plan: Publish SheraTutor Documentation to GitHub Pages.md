# Implementation Plan: Publish SheraTutor Documentation to GitHub Pages

Deploy the complete `docs/` directory (113 files, 85 markdown specifications, 5 interactive web apps, 14 brand assets) as a documentation website hosted on GitHub Pages under `https://codestorm-hub.github.io/Sheratutor/`.

## User Review Required

> [!IMPORTANT]
> **Zero Changes to Application Code**: Only documentation publishing files will be added. No code in `web/` or `ingestion/` will be modified.
> 
> **Repository Settings Action Required**: After pushing the workflow, GitHub Pages must be configured under:
> `https://github.com/CodeStorm-Hub/Sheratutor/settings/pages`  
> Set **Build and deployment > Source** to **GitHub Actions**.

## Proposed Changes

### Documentation Site Configuration & Assets

#### [NEW] [`mkdocs.yml`](file:///home/syed/workspace/Sheratutor/mkdocs.yml)
- Configure site title, repository link, and brand icons (`docs/assets/icon-badge.svg`).
- Set theme to `material` with dark/light mode toggle palettes (`slate` and `default`).
- Configure features: navigation tabs, sticky tabs, navigation sections, search indexing, and copy-code buttons.
- Register markdown extensions: `pymdownx.superfences` (native Mermaid rendering), `pymdownx.arithmatex` (MathJax equation rendering), `tables`, `admonitions`, `details`, and `md_in_html`.
- Structure the comprehensive 6-tier navigation bar mapping all 113 documents cleanly.

#### [NEW] [`docs/index.md`](file:///home/syed/workspace/Sheratutor/docs/index.md)
- Portal homepage welcoming visitors, featuring the SheraTutor tagline *"SheraTutor, for Shera Students"*, key metrics, and direct links to all documentation sections.

#### [NEW] [`docs/stylesheets/sheratutor.css`](file:///home/syed/workspace/Sheratutor/docs/stylesheets/sheratutor.css)
- Implement SheraTutor's brand design system tokens from `docs/research-idea/03-design-system.md`:
  - Primary dark background: `#14182B` (Ink Navy)
  - Card surfaces: `#1E2761` (Card Navy)
  - Primary accent: `#FF6B57` (Coral)
  - Secondary / dark accent: `#23D9A5` (Mint)
  - Typography imports: `Baloo 2` for headlines, `Inter` for body, `Space Mono` for code tags.

---

### CI/CD Deployment Automation

#### [NEW] [`.github/workflows/deploy-docs.yml`](file:///home/syed/workspace/Sheratutor/.github/workflows/deploy-docs.yml)
- Automated GitHub Actions workflow triggered on push to `main` or `azure-foundry` branches affecting `docs/**`, `mkdocs.yml`, or the workflow itself.
- Python 3.12 runner environment with pip caching.
- Builds static HTML site via `mkdocs build`.
- Deploys static bundle directly to GitHub Pages using official GitHub Actions (`actions/upload-pages-artifact@v3` and `actions/deploy-pages@v4`).

---

## Verification Plan

### Automated Local Verification
1. Run local test build in virtual environment:
   ```bash
   /tmp/docs_venv/bin/mkdocs build -f /home/syed/workspace/Sheratutor/mkdocs.yml -d /tmp/site_test
   ```
2. Verify:
   - Exit code `0` (clean build without fatal errors).
   - Generated `index.html`, CSS assets, and search index `search_index.json`.
   - Native Mermaid diagram output and MathJax script tags.
   - All 5 interactive HTML explorers copied to output (`sheratutor_interactive_explorer.html`, `genkit_interactive_explorer.html`, etc.).
   - Brand asset SVGs/PNGs accessible.
3. Remove temporary build directory `/tmp/site_test`.

### Manual / Post-Deployment Verification
1. User verifies GitHub Actions run under `https://github.com/CodeStorm-Hub/Sheratutor/actions`.
2. Inspect published website live at `https://codestorm-hub.github.io/Sheratutor/`.
