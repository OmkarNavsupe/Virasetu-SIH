-- Virasetu SQLite Database Schema

CREATE TABLE IF NOT EXISTS heritage_sites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    state TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    history TEXT NOT NULL,
    architecture TEXT NOT NULL,
    historical_importance TEXT NOT NULL,
    famous_events TEXT NOT NULL,
    interesting_facts TEXT NOT NULL,
    image_url TEXT NOT NULL,
    built_by TEXT,
    built_year TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS traditional_arts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    origin TEXT NOT NULL,
    short_description TEXT NOT NULL,
    about TEXT NOT NULL,
    cultural_importance TEXT NOT NULL,
    current_status TEXT NOT NULL,
    traditional_methods TEXT NOT NULL,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS teachers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    art_form_id INTEGER NOT NULL,
    experience_years INTEGER NOT NULL,
    location TEXT NOT NULL,
    teaching_mode TEXT NOT NULL, -- Online, Offline, Hybrid
    languages TEXT NOT NULL,
    rating REAL DEFAULT 4.8,
    reviews_count INTEGER DEFAULT 12,
    about TEXT NOT NULL,
    availability TEXT NOT NULL,
    email TEXT NOT NULL,
    photo_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(art_form_id) REFERENCES traditional_arts(id)
);

CREATE TABLE IF NOT EXISTS quizzes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    heritage_id INTEGER NOT NULL,
    question TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_option TEXT NOT NULL, -- 'A', 'B', 'C', 'D'
    explanation TEXT NOT NULL,
    FOREIGN KEY(heritage_id) REFERENCES heritage_sites(id)
);

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS passport_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    entry_type TEXT NOT NULL, -- 'site_explored', 'art_explored', 'quiz_completed', 'saved_site', 'saved_art'
    item_id INTEGER NOT NULL,
    item_name TEXT NOT NULL,
    extra_data TEXT, -- score, notes
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS teacher_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    teacher_id INTEGER NOT NULL,
    teacher_name TEXT NOT NULL,
    art_form TEXT NOT NULL,
    student_name TEXT NOT NULL,
    student_email TEXT NOT NULL,
    learning_mode TEXT NOT NULL,
    preferred_timing TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(teacher_id) REFERENCES teachers(id)
);
