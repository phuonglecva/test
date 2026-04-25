from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path
from typing import Annotated, Any

from fastapi import Depends, FastAPI, Header, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from .db import get_connection, hash_password, initialize_database, now_iso, row_to_user, verify_password
from .planner import build_single_exercise_plan, generate_workout_plan, get_bmi, get_bmi_category, get_profile_plan

ROOT_DIR = Path(__file__).resolve().parents[1]
EXERCISES_PATH = ROOT_DIR / "dataset" / "data" / "exercises.json"

app = FastAPI(title="Gym Buddy API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

initialize_database()


class RegisterRequest(BaseModel):
    email: str = Field(min_length=3, max_length=160)
    password: str = Field(min_length=6)
    name: str = Field(min_length=1, max_length=80)


class LoginRequest(BaseModel):
    email: str = Field(min_length=3, max_length=160)
    password: str


class OnboardingRequest(BaseModel):
    name: str = Field(min_length=1, max_length=80)
    title: str = Field(min_length=1, max_length=120)
    gym: str = Field(min_length=1, max_length=120)
    plan: str = Field(min_length=1, max_length=120)
    weeklyGoal: int = Field(ge=1, le=14)
    heightCm: float | None = Field(default=None, ge=80, le=240)
    weightKg: float | None = Field(default=None, ge=25, le=300)
    gender: str = Field(default="other", pattern="^(male|female|other)$")


class WorkoutLogRequest(BaseModel):
    title: str = Field(min_length=1, max_length=160)
    focus: str | None = None
    durationSeconds: int = Field(default=0, ge=0)
    calories: int = Field(default=0, ge=0)
    completedExercises: int = Field(default=0, ge=0)
    totalExercises: int = Field(default=0, ge=0)
    exercises: list[dict[str, Any]] = Field(default_factory=list)
    startedAt: str | None = None


class GenerateWorkoutRequest(BaseModel):
    goal: str = Field(min_length=1, max_length=500)


def create_session(user_id: int) -> str:
    token = secrets_token()
    with get_connection() as connection:
        connection.execute(
            "insert into sessions (token, user_id, created_at) values (?, ?, ?)",
            (token, user_id, now_iso()),
        )
    return token


def secrets_token() -> str:
    import secrets

    return secrets.token_urlsafe(32)


def get_current_user(authorization: Annotated[str | None, Header()] = None) -> dict[str, Any]:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing auth token")

    token = authorization.removeprefix("Bearer ").strip()
    with get_connection() as connection:
        row = connection.execute(
            """
            select users.*
            from sessions
            join users on users.id = sessions.user_id
            where sessions.token = ?
            """,
            (token,),
        ).fetchone()

    if not row:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid auth token")

    return row_to_user(row)


def count_weekly_workouts(user_id: int) -> int:
    with get_connection() as connection:
        row = connection.execute(
            """
            select count(*) as count
            from workout_logs
            where user_id = ?
              and date(finished_at) >= date('now', '-6 days')
            """,
            (user_id,),
        ).fetchone()
    return int(row["count"] if row else 0)


def get_logs_for_last_week(user_id: int) -> list[dict[str, Any]]:
    with get_connection() as connection:
        rows = connection.execute(
            """
            select date(finished_at) as day,
                   sum(duration_seconds) as duration_seconds,
                   sum(calories) as calories,
                   sum(completed_exercises) as completed_exercises,
                   count(*) as sessions
            from workout_logs
            where user_id = ?
              and date(finished_at) >= date('now', '-6 days')
            group by date(finished_at)
            """,
            (user_id,),
        ).fetchall()
    return [dict(row) for row in rows]


def get_recent_workout_logs(user_id: int, limit: int = 10) -> list[dict[str, Any]]:
    with get_connection() as connection:
        rows = connection.execute(
            """
            select *
            from workout_logs
            where user_id = ?
            order by finished_at desc
            limit ?
            """,
            (user_id, limit),
        ).fetchall()

    return [
        {
            "id": row["id"],
            "title": row["title"],
            "focus": row["focus"],
            "durationSeconds": row["duration_seconds"],
            "calories": row["calories"],
            "completedExercises": row["completed_exercises"],
            "totalExercises": row["total_exercises"],
            "startedAt": row["started_at"],
            "finishedAt": row["finished_at"],
            "exercises": json.loads(row["exercises_json"]),
        }
        for row in rows
    ]


def build_app_data_for_user(user: dict[str, Any]) -> dict[str, Any]:
    logs = get_recent_workout_logs(user["id"])
    weekly_done = count_weekly_workouts(user["id"])
    total_calories = sum(log["calories"] for log in logs)
    total_exercises = sum(log["completedExercises"] for log in logs)
    total_duration = sum(log["durationSeconds"] for log in logs)
    weekly_rows = get_logs_for_last_week(user["id"])
    weekly_by_day = {row["day"]: row for row in weekly_rows}
    week_labels = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"]
    with get_connection() as connection:
        week_dates = [
            connection.execute("select date('now', ?) as day", (f"-{6 - index} days",)).fetchone()["day"]
            for index in range(7)
        ]

    bmi = get_bmi(user.get("heightCm"), user.get("weightKg"))
    plan_recommendation = get_profile_plan(user)
    latest_log = logs[0] if logs else None
    recommended_workouts = build_recommended_workouts(user)

    return {
        "user": {
        "name": user["name"],
        "title": user["title"],
        "gym": user["gym"],
        "plan": plan_recommendation,
        "avatar": user["avatar"],
        "readiness": user["readiness"],
        "streakDays": weekly_done,
        "weeklyGoal": user["weeklyGoal"],
        "weeklyDone": weekly_done,
        "hasSeenOnboarding": user["hasSeenOnboarding"],
        "email": user["email"],
        "heightCm": user.get("heightCm"),
        "weightKg": user.get("weightKg"),
        "gender": user.get("gender"),
        "bmi": bmi,
        "bmiCategory": get_bmi_category(bmi),
        "planRecommendation": plan_recommendation,
        },
        "metrics": [
            {"id": "duration", "label": "Thời gian tập", "value": str(round(total_duration / 60)), "unit": "phút", "delta": f"{total_exercises} bài"},
            {"id": "calories", "label": "Calories", "value": str(total_calories), "unit": "kcal", "delta": f"{len(logs)} buổi"},
            {"id": "weekly", "label": "Tuần này", "value": str(weekly_done), "unit": "buổi", "delta": f"/ {user['weeklyGoal']}"},
        ],
        "recommendedWorkouts": recommended_workouts,
        "todayPlan": build_today_plan(latest_log),
        "aiSuggestions": build_suggestions(user, logs, bmi),
        "progressWeeks": [
            {
                "label": week_labels[index],
                "volume": round((weekly_by_day.get(day, {}).get("duration_seconds") or 0) / 60, 1),
            }
            for index, day in enumerate(week_dates)
        ],
        "personalRecords": build_personal_records(logs),
        "connections": build_connections(),
        "badges": build_badges(weekly_done, logs),
        "workoutLogs": logs,
    }


def build_recommended_workouts(user: dict[str, Any]) -> list[dict[str, Any]]:
    bmi = get_bmi(user.get("heightCm"), user.get("weightKg"))
    needs_cardio = bmi is not None and bmi >= 23
    base = [
        ("strength-base", "Sức mạnh nền tảng", "Toàn thân vừa sức, ưu tiên kỹ thuật.", "Toàn thân", 40, 4, 180, "neon", "0003"),
        ("upper-control", "Upper body kiểm soát", "Ngực, lưng, vai với volume cơ bản.", "Upper body", 38, 4, 165, "orange", "0025"),
        ("lower-stability", "Lower body ổn định", "Squat, hinge và core nhẹ.", "Lower body", 42, 4, 190, "neon", "0020"),
    ]
    if needs_cardio:
        base.insert(1, ("metabolic-light", "Cardio + strength nhẹ", "Nhịp tim vừa phải, không ép cường độ.", "Conditioning", 35, 4, 220, "orange", "0017"))
    return [
        {
            "id": item[0],
            "title": item[1],
            "subtitle": item[2],
            "focus": item[3],
            "minutes": item[4],
            "exercises": item[5],
            "calories": item[6],
            "progress": min(0.95, max(0.35, user["weeklyGoal"] / 7)),
            "accent": item[7],
            "imageId": item[8],
        }
        for item in base[:4]
    ]


def build_today_plan(latest_log: dict[str, Any] | None) -> list[dict[str, str]]:
    if latest_log:
        return [
            {
                "id": f"next-{index}",
                "name": str(item.get("name") or "Bài tập"),
                "sets": str(item.get("sets") or "3"),
                "load": "Vừa sức",
                "rest": str(item.get("rest") or "60 giây"),
                "status": "Gợi ý lại" if item.get("completed") else "Chưa xong",
            }
            for index, item in enumerate(latest_log.get("exercises", [])[:3])
        ]
    return [
        {"id": "starter-1", "name": "Goblet squat", "sets": "3 x 8-10", "load": "Nhẹ-vừa", "rest": "60 giây", "status": "Sẵn sàng"},
        {"id": "starter-2", "name": "Dumbbell bench press", "sets": "3 x 8-10", "load": "Nhẹ-vừa", "rest": "60 giây", "status": "Sẵn sàng"},
        {"id": "starter-3", "name": "Seated cable row", "sets": "3 x 10-12", "load": "Nhẹ-vừa", "rest": "60 giây", "status": "Sẵn sàng"},
    ]


def build_suggestions(user: dict[str, Any], logs: list[dict[str, Any]], bmi: float | None) -> list[dict[str, str]]:
    suggestions = [
        {
            "id": "consistency",
            "title": "Ưu tiên hoàn thành lịch tuần",
            "body": f"Bạn đã hoàn thành {count_weekly_workouts(user['id'])}/{user['weeklyGoal']} buổi. Giữ cường độ vừa phải để duy trì đều.",
            "confidence": "Từ dữ liệu tập",
        },
        {
            "id": "technique",
            "title": "Giữ mức gắng sức an toàn",
            "body": "Dừng mỗi set khi còn khoảng 1-2 reps tốt. Đây là ngưỡng đủ hiệu quả mà không quá tải.",
            "confidence": "Khuyến nghị",
        },
    ]
    if bmi is not None:
        suggestions.append(
            {
                "id": "bmi-plan",
                "title": f"BMI hiện tại: {bmi}",
                "body": get_profile_plan(user),
                "confidence": "BMI",
            }
        )
    if logs:
        suggestions.append(
            {
                "id": "last-session",
                "title": "Dựa trên buổi gần nhất",
                "body": f"Buổi gần nhất hoàn thành {logs[0]['completedExercises']}/{logs[0]['totalExercises']} bài trong {round(logs[0]['durationSeconds'] / 60)} phút.",
                "confidence": "Log mới",
            }
        )
    return suggestions[:3]


def build_personal_records(logs: list[dict[str, Any]]) -> list[dict[str, str]]:
    if not logs:
        return []
    longest = max(logs, key=lambda log: log["durationSeconds"])
    most_exercises = max(logs, key=lambda log: log["completedExercises"])
    best_calories = max(logs, key=lambda log: log["calories"])
    return [
        {"id": "longest", "lift": "Buổi dài nhất", "value": f"{round(longest['durationSeconds'] / 60)} phút", "delta": longest["title"]},
        {"id": "most-exercises", "lift": "Nhiều bài nhất", "value": f"{most_exercises['completedExercises']} bài", "delta": most_exercises["title"]},
        {"id": "calories", "lift": "Calories cao nhất", "value": f"{best_calories['calories']} kcal", "delta": best_calories["title"]},
    ]


def build_connections() -> list[dict[str, str]]:
    from .planner import OPENROUTER_API_KEY

    return [
        {"id": "backend", "name": "SQLite backend", "status": "Đang hoạt động", "detail": "Auth, profile và workout logs đang lưu vào SQLite."},
        {"id": "ai", "name": "OpenRouter coach", "status": "Đã cấu hình" if OPENROUTER_API_KEY else "Planner nội bộ", "detail": "Workout generation chạy ở backend."},
    ]


def build_badges(weekly_done: int, logs: list[dict[str, Any]]) -> list[str]:
    badges: list[str] = []
    if weekly_done:
        badges.append(f"{weekly_done} buổi tuần này")
    if len(logs) >= 5:
        badges.append("5 workout logs")
    if any(log["completedExercises"] == log["totalExercises"] and log["totalExercises"] > 0 for log in logs):
        badges.append("Hoàn thành trọn buổi")
    return badges


@lru_cache(maxsize=1)
def load_exercises() -> list[dict[str, Any]]:
    with EXERCISES_PATH.open("r", encoding="utf-8") as file:
        return json.load(file)


def exercise_matches_query(exercise: dict[str, Any], query: str) -> bool:
    normalized = query.strip().lower()
    if not normalized:
        return True

    fields = [
        exercise.get("id"),
        exercise.get("name"),
        exercise.get("category"),
        exercise.get("body_part"),
        exercise.get("equipment"),
        exercise.get("target"),
    ]
    muscles = exercise.get("secondary_muscles") or []
    values = [str(value).lower() for value in fields if value]
    values.extend(str(muscle).lower() for muscle in muscles)
    return any(normalized in value for value in values)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/auth/register")
def register(payload: RegisterRequest) -> dict[str, Any]:
    avatar = payload.name.strip()[:1].upper() or "U"
    try:
        with get_connection() as connection:
            cursor = connection.execute(
                """
                insert into users (email, password_hash, name, avatar, created_at)
                values (?, ?, ?, ?, ?)
                """,
                (payload.email.lower(), hash_password(payload.password), payload.name.strip(), avatar, now_iso()),
            )
            user_id = int(cursor.lastrowid)
            row = connection.execute("select * from users where id = ?", (user_id,)).fetchone()
    except Exception as exc:
        if "unique" in str(exc).lower():
            raise HTTPException(status_code=409, detail="Email already registered") from exc
        raise

    token = create_session(user_id)
    return {"token": token, "user": row_to_user(row)}


@app.post("/auth/login")
def login(payload: LoginRequest) -> dict[str, Any]:
    with get_connection() as connection:
        row = connection.execute("select * from users where email = ?", (payload.email.lower(),)).fetchone()

    if not row or not verify_password(payload.password, row["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_session(row["id"])
    return {"token": token, "user": row_to_user(row)}


@app.get("/me")
def me(user: Annotated[dict[str, Any], Depends(get_current_user)]) -> dict[str, Any]:
    return {"user": user}


@app.patch("/me/onboarding")
def save_onboarding(
    payload: OnboardingRequest,
    user: Annotated[dict[str, Any], Depends(get_current_user)],
) -> dict[str, Any]:
    avatar = payload.name.strip()[:1].upper() or user["avatar"]
    with get_connection() as connection:
        row = connection.execute(
            """
            update users
            set name = ?, title = ?, gym = ?, plan = ?, weekly_goal = ?, avatar = ?,
                height_cm = ?, weight_kg = ?, gender = ?, has_seen_onboarding = 1
            where id = ?
            returning *
            """,
            (
                payload.name.strip(),
                payload.title.strip(),
                payload.gym.strip(),
                payload.plan.strip(),
                payload.weeklyGoal,
                avatar,
                payload.heightCm,
                payload.weightKg,
                payload.gender,
                user["id"],
            ),
        ).fetchone()
    return {"user": row_to_user(row)}


@app.get("/app-data")
def get_app_data(user: Annotated[dict[str, Any], Depends(get_current_user)]) -> dict[str, Any]:
    return build_app_data_for_user(user)


@app.get("/workout-logs")
def list_workout_logs(user: Annotated[dict[str, Any], Depends(get_current_user)]) -> list[dict[str, Any]]:
    return get_recent_workout_logs(user["id"], limit=50)


@app.post("/workout-logs")
def create_workout_log(
    payload: WorkoutLogRequest,
    user: Annotated[dict[str, Any], Depends(get_current_user)],
) -> dict[str, Any]:
    with get_connection() as connection:
        row = connection.execute(
            """
            insert into workout_logs (
              user_id, title, focus, duration_seconds, calories, completed_exercises,
              total_exercises, exercises_json, started_at, finished_at
            )
            values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            returning *
            """,
            (
                user["id"],
                payload.title,
                payload.focus,
                payload.durationSeconds,
                payload.calories,
                payload.completedExercises,
                payload.totalExercises,
                json.dumps(payload.exercises),
                payload.startedAt,
                now_iso(),
            ),
        ).fetchone()

    return get_recent_workout_logs(user["id"], limit=1)[0] if row else {}


@app.get("/workouts")
def get_workouts(user: Annotated[dict[str, Any], Depends(get_current_user)]) -> list[dict[str, Any]]:
    return build_recommended_workouts(user)


@app.get("/workouts/{workout_id}")
def get_workout(workout_id: str, user: Annotated[dict[str, Any], Depends(get_current_user)]) -> dict[str, Any]:
    for workout in build_recommended_workouts(user):
        if workout["id"] == workout_id:
            plan = generate_workout_plan(workout["title"], user)
            return {
                "workout": workout,
                "todayPlan": [
                    {
                        "id": f"plan-{index}",
                        "name": item["name"],
                        "sets": f"{item['sets']} x {item['reps']}",
                        "load": "Vừa sức",
                        "rest": item["rest"],
                        "status": "Sẵn sàng",
                    }
                    for index, item in enumerate(plan["exercises"])
                ],
            }
    raise HTTPException(status_code=404, detail="Workout not found")


@app.post("/workouts/generate")
def generate_workout(
    payload: GenerateWorkoutRequest,
    user: Annotated[dict[str, Any], Depends(get_current_user)],
) -> dict[str, Any]:
    return {"plan": generate_workout_plan(payload.goal, user)}


@app.post("/exercises/{exercise_id}/task")
def create_exercise_task(
    exercise_id: str,
    user: Annotated[dict[str, Any], Depends(get_current_user)],
) -> dict[str, Any]:
    del user
    for exercise in load_exercises():
        if exercise.get("id") == exercise_id:
            return {"plan": build_single_exercise_plan(exercise)}
    raise HTTPException(status_code=404, detail="Exercise not found")


@app.get("/exercises")
def get_exercises(
    q: str = "",
    body_part: str | None = None,
    limit: int = Query(default=50, ge=1, le=500),
) -> dict[str, Any]:
    exercises = load_exercises()
    filtered = [exercise for exercise in exercises if exercise_matches_query(exercise, q)]

    if body_part and body_part != "all":
        filtered = [exercise for exercise in filtered if exercise.get("body_part") == body_part]

    return {
        "items": filtered[:limit],
        "total": len(filtered),
        "bodyParts": sorted({exercise.get("body_part") for exercise in exercises if exercise.get("body_part")}),
    }


@app.get("/exercises/{exercise_id}")
def get_exercise(exercise_id: str) -> dict[str, Any]:
    for exercise in load_exercises():
        if exercise.get("id") == exercise_id:
            return exercise
    raise HTTPException(status_code=404, detail="Exercise not found")
