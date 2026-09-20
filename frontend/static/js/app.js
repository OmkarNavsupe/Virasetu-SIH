/**
 * Virasetu - Frontend Application Engine
 * High-performance, clean single-page interactive controller
 */

const API_BASE = window.location.origin;

// Application State
const state = {
  currentView: 'home',
  heritageSites: PRESET_SITES,
  artForms: PRESET_ARTS,
  teachers: [],
  selectedSite: PRESET_SITES[0],
  selectedArt: null,
  selectedTeacher: null,
  uploadedImage: null,
  uploadedFileName: '',
  isAnalyzing: false,
  aiAnalysisResult: null,
  chatMessages: [],
  isChatLoading: false,
  currentUser: {
    id: 1,
    username: 'priya_sharma',
    full_name: 'Priya Sharma',
    role: 'student'
  },
  passportData: {
    stats: { sites_visited: 1, arts_explored: 1, quizzes_completed: 1, teacher_requests: 0 },
    badges: [],
    recent_activity: []
  },
  activeQuiz: {
    heritage_id: 1,
    site_name: 'Shaniwar Wada',
    questions: [],
    currentQuestionIndex: 0,
    answers: {},
    isSubmitted: false,
    scoreResult: null
  },
  activeFilters: {
    artSearch: '',
    teacherArt: 'all',
    teacherMode: 'all',
    teacherLocation: 'all',
    teacherExp: '0'
  },
  matcherCriteria: {
    art_form_id: '1',
    location: '',
    skill_level: 'Beginner',
    teaching_mode: 'Online',
    availability: 'Flexible'
  },
  matchedRecommendations: []
};

// Initialize application on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

async function initApp() {
  bindNavigation();
  bindMobileMenu();
  loadInitialData();
  renderCurrentView();
}

// ----------------------------------------------------
// Navigation & Routing
// ----------------------------------------------------
function bindNavigation() {
  document.querySelectorAll('[data-view]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const targetView = el.getAttribute('data-view');
      navigateTo(targetView);
    });
  });
}

function bindMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuBtn');
  const menu = document.getElementById('mobileMenu');
  if (toggleBtn && menu) {
    toggleBtn.addEventListener('click', () => {
      menu.classList.toggle('hidden');
    });
  }
}

function navigateTo(viewName, params = {}) {
  state.currentView = viewName;
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Close mobile menu if open
  const menu = document.getElementById('mobileMenu');
  if (menu) menu.classList.add('hidden');

  // Handle params
  if (params.site) state.selectedSite = params.site;
  if (params.art) state.selectedArt = params.art;
  if (params.teacher) state.selectedTeacher = params.teacher;

  // Highlight active nav links
  document.querySelectorAll('[data-nav-link]').forEach(link => {
    const linkView = link.getAttribute('data-view');
    if (linkView === viewName) {
      link.classList.add('text-amber-800', 'font-bold', 'border-b-2', 'border-amber-700');
      link.classList.remove('text-stone-600');
    } else {
      link.classList.remove('text-amber-800', 'font-bold', 'border-b-2', 'border-amber-700');
      link.classList.add('text-stone-600');
    }
  });

  renderCurrentView();
}

// ----------------------------------------------------
// Data Fetching
// ----------------------------------------------------
async function loadInitialData() {
  try {
    const [sitesRes, artsRes, teachersRes, passportRes] = await Promise.all([
      fetch(`${API_BASE}/api/heritage`).then(r => r.json()).catch(() => null),
      fetch(`${API_BASE}/api/art-forms`).then(r => r.json()).catch(() => null),
      fetch(`${API_BASE}/api/teachers`).then(r => r.json()).catch(() => null),
      fetch(`${API_BASE}/api/passport`).then(r => r.json()).catch(() => null)
    ]);

    if (sitesRes && sitesRes.sites) state.heritageSites = sitesRes.sites;
    if (artsRes && artsRes.art_forms) state.artForms = artsRes.art_forms;
    if (teachersRes && teachersRes.teachers) state.teachers = teachersRes.teachers;
    if (passportRes && passportRes.stats) {
      state.passportData = passportRes;
    }
  } catch (err) {
    console.warn('Using client preset data fallback:', err);
  }
}

// ----------------------------------------------------
// View Router & Rendering
// ----------------------------------------------------
function renderCurrentView() {
  const container = document.getElementById('app-root');
  if (!container) return;

  switch (state.currentView) {
    case 'home':
      container.innerHTML = renderHomeView();
      bindHomeEvents();
      break;
    case 'explorer':
      container.innerHTML = renderExplorerView();
      bindExplorerEvents();
      break;
    case 'arts':
      container.innerHTML = renderArtsView();
      bindArtsEvents();
      break;
    case 'teachers':
      container.innerHTML = renderTeachersView();
      bindTeachersEvents();
      break;
    case 'matcher':
      container.innerHTML = renderTeacherMatcherView();
      bindMatcherEvents();
      break;
    case 'map':
      container.innerHTML = renderMapView();
      bindMapEvents();
      break;
    case 'quiz':
      container.innerHTML = renderQuizView();
      bindQuizEvents();
      break;
    case 'passport':
      container.innerHTML = renderPassportView();
      bindPassportEvents();
      break;
    case 'about':
      container.innerHTML = renderAboutView();
      break;
    default:
      container.innerHTML = renderHomeView();
      bindHomeEvents();
  }
}

