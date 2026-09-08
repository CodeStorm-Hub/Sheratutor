# Walkthrough: SheraTutor Documentation Website & GitHub Pages Deployment

We have successfully configured and verified the documentation website for the complete `docs/` directory of **SheraTutor** using **Material for MkDocs**, incorporating the SheraTutor brand design system, native Mermaid diagrams, MathJax equations, and a multi-branch GitHub Actions deployment pipeline (`main` and `docs`).

---

## 1. What Was Created & Configured

### 1. Site Configuration — [`mkdocs.yml`](file:///home/syed/workspace/Sheratutor/mkdocs.yml)
- **Metadata**: Configured `site_name: SheraTutor Documentation`, `site_url: https://codestorm-hub.github.io/Sheratutor/`, and links to the GitHub repository.
- **Brand Theming**: Configured Material theme with dual palette modes (`slate` dark / `default` light) matching system preferences with an instant toggle.
- **Extensions**:
  - `pymdownx.superfences`: Natively renders all 9 architecture Mermaid flowcharts without external dependencies.
  - `pymdownx.arithmatex`: MathJax 3 support for all 25 documents with LaTeX math equations.
  - `admonitions` & `pymdownx.details`: Collapsible note, tip, warning, and caution callouts.
  - `search`: Built-in local offline search index with term highlighting and sharing.
- **Information Architecture**: Complete 6-tier navigation bar mapping all 113 files across all 8 folders (`Overview & Vision`, `Specifications & Audits`, `Ingestion & RAG Pipelines`, `Genkit & System Architecture`, `Interactive Visual Explorers`, and `Azure Foundry Reference (63 Docs)`).

### 2. Portal Homepage — [`docs/index.md`](file:///home/syed/workspace/Sheratutor/docs/index.md)
- Custom landing page featuring the SheraTutor tagline (*"SheraTutor, for Shera Students"*), platform metrics, an interactive grid card directory, and a high-level system architecture flowchart.

### 3. Custom Branded 404 Page — [`docs/404.md`](file:///home/syed/workspace/Sheratutor/docs/404.md)
- Custom error page ensuring visitors hitting dead or outdated links can navigate back to the home portal, SRS, or use the search index.

### 4. Brand Design Tokens — [`docs/stylesheets/sheratutor.css`](file:///home/syed/workspace/Sheratutor/docs/stylesheets/sheratutor.css)
- Implement tokens from `docs/research-idea/03-design-system.md`:
  - **Ink Navy** (`#14182B`) and **Card Navy** (`#1E2761`)
  - **Coral** (`#FF6B57`) primary accent
  - **Mint** (`#23D9A5`) dark-mode & AI accent
  - **Typography**: Google Fonts `Baloo 2` for headlines, `Inter` for body, and `Space Mono` for code and eyebrow tags.
  - **Responsive Containers**: Prevents wide Mermaid charts and MathJax equations from breaking mobile viewports.
  - **Interactive Iframe Wrappers**: Allows embedding the 5 interactive HTML web apps directly in the site layout.

### 5. Automated CI/CD Pipeline — [`.github/workflows/deploy-docs.yml`](file:///home/syed/workspace/Sheratutor/.github/workflows/deploy-docs.yml)
- **Triggers**:
  - Automatically triggers deployment on `push` to **both `main` and `docs`** branches.
  - Runs dry-run build validation on `pull_request` targeting `main` or `docs`.
  - Supports manual triggering via `workflow_dispatch`.
- **Official GitHub Pages Standards**:
  - Uses `actions/configure-pages@v5`.
  - Uses `actions/setup-python@v5` with pip caching.
  - `concurrency: { group: 'pages', cancel-in-progress: false }` for safe, reliable deployments.
  - Uses `actions/upload-pages-artifact@v3` and `actions/deploy-pages@v4` targeting the `github-pages` environment.

---

## 2. Verification & Validation Results

### Local Build Test
A local build was executed using MkDocs Material inside a sandboxed environment:
```bash
mkdocs build -f mkdocs.yml -d /tmp/site_test
```

- **Status**: **Success (Exit Code 0)**
- **Build Time**: **5.73 seconds**
- **Artifacts Verified**:
  - `index.html` (71 KB) generated with portal cards and Mermaid script.
  - `404.html` (67 KB) generated with custom brand badge.
  - Search index `search/search_index.json` indexed across all 113 files.
  - All 14 SVGs and retina PNGs copied to `site/assets/`.
  - All 5 standalone interactive HTML apps and pitch deck copied directly to static output:
    - `antigravity-docs/sheratutor_interactive_explorer.html`
    - `antigravity-docs/genkit_interactive_explorer.html`
    - `antigravity-docs/foundry_interactive_explorer.html`
    - `antigravity-docs/sheratutor_genkit_integration_explorer.html`
    - `pitch/BoardMate_AI_Pitch_Deck.html`

---

## 3. How to Go Live on GitHub Pages

1. **Commit and Push to the `docs` branch:**
   ```bash
   git add .github/ docs/index.md docs/404.md docs/stylesheets/ mkdocs.yml
   git commit -m "feat(docs): setup documentation portal and GitHub Pages deployment workflow"
   git push origin docs
   ```
2. **Enable GitHub Actions for GitHub Pages:**
   - In GitHub, navigate to:  
     `https://github.com/CodeStorm-Hub/Sheratutor/settings/pages`
   - Under **Build and deployment > Source**, select:  
     **GitHub Actions** (instead of *Deploy from a branch*).
3. **Live Documentation Site URL:**  
   Once the workflow finishes (~30 seconds), the site will be accessible at:  
   👉 **`https://codestorm-hub.github.io/Sheratutor/`**
