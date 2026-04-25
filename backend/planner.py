from __future__ import annotations

import json
import os
import urllib.error
import urllib.request
from typing import Any

from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_APIKEY") or os.getenv("OPENROUTER_API_KEY") or ""
OPENROUTER_BASE_URL = os.getenv("OPENROUTER_BASEURL") or os.getenv("OPENROUTER_BASE_URL") or "https://openrouter.ai/api/v1"
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL") or "openai/gpt-4o-mini"


def get_bmi(height_cm: float | None, weight_kg: float | None) -> float | None:
    if not height_cm or not weight_kg or height_cm <= 0 or weight_kg <= 0:
        return None
    return round(weight_kg / ((height_cm / 100) ** 2), 1)


def get_bmi_category(bmi: float | None) -> str:
    if bmi is None:
        return "Chưa đủ dữ liệu"
    if bmi < 18.5:
        return "Thiếu cân"
    if bmi < 23:
        return "Cân đối"
    if bmi < 25:
        return "Hơi thừa cân"
    return "Thừa cân"


def get_profile_plan(user: dict[str, Any]) -> str:
    bmi = get_bmi(user.get("heightCm"), user.get("weightKg"))
    category = get_bmi_category(bmi)
    base_plan = user.get("plan") or "Tăng sức mạnh nền tảng"

    if category == "Thiếu cân":
        return f"{base_plan}: ưu tiên hypertrophy, ăn đủ năng lượng và tăng tải chậm."
    if category in {"Hơi thừa cân", "Thừa cân"}:
        return f"{base_plan}: kết hợp strength toàn thân, cardio vừa phải và kiểm soát phục hồi."
    if category == "Cân đối":
        return f"{base_plan}: cân bằng sức mạnh, cơ bắp và kỹ thuật."
    return f"{base_plan}: cập nhật chiều cao/cân nặng để cá nhân hóa BMI."


def normalize_plan(plan: dict[str, Any], source: str) -> dict[str, Any]:
    exercises = [
        {
            "name": str(item.get("name") or "Bài tập").strip(),
            "sets": str(item.get("sets") or "3").strip(),
            "reps": str(item.get("reps") or "8-10").strip(),
            "rest": str(item.get("rest") or "60 giây").strip(),
            "cue": str(item.get("cue") or "Giữ kỹ thuật ổn định, dừng lại nếu form xấu đi.").strip(),
        }
        for item in plan.get("exercises", [])
        if item.get("name")
    ][:6]
    if not exercises:
        exercises = build_rule_based_plan("Tập toàn thân", {})["exercises"]

    tips = [
        {
            "title": str(item.get("title") or "Mẹo tập").strip(),
            "body": str(item.get("body") or "Giữ nhịp thở đều và kiểm soát tempo.").strip(),
            "category": item.get("category") if item.get("category") in {"training", "execution", "recovery"} else "training",
        }
        for item in plan.get("tips", [])
        if item.get("title") and item.get("body")
    ][:4]
    if len(tips) < 3:
        tips = default_tips()

    return {
        "title": str(plan.get("title") or "Buổi tập cá nhân hóa").strip(),
        "summary": str(plan.get("summary") or "Buổi tập vừa sức, ưu tiên kỹ thuật và tiến bộ ổn định.").strip(),
        "focus": str(plan.get("focus") or "Toàn thân").strip(),
        "durationMinutes": int(plan.get("durationMinutes") or 45),
        "difficulty": str(plan.get("difficulty") or "Cơ bản").strip(),
        "warmup": [str(item).strip() for item in plan.get("warmup", []) if str(item).strip()] or [
            "Đi bộ nhanh 5 phút",
            "Xoay khớp vai, hông, gối trong 3 phút",
            "Làm 1-2 set nhẹ trước bài chính",
        ],
        "exercises": exercises,
        "tips": tips,
        "recovery": [str(item).strip() for item in plan.get("recovery", []) if str(item).strip()] or [
            "Uống nước sau buổi tập.",
            "Ăn một bữa có protein trong 2 giờ sau tập.",
            "Ngủ đủ để phục hồi tốt hơn.",
        ],
        "note": "Được tạo bởi OpenRouter." if source == "openrouter" else "Được tạo bởi planner nội bộ dựa trên hồ sơ của bạn.",
        "source": source,
    }