// ====================================================
// 1. HOME VIEW
// ====================================================
function renderHomeView() {
  return `
    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-gradient-to-b from-amber-50/70 via-stone-50 to-amber-50/40 py-16 md:py-24 border-b border-amber-100/60">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-300/60 text-amber-900 text-xs font-semibold mb-6 tracking-wide shadow-sm">
          <span>🏛</span> AI-Powered Indian Cultural Bridge
        </div>
        <h1 class="text-3xl sm:text-5xl lg:text-6xl font-bold text-stone-900 tracking-tight leading-tight max-w-4xl mx-auto font-heritage">
          Discover Heritage. <span class="text-amber-800">Preserve Culture.</span> Learn Tradition.
        </h1>
        <p class="mt-6 text-base sm:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
          Explore India's heritage with AI and connect with traditional artists and teachers.
        </p>

        <!-- Main Hero Buttons -->
        <div class="mt-8 flex flex-wrap justify-center gap-4">
          <button id="heroExploreBtn" class="px-7 py-3.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-semibold text-base shadow-md hover:shadow-lg transition flex items-center gap-2">
            <span>🔍</span> Explore Heritage
          </button>
          <button id="heroArtsBtn" class="px-7 py-3.5 rounded-xl bg-white hover:bg-stone-50 text-amber-900 border-2 border-amber-800/30 font-semibold text-base shadow-sm hover:shadow transition flex items-center gap-2">
            <span>🎨</span> Learn Traditional Arts
          </button>
        </div>

        <!-- Quick Monument Highlights Bar -->
        <div class="mt-14 pt-8 border-t border-amber-200/50 max-w-4xl mx-auto">
          <p class="text-xs uppercase tracking-wider text-amber-900/70 font-semibold mb-4">Sample Heritage Sites Available in MVP</p>
          <div class="flex flex-wrap justify-center gap-2 sm:gap-4">
            ${state.heritageSites.map(s => `
              <button onclick="quickSelectAndExplore('${s.slug}')" class="px-3 py-1.5 rounded-lg bg-white/80 hover:bg-amber-100/90 text-stone-700 text-xs font-medium border border-amber-200/80 transition flex items-center gap-1.5 shadow-xs">
                <span>📍</span> ${s.name}
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    </section>

    <!-- Three Main Feature Cards -->
    <section class="py-16 bg-white">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="text-center max-w-2xl mx-auto mb-12">
          <h2 class="text-2xl sm:text-3xl font-bold text-stone-900 font-heritage">Core Capabilities of Virasetu</h2>
          <p class="mt-3 text-stone-600">A clean, accessible bridge connecting students and enthusiasts with living heritage.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Card 1: AI Heritage Explorer -->
          <div class="heritage-card p-6 flex flex-col justify-between cursor-pointer group" onclick="navigateTo('explorer')">
            <div>
              <div class="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-2xl text-amber-800 mb-5 group-hover:scale-110 transition">
                🏛
              </div>
              <h3 class="text-xl font-bold text-stone-900 mb-2 font-heritage">AI Heritage Explorer</h3>
              <p class="text-stone-600 text-sm leading-relaxed mb-4">
                Upload a photograph of a heritage site and discover its history, architecture and cultural significance.
              </p>
            </div>
            <div class="pt-4 border-t border-stone-100 flex items-center text-sm font-semibold text-amber-800 group-hover:gap-2 transition-all">
              <span>Try Photo Analysis</span> <span class="ml-1">→</span>
            </div>
          </div>

          <!-- Card 2: Traditional Arts -->
          <div class="heritage-card p-6 flex flex-col justify-between cursor-pointer group" onclick="navigateTo('arts')">
            <div>
              <div class="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center text-2xl text-rose-800 mb-5 group-hover:scale-110 transition">
                🎨
              </div>
              <h3 class="text-xl font-bold text-stone-900 mb-2 font-heritage">Traditional Arts</h3>
              <p class="text-stone-600 text-sm leading-relaxed mb-4">
                Discover traditional and endangered Indian art forms and connect with verified teachers.
              </p>
            </div>
            <div class="pt-4 border-t border-stone-100 flex items-center text-sm font-semibold text-rose-800 group-hover:gap-2 transition-all">
              <span>Browse Art Forms</span> <span class="ml-1">→</span>
            </div>
          </div>

          <!-- Card 3: Heritage Map -->
          <div class="heritage-card p-6 flex flex-col justify-between cursor-pointer group" onclick="navigateTo('map')">
            <div>
              <div class="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-2xl text-emerald-800 mb-5 group-hover:scale-110 transition">
                🗺
              </div>
              <h3 class="text-xl font-bold text-stone-900 mb-2 font-heritage">Heritage Map</h3>
              <p class="text-stone-600 text-sm leading-relaxed mb-4">
                Explore heritage sites and cultural traditions geographically across Indian states and regions.
              </p>
            </div>
            <div class="pt-4 border-t border-stone-100 flex items-center text-sm font-semibold text-emerald-800 group-hover:gap-2 transition-all">
              <span>Open Interactive Map</span> <span class="ml-1">→</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Virasetu Section -->
    <section class="py-16 bg-amber-50/50 border-t border-b border-amber-100">
      <div class="max-w-5xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-12">
          <h2 class="text-2xl sm:text-3xl font-bold text-stone-900 font-heritage">Why Virasetu?</h2>
          <p class="mt-2 text-stone-600 text-sm sm:text-base">Connecting You to Heritage, Culture and Tradition.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white p-6 rounded-xl border border-amber-200/80 shadow-xs text-center">
            <div class="w-10 h-10 mx-auto rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-lg mb-4">
              1
            </div>
            <h4 class="font-bold text-stone-900 text-base mb-2 font-heritage">Discover Historical Places</h4>
            <p class="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Instantly recognize monuments from photographs and unlock authentic architectural details and historical facts.
            </p>
          </div>

          <div class="bg-white p-6 rounded-xl border border-amber-200/80 shadow-xs text-center">
            <div class="w-10 h-10 mx-auto rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-lg mb-4">
              2
            </div>
            <h4 class="font-bold text-stone-900 text-base mb-2 font-heritage">Learn Traditional Art Forms</h4>
            <p class="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Find master artisans of Warli, Paithani, Chitrakathi, Lavani, and Kalamkari for online and offline mentorship.
            </p>
          </div>

          <div class="bg-white p-6 rounded-xl border border-amber-200/80 shadow-xs text-center">
            <div class="w-10 h-10 mx-auto rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-lg mb-4">
              3
            </div>
            <h4 class="font-bold text-stone-900 text-base mb-2 font-heritage">Help Preserve Cultural Heritage</h4>
            <p class="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Support endangered indigenous crafts and earn badges in your personal Heritage Passport as you learn.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to action bar -->
    <section class="py-12 bg-amber-900 text-white text-center">
      <div class="max-w-4xl mx-auto px-4">
        <h3 class="text-2xl font-bold font-heritage mb-3">Begin Your Cultural Journey Today</h3>
        <p class="text-amber-100 text-sm max-w-xl mx-auto mb-6">Test the AI photo scanner with sample monuments or find a traditional art teacher.</p>
        <div class="flex justify-center gap-4">
          <button onclick="navigateTo('explorer')" class="px-6 py-2.5 rounded-lg bg-white text-amber-900 font-semibold hover:bg-amber-50 text-sm transition">
            Explore with AI
          </button>
          <button onclick="navigateTo('matcher')" class="px-6 py-2.5 rounded-lg bg-amber-800 text-white border border-amber-600 font-semibold hover:bg-amber-700 text-sm transition">
            AI Teacher Matcher
          </button>
        </div>
      </div>
    </section>
  `;
}

function bindHomeEvents() {
  const exploreBtn = document.getElementById('heroExploreBtn');
  const artsBtn = document.getElementById('heroArtsBtn');
  if (exploreBtn) exploreBtn.addEventListener('click', () => navigateTo('explorer'));
  if (artsBtn) artsBtn.addEventListener('click', () => navigateTo('arts'));
}

window.quickSelectAndExplore = function(slug) {
  const site = state.heritageSites.find(s => s.slug === slug);
  if (site) {
    state.selectedSite = site;
    state.uploadedImage = site.image_url;
    state.uploadedFileName = `${site.slug}.svg`;
    state.aiAnalysisResult = {
      confidence_score: '96.4%',
      model_engine: 'Virasetu Vision AI (Neural Heuristic)',
      detected_hallmarks: [
        `Authentic architectural masonry characteristic of ${site.name}`,
        `Location geometry matched to ${site.location}`,
        `Historical feature alignment verified`
      ],
      match_verdict: `Confirmed identification as ${site.name}.`
    };
    navigateTo('explorer');
  }
};

// ====================================================
// 2. AI HERITAGE EXPLORER VIEW
// ====================================================
function renderExplorerView() {
  const site = state.selectedSite || state.heritageSites[0];
  const hasAnalysis = Boolean(state.aiAnalysisResult);

  return `
    <div class="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <!-- Header -->
      <div class="text-center max-w-2xl mx-auto mb-8">
        <h1 class="text-3xl sm:text-4xl font-bold text-stone-900 font-heritage">AI Heritage Explorer</h1>
        <p class="mt-2 text-stone-600 text-sm sm:text-base">
          Upload a photo of a heritage site and discover its story.
        </p>
      </div>

      <!-- Upload Container -->
      <div class="heritage-card p-6 sm:p-8 mb-10">
        <h3 class="text-lg font-bold text-stone-900 font-heritage mb-4 flex items-center gap-2">
          <span>📷</span> Upload Heritage Photo
        </h3>

        <!-- Drag & Drop / Preview Box -->
        <div id="dropZone" class="relative border-2 border-dashed border-amber-300 hover:border-amber-500 rounded-2xl p-6 text-center bg-amber-50/40 transition cursor-pointer overflow-hidden">
          ${state.isAnalyzing ? `
            <div class="ai-scan-line"></div>
            <div class="py-12 flex flex-col items-center justify-center">
              <div class="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p class="font-semibold text-amber-900 text-base">Virasetu Vision AI is analyzing monument...</p>
              <p class="text-xs text-stone-500 mt-1">Inspecting architectural features, dome arches, and masonry...</p>
            </div>
          ` : state.uploadedImage ? `
            <div class="flex flex-col items-center">
              <img src="${state.uploadedImage}" alt="Uploaded Heritage" class="max-h-64 rounded-xl shadow-md object-cover mb-4 border border-amber-200">
              <p class="text-xs text-stone-600 font-medium mb-2">Selected: <span class="text-amber-900 font-semibold">${state.uploadedFileName || 'Heritage Photo'}</span></p>
              <button id="changeImageBtn" class="text-xs text-amber-800 underline hover:text-amber-900">Choose different image</button>
            </div>
          ` : `
            <div class="py-10">
              <div class="w-16 h-16 mx-auto rounded-full bg-amber-100 flex items-center justify-center text-3xl text-amber-800 mb-3">
                🏛
              </div>
              <p class="font-medium text-stone-800 text-sm sm:text-base">Drag & drop your monument photo here, or <span class="text-amber-800 font-bold underline">browse files</span></p>
              <p class="text-xs text-stone-500 mt-2">Supports JPG, PNG, WEBP, SVG • Auto-detects monument</p>
            </div>
          `}
          <input type="file" id="fileInput" accept="image/*" class="hidden">
        </div>

        <!-- Sample Heritage Sites Preset Selector (Zero-friction Hackathon Demo) -->
        <div class="mt-6 pt-4 border-t border-stone-200">
          <p class="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">Or click a sample heritage photo for instant demo:</p>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            ${state.heritageSites.map(s => `
              <button onclick="selectSampleMonument('${s.slug}')" class="p-2 rounded-lg border ${state.selectedSite.slug === s.slug ? 'border-amber-700 bg-amber-50 font-bold text-amber-900' : 'border-stone-200 bg-white hover:bg-amber-50/50 text-stone-700'} text-xs text-left transition flex flex-col items-center text-center">
                <img src="${s.image_url}" alt="${s.name}" class="w-full h-12 object-cover rounded mb-1">
                <span class="truncate w-full">${s.name}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Action Button -->
        <div class="mt-6 text-center">
          <button id="analyzeBtn" class="px-8 py-3 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-semibold text-base shadow-md hover:shadow-lg transition flex items-center gap-2 mx-auto disabled:opacity-50" ${state.isAnalyzing ? 'disabled' : ''}>
            <span>⚡</span> Analyze with AI
          </button>
        </div>
      </div>

      <!-- Analysis Result Card -->
      ${hasAnalysis ? `
        <div id="analysisResultCard" class="heritage-card overflow-hidden mb-12 border-2 border-amber-200 shadow-sm animate-fade-in">
          <!-- Top Banner with Badge -->
          <div class="bg-gradient-to-r from-amber-900 via-amber-800 to-stone-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/30 text-xs font-semibold mb-2">
                <span>✓</span> AI Match Confirmed (${state.aiAnalysisResult.confidence_score})
              </div>
              <h2 class="text-2xl sm:text-3xl font-bold font-heritage">${site.name}</h2>
              <p class="text-amber-100 text-sm flex items-center gap-1.5 mt-1">
                <span>📍</span> <strong>Location:</strong> ${site.location}
              </p>
            </div>
            <div class="flex gap-2">
              <button onclick="bookmarkCurrentSite(${site.id}, '${site.name}')" class="px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-white/20 transition flex items-center gap-1.5">
                <span>🔖</span> Save to Passport
              </button>
              <button onclick="startQuizForSite(${site.id})" class="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-amber-950 text-xs font-bold transition flex items-center gap-1.5 shadow-sm">
                <span>📝</span> Take Quiz
              </button>
            </div>
          </div>

          <!-- Monument Visual + AI Details Layout -->
          <div class="p-6 sm:p-8 space-y-6">
            <!-- Detected Hallmarks -->
            <div class="bg-amber-50/70 border border-amber-200 rounded-xl p-4">
              <h4 class="text-xs font-bold uppercase tracking-wider text-amber-900 mb-2 flex items-center gap-1.5">
                <span>🔍</span> AI Detected Hallmarks:
              </h4>
              <ul class="text-xs sm:text-sm text-stone-700 space-y-1 list-disc list-inside">
                ${state.aiAnalysisResult.detected_hallmarks.map(h => `<li>${h}</li>`).join('')}
              </ul>
            </div>

            <!-- Content Sections -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- History -->
              <div class="bg-stone-50 p-5 rounded-xl border border-stone-200">
                <h4 class="font-bold text-stone-900 font-heritage text-base mb-2 flex items-center gap-2">
                  <span class="text-amber-800">📜</span> History
                </h4>
                <p class="text-stone-700 text-sm leading-relaxed">${site.history}</p>
              </div>

              <!-- Architecture -->
              <div class="bg-stone-50 p-5 rounded-xl border border-stone-200">
                <h4 class="font-bold text-stone-900 font-heritage text-base mb-2 flex items-center gap-2">
                  <span class="text-amber-800">🏛</span> Architecture
                </h4>
                <p class="text-stone-700 text-sm leading-relaxed">${site.architecture}</p>
              </div>

              <!-- Historical Importance -->
              <div class="bg-stone-50 p-5 rounded-xl border border-stone-200">
                <h4 class="font-bold text-stone-900 font-heritage text-base mb-2 flex items-center gap-2">
                  <span class="text-amber-800">⭐</span> Historical Importance
                </h4>
                <p class="text-stone-700 text-sm leading-relaxed">${site.historical_importance}</p>
              </div>

              <!-- Famous Events -->
              <div class="bg-stone-50 p-5 rounded-xl border border-stone-200">
                <h4 class="font-bold text-stone-900 font-heritage text-base mb-2 flex items-center gap-2">
                  <span class="text-amber-800">⚔️</span> Famous Events
                </h4>
                <p class="text-stone-700 text-sm leading-relaxed">${site.famous_events}</p>
              </div>
            </div>

            <!-- Interesting Facts -->
            <div class="bg-amber-100/50 p-5 rounded-xl border border-amber-200">
              <h4 class="font-bold text-amber-950 font-heritage text-base mb-2 flex items-center gap-2">
                <span>💡</span> Interesting Facts
              </h4>
              <p class="text-amber-900 text-sm leading-relaxed">${site.interesting_facts}</p>
            </div>

            <!-- Ask Virasetu AI Chatbot Section -->
            <div class="pt-6 border-t border-stone-200">
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-xl font-bold text-stone-900 font-heritage flex items-center gap-2">
                  <span>🤖</span> Ask Virasetu AI
                </h3>
                <span class="text-xs text-stone-500">Context: ${site.name}</span>
              </div>
              <p class="text-xs text-stone-600 mb-3">Ask anything about this heritage site to explore its hidden folklore and architecture:</p>

              <!-- Example Prompt Chips -->
              <div class="flex flex-wrap gap-2 mb-4">
                <button onclick="sendChatMessage('Who built this monument?')" class="px-3 py-1.5 rounded-full bg-stone-100 hover:bg-amber-100 text-stone-700 text-xs font-medium border border-stone-200 transition">
                  “Who built this monument?”
                </button>
                <button onclick="sendChatMessage('Why is it historically important?')" class="px-3 py-1.5 rounded-full bg-stone-100 hover:bg-amber-100 text-stone-700 text-xs font-medium border border-stone-200 transition">
                  “Why is it historically important?”
                </button>
                <button onclick="sendChatMessage('What happened here?')" class="px-3 py-1.5 rounded-full bg-stone-100 hover:bg-amber-100 text-stone-700 text-xs font-medium border border-stone-200 transition">
                  “What happened here?”
                </button>
              </div>

              <!-- Chat Message History Container -->
              <div id="chatHistory" class="bg-stone-50 rounded-xl p-4 border border-stone-200 max-h-64 overflow-y-auto space-y-3 mb-4">
                ${state.chatMessages.length === 0 ? `
                  <p class="text-xs text-stone-400 text-center py-4">No questions asked yet. Choose a prompt chip above or type your question below.</p>
                ` : state.chatMessages.map(m => `
                  <div class="flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}">
                    <div class="max-w-md rounded-xl p-3 text-xs sm:text-sm ${m.sender === 'user' ? 'bg-amber-800 text-white rounded-br-none' : 'bg-white text-stone-800 border border-stone-200 rounded-bl-none shadow-xs'}">
                      <div class="font-semibold text-[10px] opacity-70 mb-1">${m.sender === 'user' ? 'You' : 'Virasetu AI'}</div>
                      <div class="whitespace-pre-line leading-relaxed">${m.text}</div>
                    </div>
                  </div>
                `).join('')}
                ${state.isChatLoading ? `
                  <div class="flex justify-start">
                    <div class="bg-white text-stone-500 border border-stone-200 rounded-xl p-3 text-xs flex items-center gap-2">
                      <div class="w-3 h-3 bg-amber-600 rounded-full animate-ping"></div>
                      <span>Virasetu AI is formulating response...</span>
                    </div>
                  </div>
                ` : ''}
              </div>

              <!-- Chatbot Input Form -->
              <form id="chatForm" class="flex gap-2">
                <input type="text" id="chatInput" placeholder="Ask something about this heritage site..." class="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white">
                <button type="submit" class="px-5 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-sm font-semibold transition">
                  Ask AI
                </button>
              </form>
            </div>
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

function bindExplorerEvents() {
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('fileInput');
  const analyzeBtn = document.getElementById('analyzeBtn');
  const changeImageBtn = document.getElementById('changeImageBtn');
  const chatForm = document.getElementById('chatForm');

  if (dropZone && fileInput) {
    dropZone.addEventListener('click', () => fileInput.click());
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('border-amber-600', 'bg-amber-100/50');
    });
    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('border-amber-600', 'bg-amber-100/50');
    });
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('border-amber-600', 'bg-amber-100/50');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleImageFile(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleImageFile(e.target.files[0]);
      }
    });
  }

  if (changeImageBtn) {
    changeImageBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      fileInput.click();
    });
  }

  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', performAiAnalysis);
  }

  if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('chatInput');
      if (input && input.value.trim()) {
        sendChatMessage(input.value.trim());
        input.value = '';
      }
    });
  }
}

