# VIRASETU (वीरसेतू)
> **“Connecting You to Heritage, Culture and Tradition.”**
> An AI-Powered Indian Heritage & Traditional Arts Platform

---

## 📌 Project Overview

**Virasetu** is a simple, modern, and accessible web platform designed to bridge the generational gap in Indian heritage preservation. Suitable for college project demonstrations and hackathons, Virasetu unites two core pillars:

1. **AI Heritage Explorer**: Upload or select a photograph of an Indian heritage monument (e.g., Shaniwar Wada, Sinhagad Fort, Aga Khan Palace, Gateway of India, Red Fort, Taj Mahal) to automatically identify the monument, uncover its architectural nuances and history, converse with a context-aware AI guide (**Ask Virasetu AI**), and test historical knowledge via interactive quizzes.
2. **Traditional Art Teacher–Learner Platform**: Discover endangered and traditional Indian art forms (Warli Painting, Paithani Weaving, Chitrakathi Puppetry, Lavani Dance, Kalamkari, Traditional Pottery) and connect with master artisans for online, offline, or hybrid mentorship with an **AI Teacher Matcher**.
3. **Heritage Passport**: A digital cultural passport that dynamically stamps monument visits, art explorations, quiz scores, and awards cultural achievement badges.

---

## 🚀 Quick Start (Instant Run)

Virasetu comes with a **built-in zero-dependency runner** that works out-of-the-box using the standard Python runtime, as well as native support for Flask.

### Option 1: One-Line Startup

```bash
./run.sh
```

### Option 2: Python Command

```bash
python3 app.py
```

Open your browser and navigate to:
👉 **`http://localhost:8080`**

*(Optional) Install extra Flask packages if desired:*
```bash
pip install -r requirements.txt
```

---

## 🧭 Hackathon Demo Guide & User Flows

Follow these simple walkthrough flows to demonstrate the complete application during evaluation:

### Flow 1: AI Monument Discovery & Contextual Chat
1. Navigate to **Home** or click **“Explore Heritage”**.
2. Under **AI Heritage Explorer**, either upload a photo or click any sample monument chip (e.g., **Shaniwar Wada**).
3. Click **“Analyze with AI”**.
4. Observe the real-time AI scan animation and high-confidence identification result:
   - Location, History, Architecture, Historical Importance, Famous Events, Interesting Facts.
5. In the **“Ask Virasetu AI”** chatbot, click the prompt chips:
   - *“Who built this monument?”*
   - *“Why is it historically important?”*
   - *“What happened here?”*
6. Click **“Take Quiz”** to answer multiple-choice questions with instant feedback and score recording into your **Heritage Passport**.

### Flow 2: Traditional Arts & Master Teacher Discovery
1. Click **Traditional Arts** in the navigation bar.
2. Search for an art form (e.g., *“Warli”* or *“Silk”*).
3. Click **“Explore”** on any card (e.g., **Warli Painting**) to view cultural significance, endangered status, and traditional materials.
4. Click on a related teacher profile to review their experience, teaching mode, and student ratings.
5. Click **“Contact / Request to Learn”** to submit a lesson inquiry.

### Flow 3: AI Teacher Matching Engine
1. Go to **Find a Teacher** → Click **“Match Teacher with AI”** (or navigate to `/matcher`).
2. Enter your preferences: Art Form (*Warli Painting*), Format (*Online*), Skill Level (*Beginner*), Availability (*Weekends*).
3. Click **“Match Recommended Teachers”**.
4. View ranked master teachers with AI-style match percentages (e.g., `96% Match`, `88% Match`) and transparent matching rationale.

### Flow 4: Heritage Map & Passport
1. Click **Heritage Map** to view monument locations and craft clusters geographically.
2. Click any location pin to view its summary and explore.
3. Click **Passport** in the top navigation to view your personal cultural stamps, stats, and badges (**Heritage Explorer**, **Art Learner**, **Culture Enthusiast**, **Quiz Master**).