def default_tips() -> list[dict[str, str]]:
    return [
        {
            "title": "Chừa 2 reps dự phòng",
            "body": "Ở các set đầu, dừng khi bạn còn khoảng 2 reps tốt để giữ chất lượng cả buổi.",
            "category": "training",
        },
        {
            "title": "Tempo ổn định",
            "body": "Hạ tạ có kiểm soát, không giật tạ để lấy đà.",
            "category": "execution",
        },
        {
            "title": "Phục hồi ngay sau tập",
            "body": "Đi bộ nhẹ 5-10 phút và bổ sung nước để giảm mỏi cơ.",
            "category": "recovery",
        },
    ]


def build_rule_based_plan(goal: str, user: dict[str, Any]) -> dict[str, Any]:
    normalized_goal = goal.lower()
    if "push" in normalized_goal or "ngực" in normalized_goal or "vai" in normalized_goal:
        focus = "Push: ngực, vai, tay sau"
        exercises = [
            {"name": "Incline dumbbell press", "sets": "3", "reps": "8-10", "rest": "75 giây", "cue": "Hạ tạ chậm, giữ vai ổn định."},
            {"name": "Seated shoulder press", "sets": "3", "reps": "8-10", "rest": "75 giây", "cue": "Siết bụng, không ưỡn lưng quá mức."},
            {"name": "Cable lateral raise", "sets": "2", "reps": "12-15", "rest": "45 giây", "cue": "Nâng bằng vai, không vung người."},
            {"name": "Triceps rope pushdown", "sets": "2", "reps": "10-12", "rest": "45 giây", "cue": "Giữ khuỷu tay cố định."},
        ]
    elif "pull" in normalized_goal or "lưng" in normalized_goal or "xô" in normalized_goal:
        focus = "Pull: lưng, xô, tay trước"
        exercises = [
            {"name": "Lat pulldown", "sets": "3", "reps": "8-10", "rest": "75 giây", "cue": "Kéo khuỷu tay xuống, không rướn cổ."},
            {"name": "Chest-supported row", "sets": "3", "reps": "10-12", "rest": "75 giây", "cue": "Dừng nhẹ ở cuối biên độ kéo."},
            {"name": "Face pull", "sets": "2", "reps": "12-15", "rest": "45 giây", "cue": "Kéo về ngang mặt, giữ vai sau hoạt động."},
            {"name": "Dumbbell curl", "sets": "2", "reps": "10-12", "rest": "45 giây", "cue": "Không đung đưa thân người."},
        ]
    elif "leg" in normalized_goal or "chân" in normalized_goal or "đùi" in normalized_goal:
        focus = "Lower body"
        exercises = [
            {"name": "Goblet squat", "sets": "3", "reps": "8-10", "rest": "75 giây", "cue": "Đạp đều cả bàn chân, giữ ngực mở."},
            {"name": "Romanian deadlift", "sets": "3", "reps": "8-10", "rest": "90 giây", "cue": "Đẩy hông ra sau, giữ lưng trung lập."},
            {"name": "Leg press", "sets": "2", "reps": "10-12", "rest": "75 giây", "cue": "Không khóa gối ở đỉnh."},
            {"name": "Standing calf raise", "sets": "2", "reps": "12-15", "rest": "45 giây", "cue": "Dừng ngắn ở vị trí cao nhất."},
        ]
    else:
        focus = "Toàn thân"
        exercises = [
            {"name": "Goblet squat", "sets": "3", "reps": "8-10", "rest": "75 giây", "cue": "Giữ thân người chắc và xuống trong tầm kiểm soát."},
            {"name": "Dumbbell bench press", "sets": "3", "reps": "8-10", "rest": "75 giây", "cue": "Hạ tạ đều hai bên."},
            {"name": "Seated cable row", "sets": "3", "reps": "10-12", "rest": "75 giây", "cue": "Kéo bằng lưng, không giật người."},
            {"name": "Plank", "sets": "2", "reps": "30-45 giây", "rest": "45 giây", "cue": "Siết bụng, giữ hông ngang."},
        ]

    return normalize_plan(
        {
            "title": f"{focus} vừa sức",
            "summary": f"Kế hoạch phù hợp với mục tiêu '{goal}' và hồ sơ hiện tại. Cường độ vừa phải, không try hard.",
            "focus": focus,
            "durationMinutes": 40,
            "difficulty": "Cơ bản",
            "warmup": ["Đi bộ nhanh 5 phút", "Xoay khớp toàn thân 3 phút", "Làm 1 set nhẹ cho bài đầu tiên"],
            "exercises": exercises,
            "tips": default_tips(),
            "recovery": ["Uống nước sau tập.", "Giãn nhẹ nhóm cơ chính 3-5 phút.", "Theo dõi mức mỏi vào ngày mai."],
        },
        "rule_based",
    )