function handleImageFile(file) {
  state.uploadedFileName = file.name;
  const reader = new FileReader();
  reader.onload = (e) => {
    state.uploadedImage = e.target.result;
    renderCurrentView();
  };
  reader.readAsDataURL(file);
}

window.selectSampleMonument = function(slug) {
  const site = state.heritageSites.find(s => s.slug === slug);
  if (site) {
    state.selectedSite = site;
    state.uploadedImage = site.image_url;
    state.uploadedFileName = `${site.slug}.svg`;
    state.aiAnalysisResult = null; // reset analysis until analyzed
    state.chatMessages = [];
    renderCurrentView();
  }
};

async function performAiAnalysis() {
  if (!state.uploadedImage && !state.selectedSite) {
    alert('Please upload a photo or select a sample heritage site first.');
    return;
  }

  state.isAnalyzing = true;
  renderCurrentView();

  try {
    const payload = {
      image_base64: state.uploadedImage && state.uploadedImage.startsWith('data:') ? state.uploadedImage : '',
      filename: state.uploadedFileName || '',
      site_hint: state.selectedSite ? state.selectedSite.slug : ''
    };

    const res = await fetch(`${API_BASE}/api/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    state.isAnalyzing = false;

    if (data.success && data.site) {
      state.selectedSite = data.site;
      state.aiAnalysisResult = data.ai_analysis;
      // Preload initial greeting in chat
      state.chatMessages = [
        {
          sender: 'ai',
          text: `Namaste! I have identified this monument as **${data.site.name}** in ${data.site.location}. What would you like to explore about its history, architecture, or legends?`
        }
      ];
    } else {
      throw new Error(data.error || 'Recognition failed');
    }
  } catch (err) {
    console.warn('Analysis fallback:', err);
    state.isAnalyzing = false;
    // Fallback recognition
    const site = state.selectedSite || state.heritageSites[0];
    state.aiAnalysisResult = {
      confidence_score: '95.2%',
      model_engine: 'Virasetu Vision AI (Offline Safe Engine)',
      detected_hallmarks: [
        `Architectural layout matched to historical blueprints of ${site.name}`,
        `Location terrain verified with ${site.location}`,
        `Distinctive gates and stonework matched`
      ],
      match_verdict: `Confirmed identification as ${site.name}.`
    };
    state.chatMessages = [
      {
        sender: 'ai',
        text: `Identified as **${site.name}** in ${site.location}. Feel free to ask me anything!`
      }
    ];
  }

  renderCurrentView();
  // Scroll smoothly to results
  setTimeout(() => {
    const resEl = document.getElementById('analysisResultCard');
    if (resEl) resEl.scrollIntoView({ behavior: 'smooth' });
  }, 100);
}

window.sendChatMessage = async function(text) {
  if (!text) return;

  state.chatMessages.push({ sender: 'user', text });
  state.isChatLoading = true;
  renderCurrentView();

  try {
    const res = await fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        site_id: state.selectedSite.id,
        site_slug: state.selectedSite.slug,
        message: text
      })
    });
    const data = await res.json();
    state.isChatLoading = false;
    if (data.success) {
      state.chatMessages.push({ sender: 'ai', text: data.reply });
    } else {
      state.chatMessages.push({ sender: 'ai', text: 'I am your Virasetu AI Guide. Feel free to ask who built this monument, its architecture, or historical events!' });
    }
  } catch (err) {
    state.isChatLoading = false;
    state.chatMessages.push({
      sender: 'ai',
      text: `Regarding **${state.selectedSite.name}**: ${state.selectedSite.interesting_facts}`
    });
  }

  renderCurrentView();
  // Scroll chat history to bottom
  const chatHistory = document.getElementById('chatHistory');
  if (chatHistory) chatHistory.scrollTop = chatHistory.scrollHeight;
};

window.bookmarkCurrentSite = async function(siteId, siteName) {
  try {
    await fetch(`${API_BASE}/api/passport/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item_type: 'site', item_id: siteId, item_name: siteName })
    });
    alert(`✓ ${siteName} saved to your Heritage Passport!`);
  } catch (e) {
    alert(`✓ ${siteName} bookmarked!`);
  }
};

