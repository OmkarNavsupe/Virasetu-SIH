"""
Virasetu - AI-Powered Heritage and Traditional Arts Platform
Main Application Server (REST API & Frontend Hosting)
"""

import os
import sys
import json
import base64
import urllib.parse
from wsgiref.simple_server import make_server
import mimetypes

# Add root directory to sys.path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from backend.config import PORT, HOST, STATIC_DIR, FRONTEND_DIR
from backend.database import ensure_db_initialized, query_all, query_one, execute_write
from backend.services.ai_service import analyze_heritage_image, generate_chat_response, match_teachers

# Ensure database is ready with seed data
ensure_db_initialized()


class VirasetuAPI:
    """
    Core REST API router for Virasetu.
    Implements a robust WSGI application that can be run natively with wsgiref
    or mounted into Flask/Gunicorn.
    """

    def __init__(self):
        mimetypes.init()

    def __call__(self, environ, start_response):
        path = environ.get("PATH_INFO", "/")
        method = environ.get("REQUEST_METHOD", "GET").upper()

        # Handle CORS Preflight
        if method == "OPTIONS":
            return self._cors_response(start_response)

        # Static Assets
        if path.startswith("/static/"):
            return self._serve_static(path, start_response)

        # API Routes
        if path.startswith("/api/"):
            return self._handle_api(path, method, environ, start_response)

        # Single Page Application root & direct HTML paths
        return self._serve_spa(environ, start_response)

    def _cors_headers(self):
        return [
            ("Access-Control-Allow-Origin", "*"),
            ("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"),
            ("Access-Control-Allow-Headers", "Content-Type, Authorization"),
        ]

    def _cors_response(self, start_response):
        headers = self._cors_headers() + [("Content-Length", "0")]
        start_response("204 No Content", headers)
        return [b""]

    def _json_response(self, start_response, data, status=200):
        body = json.dumps(data, indent=2).encode("utf-8")
        headers = [
            ("Content-Type", "application/json; charset=utf-8"),
            ("Content-Length", str(len(body))),
        ] + self._cors_headers()
        status_text = f"{status} OK" if status == 200 else f"{status} Error"
        start_response(status_text, headers)
        return [body]

    def _parse_body(self, environ):
        try:
            content_length = int(environ.get("CONTENT_LENGTH", 0))
        except (ValueError, TypeError):
            content_length = 0

        if content_length == 0:
            return {}

        raw_body = environ["wsgi.input"].read(content_length)
        content_type = environ.get("CONTENT_TYPE", "")

        if "application/json" in content_type:
            try:
                return json.loads(raw_body.decode("utf-8"))
            except Exception:
                return {}

        # Handle simple form data
        if "application/x-www-form-urlencoded" in content_type:
            parsed = urllib.parse.parse_qs(raw_body.decode("utf-8"))
            return {k: v[0] if len(v) == 1 else v for k, v in parsed.items()}

        # Raw bytes for binary uploads
        return {"_raw_bytes": raw_body}

    def _parse_query(self, environ):
        qs = environ.get("QUERY_STRING", "")
        parsed = urllib.parse.parse_qs(qs)
        return {k: v[0] if len(v) == 1 else v for k, v in parsed.items()}

    def _handle_api(self, path, method, environ, start_response):
        query_params = self._parse_query(environ)
        body = self._parse_body(environ) if method in ("POST", "PUT") else {}

        try:
            # ----------------------------------------------------
            # 1. /api/heritage
            # ----------------------------------------------------
            if path == "/api/heritage" and method == "GET":
                sites = query_all("SELECT id, slug, name, location, state, latitude, longitude, image_url, built_by, built_year, short_desc FROM (SELECT *, SUBSTR(history, 1, 140) || '...' as short_desc FROM heritage_sites) ORDER BY id ASC")
                return self._json_response(start_response, {"success": True, "sites": sites})

            if path.startswith("/api/heritage/") and method == "GET":
                identifier = path.replace("/api/heritage/", "").strip()
                if identifier.isdigit():
                    site = query_one("SELECT * FROM heritage_sites WHERE id = ?", (int(identifier),))
                else:
                    site = query_one("SELECT * FROM heritage_sites WHERE slug = ?", (identifier,))

                if site:
                    # Also fetch related quizzes
                    quizzes = query_all("SELECT id, question, option_a, option_b, option_c, option_d, correct_option, explanation FROM quizzes WHERE heritage_id = ?", (site["id"],))
                    return self._json_response(start_response, {"success": True, "site": site, "quizzes": quizzes})
                return self._json_response(start_response, {"success": False, "error": "Heritage site not found"}, status=404)

            # ----------------------------------------------------
            # 2. /api/upload (AI Heritage Photo Recognition)
            # ----------------------------------------------------
            if path == "/api/upload" and method == "POST":
                # Check for base64 image or filename or preset hint
                image_base64 = body.get("image_base64", "")
                filename = body.get("filename", "")
                site_hint = body.get("site_hint", "")

                image_bytes = None
                if image_base64:
                    try:
                        if "," in image_base64:
                            image_base64 = image_base64.split(",", 1)[1]
                        image_bytes = base64.b64decode(image_base64)
                    except Exception:
                        image_bytes = None

                analysis = analyze_heritage_image(image_bytes=image_bytes, filename=filename, site_hint=site_hint)

                # Record site exploration in passport for demo user
                if analysis.get("site"):
                    execute_write(
                        "INSERT INTO passport_entries (user_id, entry_type, item_id, item_name, extra_data) VALUES (?, ?, ?, ?, ?)",
                        (1, "site_explored", analysis["site"]["id"], analysis["site"]["name"], "Identified via AI Vision")
                    )

                return self._json_response(start_response, analysis)

            # ----------------------------------------------------
            # 3. /api/chat (Ask Virasetu AI Chatbot)
            # ----------------------------------------------------
            if path == "/api/chat" and method == "POST":
                site_id = body.get("site_id")
                site_slug = body.get("site_slug")
                message = body.get("message", "")

                site = None
                if site_id:
                    site = query_one("SELECT * FROM heritage_sites WHERE id = ?", (int(site_id),))
                elif site_slug:
                    site = query_one("SELECT * FROM heritage_sites WHERE slug = ?", (site_slug,))

                if not site:
                    site = query_one("SELECT * FROM heritage_sites LIMIT 1")

                chat_result = generate_chat_response(site, message)
                return self._json_response(start_response, {
                    "success": True,
                    "site_name": site["name"],
                    "reply": chat_result["reply"],
                    "source": chat_result["source"]
                })

            # ----------------------------------------------------
            # 4. /api/art-forms
            # ----------------------------------------------------
            if path == "/api/art-forms" and method == "GET":
                search = query_params.get("search", "").strip().lower()
                if search:
                    arts = query_all(
                        "SELECT * FROM traditional_arts WHERE LOWER(name) LIKE ? OR LOWER(origin) LIKE ? OR LOWER(short_description) LIKE ?",
                        (f"%{search}%", f"%{search}%", f"%{search}%")
                    )
                else:
                    arts = query_all("SELECT * FROM traditional_arts ORDER BY id ASC")
                return self._json_response(start_response, {"success": True, "art_forms": arts})

            if path.startswith("/api/art-forms/") and method == "GET":
                identifier = path.replace("/api/art-forms/", "").strip()
                if identifier.isdigit():
                    art = query_one("SELECT * FROM traditional_arts WHERE id = ?", (int(identifier),))
                else:
                    art = query_one("SELECT * FROM traditional_arts WHERE slug = ?", (identifier,))

                if art:
                    teachers = query_all(
                        "SELECT t.*, a.name as art_form_name FROM teachers t JOIN traditional_arts a ON t.art_form_id = a.id WHERE t.art_form_id = ?",
                        (art["id"],)
                    )
                    # Record art exploration in passport
                    execute_write(
                        "INSERT INTO passport_entries (user_id, entry_type, item_id, item_name, extra_data) VALUES (?, ?, ?, ?, ?)",
                        (1, "art_explored", art["id"], art["name"], f"Explored {art['name']}")
                    )
                    return self._json_response(start_response, {"success": True, "art_form": art, "teachers": teachers})
                return self._json_response(start_response, {"success": False, "error": "Art form not found"}, status=404)

            # ----------------------------------------------------
            # 5. /api/teachers
            # ----------------------------------------------------
            if path == "/api/teachers" and method == "GET":
                art_id = query_params.get("art_form_id")
                location = query_params.get("location", "").strip().lower()
                mode = query_params.get("teaching_mode", "").strip().lower()
                min_exp = query_params.get("min_experience")

                query = "SELECT t.*, a.name as art_form_name, a.slug as art_form_slug FROM teachers t JOIN traditional_arts a ON t.art_form_id = a.id WHERE 1=1"
                params = []

                if art_id and art_id != "all":
                    query += " AND t.art_form_id = ?"
                    params.append(int(art_id))

                if location and location != "all":
                    query += " AND LOWER(t.location) LIKE ?"
                    params.append(f"%{location}%")

                if mode and mode != "all":
                    query += " AND (LOWER(t.teaching_mode) LIKE ? OR LOWER(t.teaching_mode) LIKE '%hybrid%')"
                    params.append(f"%{mode}%")

                if min_exp:
                    query += " AND t.experience_years >= ?"
                    params.append(int(min_exp))

                query += " ORDER BY t.rating DESC, t.experience_years DESC"
                teachers = query_all(query, params)
                return self._json_response(start_response, {"success": True, "teachers": teachers})

            if path.startswith("/api/teachers/") and method == "GET":
                teacher_id = path.replace("/api/teachers/", "").strip()
                teacher = query_one(
                    "SELECT t.*, a.name as art_form_name, a.origin as art_origin, a.slug as art_form_slug FROM teachers t JOIN traditional_arts a ON t.art_form_id = a.id WHERE t.id = ?",
                    (int(teacher_id),)
                )
                if teacher:
                    return self._json_response(start_response, {"success": True, "teacher": teacher})
                return self._json_response(start_response, {"success": False, "error": "Teacher not found"}, status=404)

            # Become a Teacher registration
            if path == "/api/teachers" and method == "POST":
                name = body.get("name", "").strip()
                art_form_id = body.get("art_form_id")
                experience_years = int(body.get("experience_years", 3))
                location = body.get("location", "").strip()
                teaching_mode = body.get("teaching_mode", "Online").strip()
                languages = body.get("languages", "English, Hindi").strip()
                about = body.get("about", "").strip()
                email = body.get("email", "").strip()
                availability = body.get("availability", "Flexible").strip()

                if not name or not art_form_id or not email:
                    return self._json_response(start_response, {"success": False, "error": "Name, art form, and email are required."}, status=400)

                new_id = execute_write("""
                    INSERT INTO teachers (name, art_form_id, experience_years, location, teaching_mode, languages, rating, reviews_count, about, availability, email, photo_url)
                    VALUES (?, ?, ?, ?, ?, ?, 5.0, 1, ?, ?, ?, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&fit=crop&crop=faces')
                """, (name, int(art_form_id), experience_years, location, teaching_mode, languages, about, availability, email))

                return self._json_response(start_response, {
                    "success": True,
                    "message": "Teacher registered successfully! Welcome to the Virasetu Master Guild.",
                    "teacher_id": new_id
                })

            # Submit Learner Request
            if path == "/api/teachers/request" and method == "POST":
                teacher_id = int(body.get("teacher_id", 1))
                teacher = query_one("SELECT t.*, a.name as art_form_name FROM teachers t JOIN traditional_arts a ON t.art_form_id = a.id WHERE t.id = ?", (teacher_id,))
                if not teacher:
                    return self._json_response(start_response, {"success": False, "error": "Teacher not found"}, status=404)

                req_id = execute_write("""
                    INSERT INTO teacher_requests (user_id, teacher_id, teacher_name, art_form, student_name, student_email, learning_mode, preferred_timing, message)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    1, teacher["id"], teacher["name"], teacher["art_form_name"],
                    body.get("student_name", "Priya Sharma"),
                    body.get("student_email", "priya.sharma@example.com"),
                    body.get("learning_mode", "Online"),
                    body.get("preferred_timing", "Weekend Mornings"),
                    body.get("message", "I would love to learn the foundational techniques from you.")
                ))

                return self._json_response(start_response, {
                    "success": True,
                    "message": f"Learning request sent to {teacher['name']}! They will contact you shortly via email.",
                    "request_id": req_id
                })

            # ----------------------------------------------------
            # 6. /api/match (AI Teacher Matching)
            # ----------------------------------------------------
            if path == "/api/match" and method == "POST":
                teachers = query_all("SELECT t.*, a.name as art_form_name FROM teachers t JOIN traditional_arts a ON t.art_form_id = a.id")
                matched = match_teachers(body, teachers)
                return self._json_response(start_response, {
                    "success": True,
                    "criteria": body,
                    "matches_count": len(matched),
                    "recommendations": matched
                })

            # ----------------------------------------------------
            # 7. /api/quiz
            # ----------------------------------------------------
            if path.startswith("/api/quiz/") and method == "GET":
                heritage_id = path.replace("/api/quiz/", "").strip()
                site = query_one("SELECT id, name FROM heritage_sites WHERE id = ?", (int(heritage_id),))
                if not site:
                    return self._json_response(start_response, {"success": False, "error": "Heritage site not found"}, status=404)

                quizzes = query_all("SELECT id, heritage_id, question, option_a, option_b, option_c, option_d, correct_option, explanation FROM quizzes WHERE heritage_id = ?", (int(heritage_id),))
                return self._json_response(start_response, {"success": True, "site": site, "questions": quizzes})

            if path == "/api/quiz/submit" and method == "POST":
                heritage_id = int(body.get("heritage_id", 1))
                answers = body.get("answers", {}) # {quiz_id: chosen_option}

                site = query_one("SELECT id, name FROM heritage_sites WHERE id = ?", (heritage_id,))
                quizzes = query_all("SELECT * FROM quizzes WHERE heritage_id = ?", (heritage_id,))

                total = len(quizzes)
                correct_count = 0
                results = []

                for q in quizzes:
                    qid = str(q["id"])
                    chosen = answers.get(qid, "").upper()
                    is_correct = (chosen == q["correct_option"].upper())
                    if is_correct:
                        correct_count += 1
                    results.append({
                        "quiz_id": q["id"],
                        "question": q["question"],
                        "chosen_option": chosen,
                        "correct_option": q["correct_option"],
                        "is_correct": is_correct,
                        "explanation": q["explanation"]
                    })

                # Save score to passport
                score_str = f"{correct_count}/{total}"
                execute_write(
                    "INSERT INTO passport_entries (user_id, entry_type, item_id, item_name, extra_data) VALUES (?, ?, ?, ?, ?)",
                    (1, "quiz_completed", heritage_id, f"{site['name']} Quiz", f"Score: {score_str}")
                )

                return self._json_response(start_response, {
                    "success": True,
                    "score_summary": f"Your Score: {score_str}",
                    "correct_count": correct_count,
                    "total_questions": total,
                    "percentage": round((correct_count / total * 100), 1) if total > 0 else 0,
                    "site_name": site["name"] if site else "Heritage Site",
                    "results": results
                })

            # ----------------------------------------------------
            # 8. /api/passport
            # ----------------------------------------------------
            if path == "/api/passport" and method == "GET":
                user = query_one("SELECT * FROM users WHERE id = 1")
                entries = query_all("SELECT * FROM passport_entries WHERE user_id = 1 ORDER BY created_at DESC")
                requests = query_all("SELECT * FROM teacher_requests WHERE user_id = 1 ORDER BY created_at DESC")

                # Compute badges
                unique_sites = len(set(e["item_name"] for e in entries if e["entry_type"] == "site_explored"))
                unique_arts = len(set(e["item_name"] for e in entries if e["entry_type"] == "art_explored"))
                quizzes_passed = len([e for e in entries if e["entry_type"] == "quiz_completed"])

                badges = [
                    {"name": "Heritage Explorer", "icon": "🏛", "earned": unique_sites >= 1, "description": "Explored 1+ historical heritage monument"},
                    {"name": "Art Learner", "icon": "🎨", "earned": unique_arts >= 1 or len(requests) >= 1, "description": "Explored traditional arts or requested a master teacher"},
                    {"name": "Culture Enthusiast", "icon": "📚", "earned": (unique_sites + unique_arts) >= 3, "description": "Discovered 3+ cultural heritage treasures"},
                    {"name": "Quiz Master", "icon": "🏆", "earned": quizzes_passed >= 1, "description": "Tested historical knowledge through Heritage Quiz"}
                ]

                return self._json_response(start_response, {
                    "success": True,
                    "user": user,
                    "stats": {
                        "sites_visited": unique_sites,
                        "arts_explored": unique_arts,
                        "quizzes_completed": quizzes_passed,
                        "teacher_requests": len(requests)
                    },
                    "badges": badges,
                    "recent_activity": entries[:8],
                    "learning_requests": requests
                })

            # Save / Bookmark site or art
            if path == "/api/passport/save" and method == "POST":
                item_type = body.get("item_type", "site") # 'site' or 'art'
                item_id = int(body.get("item_id", 1))
                item_name = body.get("item_name", "Heritage Item")

                entry_type = f"saved_{item_type}"
                execute_write(
                    "INSERT INTO passport_entries (user_id, entry_type, item_id, item_name, extra_data) VALUES (?, ?, ?, ?, ?)",
                    (1, entry_type, item_id, item_name, "Bookmarked to Passport")
                )
                return self._json_response(start_response, {"success": True, "message": f"Saved {item_name} to your Heritage Passport!"})

            # ----------------------------------------------------
            # 9. /api/auth
            # ----------------------------------------------------
            if path == "/api/auth/me" and method == "GET":
                user = query_one("SELECT id, username, email, full_name, role FROM users WHERE id = 1")
                return self._json_response(start_response, {"success": True, "user": user})

            if path == "/api/auth/login" and method == "POST":
                username = body.get("username", "").strip().lower()
                user = query_one("SELECT * FROM users WHERE LOWER(username) = ? OR LOWER(email) = ?", (username, username))
                if not user:
                    user = query_one("SELECT * FROM users WHERE id = 1")
                return self._json_response(start_response, {
                    "success": True,
                    "message": f"Welcome back, {user['full_name']}!",
                    "user": user
                })

            if path == "/api/auth/register" and method == "POST":
                full_name = body.get("full_name", "").strip() or "Heritage Learner"
                email = body.get("email", "").strip() or "learner@example.com"
                username = body.get("username", "").strip() or email.split("@")[0]

                new_uid = execute_write(
                    "INSERT OR IGNORE INTO users (username, email, full_name, role) VALUES (?, ?, ?, 'student')",
                    (username, email, full_name)
                )
                user = query_one("SELECT * FROM users WHERE id = ?", (new_uid,)) or query_one("SELECT * FROM users WHERE id = 1")
                return self._json_response(start_response, {
                    "success": True,
                    "message": "Account created successfully! Your Heritage Passport has been issued.",
                    "user": user
                })

            return self._json_response(start_response, {"error": "API route not found", "path": path}, status=404)

        except Exception as e:
            import traceback
            traceback.print_exc()
            return self._json_response(start_response, {"success": False, "error": str(e)}, status=500)

    def _serve_static(self, path, start_response):
        """Serves static files like CSS, JS, SVG, and images."""
        rel_path = path[len("/static/"):]
        file_path = os.path.join(STATIC_DIR, rel_path)

        if not os.path.isfile(file_path):
            start_response("404 Not Found", [("Content-Type", "text/plain")])
            return [b"Static file not found"]

        mime, _ = mimetypes.guess_type(file_path)
        mime = mime or "application/octet-stream"

        try:
            with open(file_path, "rb") as f:
                content = f.read()
            headers = [
                ("Content-Type", mime),
                ("Content-Length", str(len(content))),
                ("Cache-Control", "public, max-age=3600")
            ] + self._cors_headers()
            start_response("200 OK", headers)
            return [content]
        except Exception as e:
            start_response("500 Server Error", [("Content-Type", "text/plain")])
            return [str(e).encode("utf-8")]

    def _serve_spa(self, environ, start_response):
        """Serves the main single-page application index.html."""
        index_path = os.path.join(FRONTEND_DIR, "index.html")
        if not os.path.isfile(index_path):
            start_response("200 OK", [("Content-Type", "text/html; charset=utf-8")])
            return [b"<h1>Virasetu - Heritage & Traditional Arts Platform</h1><p>Frontend loading...</p>"]

        with open(index_path, "rb") as f:
            content = f.read()

        headers = [
            ("Content-Type", "text/html; charset=utf-8"),
            ("Content-Length", str(len(content))),
            ("Cache-Control", "no-cache")
        ] + self._cors_headers()
        start_response("200 OK", headers)
        return [content]


# Global WSGI application instance
app = VirasetuAPI()


def main():
    target_port = PORT
    server = None

    # Try target port, with automatic fallback if needed
    candidate_ports = [target_port, 8080, 5050, 8000, 5001]
    # Remove duplicates preserving order
    seen = set()
    candidate_ports = [p for p in candidate_ports if not (p in seen or seen.add(p))]

    for p in candidate_ports:
        try:
            server = make_server(HOST, p, app)
            target_port = p
            break
        except OSError as err:
            if err.errno == 48: # Address already in use
                continue
            raise err

    if not server:
        server = make_server(HOST, 0, app) # Assign ephemeral port
        target_port = server.server_port

    print("=" * 65, flush=True)
    print(f"  VIRASETU - AI Heritage & Traditional Arts Platform", flush=True)
    print(f"  'Connecting You to Heritage, Culture and Tradition.'", flush=True)
    print("=" * 65, flush=True)
    print(f"  -> Local Server running at: http://localhost:{target_port}", flush=True)
    print(f"  -> API Endpoints: http://localhost:{target_port}/api/heritage", flush=True)
    print(f"  -> Press Ctrl+C to stop the server", flush=True)
    print("=" * 65, flush=True)
    print("  [Server Engine: Python High-Performance WSGI Server (Zero Dependencies)]", flush=True)

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nVirasetu server stopped cleanly.", flush=True)


if __name__ == "__main__":
    main()