def parse_json_payload(content: str) -> dict[str, Any]:
    cleaned = content.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
    start = cleaned.find("{")
    end = cleaned.rfind("}")
    if start >= 0 and end > start:
        cleaned = cleaned[start : end + 1]
    return json.loads(cleaned)


def request_openrouter(goal: str, user: dict[str, Any]) -> dict[str, Any]:
    prompt = "\n".join(
        [
            "Tạo một kế hoạch tập gym thực tế bằng tiếng Việt.",
            f"Mục tiêu người dùng: {goal}",
            f"Hồ sơ: {get_profile_plan(user)}",
            "Trả về JSON đúng shape:",
            '{"title":"","summary":"","focus":"","durationMinutes":0,"difficulty":"","warmup":[""],"exercises":[{"name":"","sets":"","reps":"","rest":"","cue":""}],"tips":[{"title":"","body":"","category":"training"}],"recovery":[""],"note":""}',
            "Yêu cầu: 4-6 bài, sets/reps vừa sức, có tips training/execution/recovery, không dùng Markdown.",
        ]
    )
    payload = {
        "model": OPENROUTER_MODEL,
        "messages": [
            {"role": "system", "content": "Bạn là strength coach. Chỉ trả JSON hợp lệ bằng tiếng Việt."},
            {"role": "user", "content": prompt},
        ],
        "temperature": 0.7,
        "response_format": {"type": "json_object"},
    }
    request = urllib.request.Request(
        f"{OPENROUTER_BASE_URL.rstrip('/')}/chat/completions",
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://gymbuddy.app",
            "X-Title": "Gym Buddy",
        },
        method="POST",
    )
    with urllib.request.urlopen(request, timeout=25) as response:
        data = json.loads(response.read().decode("utf-8"))
    content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
    return normalize_plan(parse_json_payload(content), "openrouter")


def generate_workout_plan(goal: str, user: dict[str, Any]) -> dict[str, Any]:
    if OPENROUTER_API_KEY:
        try:
            return request_openrouter(goal, user)
        except (urllib.error.URLError, TimeoutError, ValueError, KeyError, json.JSONDecodeError):
            pass
    return build_rule_based_plan(goal, user)


def build_single_exercise_plan(exercise: dict[str, Any]) -> dict[str, Any]:
    name = exercise.get("name") or "Bài tập"
    return normalize_plan(
        {
            "title": f"Tập ngay: {name}",
            "summary": "Task nhanh cho một bài tập, cường độ cơ bản và dễ kiểm soát.",
            "focus": exercise.get("body_part") or exercise.get("target") or "Kỹ thuật",
            "durationMinutes": 15,
            "difficulty": "Cơ bản",
            "warmup": ["Khởi động khớp liên quan 3 phút", "Làm 1 set rất nhẹ để làm quen chuyển động"],
            "exercises": [
                {
                    "name": name,
                    "sets": "3",
                    "reps": "8-10",
                    "rest": "60 giây",
                    "cue": "Giữ form sạch, dừng trước khi kỹ thuật xấu đi.",
                }
            ],
            "tips": default_tips(),
            "recovery": ["Thả lỏng nhóm cơ vừa tập.", "Ghi lại cảm giác RPE sau bài."],
        },
        "exercise_task",
    )