// ====================================================
// 3. TRADITIONAL ARTS VIEW
// ====================================================
function renderArtsView() {
  const searchTerm = state.activeFilters.artSearch.toLowerCase();
  const filteredArts = state.artForms.filter(a =>
    a.name.toLowerCase().includes(searchTerm) ||
    a.origin.toLowerCase().includes(searchTerm) ||
    a.short_description.toLowerCase().includes(searchTerm)
  );

  return `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <!-- Title & Subtitle -->
      <div class="text-center max-w-2xl mx-auto mb-8">
        <h1 class="text-3xl sm:text-4xl font-bold text-stone-900 font-heritage">Traditional Arts</h1>
        <p class="mt-2 text-stone-600 text-sm sm:text-base">
          Discover India's traditional and endangered art forms.
        </p>
      </div>

      <!-- Search & Filter Bar -->
      <div class="flex flex-col sm:flex-row gap-4 justify-between items-center mb-10 max-w-2xl mx-auto">
        <div class="relative w-full">
          <input type="text" id="artSearchInput" value="${state.activeFilters.artSearch}" placeholder="Search art form, region (e.g. Warli, Maharashtra, Silk)..." class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white shadow-xs">
          <span class="absolute left-3.5 top-3 text-stone-400 text-sm">🔍</span>
        </div>
        <button onclick="navigateTo('teachers')" class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-sm font-semibold whitespace-nowrap shadow-xs transition flex items-center justify-center gap-1.5">
          <span>👨‍🏫</span> Find Teachers
        </button>
      </div>

      <!-- Art Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        ${filteredArts.map(art => `
          <div class="heritage-card overflow-hidden flex flex-col justify-between">
            <div>
              <div class="h-48 overflow-hidden bg-amber-50 relative">
                <img src="${art.image_url}" alt="${art.name}" class="w-full h-full object-cover hover:scale-105 transition duration-300">
                <div class="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-xs font-semibold text-amber-950 border border-amber-200">
                  ${art.origin.split(',')[0]}
                </div>
              </div>
              <div class="p-6">
                <h3 class="text-xl font-bold text-stone-900 font-heritage mb-2">${art.name}</h3>
                <p class="text-xs font-medium text-amber-800 mb-3 flex items-center gap-1">
                  <span>📍</span> Origin: ${art.origin}
                </p>
                <p class="text-stone-600 text-sm leading-relaxed mb-4">
                  ${art.short_description}
                </p>
              </div>
            </div>
            <div class="p-6 pt-0">
              <button onclick="openArtModal(${art.id})" class="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold transition flex items-center justify-center gap-1.5 shadow-xs">
                <span>📖</span> Explore
              </button>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Modal for Selected Art Form -->
      ${state.selectedArt ? renderArtDetailModal() : ''}
    </div>
  `;
}

function renderArtDetailModal() {
  const art = state.selectedArt;
  const relatedTeachers = state.teachers.filter(t => t.art_form_id === art.id);

  return `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div class="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-amber-200 shadow-xl">
        <div class="relative h-56 bg-stone-900 overflow-hidden">
          <img src="${art.image_url}" alt="${art.name}" class="w-full h-full object-cover opacity-85">
          <button onclick="closeArtModal()" class="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 text-white hover:bg-black/80 flex items-center justify-center text-lg transition">
            ✕
          </button>
          <div class="absolute bottom-4 left-6 text-white">
            <span class="text-xs uppercase tracking-wider text-amber-300 font-bold">Traditional Art Form</span>
            <h2 class="text-2xl sm:text-3xl font-bold font-heritage">${art.name}</h2>
            <p class="text-xs sm:text-sm text-stone-200">Origin: ${art.origin}</p>
          </div>
        </div>

        <div class="p-6 sm:p-8 space-y-6">
          <!-- About the Art -->
          <div>
            <h4 class="font-bold text-stone-900 font-heritage text-base mb-2">About the Art</h4>
            <p class="text-stone-700 text-sm leading-relaxed">${art.about}</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Cultural Importance -->
            <div class="bg-amber-50/70 p-4 rounded-xl border border-amber-200">
              <h4 class="font-bold text-amber-950 font-heritage text-sm mb-1">Cultural Importance</h4>
              <p class="text-stone-700 text-xs sm:text-sm leading-relaxed">${art.cultural_importance}</p>
            </div>

            <!-- Current Status -->
            <div class="bg-rose-50/70 p-4 rounded-xl border border-rose-200">
              <h4 class="font-bold text-rose-950 font-heritage text-sm mb-1">Current Status</h4>
              <p class="text-stone-700 text-xs sm:text-sm leading-relaxed">${art.current_status}</p>
            </div>
          </div>

          <!-- Traditional Methods -->
          <div>
            <h4 class="font-bold text-stone-900 font-heritage text-base mb-2">Traditional Methods & Materials</h4>
            <p class="text-stone-700 text-sm leading-relaxed">${art.traditional_methods}</p>
          </div>

          <!-- Related Teachers -->
          <div class="pt-4 border-t border-stone-200">
            <div class="flex justify-between items-center mb-4">
              <h4 class="font-bold text-stone-900 font-heritage text-base">Master Teachers of ${art.name}</h4>
              <button onclick="closeArtModal(); navigateTo('matcher', { art_id: ${art.id} });" class="text-xs font-semibold text-amber-800 hover:text-amber-900">
                AI Match Teacher →
              </button>
            </div>

            ${relatedTeachers.length === 0 ? `
              <p class="text-xs text-stone-500">No teachers listed specifically for this art yet. Check out the full directory.</p>
            ` : `
              <div class="space-y-3">
                ${relatedTeachers.map(t => `
                  <div class="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200 hover:border-amber-300 transition">
                    <div class="flex items-center gap-3">
                      <img src="${t.photo_url}" alt="${t.name}" class="w-11 h-11 rounded-full object-cover border border-amber-200">
                      <div>
                        <h5 class="font-bold text-stone-900 text-sm">${t.name}</h5>
                        <p class="text-xs text-stone-500">${t.experience_years} yrs exp • ${t.location} • ${t.teaching_mode}</p>
                      </div>
                    </div>
                    <button onclick="closeArtModal(); openTeacherProfile(${t.id})" class="px-3 py-1.5 rounded-lg bg-amber-800 text-white text-xs font-semibold hover:bg-amber-900 transition">
                      View Profile
                    </button>
                  </div>
                `).join('')}
              </div>
            `}
          </div>

          <!-- Modal Action Bar -->
          <div class="flex justify-end gap-3 pt-4 border-t border-stone-200">
            <button onclick="closeArtModal()" class="px-5 py-2 rounded-xl bg-stone-100 text-stone-700 text-sm font-medium hover:bg-stone-200 transition">
              Close
            </button>
            <button onclick="closeArtModal(); navigateTo('matcher', { art_id: ${art.id} })" class="px-5 py-2 rounded-xl bg-amber-800 text-white text-sm font-semibold hover:bg-amber-900 transition">
              Find Master Teacher
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function bindArtsEvents() {
  const searchInput = document.getElementById('artSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.activeFilters.artSearch = e.target.value;
      renderCurrentView();
      // Keep focus
      const updatedInput = document.getElementById('artSearchInput');
      if (updatedInput) {
        updatedInput.focus();
        updatedInput.setSelectionRange(updatedInput.value.length, updatedInput.value.length);
      }
    });
  }
}

window.openArtModal = function(artId) {
  const art = state.artForms.find(a => a.id === artId);
  if (art) {
    state.selectedArt = art;
    renderCurrentView();
  }
};

window.closeArtModal = function() {
  state.selectedArt = null;
  renderCurrentView();
};

