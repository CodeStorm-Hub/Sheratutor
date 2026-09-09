import json
from pathlib import Path

meta_path = Path("/home/syed/workspace/Sheratutor/ingestion/output/figures/chemistry/all_407_figures_metadata.json")
with open(meta_path, "r", encoding="utf-8") as f:
    figures = json.load(f)

html_template = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NCTB Chemistry Multimodal Diagram Explorer (407 Figures)</title>
  <script src="https://www.gstatic.com/antigravity/web/dev/tailwindcss.min.js"></script>
  <style>
    :root {
      --bg: #090d16;
      --card: #0f172a;
      --card-hover: #1e293b;
      --border: #334155;
      --primary: #38bdf8;
      --secondary: #818cf8;
      --accent: #34d399;
      --text: #f8fafc;
      --muted: #94a3b8;
    }
    body {
      background-color: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #0f172a;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #334155;
      border-radius: 3px;
    }
    .fig-card {
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .fig-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px -5px rgba(56, 189, 248, 0.15);
      border-color: #38bdf8;
    }
  </style>
</head>
<body class="min-h-screen p-4 md:p-8 antialiased">
  <div class="max-w-[1600px] mx-auto space-y-6">

    <!-- Top Header -->
    <header class="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-6 shadow-xl relative overflow-hidden">
      <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        <div>
          <div class="flex flex-wrap items-center gap-2 mb-2">
            <span class="px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/15 text-sky-400 border border-sky-500/30">NCTB Secondary Chemistry</span>
            <span class="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">Class 9–10</span>
            <span class="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">300 DPI Multimodal Crops</span>
            <span class="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-400 border border-purple-500/30">Supabase CDN Hosted</span>
          </div>
          <h1 class="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <span>🔬</span> Chemistry Multimodal Visual Corpus Explorer
          </h1>
          <p class="text-[#94a3b8] text-sm mt-1.5 max-w-3xl">
            Inspecting every apparatus diagram, molecular geometry, heating curve, electric circuit, and blast furnace process extracted from both the Bengali (215 figures) and English (192 figures) curriculum editions.
          </p>
        </div>

        <!-- Metric Counter Cards -->
        <div class="flex items-center gap-3 shrink-0">
          <div class="bg-[#1e293b]/60 border border-[#334155] rounded-xl px-4 py-3 text-center min-w-[100px]">
            <div class="text-2xl font-black text-white" id="stat-total">407</div>
            <div class="text-[11px] font-medium text-[#94a3b8] uppercase tracking-wider">Total Figures</div>
          </div>
          <div class="bg-[#1e293b]/60 border border-[#334155] rounded-xl px-4 py-3 text-center min-w-[90px]">
            <div class="text-2xl font-black text-sky-400" id="stat-bn">215</div>
            <div class="text-[11px] font-medium text-sky-300/80 uppercase tracking-wider">🇧🇩 Bangla</div>
          </div>
          <div class="bg-[#1e293b]/60 border border-[#334155] rounded-xl px-4 py-3 text-center min-w-[90px]">
            <div class="text-2xl font-black text-indigo-400" id="stat-en">192</div>
            <div class="text-[11px] font-medium text-indigo-300/80 uppercase tracking-wider">🇬🇧 English</div>
          </div>
          <div class="bg-[#1e293b]/60 border border-[#334155] rounded-xl px-4 py-3 text-center min-w-[80px]">
            <div class="text-2xl font-black text-emerald-400">12</div>
            <div class="text-[11px] font-medium text-emerald-300/80 uppercase tracking-wider">Chapters</div>
          </div>
        </div>
      </div>
    </header>

    <!-- Controls Bar: Search + Language Filter + Chapter Scroller -->
    <div class="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-4 shadow-lg space-y-4">
      
      <!-- Search & Language Toggle Row -->
      <div class="flex flex-col md:flex-row items-center justify-between gap-4">
        <!-- Search Input -->
        <div class="relative w-full md:w-96">
          <svg class="w-4 h-4 text-[#94a3b8] absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <input 
            type="text" 
            id="search-input" 
            placeholder="Search by page (e.g. 178), chapter, or filename..." 
            class="w-full bg-[#1e293b] border border-[#334155] text-white text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-sky-400 transition-colors"
            oninput="handleSearch(this.value)"
          >
        </div>

        <!-- Language Switcher -->
        <div class="flex items-center bg-[#1e293b] p-1 rounded-xl border border-[#334155] w-full md:w-auto">
          <button onclick="setLangFilter('all')" id="lang-btn-all" class="flex-1 md:flex-none px-4 py-1.5 rounded-lg text-xs font-semibold bg-sky-500 text-slate-950 shadow transition-all">All (407)</button>
          <button onclick="setLangFilter('bn')" id="lang-btn-bn" class="flex-1 md:flex-none px-4 py-1.5 rounded-lg text-xs font-semibold text-[#94a3b8] hover:text-white transition-all">🇧🇩 বাংলা (215)</button>
          <button onclick="setLangFilter('en')" id="lang-btn-en" class="flex-1 md:flex-none px-4 py-1.5 rounded-lg text-xs font-semibold text-[#94a3b8] hover:text-white transition-all">🇬🇧 English (192)</button>
        </div>

        <!-- Display Counter -->
        <div class="text-xs font-medium text-[#94a3b8] shrink-0">
          Showing <span id="visible-count" class="font-bold text-sky-400">407</span> / 407 diagrams
        </div>
      </div>

      <!-- Chapter Pills Horizontal Scroller -->
      <div class="overflow-x-auto custom-scrollbar pb-1">
        <div class="flex items-center gap-1.5 min-w-max" id="chapter-pills">
          <!-- Populated by JS -->
        </div>
      </div>
    </div>

    <!-- Gallery Grid -->
    <main id="gallery-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
      <!-- Cards rendered by JS -->
    </main>

    <!-- Empty State -->
    <div id="empty-state" class="hidden text-center py-20 bg-[#0f172a] rounded-2xl border border-[#1e293b]">
      <div class="text-4xl mb-3">🔍</div>
      <h3 class="text-lg font-bold text-white">No diagrams matched your search</h3>
      <p class="text-sm text-[#94a3b8] mt-1">Try searching for another page number or select "All Chapters".</p>
    </div>

  </div>

  <!-- Fullscreen Modal / Lightbox -->
  <div id="modal" class="fixed inset-0 z-50 bg-black/85 backdrop-blur-md hidden flex items-center justify-center p-4">
    <div class="bg-[#0f172a] border border-[#334155] rounded-2xl max-w-5xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
      <!-- Modal Header -->
      <div class="p-4 border-b border-[#1e293b] flex items-center justify-between bg-[#1e293b]/40">
        <div>
          <div class="flex items-center gap-2">
            <span id="modal-badge-lang" class="px-2 py-0.5 rounded text-[11px] font-bold bg-sky-500/20 text-sky-300">BN</span>
            <span id="modal-chapter-tag" class="text-xs text-[#94a3b8]">Chapter 1</span>
          </div>
          <h3 id="modal-title" class="text-base font-bold text-white mt-0.5">Title</h3>
        </div>
        <button onclick="closeModal()" class="w-8 h-8 rounded-lg bg-[#1e293b] hover:bg-[#334155] text-slate-300 flex items-center justify-center transition-colors">
          ✕
        </button>
      </div>

      <!-- Modal Body (Image Container) -->
      <div class="flex-1 overflow-auto p-6 flex items-center justify-center bg-black/40 min-h-[400px]">
        <img id="modal-img" src="" alt="" class="max-h-[65vh] max-w-full object-contain rounded-lg shadow-lg border border-[#334155]">
      </div>

      <!-- Modal Footer (Metadata & Direct URL) -->
      <div class="p-4 border-t border-[#1e293b] bg-[#1e293b]/30 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div class="flex items-center gap-4 text-[#94a3b8]">
          <div>Page: <span id="modal-page" class="font-bold text-white"></span></div>
          <div>Dimensions: <span id="modal-dims" class="font-bold text-white"></span></div>
          <div>File: <span id="modal-file" class="font-mono text-slate-300"></span></div>
        </div>
        <div class="flex items-center gap-2">
          <a id="modal-cdn-link" href="#" target="_blank" class="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold transition-colors flex items-center gap-1.5">
            <span>View Fullscreen CDN</span>
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
          </a>
        </div>
      </div>
    </div>
  </div>

  <script>
    const ALL_FIGURES = """ + json.dumps(figures, ensure_ascii=False) + """;

    const CHAPTERS = [
      { no: -1, name: "All Chapters" },
      { no: 0, name: "Ch 0: Front Matter" },
      { no: 1, name: "Ch 1: Concepts" },
      { no: 2, name: "Ch 2: States" },
      { no: 3, name: "Ch 3: Structure" },
      { no: 4, name: "Ch 4: Periodic Table" },
      { no: 5, name: "Ch 5: Chemical Bonds" },
      { no: 6, name: "Ch 6: Mole" },
      { no: 7, name: "Ch 7: Reactions" },
      { no: 8, name: "Ch 8: Energy" },
      { no: 9, name: "Ch 9: Acid-Base" },
      { no: 10, name: "Ch 10: Metals" },
      { no: 11, name: "Ch 11: Fossils" },
      { no: 12, name: "Ch 12: Chemistry in Life" }
    ];

    let currentLang = 'all';
    let currentChapter = -1;
    let currentSearch = '';

    function init() {
      renderChapterPills();
      filterAndRender();
    }

    function renderChapterPills() {
      const container = document.getElementById('chapter-pills');
      container.innerHTML = CHAPTERS.map(ch => {
        const count = ch.no === -1 
          ? ALL_FIGURES.length 
          : ALL_FIGURES.filter(f => f.chapter_no === ch.no).length;
        
        const active = ch.no === currentChapter;
        return `
          <button 
            onclick="setChapterFilter(${ch.no})"
            class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              active 
                ? 'bg-sky-500 text-slate-950 font-bold shadow-md shadow-sky-500/20' 
                : 'bg-[#1e293b] text-[#94a3b8] hover:text-white hover:bg-[#334155]'
            }"
          >
            ${ch.name} <span class="opacity-75 font-normal ml-0.5">(${count})</span>
          </button>
        `;
      }).join('');
    }

    function setLangFilter(lang) {
      currentLang = lang;
      ['all', 'bn', 'en'].forEach(l => {
        const btn = document.getElementById(`lang-btn-${l}`);
        if (l === lang) {
          btn.className = 'flex-1 md:flex-none px-4 py-1.5 rounded-lg text-xs font-semibold bg-sky-500 text-slate-950 shadow transition-all';
        } else {
          btn.className = 'flex-1 md:flex-none px-4 py-1.5 rounded-lg text-xs font-semibold text-[#94a3b8] hover:text-white transition-all';
        }
      });
      filterAndRender();
    }

    function setChapterFilter(chNo) {
      currentChapter = chNo;
      renderChapterPills();
      filterAndRender();
    }

    function handleSearch(val) {
      currentSearch = val.trim().toLowerCase();
      filterAndRender();
    }

    function filterAndRender() {
      const filtered = ALL_FIGURES.filter(fig => {
        if (currentLang !== 'all' && fig.lang !== currentLang) return false;
        if (currentChapter !== -1 && fig.chapter_no !== currentChapter) return false;
        if (currentSearch) {
          const matchPage = fig.page_no.toString().includes(currentSearch);
          const matchFile = fig.filename.toLowerCase().includes(currentSearch);
          const matchChEn = fig.chapter_title_en.toLowerCase().includes(currentSearch);
          const matchChBn = fig.chapter_title_bn.toLowerCase().includes(currentSearch);
          if (!matchPage && !matchFile && !matchChEn && !matchChBn) return false;
        }
        return true;
      });

      document.getElementById('visible-count').innerText = filtered.length;
      const grid = document.getElementById('gallery-grid');
      const empty = document.getElementById('empty-state');

      if (filtered.length === 0) {
        grid.innerHTML = '';
        empty.classList.remove('hidden');
        return;
      }

      empty.classList.add('hidden');
      grid.innerHTML = filtered.map(fig => {
        const isBn = fig.lang === 'bn';
        const langBadge = isBn 
          ? '<span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">🇧🇩 বাংলা</span>'
          : '<span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">🇬🇧 English</span>';

        return `
          <div 
            class="fig-card bg-[#0f172a] border border-[#1e293b] rounded-xl overflow-hidden flex flex-col cursor-pointer group"
            onclick="openModal('${fig.id}')"
          >
            <!-- Image Card Header -->
            <div class="p-3 border-b border-[#1e293b] bg-[#1e293b]/30 flex items-center justify-between text-xs">
              <div class="flex items-center gap-1.5">
                ${langBadge}
                <span class="text-[#94a3b8] font-medium text-[11px]">Ch ${fig.chapter_no} • p.${fig.page_no}</span>
              </div>
              <span class="text-[10px] text-[#64748b] font-mono">${fig.width}×${fig.height}</span>
            </div>

            <!-- Image Viewport -->
            <div class="h-48 bg-[#020617] p-2 flex items-center justify-center overflow-hidden relative">
              <img 
                src="${fig.cdn_url}" 
                alt="${fig.filename}" 
                loading="lazy" 
                class="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-200"
                onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'100\\' height=\\'100\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'%2364748b\\' stroke-width=\\'2\\'><rect x=\\'3\\' y=\\'3\\' width=\\'18\\' height=\\'18\\' rx=\\'2\\' ry=\\'2\\'/><circle cx=\\'8.5\\' cy=\\'8.5\\' r=\\'1.5\\'/><polyline points=\\'21 15 16 10 5 21\\'/></svg>';"
              >
            </div>

            <!-- Card Footer -->
            <div class="p-3 bg-[#0f172a] border-t border-[#1e293b] flex items-center justify-between text-xs mt-auto">
              <span class="text-white font-medium truncate text-[11px] max-w-[170px]" title="${isBn ? fig.chapter_title_bn : fig.chapter_title_en}">
                ${isBn ? fig.chapter_title_bn : fig.chapter_title_en}
              </span>
              <span class="text-[11px] font-mono text-sky-400 group-hover:underline">View ↗</span>
            </div>
          </div>
        `;
      }).join('');
    }

    function openModal(id) {
      const fig = ALL_FIGURES.find(f => f.id === id);
      if (!fig) return;

      const isBn = fig.lang === 'bn';
      document.getElementById('modal-title').innerText = isBn ? `${fig.chapter_title_bn} (পৃষ্ঠা ${fig.page_no})` : `${fig.chapter_title_en} (Page ${fig.page_no})`;
      document.getElementById('modal-chapter-tag').innerText = `Chapter ${fig.chapter_no}: ${fig.chapter_title_en}`;
      document.getElementById('modal-badge-lang').innerText = isBn ? '🇧🇩 বাংলা সংস্করণ' : '🇬🇧 English Edition';
      document.getElementById('modal-badge-lang').className = isBn ? 'px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-300' : 'px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-500/20 text-indigo-300';
      
      document.getElementById('modal-img').src = fig.cdn_url;
      document.getElementById('modal-page').innerText = fig.page_no;
      document.getElementById('modal-dims').innerText = `${fig.width} × ${fig.height} px`;
      document.getElementById('modal-file').innerText = fig.filename;
      document.getElementById('modal-cdn-link').href = fig.cdn_url;

      document.getElementById('modal').classList.remove('hidden');
    }

    function closeModal() {
      document.getElementById('modal').classList.add('hidden');
    }

    document.getElementById('modal').addEventListener('click', (e) => {
      if (e.target.id === 'modal') closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });

    init();
  </script>
</body>
</html>
"""

target_html = Path("/home/syed/.gemini/antigravity/brain/f428beae-0d17-41f0-9ee8-6ac0868b0493/chemistry_all_diagrams_explorer.html")
target_html.write_text(html_template, encoding="utf-8")
print(f"Generated standalone explorer HTML at {target_html} with {len(figures)} figures embedded!")
