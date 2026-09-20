"""
Virasetu Automated Verification Test Script
Tests all REST API endpoints, AI recognition, chat, matching, quiz, and static serving.
"""

import sys
import os
import json
import io
import urllib.parse

# Ensure project root is in sys.path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from backend.app import app

def simulate_request(path, method="GET", body=None, query_string=""):
    environ = {
        "PATH_INFO": path,
        "REQUEST_METHOD": method,
        "QUERY_STRING": query_string,
        "CONTENT_TYPE": "application/json",
        "wsgi.input": io.BytesIO(json.dumps(body).encode("utf-8") if body else b""),
        "CONTENT_LENGTH": str(len(json.dumps(body).encode("utf-8"))) if body else "0"
    }

    status_holder = {}
    headers_holder = {}

    def start_response(status, headers):
        status_holder["status"] = status
        headers_holder["headers"] = headers

    result = app(environ, start_response)
    body_data = b"".join(result)
    try:
        json_data = json.loads(body_data.decode("utf-8"))
    except Exception:
        json_data = body_data.decode("utf-8")

    return status_holder.get("status", ""), json_data

def run_tests():
    print("==================================================")
    print(" Running Virasetu Automated Verification Suite   ")
    print("==================================================")
    all_passed = True

    # 1. Test GET /api/heritage
    status, data = simulate_request("/api/heritage")
    assert "200" in status, f"Heritage API failed: {status}"
    assert len(data.get("sites", [])) == 6, f"Expected 6 sites, got {len(data.get('sites', []))}"
    print(" [PASS] GET /api/heritage -> 6 sites returned")

    # 2. Test GET /api/heritage/1
    status, data = simulate_request("/api/heritage/1")
    assert "200" in status, f"Heritage details failed: {status}"
    assert data["site"]["name"] == "Shaniwar Wada", f"Expected Shaniwar Wada, got {data['site']['name']}"
    assert len(data.get("quizzes", [])) >= 3, "Expected related quizzes"
    print(" [PASS] GET /api/heritage/1 -> Shaniwar Wada details & quizzes verified")

    # 3. Test POST /api/upload (AI Recognition)
    status, data = simulate_request("/api/upload", method="POST", body={
        "filename": "shaniwar_wada_pune.jpg",
        "site_hint": "shaniwar-wada"
    })
    assert "200" in status, f"AI upload failed: {status}"
    assert data["success"] is True
    assert data["site"]["name"] == "Shaniwar Wada"
    assert "confidence_score" in data["ai_analysis"]
    print(f" [PASS] POST /api/upload -> AI Vision identified: {data['site']['name']} ({data['ai_analysis']['confidence_score']})")

    # 4. Test POST /api/chat (Ask Virasetu AI)
    status, data = simulate_request("/api/chat", method="POST", body={
        "site_id": 1,
        "message": "Who built this monument and when?"
    })
    assert "200" in status, f"Chat failed: {status}"
    assert data["success"] is True
    assert "Baji Rao I" in data["reply"]
    print(f" [PASS] POST /api/chat -> Response: {data['reply'][:65]}...")

    # 5. Test GET /api/art-forms
    status, data = simulate_request("/api/art-forms")
    assert "200" in status, f"Art forms failed: {status}"
    assert len(data.get("art_forms", [])) == 6
    print(" [PASS] GET /api/art-forms -> 6 traditional arts returned")

    # 6. Test GET /api/teachers with filters
    status, data = simulate_request("/api/teachers", query_string="teaching_mode=online")
    assert "200" in status, f"Teachers API failed: {status}"
    assert len(data.get("teachers", [])) >= 1
    print(f" [PASS] GET /api/teachers (online filter) -> {len(data['teachers'])} teachers returned")

    # 7. Test POST /api/match (AI Teacher Matcher)
    status, data = simulate_request("/api/match", method="POST", body={
        "art_form_id": 1,
        "location": "Pune",
        "skill_level": "Beginner",
        "teaching_mode": "Online",
        "availability": "Weekends"
    })
    assert "200" in status, f"Matcher failed: {status}"
    assert data["matches_count"] > 0
    top_match = data["recommendations"][0]
    print(f" [PASS] POST /api/match -> Top Match: {top_match['teacher']['name']} ({top_match['match_badge']})")

    # 8. Test GET /api/quiz/1
    status, data = simulate_request("/api/quiz/1")
    assert "200" in status, f"Quiz GET failed: {status}"
    questions = data.get("questions", [])
    assert len(questions) >= 3
    print(f" [PASS] GET /api/quiz/1 -> {len(questions)} quiz questions returned")

    # 9. Test POST /api/quiz/submit
    answers = {str(questions[0]["id"]): questions[0]["correct_option"]}
    status, data = simulate_request("/api/quiz/submit", method="POST", body={
        "heritage_id": 1,
        "answers": answers
    })
    assert "200" in status, f"Quiz submit failed: {status}"
    assert "Score" in data["score_summary"]
    print(f" [PASS] POST /api/quiz/submit -> Result: {data['score_summary']}")

    # 10. Test GET /api/passport
    status, data = simulate_request("/api/passport")
    assert "200" in status, f"Passport failed: {status}"
    assert "stats" in data
    assert len(data.get("badges", [])) == 4
    print(f" [PASS] GET /api/passport -> User stats & {len(data['badges'])} badges verified")

    # 11. Test Static files
    status, data = simulate_request("/static/images/virasetu_logo.svg")
    assert "200" in status, f"Logo static asset failed: {status}"
    print(" [PASS] GET /static/images/virasetu_logo.svg -> 200 OK")

    status, data = simulate_request("/")
    assert "200" in status, f"SPA root failed: {status}"
    assert "VIRASETU" in str(data)
    print(" [PASS] GET / -> Virasetu Single Page Application served (200 OK)")

    print("==================================================")
    print(" ALL 11 VERIFICATION TESTS PASSED SUCCESSFULLY!   ")
    print("==================================================")

if __name__ == "__main__":
    run_tests()