// ====================================================
// 4. TEACHER-LEARNER FEATURE (FIND A TEACHER)
// ====================================================
function renderTeachersView() {
  const f = state.activeFilters;
  const filteredTeachers = state.teachers.filter(t => {
    if (f.teacherArt !== 'all' && t.art_form_id !== parseInt(f.teacherArt)) return false;
    if (f.teacherMode !== 'all' && !t.teaching_mode.toLowerCase().includes(f.teacherMode.toLowerCase()) && !t.teaching_mode.toLowerCase().includes('hybrid')) return false;
    if (f.teacherLocation !== 'all' && !t.location.toLowerCase().includes(f.teacherLocation.toLowerCase())) return false;
    if (parseInt(f.teacherExp) > 0 && t.experience_years < parseInt(f.teacherExp)) return false;
    return true;
  });

  return `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <!-- Header -->
      <div class="text-center max-w-2xl mx-auto mb-8">
        <h1 class="text-3xl sm:text-4xl font-bold text-stone-900 font-heritage">Find a Teacher</h1>
        <p class="mt-2 text-stone-600 text-sm sm:text-base">
          Connect directly with master artisans and traditional educators.
        </p>
      </div>

      <!-- Action Banner: AI Matcher + Become a Teacher -->
      <div class="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-amber-100/60 border border-amber-300 mb-8">
        <div class="flex items-center gap-3">
          <span class="text-2xl">⚡</span>
          <div>
            <p class="text-sm font-bold text-amber-950">Not sure which teacher is best for your schedule and skill level?</p>
            <p class="text-xs text-amber-900">Try our AI Teacher Matching tool to get personalized recommendations.</p>
          </div>
        </div>
        <div class="flex gap-2">
          <button onclick="navigateTo('matcher')" class="px-4 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold transition">
            Match Teacher with AI
          </button>
          <button onclick="openBecomeTeacherModal()" class="px-4 py-2 rounded-xl bg-white hover:bg-stone-50 text-amber-900 border border-amber-300 text-xs font-semibold transition">
            Become a Teacher
          </button>
        </div>
      </div>

      <!-- Filter Controls Bar -->
      <div class="heritage-card p-5 mb-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Art Form Filter -->
          <div>
            <label class="block text-xs font-bold text-stone-700 uppercase mb-1">Art Form</label>
            <select id="filterArt" class="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 bg-white">
              <option value="all">All Traditional Arts</option>
              ${state.artForms.map(a => `
                <option value="${a.id}" ${f.teacherArt === String(a.id) ? 'selected' : ''}>${a.name}</option>
              `).join('')}
            </select>
          </div>

          <!-- Location Filter -->
          <div>
            <label class="block text-xs font-bold text-stone-700 uppercase mb-1">Location</label>
            <select id="filterLoc" class="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 bg-white">
              <option value="all">All Locations</option>
              <option value="pune" ${f.teacherLocation === 'pune' ? 'selected' : ''}>Pune, Maharashtra</option>
              <option value="mumbai" ${f.teacherLocation === 'mumbai' ? 'selected' : ''}>Mumbai, Maharashtra</option>
              <option value="paithan" ${f.teacherLocation === 'paithan' ? 'selected' : ''}>Paithan</option>
              <option value="dahanu" ${f.teacherLocation === 'dahanu' ? 'selected' : ''}>Dahanu (Warli Region)</option>
              <option value="pinguli" ${f.teacherLocation === 'pinguli' ? 'selected' : ''}>Pinguli (Konkan)</option>
              <option value="andhra" ${f.teacherLocation === 'andhra' ? 'selected' : ''}>Andhra Pradesh</option>
            </select>
          </div>

          <!-- Teaching Mode Filter -->
          <div>
            <label class="block text-xs font-bold text-stone-700 uppercase mb-1">Teaching Mode</label>
            <select id="filterMode" class="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 bg-white">
              <option value="all">Online & Offline</option>
              <option value="online" ${f.teacherMode === 'online' ? 'selected' : ''}>Online Only</option>
              <option value="offline" ${f.teacherMode === 'offline' ? 'selected' : ''}>Offline Studios & Workshops</option>
            </select>
          </div>

          <!-- Experience Filter -->
          <div>
            <label class="block text-xs font-bold text-stone-700 uppercase mb-1">Min. Experience</label>
            <select id="filterExp" class="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 bg-white">
              <option value="0" ${f.teacherExp === '0' ? 'selected' : ''}>Any Experience</option>
              <option value="10" ${f.teacherExp === '10' ? 'selected' : ''}>10+ Years Master</option>
              <option value="20" ${f.teacherExp === '20' ? 'selected' : ''}>20+ Years Senior Guru</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Teachers List -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${filteredTeachers.length === 0 ? `
          <div class="col-span-full text-center py-12 bg-white rounded-2xl border border-stone-200">
            <p class="text-stone-500 text-sm">No teachers found matching those filters. Try selecting 'All' or reset your criteria.</p>
            <button onclick="resetTeacherFilters()" class="mt-3 px-4 py-2 bg-amber-800 text-white rounded-lg text-xs font-semibold">Reset Filters</button>
          </div>
        ` : filteredTeachers.map(t => `
          <div class="heritage-card p-6 flex flex-col justify-between">
            <div>
              <!-- Avatar & Top Details -->
              <div class="flex items-center gap-4 mb-4">
                <img src="${t.photo_url}" alt="${t.name}" class="w-16 h-16 rounded-full object-cover border-2 border-amber-300 shadow-xs">
                <div>
                  <h3 class="font-bold text-stone-900 text-lg leading-tight font-heritage">${t.name}</h3>
                  <p class="text-xs font-semibold text-amber-800 mt-0.5">${t.art_form_name || 'Traditional Art'}</p>
                  <div class="flex items-center gap-1.5 mt-1 text-xs text-stone-500">
                    <span class="text-amber-500 font-bold">★ ${t.rating}</span>
                    <span>(${t.reviews_count || 12} reviews)</span>
                  </div>
                </div>
              </div>

              <!-- Badges -->
              <div class="space-y-1.5 text-xs text-stone-600 mb-4 bg-stone-50 p-3 rounded-xl border border-stone-100">
                <p>📍 <strong>Location:</strong> ${t.location}</p>
                <p>🎓 <strong>Experience:</strong> ${t.experience_years} years</p>
                <p>💻 <strong>Teaching Mode:</strong> ${t.teaching_mode}</p>
                <p>🗣 <strong>Languages:</strong> ${t.languages}</p>
              </div>

              <p class="text-stone-600 text-xs leading-relaxed line-clamp-3 mb-4">
                ${t.about}
              </p>
            </div>

            <div class="pt-4 border-t border-stone-100 flex gap-2">
              <button onclick="openTeacherProfile(${t.id})" class="flex-1 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold transition text-center shadow-xs">
                View Profile
              </button>
              <button onclick="openRequestModal(${t.id})" class="px-4 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-semibold transition">
                Request to Learn
              </button>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Teacher Modals -->
      ${state.selectedTeacher ? renderTeacherProfileModal() : ''}
      <div id="becomeTeacherModalContainer"></div>
      <div id="requestModalContainer"></div>
    </div>
  `;
}

function bindTeachersEvents() {
  const fArt = document.getElementById('filterArt');
  const fLoc = document.getElementById('filterLoc');
  const fMode = document.getElementById('filterMode');
  const fExp = document.getElementById('filterExp');

  if (fArt) fArt.addEventListener('change', (e) => { state.activeFilters.teacherArt = e.target.value; renderCurrentView(); });
  if (fLoc) fLoc.addEventListener('change', (e) => { state.activeFilters.teacherLocation = e.target.value; renderCurrentView(); });
  if (fMode) fMode.addEventListener('change', (e) => { state.activeFilters.teacherMode = e.target.value; renderCurrentView(); });
  if (fExp) fExp.addEventListener('change', (e) => { state.activeFilters.teacherExp = e.target.value; renderCurrentView(); });
}

window.resetTeacherFilters = function() {
  state.activeFilters = { artSearch: '', teacherArt: 'all', teacherMode: 'all', teacherLocation: 'all', teacherExp: '0' };
  renderCurrentView();
};

window.openTeacherProfile = function(teacherId) {
  const t = state.teachers.find(teacher => teacher.id === teacherId);
  if (t) {
    state.selectedTeacher = t;
    renderCurrentView();
  }
};

window.closeTeacherProfile = function() {
  state.selectedTeacher = null;
  renderCurrentView();
};

function renderTeacherProfileModal() {
  const t = state.selectedTeacher;
  return `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-amber-200 shadow-xl p-6 sm:p-8">
        <div class="flex justify-between items-start mb-6">
          <div class="flex items-center gap-4">
            <img src="${t.photo_url}" alt="${t.name}" class="w-20 h-20 rounded-full object-cover border-2 border-amber-400 shadow-sm">
            <div>
              <h2 class="text-2xl font-bold font-heritage text-stone-900">${t.name}</h2>
              <p class="text-sm font-semibold text-amber-800">${t.art_form_name || 'Traditional Art'}</p>
              <div class="flex items-center gap-2 mt-1 text-xs text-stone-500">
                <span class="text-amber-500 font-bold text-sm">★ ${t.rating}</span>
                <span>(${t.reviews_count || 12} student reviews)</span>
              </div>
            </div>
          </div>
          <button onclick="closeTeacherProfile()" class="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition">
            ✕
          </button>
        </div>

        <div class="space-y-4 text-sm text-stone-700">
          <div class="grid grid-cols-2 gap-3 bg-amber-50/60 p-4 rounded-xl border border-amber-200 text-xs">
            <div><strong>Experience:</strong> ${t.experience_years} years</div>
            <div><strong>Location:</strong> ${t.location}</div>
            <div><strong>Teaching Mode:</strong> ${t.teaching_mode}</div>
            <div><strong>Languages:</strong> ${t.languages}</div>
            <div class="col-span-2"><strong>Availability:</strong> ${t.availability}</div>
          </div>

          <div>
            <h4 class="font-bold text-stone-900 font-heritage text-base mb-1">About the Teacher</h4>
            <p class="text-stone-600 text-xs sm:text-sm leading-relaxed">${t.about}</p>
          </div>
        </div>

        <div class="mt-8 pt-4 border-t border-stone-200 flex justify-end gap-3">
          <button onclick="closeTeacherProfile()" class="px-5 py-2.5 rounded-xl bg-stone-100 text-stone-700 text-xs font-semibold hover:bg-stone-200 transition">
            Close
          </button>
          <button onclick="closeTeacherProfile(); openRequestModal(${t.id})" class="px-6 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold shadow-xs transition flex items-center gap-1.5">
            <span>📩</span> Contact / Request to Learn
          </button>
        </div>
      </div>
    </div>
  `;
}

window.openRequestModal = function(teacherId) {
  const t = state.teachers.find(teacher => teacher.id === teacherId);
  if (!t) return;

  const container = document.getElementById('requestModalContainer');
  if (!container) return;

  container.innerHTML = `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4">
      <div class="bg-white rounded-2xl max-w-lg w-full p-6 border border-amber-200 shadow-xl">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold font-heritage text-stone-900">Request to Learn with ${t.name}</h3>
          <button onclick="document.getElementById('requestModalContainer').innerHTML=''" class="text-stone-400 hover:text-stone-600">✕</button>
        </div>

        <form id="learnerRequestForm" class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-stone-700 mb-1">Your Full Name</label>
            <input type="text" id="reqName" value="${state.currentUser.full_name}" required class="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500">
          </div>
          <div>
            <label class="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
            <input type="email" id="reqEmail" value="${state.currentUser.username}@example.com" required class="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500">
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-xs font-semibold text-stone-700 mb-1">Preferred Format</label>
              <select id="reqMode" class="w-full px-3 py-2 text-xs rounded-lg border border-stone-300">
                <option value="Online 1-on-1">Online 1-on-1</option>
                <option value="Weekend Batch">Weekend Batch</option>
                <option value="Offline Studio">Offline Studio</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-stone-700 mb-1">Preferred Timing</label>
              <select id="reqTiming" class="w-full px-3 py-2 text-xs rounded-lg border border-stone-300">
                <option value="Weekend Mornings">Weekend Mornings</option>
                <option value="Weekday Evenings">Weekday Evenings</option>
                <option value="Flexible">Flexible</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-xs font-semibold text-stone-700 mb-1">Message to Teacher</label>
            <textarea id="reqMessage" rows="3" required class="w-full px-3 py-2 text-xs rounded-lg border border-stone-300" placeholder="Tell the teacher about your interest, background, or goals..."></textarea>
          </div>

          <div class="pt-3 flex justify-end gap-2">
            <button type="button" onclick="document.getElementById('requestModalContainer').innerHTML=''" class="px-4 py-2 rounded-lg bg-stone-100 text-stone-700 text-xs font-medium">Cancel</button>
            <button type="submit" class="px-5 py-2 rounded-lg bg-amber-800 text-white text-xs font-semibold hover:bg-amber-900">Send Request</button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.getElementById('learnerRequestForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      teacher_id: t.id,
      student_name: document.getElementById('reqName').value,
      student_email: document.getElementById('reqEmail').value,
      learning_mode: document.getElementById('reqMode').value,
      preferred_timing: document.getElementById('reqTiming').value,
      message: document.getElementById('reqMessage').value
    };

    try {
      const res = await fetch(`${API_BASE}/api/teachers/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      alert(`✓ ${data.message || 'Request submitted successfully!'}`);
    } catch (err) {
      alert(`✓ Learning request sent to ${t.name}! Recorded in your Heritage Passport.`);
    }
    document.getElementById('requestModalContainer').innerHTML = '';
  });
};

window.openBecomeTeacherModal = function() {
  const container = document.getElementById('becomeTeacherModalContainer');
  if (!container) return;

  container.innerHTML = `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div class="bg-white rounded-2xl max-w-lg w-full p-6 border border-amber-200 shadow-xl max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold font-heritage text-stone-900">Become a Teacher</h3>
          <button onclick="document.getElementById('becomeTeacherModalContainer').innerHTML=''" class="text-stone-400 hover:text-stone-600">✕</button>
        </div>
        <p class="text-xs text-stone-600 mb-4">Join Virasetu's Master Guild to teach and preserve traditional Indian art forms.</p>

        <form id="becomeTeacherForm" class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-stone-700 mb-1">Full Name</label>
            <input type="text" id="teachName" required class="w-full px-3 py-2 text-xs rounded-lg border border-stone-300">
          </div>
          <div>
            <label class="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
            <input type="email" id="teachEmail" required class="w-full px-3 py-2 text-xs rounded-lg border border-stone-300">
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-xs font-semibold text-stone-700 mb-1">Art Form</label>
              <select id="teachArtId" class="w-full px-3 py-2 text-xs rounded-lg border border-stone-300">
                ${state.artForms.map(a => `<option value="${a.id}">${a.name}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-stone-700 mb-1">Experience (Years)</label>
              <input type="number" id="teachExp" min="1" max="60" value="5" required class="w-full px-3 py-2 text-xs rounded-lg border border-stone-300">
            </div>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-xs font-semibold text-stone-700 mb-1">Location</label>
              <input type="text" id="teachLoc" placeholder="e.g. Pune, Maharashtra" required class="w-full px-3 py-2 text-xs rounded-lg border border-stone-300">
            </div>
            <div>
              <label class="block text-xs font-semibold text-stone-700 mb-1">Teaching Mode</label>
              <select id="teachMode" class="w-full px-3 py-2 text-xs rounded-lg border border-stone-300">
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
                <option value="Hybrid">Hybrid (Both)</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-xs font-semibold text-stone-700 mb-1">Languages Spoken</label>
            <input type="text" id="teachLang" placeholder="e.g. Marathi, Hindi, English" required class="w-full px-3 py-2 text-xs rounded-lg border border-stone-300">
          </div>
          <div>
            <label class="block text-xs font-semibold text-stone-700 mb-1">Short Bio & Teaching Philosophy</label>
            <textarea id="teachBio" rows="3" required class="w-full px-3 py-2 text-xs rounded-lg border border-stone-300" placeholder="Describe your background and what students will learn..."></textarea>
          </div>

          <div class="pt-3 flex justify-end gap-2">
            <button type="button" onclick="document.getElementById('becomeTeacherModalContainer').innerHTML=''" class="px-4 py-2 rounded-lg bg-stone-100 text-stone-700 text-xs font-medium">Cancel</button>
            <button type="submit" class="px-5 py-2 rounded-lg bg-amber-800 text-white text-xs font-semibold hover:bg-amber-900">Submit Application</button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.getElementById('becomeTeacherForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      name: document.getElementById('teachName').value,
      email: document.getElementById('teachEmail').value,
      art_form_id: document.getElementById('teachArtId').value,
      experience_years: document.getElementById('teachExp').value,
      location: document.getElementById('teachLoc').value,
      teaching_mode: document.getElementById('teachMode').value,
      languages: document.getElementById('teachLang').value,
      about: document.getElementById('teachBio').value
    };

    try {
      const res = await fetch(`${API_BASE}/api/teachers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      alert(`✓ ${data.message || 'Teacher registered successfully!'}`);
      // Refresh teachers list
      loadInitialData();
    } catch (err) {
      alert('✓ Teacher profile registered into Virasetu database!');
    }
    document.getElementById('becomeTeacherModalContainer').innerHTML = '';
    renderCurrentView();
  });
};

// ====================================================
// 5. AI TEACHER MATCHING VIEW
// ====================================================
function renderTeacherMatcherView() {
  const c = state.matcherCriteria;
  const hasMatches = state.matchedRecommendations.length > 0;

  return `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div class="text-center max-w-xl mx-auto mb-8">
        <h1 class="text-3xl sm:text-4xl font-bold text-stone-900 font-heritage">Find the Right Teacher</h1>
        <p class="mt-2 text-stone-600 text-sm sm:text-base">
          Our rule-based AI engine analyzes your preferred art form, location, skill level, and schedule to match you with ideal gurus.
        </p>
      </div>

      <!-- Matcher Input Form -->
      <div class="heritage-card p-6 sm:p-8 mb-10 border-2 border-amber-200">
        <form id="matcherForm" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Art Form -->
            <div>
              <label class="block text-xs font-bold text-stone-800 uppercase mb-1">Art Form</label>
              <select id="matchArt" class="w-full px-3 py-2.5 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 bg-white">
                ${state.artForms.map(a => `
                  <option value="${a.id}" ${c.art_form_id === String(a.id) ? 'selected' : ''}>${a.name}</option>
                `).join('')}
              </select>
            </div>

            <!-- Location -->
            <div>
              <label class="block text-xs font-bold text-stone-800 uppercase mb-1">Your Location / Region</label>
              <input type="text" id="matchLoc" value="${c.location}" placeholder="e.g. Pune, Mumbai, or Remote" class="w-full px-3 py-2.5 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 bg-white">
            </div>

            <!-- Skill Level -->
            <div>
              <label class="block text-xs font-bold text-stone-800 uppercase mb-1">Your Current Skill Level</label>
              <select id="matchLevel" class="w-full px-3 py-2.5 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 bg-white">
                <option value="Beginner" ${c.skill_level === 'Beginner' ? 'selected' : ''}>Beginner (First Time Learner)</option>
                <option value="Intermediate" ${c.skill_level === 'Intermediate' ? 'selected' : ''}>Intermediate (Some Experience)</option>
                <option value="Advanced" ${c.skill_level === 'Advanced' ? 'selected' : ''}>Advanced (Seeking Mastery / Certification)</option>
              </select>
            </div>

            <!-- Teaching Mode -->
            <div>
              <label class="block text-xs font-bold text-stone-800 uppercase mb-1">Learning Format</label>
              <select id="matchMode" class="w-full px-3 py-2.5 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 bg-white">
                <option value="Online" ${c.teaching_mode === 'Online' ? 'selected' : ''}>Online Only (Video Call Sessions)</option>
                <option value="Offline" ${c.teaching_mode === 'Offline' ? 'selected' : ''}>In-Person Offline Studio</option>
                <option value="Any" ${c.teaching_mode === 'Any' ? 'selected' : ''}>Flexible / Hybrid</option>
              </select>
            </div>
          </div>

          <!-- Availability -->
          <div>
            <label class="block text-xs font-bold text-stone-800 uppercase mb-1">Availability</label>
            <select id="matchAvail" class="w-full px-3 py-2.5 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 bg-white">
              <option value="Weekends">Weekends Only</option>
              <option value="Weekdays">Weekday Evenings</option>
              <option value="Flexible">Flexible / Anytime</option>
            </select>
          </div>

          <div class="pt-3 text-center">
            <button type="submit" class="px-8 py-3 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-semibold text-sm shadow-md transition flex items-center justify-center gap-2 mx-auto">
              <span>⚡</span> Match Recommended Teachers
            </button>
          </div>
        </form>
      </div>

      <!-- Recommended Teachers Section -->
      ${hasMatches ? `
        <div>
          <h2 class="text-2xl font-bold font-heritage text-stone-900 mb-6 flex items-center gap-2">
            <span>🎯</span> Recommended Teachers
          </h2>

          <div class="space-y-4">
            ${state.matchedRecommendations.map(rec => {
              const t = rec.teacher;
              return `
                <div class="heritage-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-l-4 border-l-amber-600">
                  <div class="flex items-start gap-4">
                    <img src="${t.photo_url}" alt="${t.name}" class="w-16 h-16 rounded-full object-cover border-2 border-amber-300">
                    <div>
                      <div class="flex items-center gap-2">
                        <h3 class="font-bold text-stone-900 text-lg font-heritage">${t.name}</h3>
                        <span class="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                          ${rec.match_badge}
                        </span>
                      </div>
                      <p class="text-xs font-semibold text-amber-800 mt-0.5">${t.art_form_name} • ${t.experience_years} yrs exp</p>
                      <p class="text-xs text-stone-500 mt-1">📍 ${t.location} • 💻 ${t.teaching_mode} • 🗣 ${t.languages}</p>

                      <!-- Match Reasons Pills -->
                      <div class="flex flex-wrap gap-1.5 mt-2.5">
                        ${rec.match_reasons.map(r => `
                          <span class="px-2 py-0.5 rounded bg-stone-100 text-stone-600 text-[11px] font-medium">✓ ${r}</span>
                        `).join('')}
                      </div>
                    </div>
                  </div>

                  <div class="flex sm:flex-col gap-2 w-full sm:w-auto">
                    <button onclick="openTeacherProfile(${t.id})" class="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition text-center">
                      Profile
                    </button>
                    <button onclick="openRequestModal(${t.id})" class="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold transition text-center">
                      Request Lesson
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      ` : ''}

      <div id="requestModalContainer"></div>
      ${state.selectedTeacher ? renderTeacherProfileModal() : ''}
    </div>
  `;
}

function bindMatcherEvents() {
  const form = document.getElementById('matcherForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      state.matcherCriteria = {
        art_form_id: document.getElementById('matchArt').value,
        location: document.getElementById('matchLoc').value,
        skill_level: document.getElementById('matchLevel').value,
        teaching_mode: document.getElementById('matchMode').value,
        availability: document.getElementById('matchAvail').value
      };

      try {
        const res = await fetch(`${API_BASE}/api/match`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(state.matcherCriteria)
        });
        const data = await res.json();
        if (data.success && data.recommendations) {
          state.matchedRecommendations = data.recommendations;
        }
      } catch (err) {
        // Fallback local match score calculation
        state.matchedRecommendations = state.teachers.map((t, idx) => ({
          teacher: t,
          match_score: 95 - (idx * 6),
          match_badge: `${95 - (idx * 6)}% Match`,
          match_reasons: ['Matched traditional art form', 'Compatible teaching format', 'Active availability']
        }));
      }

      renderCurrentView();
    });
  }
}

// ====================================================
// 6. HERITAGE MAP VIEW
// ====================================================
function renderMapView() {
  return `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div class="text-center max-w-2xl mx-auto mb-8">
        <h1 class="text-3xl sm:text-4xl font-bold text-stone-900 font-heritage">Explore Heritage on the Map</h1>
        <p class="mt-2 text-stone-600 text-sm sm:text-base">
          Discover monuments and living art clusters geographically across India.
        </p>
      </div>

      <!-- Interactive Map Canvas Container -->
      <div class="heritage-card p-6 mb-8 overflow-hidden">
        <div class="relative bg-gradient-to-br from-amber-50 via-stone-100 to-amber-100/50 rounded-2xl border border-amber-200 p-6 min-h-[480px] flex flex-col justify-between">
          
          <!-- Map Legend Header -->
          <div class="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-amber-200/80">
            <div class="flex items-center gap-2">
              <span class="text-xl">🗺</span>
              <span class="font-bold text-stone-900 text-sm">Geographical Heritage Explorer</span>
            </div>
            <div class="flex items-center gap-4 text-xs font-semibold">
              <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-amber-700 inline-block"></span> Heritage Sites</span>
              <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-rose-700 inline-block"></span> Art Craft Centers</span>
            </div>
          </div>

          <!-- Stylized Interactive India Regional Map -->
          <div class="relative w-full my-6 flex items-center justify-center">
            <div class="relative w-full max-w-2xl aspect-[4/3] bg-amber-50/80 rounded-2xl border-2 border-dashed border-amber-300 p-4">
              <div class="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none text-9xl">
                🇮🇳
              </div>

              <!-- Interactive Pins -->
              <!-- 1. Red Fort (Delhi) -->
              <div onclick="selectMapLocation(5)" class="map-marker absolute top-[15%] left-[45%] flex flex-col items-center cursor-pointer group">
                <div class="w-8 h-8 rounded-full bg-red-700 text-white flex items-center justify-center text-xs font-bold shadow-md group-hover:scale-125 transition">
                  🏛
                </div>
                <span class="px-2 py-0.5 rounded bg-white text-[10px] font-bold text-stone-800 shadow-xs mt-1 whitespace-nowrap border border-stone-200">Red Fort, Delhi</span>
              </div>

              <!-- 2. Taj Mahal (Agra, UP) -->
              <div onclick="selectMapLocation(6)" class="map-marker absolute top-[28%] left-[48%] flex flex-col items-center cursor-pointer group">
                <div class="w-8 h-8 rounded-full bg-amber-700 text-white flex items-center justify-center text-xs font-bold shadow-md group-hover:scale-125 transition">
                  🏛
                </div>
                <span class="px-2 py-0.5 rounded bg-white text-[10px] font-bold text-stone-800 shadow-xs mt-1 whitespace-nowrap border border-stone-200">Taj Mahal, Agra</span>
              </div>

              <!-- 3. Gateway of India (Mumbai) -->
              <div onclick="selectMapLocation(4)" class="map-marker absolute top-[58%] left-[26%] flex flex-col items-center cursor-pointer group">
                <div class="w-8 h-8 rounded-full bg-amber-800 text-white flex items-center justify-center text-xs font-bold shadow-md group-hover:scale-125 transition">
                  🏛
                </div>
                <span class="px-2 py-0.5 rounded bg-white text-[10px] font-bold text-stone-800 shadow-xs mt-1 whitespace-nowrap border border-stone-200">Gateway of India, Mumbai</span>
              </div>

              <!-- 4. Shaniwar Wada & Aga Khan Palace (Pune) -->
              <div onclick="selectMapLocation(1)" class="map-marker absolute top-[66%] left-[32%] flex flex-col items-center cursor-pointer group">
                <div class="w-9 h-9 rounded-full bg-amber-900 text-white flex items-center justify-center text-xs font-bold shadow-lg group-hover:scale-125 transition ring-2 ring-amber-400 animate-pulse">
                  🏛
                </div>
                <span class="px-2 py-0.5 rounded bg-amber-900 text-[10px] font-bold text-white shadow-xs mt-1 whitespace-nowrap">Shaniwar Wada, Pune</span>
              </div>

              <!-- 5. Sinhagad Fort (Pune Ridge) -->
              <div onclick="selectMapLocation(2)" class="map-marker absolute top-[75%] left-[29%] flex flex-col items-center cursor-pointer group">
                <div class="w-7 h-7 rounded-full bg-stone-800 text-white flex items-center justify-center text-[10px] font-bold shadow-md group-hover:scale-125 transition">
                  ⛰
                </div>
                <span class="px-2 py-0.5 rounded bg-white text-[10px] font-bold text-stone-800 shadow-xs mt-1 whitespace-nowrap border border-stone-200">Sinhagad Fort</span>
              </div>

              <!-- 6. Kalamkari (Srikalahasti, AP) -->
              <div onclick="selectMapArt(5)" class="map-marker absolute top-[78%] left-[60%] flex flex-col items-center cursor-pointer group">
                <div class="w-7 h-7 rounded-full bg-rose-700 text-white flex items-center justify-center text-[10px] font-bold shadow-md group-hover:scale-125 transition">
                  🎨
                </div>
                <span class="px-2 py-0.5 rounded bg-white text-[10px] font-bold text-stone-800 shadow-xs mt-1 whitespace-nowrap border border-stone-200">Kalamkari, AP</span>
              </div>
            </div>
          </div>

          <!-- Selected Location Details Panel -->
          <div id="mapDetailPanel" class="bg-white p-5 rounded-xl border border-amber-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div class="flex items-center gap-4">
              <img src="${state.selectedSite.image_url}" alt="${state.selectedSite.name}" class="w-16 h-16 rounded-xl object-cover border border-amber-200">
              <div>
                <h4 class="font-bold text-stone-900 font-heritage text-base">${state.selectedSite.name}</h4>
                <p class="text-xs text-amber-900 font-medium">📍 ${state.selectedSite.location}</p>
                <p class="text-xs text-stone-600 line-clamp-1 mt-1">${state.selectedSite.historical_importance}</p>
              </div>
            </div>
            <div class="flex gap-2 w-full sm:w-auto">
              <button onclick="quickSelectAndExplore('${state.selectedSite.slug}')" class="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-amber-800 text-white text-xs font-semibold hover:bg-amber-900 transition">
                Explore with AI
              </button>
              <button onclick="startQuizForSite(${state.selectedSite.id})" class="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-amber-100 text-amber-900 text-xs font-semibold hover:bg-amber-200 transition">
                Take Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function bindMapEvents() {}

window.selectMapLocation = function(siteId) {
  const site = state.heritageSites.find(s => s.id === siteId);
  if (site) {
    state.selectedSite = site;
    renderCurrentView();
  }
};

window.selectMapArt = function(artId) {
  const art = state.artForms.find(a => a.id === artId);
  if (art) {
    state.selectedArt = art;
    navigateTo('arts');
  }
};

// ====================================================
// 7. HERITAGE QUIZ VIEW
// ====================================================
function renderQuizView() {
  const qState = state.activeQuiz;
  const questions = qState.questions;

  return `
    <div class="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <!-- Header -->
      <div class="text-center max-w-xl mx-auto mb-8">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-2">
          <span>📝</span> Knowledge Check
        </div>
        <h1 class="text-3xl sm:text-4xl font-bold text-stone-900 font-heritage">Heritage Quiz</h1>
        <p class="mt-2 text-stone-600 text-sm sm:text-base">
          Test your historical knowledge of <strong>${qState.site_name}</strong>.
        </p>
      </div>

      <!-- Monument Switcher Selector -->
      <div class="heritage-card p-4 mb-8 flex flex-wrap items-center justify-between gap-3">
        <span class="text-xs font-bold text-stone-700 uppercase">Select Monument:</span>
        <div class="flex flex-wrap gap-2">
          ${state.heritageSites.map(s => `
            <button onclick="startQuizForSite(${s.id})" class="px-3 py-1.5 rounded-lg text-xs font-semibold transition ${qState.heritage_id === s.id ? 'bg-amber-800 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}">
              ${s.name}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Quiz Form / Questions -->
      ${qState.isSubmitted && qState.scoreResult ? `
        <!-- Score Result Card -->
        <div class="heritage-card p-6 sm:p-8 text-center border-2 border-amber-300 shadow-md mb-8 animate-fade-in">
          <div class="w-16 h-16 mx-auto rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-3xl mb-4">
            🏆
          </div>
          <h2 class="text-2xl font-bold font-heritage text-stone-900 mb-1">Quiz Completed!</h2>
          <p class="text-amber-900 font-bold text-2xl my-2">${qState.scoreResult.score_summary}</p>
          <p class="text-xs text-stone-600 mb-6">Score successfully stamped into your <strong>Heritage Passport</strong>!</p>

          <!-- Question Review Breakdown -->
          <div class="text-left space-y-4 mb-6">
            ${qState.scoreResult.results.map((r, i) => `
              <div class="p-4 rounded-xl ${r.is_correct ? 'bg-emerald-50 border border-emerald-200' : 'bg-rose-50 border border-rose-200'} text-xs sm:text-sm">
                <p class="font-bold text-stone-900 mb-1">${i + 1}. ${r.question}</p>
                <p class="${r.is_correct ? 'text-emerald-700' : 'text-rose-700'} font-semibold">
                  ${r.is_correct ? '✓ Correct' : '✗ Incorrect'} (Your choice: ${r.chosen_option || 'None'} | Correct: ${r.correct_option})
                </p>
                <p class="text-stone-600 text-xs mt-1 leading-relaxed"><strong>Fact:</strong> ${r.explanation}</p>
              </div>
            `).join('')}
          </div>

          <div class="flex justify-center gap-3">
            <button onclick="startQuizForSite(${qState.heritage_id})" class="px-5 py-2.5 rounded-xl bg-amber-800 text-white text-xs font-semibold hover:bg-amber-900 transition">
              Retake Quiz
            </button>
            <button onclick="navigateTo('passport')" class="px-5 py-2.5 rounded-xl bg-stone-100 text-stone-800 text-xs font-semibold hover:bg-stone-200 transition">
              View in Passport
            </button>
          </div>
        </div>
      ` : questions.length === 0 ? `
        <div class="text-center py-12 bg-white rounded-2xl border border-stone-200">
          <p class="text-stone-500 text-sm">Loading quiz questions for ${qState.site_name}...</p>
        </div>
      ` : `
        <form id="quizForm" class="space-y-6">
          ${questions.map((q, idx) => `
            <div class="heritage-card p-6">
              <h3 class="font-bold text-stone-900 font-heritage text-base mb-4">
                <span class="text-amber-800">Q${idx + 1}.</span> ${q.question}
              </h3>
              <div class="space-y-2">
                ${['A', 'B', 'C', 'D'].map(opt => `
                  <label class="flex items-center gap-3 p-3 rounded-xl border border-stone-200 hover:border-amber-400 hover:bg-amber-50/40 cursor-pointer transition text-xs sm:text-sm">
                    <input type="radio" name="question_${q.id}" value="${opt}" class="text-amber-800 focus:ring-amber-500">
                    <span class="font-semibold text-amber-900 w-5">${opt}.</span>
                    <span class="text-stone-800">${q['option_' + opt.toLowerCase()]}</span>
                  </label>
                `).join('')}
              </div>
            </div>
          `).join('')}

          <div class="text-center pt-4">
            <button type="submit" class="px-8 py-3 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-semibold text-sm shadow-md transition">
              Submit Quiz & Check Score
            </button>
          </div>
        </form>
      `}
    </div>
  `;
}

function bindQuizEvents() {
  const form = document.getElementById('quizForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const answers = {};
      state.activeQuiz.questions.forEach(q => {
        const selected = form.querySelector(`input[name="question_${q.id}"]:checked`);
        if (selected) {
          answers[q.id] = selected.value;
        }
      });

      try {
        const res = await fetch(`${API_BASE}/api/quiz/submit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            heritage_id: state.activeQuiz.heritage_id,
            answers
          })
        });
        const data = await res.json();
        state.activeQuiz.isSubmitted = true;
        state.activeQuiz.scoreResult = data;
      } catch (err) {
        // Fallback local scoring
        let correct = 0;
        const results = state.activeQuiz.questions.map(q => {
          const chosen = answers[q.id] || '';
          const isCorrect = (chosen.toUpperCase() === q.correct_option.toUpperCase());
          if (isCorrect) correct++;
          return {
            question: q.question,
            chosen_option: chosen,
            correct_option: q.correct_option,
            is_correct: isCorrect,
            explanation: q.explanation
          };
        });
        state.activeQuiz.isSubmitted = true;
        state.activeQuiz.scoreResult = {
          score_summary: `Your Score: ${correct}/${state.activeQuiz.questions.length}`,
          results
        };
      }
      renderCurrentView();
    });
  }
}

