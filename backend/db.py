from __future__ import annotations

import secrets
import sqlite3
from datetime import datetime, timezone
from hashlib import pbkdf2_hmac
from pathlib import Path
from typing import Any

ROOT_DIR = Path(__file__).resolve().parents[1]
DB_PATH = ROOT_DIR / "backend" / "buddy.sqlite3"


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def get_connection() -> sqlite3.Connection:
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def initialize_database() -> None:
    with get_connection() as connection:
        connection.executescript(
            """
            create table if not exists users (
              id integer primary key autoincrement,
              email text not null unique,
              password_hash text not null,
              name text not null,
              title text not null default 'Intermediate lifter',
              gym text not null default 'District 1 Strength Lab',
              plan text not null default 'Hypertrophy focus',
              avatar text not null default 'S',
              readiness integer not null default 92,
              weekly_goal integer not null default 5,
              height_cm real,
              weight_kg real,
              gender text not null default 'other',
              has_seen_onboarding integer not null default 0,
              created_at text not null
            );

            create table if not exists sessions (
              token text primary key,
              user_id integer not null references users(id) on delete cascade,
              created_at text not null
            );

            create table if not exists workout_logs (
              id integer primary key autoincrement,
              user_id integer not null references users(id) on delete cascade,
              title text not null,
              focus text,
              duration_seconds integer not null default 0,
              calories integer not null default 0,
              completed_exercises integer not null default 0,
              total_exercises integer not null default 0,
              exercises_json text not null,
              started_at text,
              finished_at text not null
            );
            """
        )
        existing_columns = {
            row["name"]
            for row in connection.execute("pragma table_info(users)").fetchall()
        }
        migrations = {
            "height_cm": "alter table users add column height_cm real",
            "weight_kg": "alter table users add column weight_kg real",
            "gender": "alter table users add column gender text not null default 'other'",
        }
        for column_name, statement in migrations.items():
            if column_name not in existing_columns:
                connection.execute(statement)


def hash_password(password: str, salt: str | None = None) -> str:
    password_salt = salt or secrets.token_hex(16)
    digest = pbkdf2_hmac("sha256", password.encode("utf-8"), password_salt.encode("utf-8"), 120_000)
    return f"{password_salt}${digest.hex()}"


def verify_password(password: str, password_hash: str) -> bool:
    salt, _ = password_hash.split("$", 1)
    return hash_password(password, salt) == password_hash


def row_to_user(row: sqlite3.Row) -> dict[str, Any]:
    return {
        "id": row["id"],
        "email": row["email"],
        "name": row["name"],
        "title": row["title"],
        "gym": row["gym"],
        "plan": row["plan"],
        "avatar": row["avatar"],
        "readiness": row["readiness"],
        "weeklyGoal": row["weekly_goal"],
        "heightCm": row["height_cm"],
        "weightKg": row["weight_kg"],
        "gender": row["gender"],
        "hasSeenOnboarding": bool(row["has_seen_onboarding"]),
    }