---

## 🛠 Project Architecture & Tech Stack

```
Virasetu/
├── app.py                     # Main root entry point
├── run.sh                     # Executable startup script
├── requirements.txt           # Python dependencies
├── package.json               # Frontend package definition
├── .env.example               # Environment variables template
├── README.md                  # Comprehensive documentation
│
├── database/
│   ├── schema.sql             # Relational SQLite database schema
│   ├── seed_data.py           # Preloaded authentic Indian heritage & arts data
│   └── virasetu.db           # Auto-initialized SQLite database
│
├── backend/
│   ├── app.py                 # REST API router & dual Flask/WSGI server
│   ├── config.py              # Configuration & environment variables
│   ├── database.py            # SQLite connection manager & query helpers
│   └── services/
│       └── ai_service.py      # Vision analysis heuristic, Ask Virasetu chatbot, Teacher Matcher
│
└── frontend/
    ├── index.html             # Clean responsive UI with Tailwind CSS & Indian aesthetic
    ├── static/
    │   ├── css/styles.css     # Terracotta & gold theme, cards, animations
    │   ├── js/app.js          # Interactive single-page controller
    │   ├── js/data.js         # Offline client-side data cache
    │   └── images/            # Custom SVGs for monuments, arts, and Virasetu logo
    └── src/                   # React component source code
```

---

## 📡 REST API Reference

| Endpoint | Method | Description |
| :--- | :---: | :--- |
| `/api/heritage` | `GET` | List all 6 heritage monuments with coordinates |
| `/api/heritage/<id>` | `GET` | Retrieve detailed history, architecture, and quiz for a site |
| `/api/upload` | `POST` | AI photo identification with confidence score and hallmarks |
| `/api/chat` | `POST` | Context-aware chatbot (Ask Virasetu AI) for a monument |
| `/api/art-forms` | `GET` | List traditional arts (supports `?search=`) |
| `/api/art-forms/<id>` | `GET` | Detailed cultural significance and associated teachers |
| `/api/teachers` | `GET` | Filter teachers by art form, location, mode, and experience |
| `/api/teachers/<id>` | `GET` | Detailed teacher profile |
| `/api/teachers` | `POST` | Register a new teacher profile ("Become a Teacher") |
| `/api/teachers/request` | `POST` | Submit a learner lesson request |
| `/api/match` | `POST` | AI teacher matching engine calculating match percentages |
| `/api/quiz/<heritage_id>` | `GET` | Retrieve multiple-choice quiz questions for a site |
| `/api/quiz/submit` | `POST` | Score quiz submission, explanations, and passport update |
| `/api/passport` | `GET` | Retrieve user stats, badges, and stamping history |
| `/api/passport/save` | `POST` | Bookmark a monument or art form to Heritage Passport |
| `/api/auth/me` | `GET` | Retrieve current active user profile |

---

## ⚙️ Environment Variables (`.env`)

Virasetu runs completely offline without any API keys. If you wish to connect live cloud LLMs, simply set the keys in `.env`:

```bash
cp .env.example .env
```

```env
PORT=5000
HOST=0.0.0.0

# Optional Cloud AI API Keys:
GEMINI_API_KEY=
OPENAI_API_KEY=
```

---

## 🎓 College Project & Hackathon Presentation Highlights

- **Clean Visual Style**: Soft Indian heritage aesthetic using terracotta (`#C85A32`), warm gold (`#D97706`), deep charcoal (`#1E293B`), and sandstone ivory (`#FAF7F2`).
- **Low Cognitive Load**: Easy 1-click flows without bloated or confusing dashboards.
- **Robust Reliability**: Fully functional backend and SQLite database with seed data; never crashes even without internet access.
- **Zero Third-Party Dependency Lock-in**: Dual-engine server runs on pure Python standard library WSGI as well as Flask.