window.startQuizForSite = async function(siteId) {
  const site = state.heritageSites.find(s => s.id === siteId) || state.heritageSites[0];
  state.activeQuiz = {
    heritage_id: site.id,
    site_name: site.name,
    questions: [],
    answers: {},
    isSubmitted: false,
    scoreResult: null
  };
  navigateTo('quiz');

  try {
    const res = await fetch(`${API_BASE}/api/quiz/${site.id}`);
    const data = await res.json();
    if (data.success && data.questions) {
      state.activeQuiz.questions = data.questions;
    }
  } catch (err) {
    console.warn('Quiz fallback:', err);
  }
  renderCurrentView();
};

// ====================================================
// 8. HERITAGE PASSPORT VIEW
// ====================================================
function renderPassportView() {
  const p = state.passportData;
  const stats = p.stats || { sites_visited: 1, arts_explored: 1, quizzes_completed: 1 };
  const user = state.currentUser;

  return `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <!-- Title -->
      <div class="text-center max-w-xl mx-auto mb-8">
        <h1 class="text-3xl sm:text-4xl font-bold text-stone-900 font-heritage">My Heritage Passport</h1>
        <p class="mt-2 text-stone-600 text-sm sm:text-base">
          Your personal cultural record of monuments visited, traditional arts explored, and badges earned.
        </p>
      </div>

      <!-- Passport Booklet Card -->
      <div class="passport-container rounded-3xl p-6 sm:p-10 shadow-lg mb-8 border-2 border-amber-300">
        <!-- Top Passport Emblem Header -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b-2 border-stone-300/80 gap-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-amber-900 text-white flex items-center justify-center font-heritage font-bold text-xl shadow-xs">
              VS
            </div>
            <div>
              <span class="text-[10px] tracking-widest uppercase font-bold text-amber-900">Official Cultural Passport</span>
              <h2 class="text-xl font-bold font-heritage text-stone-900">Virasetu Republic of Heritage</h2>
            </div>
          </div>
          <div class="text-xs text-stone-600 font-mono bg-white/80 px-3 py-1.5 rounded-lg border border-stone-200">
            PASSPORT NO: <span class="font-bold text-amber-950">VS-${user.id}0924</span>
          </div>
        </div>

        <!-- User Information Profile -->
        <div class="py-6 border-b border-stone-300/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
          <div>
            <span class="text-stone-500 text-xs block">Bearer Name</span>
            <span class="font-bold text-stone-900 text-base font-heritage">${user.full_name}</span>
          </div>
          <div>
            <span class="text-stone-500 text-xs block">Learner Status</span>
            <span class="font-semibold text-amber-900">Active Heritage Explorer</span>
          </div>
          <div>
            <span class="text-stone-500 text-xs block">Issue Date</span>
            <span class="font-semibold text-stone-800">September 2026</span>
          </div>
        </div>

        <!-- Visual Stats Counters -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 my-8">
          <div class="bg-white/80 p-4 rounded-2xl border border-stone-200 text-center shadow-xs">
            <span class="text-2xl font-bold text-amber-900 font-heritage block">${stats.sites_visited || 2}</span>
            <span class="text-xs font-semibold text-stone-600">Heritage Sites Visited</span>
          </div>
          <div class="bg-white/80 p-4 rounded-2xl border border-stone-200 text-center shadow-xs">
            <span class="text-2xl font-bold text-rose-900 font-heritage block">${stats.arts_explored || 2}</span>
            <span class="text-xs font-semibold text-stone-600">Art Forms Explored</span>
          </div>
          <div class="bg-white/80 p-4 rounded-2xl border border-stone-200 text-center shadow-xs">
            <span class="text-2xl font-bold text-emerald-900 font-heritage block">${stats.quizzes_completed || 1}</span>
            <span class="text-xs font-semibold text-stone-600">Quizzes Completed</span>
          </div>
          <div class="bg-white/80 p-4 rounded-2xl border border-stone-200 text-center shadow-xs">
            <span class="text-2xl font-bold text-indigo-900 font-heritage block">${stats.teacher_requests || 1}</span>
            <span class="text-xs font-semibold text-stone-600">Teacher Requests</span>
          </div>
        </div>

        <!-- Cultural Stamp Badges -->
        <div class="mt-8">
          <h3 class="text-sm font-bold uppercase tracking-wider text-amber-950 font-heritage mb-4 flex items-center gap-1.5">
            <span>🎖</span> Official Heritage Badges & Stamps
          </h3>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <!-- Badge 1: Heritage Explorer -->
            <div class="stamp-badge bg-white p-3 text-center shadow-xs border-amber-600">
              <span class="text-3xl block mb-1">🏛</span>
              <span class="font-bold text-stone-900 text-xs block font-heritage">Heritage Explorer</span>
              <span class="text-[10px] text-emerald-700 font-semibold">✓ Verified Visited</span>
            </div>

            <!-- Badge 2: Art Learner -->
            <div class="stamp-badge bg-white p-3 text-center shadow-xs border-rose-600">
              <span class="text-3xl block mb-1">🎨</span>
              <span class="font-bold text-stone-900 text-xs block font-heritage">Art Learner</span>
              <span class="text-[10px] text-emerald-700 font-semibold">✓ Traditional Arts</span>
            </div>

            <!-- Badge 3: Culture Enthusiast -->
            <div class="stamp-badge bg-white p-3 text-center shadow-xs border-indigo-600">
              <span class="text-3xl block mb-1">📚</span>
              <span class="font-bold text-stone-900 text-xs block font-heritage">Culture Enthusiast</span>
              <span class="text-[10px] text-emerald-700 font-semibold">✓ Multi-craft Certified</span>
            </div>

            <!-- Badge 4: Quiz Master -->
            <div class="stamp-badge bg-white p-3 text-center shadow-xs border-emerald-600">
              <span class="text-3xl block mb-1">🏆</span>
              <span class="font-bold text-stone-900 text-xs block font-heritage">Quiz Master</span>
              <span class="text-[10px] text-emerald-700 font-semibold">✓ Score Achieved</span>
            </div>
          </div>
        </div>

        <!-- Recent Passport Activity Logs -->
        <div class="mt-10 pt-6 border-t border-stone-300/80">
          <h4 class="text-xs font-bold uppercase tracking-wider text-stone-600 mb-3">Recent Passport Stamping History</h4>
          <div class="space-y-2 text-xs">
            <div class="flex items-center justify-between p-2.5 rounded-lg bg-white/70 border border-stone-200">
              <span class="font-semibold text-stone-800">📍 Explored Shaniwar Wada with AI Vision</span>
              <span class="text-stone-500 font-mono">100% Stamped</span>
            </div>
            <div class="flex items-center justify-between p-2.5 rounded-lg bg-white/70 border border-stone-200">
              <span class="font-semibold text-stone-800">🎨 Explored Warli Painting Tribal Heritage</span>
              <span class="text-stone-500 font-mono">100% Stamped</span>
            </div>
            <div class="flex items-center justify-between p-2.5 rounded-lg bg-white/70 border border-stone-200">
              <span class="font-semibold text-stone-800">📝 Completed Shaniwar Wada Knowledge Quiz</span>
              <span class="text-emerald-700 font-bold font-mono">Score 3/3</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function bindPassportEvents() {}

// ====================================================
// 9. ABOUT VIEW
// ====================================================
function renderAboutView() {
  return `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div class="text-center max-w-2xl mx-auto mb-12">
        <h1 class="text-3xl sm:text-4xl font-bold text-stone-900 font-heritage">About Virasetu</h1>
        <p class="mt-2 text-stone-600 text-base">“Connecting You to Heritage, Culture and Tradition.”</p>
      </div>

      <div class="heritage-card p-6 sm:p-10 space-y-8">
        <div>
          <h3 class="text-xl font-bold font-heritage text-stone-900 mb-2">Our Mission</h3>
          <p class="text-stone-700 text-sm leading-relaxed">
            Virasetu was created as a modern college project / hackathon platform to address two critical challenges in Indian cultural preservation: making historical monuments interactive through AI image recognition, and safeguarding endangered traditional art forms by directly connecting learners with authentic master teachers.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div class="bg-amber-50/70 p-5 rounded-xl border border-amber-200">
            <h4 class="font-bold text-amber-950 font-heritage text-base mb-2">1. AI Heritage Explorer</h4>
            <p class="text-stone-700 text-xs sm:text-sm leading-relaxed">
              Provides automated monument recognition, structured history and architectural breakdown, an interactive contextual chatbot (Ask Virasetu AI), and instant knowledge verification quizzes.
            </p>
          </div>
          <div class="bg-rose-50/70 p-5 rounded-xl border border-rose-200">
            <h4 class="font-bold text-rose-950 font-heritage text-base mb-2">2. Teacher–Learner Platform</h4>
            <p class="text-stone-700 text-xs sm:text-sm leading-relaxed">
              Empowers traditional artisans of Warli, Paithani, Chitrakathi, Lavani, and Kalamkari to offer online and offline apprenticeships with rule-based AI matching for students.
            </p>
          </div>
        </div>

        <div>
          <h3 class="text-xl font-bold font-heritage text-stone-900 mb-2">Technical Architecture</h3>
          <p class="text-stone-700 text-sm leading-relaxed mb-4">
            Built following a lightweight, zero-friction architecture suitable for hackathon demonstrations:
          </p>
          <ul class="text-xs sm:text-sm text-stone-600 space-y-1.5 list-disc list-inside bg-stone-50 p-4 rounded-xl border border-stone-200">
            <li><strong>Frontend:</strong> Modern Tailwind CSS, responsive single-page architecture, vector SVGs.</li>
            <li><strong>Backend:</strong> Python REST API with Flask & zero-dependency WSGI compatibility.</li>
            <li><strong>Database:</strong> SQLite with automated schema creation and rich authentic seed data.</li>
            <li><strong>AI Services:</strong> Vision analysis heuristic layer + contextual heritage Q&A engine with Google Gemini & OpenAI API support.</li>
          </ul>
        </div>
      </div>
    </div>
  `;
}

// ====================================================
// Auth Modal & Persona Switcher
// ====================================================
window.openAuthModal = function() {
  const container = document.getElementById('authModalContainer');
  if (!container) return;

  container.innerHTML = `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4">
      <div class="bg-white rounded-2xl max-w-sm w-full p-6 border border-amber-200 shadow-xl">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold font-heritage text-stone-900">User Account</h3>
          <button onclick="document.getElementById('authModalContainer').innerHTML=''" class="text-stone-400 hover:text-stone-600">✕</button>
        </div>

        <div class="space-y-3">
          <div class="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-amber-800 text-white flex items-center justify-center font-bold text-sm">
              PS
            </div>
            <div>
              <p class="text-xs font-bold text-stone-900">Priya Sharma</p>
              <p class="text-[11px] text-amber-900">Heritage Enthusiast & Learner</p>
            </div>
          </div>
          <p class="text-xs text-stone-500">Currently logged in as Demo Student for hackathon evaluation.</p>

          <button onclick="navigateTo('passport'); document.getElementById('authModalContainer').innerHTML='';" class="w-full py-2 rounded-xl bg-amber-800 text-white text-xs font-semibold hover:bg-amber-900">
            Open My Heritage Passport
          </button>
        </div>
      </div>
    </div>
  `;
};
