import ast
import json
import logging
import os
import re
import shutil
import subprocess
import tempfile
import time
from collections import defaultdict, deque

from flask import Flask, jsonify, request
from flask_cors import CORS
from groq import Groq


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.config["DEV_ERROR_DETAILS"] = os.getenv("DEV_ERROR_DETAILS", "true").lower() == "true"


def load_local_env():
    env_path = os.path.join(os.path.dirname(__file__), ".env")
    if not os.path.exists(env_path):
        return

    with open(env_path, "r", encoding="utf-8") as env_file:
        for raw_line in env_file:
            line = raw_line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue

            key, value = line.split("=", 1)
            os.environ.setdefault(key.strip(), value.strip())


load_local_env()

MAX_PROMPT_LENGTH = 8000
MAX_ATTACHMENTS = 5
MAX_ATTACHMENT_TEXT_LENGTH = 5000
MAX_TOTAL_ATTACHMENT_TEXT_LENGTH = 16000
DEFAULT_MODEL = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")
VISION_MODEL = os.getenv("GROQ_VISION_MODEL", "meta-llama/llama-4-scout-17b-16e-instruct")
DEFAULT_TEMPERATURE = float(os.getenv("GROQ_TEMPERATURE", "0.25"))
RATE_LIMIT_WINDOW_SECONDS = int(os.getenv("RATE_LIMIT_WINDOW_SECONDS", "60"))
RATE_LIMIT_MAX_REQUESTS = int(os.getenv("RATE_LIMIT_MAX_REQUESTS", "8"))
RUN_TIMEOUT_SECONDS = int(os.getenv("RUN_TIMEOUT_SECONDS", "6"))
ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "ALLOWED_ORIGINS",
        "http://127.0.0.1:5500,http://localhost:5500,http://127.0.0.1:8000,http://localhost:8000",
    ).split(",")
    if origin.strip()
]

EDIT_ACTIONS = {"generate", "fix", "refactor", "explain", "extend"}
RUNNABLE_LANGUAGES = {
    "python",
    "javascript",
    "typescript",
    "node.js",
    "c",
    "c++",
    "c#",
    "java",
    "go",
    "rust",
    "kotlin",
    "swift",
    "php",
    "ruby",
    "dart",
}
CODING_SCOPE_TERMS = {
    "algorithm",
    "api",
    "app",
    "application",
    "array",
    "bug",
    "build",
    "class",
    "code",
    "coding",
    "compile",
    "component",
    "console",
    "css",
    "database",
    "debug",
    "developer",
    "endpoint",
    "fix",
    "flask",
    "frontend",
    "function",
    "html",
    "implement",
    "input",
    "javascript",
    "js",
    "leetcode",
    "logic",
    "loop",
    "method",
    "node",
    "object",
    "output",
    "print",
    "program",
    "programming",
    "python",
    "react",
    "refactor",
    "return",
    "script",
    "server",
    "software",
    "sql",
    "style",
    "syntax",
    "test",
    "typescript",
    "ui",
    "variable",
    "web",
    "website",
}
LEETCODE_KNOWN_PROBLEMS = {
    "1": {"title": "Two Sum", "signature": "Return the exact LeetCode Solution class or function signature for Two Sum."},
    "20": {"title": "Valid Parentheses", "signature": "Return the exact LeetCode Solution class or function signature for Valid Parentheses."},
    "53": {"title": "Maximum Subarray", "signature": "Return the exact LeetCode Solution class or function signature for Maximum Subarray."},
    "121": {"title": "Best Time to Buy and Sell Stock", "signature": "Return the exact LeetCode Solution class or function signature for Best Time to Buy and Sell Stock."},
    "141": {"title": "Linked List Cycle", "signature": "Return the exact LeetCode Solution class or function signature for Linked List Cycle."},
    "206": {"title": "Reverse Linked List", "signature": "Return the exact LeetCode Solution class or function signature for Reverse Linked List."},
    "217": {"title": "Contains Duplicate", "signature": "Return the exact LeetCode Solution class or function signature for Contains Duplicate."},
    "242": {"title": "Valid Anagram", "signature": "Return the exact LeetCode Solution class or function signature for Valid Anagram."},
}
LANGUAGE_GUARDRAILS = {
    "python": (
        "Use valid Python syntax only. Every generated file must be Python when Python is requested. "
        "Never use JavaScript syntax such as console.log, let, const, semicolons as statement terminators, or curly-brace for-loops. "
        "Use print() for output, def for functions, and indentation-based blocks."
    ),
    "javascript": (
        "Use valid JavaScript syntax only. Every generated file must be JavaScript when JavaScript is requested. "
        "Do not use Python print(), def, or indentation-only block syntax."
    ),
    "typescript": (
        "Use valid TypeScript syntax only. Every generated file must be TypeScript when TypeScript is requested. "
        "Include types where helpful and do not fall back to plain Python or Java syntax."
    ),
    "java": (
        "Use valid Java syntax only. Every generated file must be Java when Java is requested. "
        "Do not use Python indentation syntax or JavaScript console.log. Prefer class-based Java structure."
    ),
    "c": (
        "Use valid C syntax only. Every generated file must be C when C is requested. "
        "Do not use Python syntax such as print(), range(), def, or indentation-based blocks. "
        "Do not use JavaScript syntax such as console.log, let, or const. "
        "Prefer standard C patterns such as #include <stdio.h>, int main(void), printf, braces, and semicolons."
    ),
    "c++": (
        "Use valid C++ syntax only. Every generated file must be C++ when C++ is requested. "
        "Do not use Python syntax such as print(), range(), colon-ended for loops, or indentation-based blocks. "
        "Do not use JavaScript syntax such as console.log, let, or const for variable declarations. "
        "Prefer standard C++ patterns such as #include <iostream>, int main(), std::cout, braces, and semicolons where appropriate."
    ),
    "c#": (
        "Use valid C# syntax only. Every generated file must be C# when C# is requested. "
        "Do not use Python syntax, C/C++ headers, or JavaScript console.log. "
        "Prefer standard C# patterns such as using directives, class Program, static void Main, Console.WriteLine, braces, and semicolons."
    ),
    "go": (
        "Use valid Go syntax only. Every generated file must be Go when Go is requested. "
        "Do not use Python def/print syntax, JavaScript console.log, or C-style headers. "
        "Prefer package main, import blocks, func main(), fmt.Println, braces, and idiomatic Go naming."
    ),
    "rust": (
        "Use valid Rust syntax only. Every generated file must be Rust when Rust is requested. "
        "Do not use Python syntax such as print(), def, or range()-style loops. "
        "Do not use JavaScript syntax such as console.log, let with semicolon-free style, or function keyword. "
        "Prefer standard Rust patterns such as fn main(), println!, let mut when needed, braces, and ownership-safe code."
    ),
    "kotlin": (
        "Use valid Kotlin syntax only. Every generated file must be Kotlin when Kotlin is requested. "
        "Do not use JavaScript console.log, Python def/print syntax, or C-style headers. "
        "Prefer fun main(), println(), val/var, braces, and idiomatic Kotlin style."
    ),
    "swift": (
        "Use valid Swift syntax only. Every generated file must be Swift when Swift is requested. "
        "Do not use Python def/print syntax, JavaScript console.log, or C/C++ headers. "
        "Prefer import Foundation when useful, let/var, print(), functions with func, and idiomatic Swift style."
    ),
    "php": (
        "Use valid PHP syntax only. Every generated file must be PHP when PHP is requested. "
        "Do not use Python syntax, JavaScript console.log, or Java class syntax unless explicitly requested. "
        "Prefer <?php, function, echo when output is needed, braces, and standard PHP conventions."
    ),
    "ruby": (
        "Use valid Ruby syntax only. Every generated file must be Ruby when Ruby is requested. "
        "Do not use Python syntax, JavaScript console.log, or C/C++ headers. "
        "Prefer puts for output, def/end for functions, and idiomatic Ruby blocks."
    ),
    "dart": (
        "Use valid Dart syntax only. Every generated file must be Dart when Dart is requested. "
        "Do not use Python def/print syntax, JavaScript console.log, or C/C++ headers. "
        "Prefer void main(), print(), braces, semicolons, and idiomatic Dart style."
    ),
    "html/css": (
        "Return valid HTML and CSS only for the requested files. Do not switch to Python or JavaScript unless the request asks for them."
    ),
    "react": (
        "Return React code using JSX. Do not fall back to plain Python or backend-only code."
    ),
    "node.js": (
        "Use valid Node.js JavaScript. Do not use Python syntax."
    ),
}


def build_language_enforcement(language):
    normalized = (language or "").strip()
    return (
        f"The selected language is {normalized}. Every returned source code file must use {normalized} syntax, keywords, and conventions. "
        f"If an example would normally be easier in another language, still write it in {normalized}. "
        "Do not mix languages within a file. Supporting assets or config files may use their native formats when the request needs them."
    )

CORS(
    app,
    resources={r"/*": {"origins": ALLOWED_ORIGINS}},
    supports_credentials=False,
)


def create_groq_client():
    api_key = os.getenv("GROQ_API_KEY", "").strip()
    if not api_key:
        return None
    return Groq(api_key=api_key)


client = create_groq_client()
request_log = defaultdict(deque)


def error_response(message, status_code, extra=None, headers=None):
    payload = {"error": message, "code": ""}
    if extra:
        payload.update(extra)
    response = jsonify(payload)
    if headers:
        for key, value in headers.items():
            response.headers[key] = value
    return response, status_code


@app.after_request
def add_cors_headers(response):
    origin = request.headers.get("Origin", "").strip()
    if origin and origin in ALLOWED_ORIGINS:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Vary"] = "Origin"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    return response


def validate_origin():
    origin = request.headers.get("Origin", "").strip()
    if not origin:
        return True
    return origin in ALLOWED_ORIGINS


def validate_generate_payload(payload):
    if not isinstance(payload, dict):
        return "Request body must be valid JSON."

    description = payload.get("description")
    if not isinstance(description, str):
        return "Field 'description' must be a string."

    description = description.strip()
    if not description:
        return "Field 'description' is required."

    if len(description) > MAX_PROMPT_LENGTH:
        return f"Field 'description' must be under {MAX_PROMPT_LENGTH} characters."

    intent_info = detect_request_intent(description, payload)
    if intent_info["intent"] == "off_topic":
        return (
            "This studio only handles coding requests. Ask it to build, explain, fix, refactor, or extend software, "
            "UI, APIs, scripts, or LeetCode solutions."
        )

    language = payload.get("language", "Python")
    if not isinstance(language, str) or not language.strip():
        return "Field 'language' must be a non-empty string."

    style = payload.get("style", "Production-ready")
    if style is not None and not isinstance(style, str):
        return "Field 'style' must be a string."

    complexity = payload.get("complexity", "Balanced")
    if complexity is not None and not isinstance(complexity, str):
        return "Field 'complexity' must be a string."

    mode = payload.get("mode", "code")
    if mode is not None and not isinstance(mode, str):
        return "Field 'mode' must be a string."

    framework = payload.get("framework", "None")
    if framework is not None and not isinstance(framework, str):
        return "Field 'framework' must be a string."

    edit_action = payload.get("edit_action", "generate")
    if not isinstance(edit_action, str) or edit_action.lower() not in EDIT_ACTIONS:
        return "Field 'edit_action' must be one of generate, fix, refactor, explain, or extend."

    compare = payload.get("compare", False)
    if not isinstance(compare, bool):
        return "Field 'compare' must be a boolean."

    workspace_name = payload.get("workspace_name", "")
    if workspace_name is not None and not isinstance(workspace_name, str):
        return "Field 'workspace_name' must be a string."

    target_file = payload.get("target_file", "")
    if target_file is not None and not isinstance(target_file, str):
        return "Field 'target_file' must be a string."

    strict_options = payload.get("strict_options", {})
    if strict_options is not None:
        if not isinstance(strict_options, dict):
            return "Field 'strict_options' must be an object."
        for key in ["no_external_libraries", "runnable_output_required", "single_file_only"]:
            value = strict_options.get(key, False)
            if not isinstance(value, bool):
                return f"Strict option '{key}' must be a boolean."

    leetcode_problem_id = payload.get("leetcode_problem_id", "")
    if leetcode_problem_id is not None and not isinstance(leetcode_problem_id, str):
        return "Field 'leetcode_problem_id' must be a string."

    leetcode_question_name = payload.get("leetcode_question_name", "")
    if leetcode_question_name is not None and not isinstance(leetcode_question_name, str):
        return "Field 'leetcode_question_name' must be a string."

    attachments = payload.get("attachments", [])
    if attachments is not None:
        if not isinstance(attachments, list):
            return "Field 'attachments' must be a list."

        if len(attachments) > MAX_ATTACHMENTS:
            return f"Field 'attachments' must contain at most {MAX_ATTACHMENTS} items."

        total_attachment_text = 0
        for attachment in attachments:
            if not isinstance(attachment, dict):
                return "Each attachment must be an object."

            name = attachment.get("name")
            if not isinstance(name, str) or not name.strip():
                return "Each attachment must include a non-empty 'name'."

            kind = attachment.get("kind")
            if kind not in {"text", "image", "binary"}:
                return "Each attachment must include a valid 'kind'."

            mime_type = attachment.get("mime_type")
            if mime_type is not None and not isinstance(mime_type, str):
                return "Attachment field 'mime_type' must be a string."

            size = attachment.get("size")
            if size is not None and not isinstance(size, int):
                return "Attachment field 'size' must be an integer."

            if kind == "text":
                content = attachment.get("content", "")
                if not isinstance(content, str):
                    return "Text attachment field 'content' must be a string."
                if len(content) > MAX_ATTACHMENT_TEXT_LENGTH:
                    return f"Text attachments must be under {MAX_ATTACHMENT_TEXT_LENGTH} characters."
                total_attachment_text += len(content)

            if kind == "image":
                data_url = attachment.get("data_url")
                if data_url is not None and not isinstance(data_url, str):
                    return "Image attachment field 'data_url' must be a string."

        if total_attachment_text > MAX_TOTAL_ATTACHMENT_TEXT_LENGTH:
            return f"Combined attachment text must be under {MAX_TOTAL_ATTACHMENT_TEXT_LENGTH} characters."

    return None


def detect_request_intent(description, payload):
    primary_request = extract_primary_request_text(description)
    text = primary_request.lower()
    if not text:
        return {"intent": "off_topic", "confidence": 0.2, "primary_request": primary_request}

    mode = str((payload or {}).get("mode", "")).strip().lower()
    edit_action = str((payload or {}).get("edit_action", "")).strip().lower()
    framework = str((payload or {}).get("framework", "")).strip().lower()
    language = str((payload or {}).get("language", "")).strip().lower()
    leetcode_problem_id = str((payload or {}).get("leetcode_problem_id", "")).strip()
    leetcode_question_name = str((payload or {}).get("leetcode_question_name", "")).strip().lower()
    attachments = (payload or {}).get("attachments", [])

    if leetcode_problem_id or leetcode_question_name or mode == "leetcode":
        return {"intent": "leetcode_request", "confidence": 0.99, "primary_request": primary_request}

    if mode == "api":
        return {"intent": "api_request", "confidence": 0.95, "primary_request": primary_request}

    if mode == "component":
        return {"intent": "ui_request", "confidence": 0.95, "primary_request": primary_request}

    explain_markers = ["explain", "why does", "how does", "line by line", "what does this code", "walk me through"]
    fix_markers = ["fix", "bug", "error", "broken", "debug", "not working", "issue"]
    extend_markers = ["extend", "add feature", "improve", "enhance", "upgrade"]
    ui_markers = ["ui", "page", "navbar", "hero", "pricing", "landing page", "form", "layout", "component"]
    api_markers = ["api", "endpoint", "route", "backend", "server", "controller", "request", "response"]

    if edit_action == "explain" or any(marker in text for marker in explain_markers):
        return {"intent": "explain_code", "confidence": 0.9, "primary_request": primary_request}

    if edit_action == "fix" or any(marker in text for marker in fix_markers):
        return {"intent": "fix_code", "confidence": 0.9, "primary_request": primary_request}

    if edit_action == "extend" or any(marker in text for marker in extend_markers):
        return {"intent": "extend_code", "confidence": 0.82, "primary_request": primary_request}

    if framework in {"react", "vue", "next.js", "tailwind"} or any(marker in text for marker in ui_markers):
        return {"intent": "ui_request", "confidence": 0.8, "primary_request": primary_request}

    if framework in {"flask", "express"} or any(marker in text for marker in api_markers):
        return {"intent": "api_request", "confidence": 0.82, "primary_request": primary_request}

    if attachments and edit_action in {"fix", "refactor", "explain", "extend"}:
        return {"intent": f"{edit_action}_code", "confidence": 0.88, "primary_request": primary_request}

    if mode in {"code", "component", "api"} and edit_action in EDIT_ACTIONS:
        if framework not in {"", "none"}:
            return {"intent": "generate_code", "confidence": 0.76, "primary_request": primary_request}
        if language and language in LANGUAGE_GUARDRAILS:
            if any(term in text for term in CODING_SCOPE_TERMS):
                return {"intent": "generate_code", "confidence": 0.74, "primary_request": primary_request}

    if attachments:
        return {"intent": "generate_code", "confidence": 0.7, "primary_request": primary_request}

    if any(term in text for term in CODING_SCOPE_TERMS):
        return {"intent": "generate_code", "confidence": 0.68, "primary_request": primary_request}

    return {"intent": "off_topic", "confidence": 0.2, "primary_request": primary_request}


def extract_primary_request_text(description):
    raw_text = (description or "").strip()
    if not raw_text:
        return ""

    split_markers = [
        "\n\nTask:",
        "\nTask:",
        "\n\nMode:",
        "\nMode:",
        "\n\nStudio mode:",
        "\nStudio mode:",
        "\n\nFramework:",
        "\nFramework:",
        "\n\nStyle:",
        "\nStyle:",
        "\n\nComplexity:",
        "\nComplexity:",
    ]

    end_index = len(raw_text)
    for marker in split_markers:
        marker_index = raw_text.find(marker)
        if marker_index != -1:
            end_index = min(end_index, marker_index)

    return raw_text[:end_index].strip()


def validate_run_payload(payload):
    if not isinstance(payload, dict):
        return "Request body must be valid JSON."

    language = payload.get("language")
    if not isinstance(language, str) or not language.strip():
        return "Field 'language' must be a non-empty string."

    code = payload.get("code")
    if not isinstance(code, str) or not code.strip():
        return "Field 'code' must be a non-empty string."

    stdin = payload.get("stdin", "")
    if stdin is not None and not isinstance(stdin, str):
        return "Field 'stdin' must be a string."

    path = payload.get("path", "")
    if path is not None and not isinstance(path, str):
        return "Field 'path' must be a string."

    return None


def get_client_ip():
    forwarded_for = request.headers.get("X-Forwarded-For", "")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()
    return request.remote_addr or "unknown"


def get_rate_limit_key():
    return f"{get_client_ip()}::{request.headers.get('Origin', '').strip() or 'direct'}"


def check_rate_limit(rate_key):
    now = time.time()
    window = request_log[rate_key]

    while window and now - window[0] > RATE_LIMIT_WINDOW_SECONDS:
        window.popleft()

    if len(window) >= RATE_LIMIT_MAX_REQUESTS:
        retry_after = max(1, int(RATE_LIMIT_WINDOW_SECONDS - (now - window[0])))
        remaining = 0
        return retry_after, remaining

    window.append(now)
    remaining = max(0, RATE_LIMIT_MAX_REQUESTS - len(window))
    return None, remaining


def rate_limit_headers(remaining, retry_after=None):
    headers = {
        "X-RateLimit-Limit": str(RATE_LIMIT_MAX_REQUESTS),
        "X-RateLimit-Remaining": str(max(0, remaining)),
        "X-RateLimit-Window": str(RATE_LIMIT_WINDOW_SECONDS),
    }
    if retry_after is not None:
        headers["Retry-After"] = str(retry_after)
    return headers


COMPLEXITY_INSTRUCTIONS = {
    "starter": (
        "Keep the solution minimal and beginner-friendly. Prefer a single straightforward implementation "
        "with little abstraction and only essential logic. Use one main file when possible, avoid helper layers "
        "unless absolutely necessary, skip optional validation and edge-case hardening, and choose the simplest clear approach."
    ),
    "balanced": (
        "Produce a moderately structured solution with small helpers when useful, practical handling for normal inputs, "
        "and enough separation to feel organized. Use a small amount of structure beyond the simplest solution, such as "
        "one or two helper functions or a light file split when it genuinely improves clarity."
    ),
    "advanced": (
        "Produce a more complete and robust solution with stronger separation of concerns, better validation, "
        "and richer structure where appropriate. Prefer a noticeably more capable result than Starter or Balanced, "
        "with stronger input handling, clearer modularity, and additional robustness when the task supports it."
    ),
}

STYLE_INSTRUCTIONS = {
    "production-ready": "Favor clean organization, dependable naming, and practical safeguards.",
    "minimal": "Keep the output lean and concise. Avoid extra helpers and optional features.",
    "readable": "Optimize for clarity with descriptive names and straightforward control flow.",
    "fast prototype": "Optimize for speed of delivery and a quick working result over polish.",
}

MODE_INSTRUCTIONS = {
    "code": "Return direct source code only, not a prose description, UI shell, or API wrapper unless requested.",
    "component": "Return reusable component-oriented output with clear inputs and UI structure.",
    "api": "Return backend or endpoint-oriented output with routes, handlers, validation, or service flow.",
    "leetcode": (
        "Return the exact solution format expected by LeetCode for the selected language. "
        "Prefer only the required class/function implementation, no extra explanation, no markdown, and no standalone driver code unless explicitly requested."
    ),
}

FRAMEWORK_HINTS = {
    "none": "Use plain language-appropriate patterns unless the user explicitly requests a framework.",
    "react": "Prefer React conventions and JSX component structure.",
    "next.js": "Prefer Next.js conventions where relevant.",
    "vue": "Prefer Vue component patterns.",
    "flask": "Prefer Flask routes and Python server structure.",
    "express": "Prefer Express route handlers and middleware-friendly Node structure.",
    "tailwind": "Prefer Tailwind utility classes for styling when UI is involved.",
    "vanilla": "Prefer framework-free, plain language-native implementation.",
}

ACTION_HINTS = {
    "generate": "Create a new solution from scratch.",
    "fix": "Treat uploaded code and prompt context as something broken that must be corrected.",
    "refactor": "Improve structure and readability while preserving behavior as much as possible.",
    "explain": "Return code that is easy to study, with self-documenting structure and optional inline comments only when helpful.",
    "extend": "Treat uploaded code and prompt context as a base that should be expanded with requested features.",
}


def normalize_complexity(complexity):
    normalized = (complexity or "Balanced").strip().lower()
    return normalized if normalized in COMPLEXITY_INSTRUCTIONS else "balanced"


def normalize_style(style):
    normalized = (style or "Production-ready").strip().lower()
    return normalized if normalized in STYLE_INSTRUCTIONS else "production-ready"


def normalize_mode(mode):
    normalized = (mode or "code").strip().lower()
    return normalized if normalized in MODE_INSTRUCTIONS else "code"


def normalize_framework(framework):
    normalized = (framework or "None").strip().lower()
    return normalized if normalized in FRAMEWORK_HINTS else "none"


def extract_studio_mode(description):
    text = (description or "").strip()
    match = re.search(r"^\s*Studio mode:\s*([A-Za-z-]+)\.?\s*$", text, re.IGNORECASE | re.MULTILINE)
    if not match:
        return "standard"
    normalized = match.group(1).strip().lower()
    return normalized if normalized in {"standard", "learning", "interview", "submission", "ui-builder"} else "standard"


def build_generation_policy(mode, description, edit_action="", framework="", language="", attachments=None, strict_options=None):
    normalized_mode = normalize_mode(mode)
    studio_mode = extract_studio_mode(description)
    strict_options = strict_options or {}
    intent_info = detect_request_intent(
        description,
        {
            "mode": normalized_mode,
            "edit_action": edit_action,
            "framework": framework,
            "language": language,
            "attachments": attachments or [],
        },
    )
    return {
        "intent": intent_info["intent"],
        "intent_confidence": intent_info["confidence"],
        "mode": normalized_mode,
        "studio_mode": studio_mode,
        "forbid_driver_code": normalized_mode == "leetcode",
        "forbid_prose": True,
        "require_runnable_output": strict_options.get("runnable_output_required", False) or (normalized_mode == "code" and studio_mode not in {"submission"}),
        "prefer_beginner_structure": studio_mode == "learning",
        "prefer_ui_output": normalized_mode == "component" or studio_mode == "ui-builder",
        "prefer_api_output": normalized_mode == "api",
        "prefer_submission_shape": studio_mode == "submission",
        "no_external_libraries": strict_options.get("no_external_libraries", False),
        "single_file_only": strict_options.get("single_file_only", False),
    }


def build_policy_instruction(policy):
    instructions = []

    if policy["mode"] == "leetcode":
        instructions.append("LeetCode policy: return only the exact required solution implementation with no driver code, no print statements, and no explanation text.")
    if policy["intent"] == "explain_code":
        instructions.append("Intent policy: the request is explanation-oriented, so keep the code especially readable and study-friendly.")
    if policy["intent"] == "fix_code":
        instructions.append("Intent policy: the request is a fix/debug task, so preserve the main goal while correcting the broken parts.")
    if policy["intent"] == "extend_code":
        instructions.append("Intent policy: the request is an extension task, so treat the solution as a base that must be expanded rather than replaced arbitrarily.")
    if policy["mode"] == "component":
        instructions.append("Component policy: return reusable UI/component code, not backend route handlers or server-only code.")
    if policy["mode"] == "api":
        instructions.append("API policy: return backend request/response code, not page markup or front-end-only UI output.")
    if policy["studio_mode"] == "learning":
        instructions.append("Learning policy: prefer the clearest beginner-friendly structure, avoid unnecessary libraries or clever shortcuts, and keep the logic easy to follow.")
    if policy["studio_mode"] == "submission":
        instructions.append("Submission policy: return only the final answer shape with no explanation prose, no markdown, and no extra demo text.")
    if policy["studio_mode"] == "ui-builder":
        instructions.append("UI Builder policy: focus on visible interface structure and interaction details, and prefer UI-facing files over backend-only output.")
    if policy["studio_mode"] == "interview":
        instructions.append("Interview policy: keep the solution efficient, explainable, and easy to speak through, without unnecessary cleverness.")
    if policy["require_runnable_output"]:
        instructions.append("Runnable-output policy: when the task behaves like a normal program, include the final call, usage path, or visible output step so the result actually runs or displays something.")
    if policy["no_external_libraries"]:
        instructions.append("Strict policy: do not use external libraries, third-party packages, or framework imports unless the user explicitly provided them in attachments.")
    if policy["single_file_only"]:
        instructions.append("Strict policy: return a single-file solution only.")

    return " ".join(instructions)


def build_attachment_context(attachments):
    if not attachments:
        return ""

    sections = ["Attached references:"]

    for index, attachment in enumerate(attachments, start=1):
        name = attachment.get("name", "unnamed")
        kind = attachment.get("kind", "binary")
        mime_type = attachment.get("mime_type", "unknown")
        size = attachment.get("size")
        size_label = f"{size} bytes" if isinstance(size, int) else "size unknown"

        if kind == "text":
            line_count = attachment.get("line_count")
            line_label = f", {line_count} lines" if isinstance(line_count, int) else ""
            truncated_label = " (excerpt)" if attachment.get("truncated") else ""
            content = attachment.get("content", "").strip()
            sections.append(
                f"[{index}] Text file: {name} [{mime_type}, {size_label}{line_label}]{truncated_label}"
            )
            if content:
                sections.append(content)
            continue

        if kind == "image":
            width = attachment.get("width")
            height = attachment.get("height")
            dimension_label = (
                f", {width}x{height}px"
                if isinstance(width, int) and isinstance(height, int)
                else ""
            )
            sections.append(
                f"[{index}] Image reference: {name} [{mime_type}, {size_label}{dimension_label}]"
            )
            continue

        sections.append(f"[{index}] Binary reference: {name} [{mime_type}, {size_label}]")

    return "\n\n".join(sections)


def has_image_attachments(attachments):
    return any(attachment.get("kind") == "image" and attachment.get("data_url") for attachment in attachments or [])


def build_json_schema_instruction(compare_enabled):
    if compare_enabled:
        return (
            "Return valid JSON only. No markdown fences. "
            "Use this exact top-level shape: "
            '{"summary":"",'
            '"notes":[""],'
            '"variants":['
            '{"label":"Primary","files":[{"path":"","content":"","role":"main"}]},'
            '{"label":"Alternative","files":[{"path":"","content":"","role":"main"}]}'
            ']}'
        )

    return (
        "Return valid JSON only. No markdown fences. "
        'Use this exact top-level shape: {"summary":"","notes":[""],"files":[{"path":"","content":"","role":"main"}]}'
    )


def build_messages(description, language, style, complexity, mode, framework, edit_action, compare, attachments, target_file, leetcode_problem_id, leetcode_question_name, strict_options=None):
    normalized_complexity = normalize_complexity(complexity)
    normalized_style = normalize_style(style)
    normalized_mode = normalize_mode(mode)
    normalized_framework = normalize_framework(framework)
    policy = build_generation_policy(mode, description, edit_action, framework, language, attachments, strict_options)
    attachment_context = build_attachment_context(attachments)
    leetcode_language_hint = ""
    leetcode_problem_hint = ""
    if normalized_mode == "leetcode":
        known_problem = LEETCODE_KNOWN_PROBLEMS.get((leetcode_problem_id or "").strip())
        if known_problem:
            leetcode_problem_hint = (
                f"LeetCode problem {leetcode_problem_id.strip()} is {known_problem['title']}. "
                f"{known_problem['signature']}"
            )
        language_key = language.strip().lower()
        if language_key == "python":
            leetcode_language_hint = (
                "For Python LeetCode solutions, use valid Python method syntax. "
                "If a return type is provided, write it with '->', for example: def solve(self, nums: List[int]) -> int:. "
                "Do not omit the arrow before the return type."
            )
        elif language_key == "java":
            leetcode_language_hint = (
                "For Java LeetCode solutions, return a class Solution with the exact method signature style LeetCode expects."
            )
        elif language_key == "c++":
            leetcode_language_hint = (
                "For C++ LeetCode solutions, return a class Solution with the exact method signature style LeetCode expects."
            )
        elif language_key == "c":
            leetcode_language_hint = (
                "For C LeetCode solutions, return the exact function signature LeetCode expects and include only required helpers."
            )
        elif language_key == "javascript":
            leetcode_language_hint = (
                "For JavaScript LeetCode solutions, return only the function implementation LeetCode expects."
            )

    system_message = " ".join(
        [
            f"Generate code in {language}.",
            build_language_enforcement(language),
            LANGUAGE_GUARDRAILS.get(language.strip().lower(), f"Use valid {language} syntax only."),
            f"Mode: {normalized_mode}. {MODE_INSTRUCTIONS[normalized_mode]}",
            leetcode_language_hint,
            f"Style: {normalized_style}. {STYLE_INSTRUCTIONS[normalized_style]}",
            f"Complexity: {normalized_complexity}. {COMPLEXITY_INSTRUCTIONS[normalized_complexity]}",
            (
                "Complexity contract: "
                "Starter must be the simplest viable version with minimal files, minimal abstraction, and minimal safeguards. "
                "Balanced must be clearly more structured than Starter, but still restrained. "
                "Advanced must be observably more capable and structured than Balanced, with stronger validation, helper decomposition, "
                "or richer architecture when appropriate. "
                "Do not return nearly identical code for different complexity levels."
            ),
            f"Framework hint: {normalized_framework}. {FRAMEWORK_HINTS[normalized_framework]}",
            f"Task intent: {edit_action.lower()}. {ACTION_HINTS[edit_action.lower()]}",
            build_policy_instruction(policy),
            f"Focus file: {target_file.strip() or 'auto'}.",
            f"LeetCode problem number: {leetcode_problem_id.strip() or 'not provided'}.",
            f"LeetCode question name: {leetcode_question_name.strip() or 'not provided'}.",
            leetcode_problem_hint,
            f"Important: the requested language is {language}. Do not mix in syntax from any other language.",
            "Different settings must produce observably different structure.",
            "Prefer multiple files when the request naturally benefits from it.",
            "Prefer built-in language features and standard library solutions unless the user explicitly asks for a third-party package or framework.",
            "For basic arrays, loops, input, strings, math, or collection tasks, avoid external libraries unless they are clearly necessary.",
            "When UI is requested, split HTML/CSS/JS or component files when useful.",
            "When API is requested, split route/service/schema files when useful.",
            "Return source code in file content fields only. Do not describe the code, announce the code, or explain what you are about to write.",
            "Do not write sentences like 'Here is the code' or 'The JavaScript code to...'.",
            build_json_schema_instruction(compare),
        ]
    )

    user_content = description
    if attachment_context:
        user_content = f"{description}\n\n{attachment_context}"

    image_parts = []
    for attachment in attachments or []:
        if attachment.get("kind") != "image":
            continue
        data_url = attachment.get("data_url")
        if not isinstance(data_url, str) or not data_url.strip():
            continue
        image_parts.append({"type": "image_url", "image_url": {"url": data_url}})

    if image_parts:
        return [
            {"role": "system", "content": system_message},
            {
                "role": "user",
                "content": [{"type": "text", "text": user_content or "Generate code from the attached image references."}, *image_parts],
            },
        ]

    return [
        {"role": "system", "content": system_message},
        {"role": "user", "content": user_content},
    ]


def parse_generation_output(raw_output, language, mode, compare_enabled):
    parsed_payload = extract_json_object(raw_output)
    if parsed_payload is None:
        parsed_payload = extract_payload_from_wrapped_text(raw_output)
    if parsed_payload is None:
        return build_fallback_response(raw_output, language, mode, compare_enabled)
    return normalize_model_payload(parsed_payload, language, mode, compare_enabled)


def build_retry_messages(language, mode, original_prompt, raw_output, compare_enabled, strict_options=None):
    policy = build_generation_policy(mode, original_prompt, language=language, strict_options=strict_options)
    system_message = " ".join(
        [
            f"Generate code in {language}.",
            build_language_enforcement(language),
            LANGUAGE_GUARDRAILS.get(language.strip().lower(), f"Use valid {language} syntax only."),
            f"Mode: {normalize_mode(mode)}. {MODE_INSTRUCTIONS[normalize_mode(mode)]}",
            build_policy_instruction(policy),
            "Your previous answer was not usable because it contained explanation, prose, or empty code.",
            "Return executable source code only inside the JSON file content fields.",
            "Do not describe the program. Do not summarize it. Do not say what the code does.",
            build_json_schema_instruction(compare_enabled),
        ]
    )
    user_message = (
        f"Original request:\n{original_prompt}\n\n"
        f"Previous unusable output:\n{raw_output}\n\n"
        "Return corrected JSON with real code now."
    )
    return [
        {"role": "system", "content": system_message},
        {"role": "user", "content": user_message},
    ]


def extract_json_object(raw_text):
    raw_text = (raw_text or "").strip()
    if not raw_text:
        return None

    if raw_text.startswith("```"):
        lines = raw_text.splitlines()
        if len(lines) >= 3 and lines[-1].strip() == "```":
            raw_text = "\n".join(lines[1:-1]).strip()

    try:
        return json.loads(raw_text)
    except json.JSONDecodeError:
        pass

    start = raw_text.find("{")
    end = raw_text.rfind("}")
    if start == -1 or end == -1 or end <= start:
        return None

    candidate = raw_text[start : end + 1]
    try:
        return json.loads(candidate)
    except json.JSONDecodeError:
        return None


def extract_payload_from_wrapped_text(raw_text):
    raw_text = (raw_text or "").strip()
    if not raw_text:
        return None

    if raw_text.startswith("```"):
        lines = raw_text.splitlines()
        if len(lines) >= 3 and lines[-1].strip() == "```":
            raw_text = "\n".join(lines[1:-1]).strip()

    file_match = re.search(
        r'"files"\s*:\s*\[\s*\{\s*"path"\s*:\s*"(?P<path>[^"]*)"\s*,\s*"content"\s*:\s*"(?P<content>(?:\\.|[^"])*)"\s*,\s*"role"\s*:\s*"(?P<role>[^"]*)"',
        raw_text,
        re.DOTALL,
    )
    if not file_match:
        return None

    path = file_match.group("path") or ""
    content = bytes(file_match.group("content"), "utf-8").decode("unicode_escape")
    role = file_match.group("role") or "main"

    summary_match = re.search(r'"summary"\s*:\s*"(?P<summary>(?:\\.|[^"])*)"', raw_text, re.DOTALL)
    notes_match = re.findall(r'"notes"\s*:\s*\[(.*?)\]', raw_text, re.DOTALL)
    notes = []
    if notes_match:
        notes = [item.strip().strip('"') for item in notes_match[0].split(",") if item.strip()]

    return {
        "summary": bytes(summary_match.group("summary"), "utf-8").decode("unicode_escape") if summary_match else "Generated result",
        "notes": notes,
        "files": [{"path": path, "content": content, "role": role}],
    }


def sanitize_file_entry(file_entry, fallback_name):
    if not isinstance(file_entry, dict):
        return None

    path = str(file_entry.get("path") or fallback_name).strip() or fallback_name
    content = file_entry.get("content", "")
    if not isinstance(content, str):
        content = str(content)
    content = content.strip("\n")
    if not content.strip():
        return None

    role = str(file_entry.get("role") or "main").strip() or "main"
    return {"path": path, "content": content, "role": role}


def default_file_path(language, mode):
    language = (language or "txt").lower()
    mode = (mode or "code").lower()
    extension_map = {
        "javascript": "js",
        "typescript": "ts",
        "python": "py",
        "html/css": "html",
        "react": "jsx",
        "node.js": "js",
        "c": "c",
        "c++": "cpp",
        "c#": "cs",
        "go": "go",
        "rust": "rs",
        "java": "java",
        "kotlin": "kt",
        "swift": "swift",
        "php": "php",
        "ruby": "rb",
        "dart": "dart",
    }
    extension = extension_map.get(language, "txt")

    if mode == "component":
        return f"component.{extension}"
    if mode == "api":
        return f"api.{extension}"
    return f"snippet.{extension}"


def build_fallback_response(raw_text, language, mode, compare_enabled):
    salvaged_text = extract_code_like_text(raw_text).strip()
    fallback_comment = "# No code returned." if (language or "").strip().lower() == "python" else "// No code returned."
    fallback_file = {
        "path": default_file_path(language, mode),
        "content": salvaged_text or fallback_comment,
        "role": "main",
    }

    if compare_enabled:
        return {
            "summary": "Fallback single-variant response.",
            "notes": ["The model did not return structured JSON, so the raw output was captured as code."],
            "variants": [{"label": "Primary", "files": [fallback_file]}],
        }

    return {
        "summary": "Fallback single-file response.",
        "notes": ["The model did not return structured JSON, so the raw output was captured as code."],
        "files": [fallback_file],
    }


def extract_code_like_text(raw_text):
    text = (raw_text or "").strip()
    if not text:
        return ""

    fenced_blocks = re.findall(r"```(?:[A-Za-z0-9_+\-#.]+)?\n(.*?)```", text, re.DOTALL)
    if fenced_blocks:
        longest_block = max(fenced_blocks, key=lambda block: len(block.strip()))
        return longest_block.strip()

    json_string_matches = re.findall(r'"content"\s*:\s*"((?:\\.|[^"])*)"', text, re.DOTALL)
    if json_string_matches:
        decoded_blocks = []
        for match in json_string_matches:
            try:
                decoded = bytes(match, "utf-8").decode("unicode_escape").strip()
            except Exception:
                decoded = match.strip()
            if decoded:
                decoded_blocks.append(decoded)
        if decoded_blocks:
            return max(decoded_blocks, key=len)

    return text


def detect_language_issues(language, files, mode="code", original_prompt="", strict_options=None):
    normalized_language = (language or "").strip().lower()
    normalized_mode = normalize_mode(mode)
    normalized_prompt = (original_prompt or "").strip().lower()
    policy = build_generation_policy(mode, original_prompt, language=language, strict_options=strict_options)
    issues = []

    for file_entry in files or []:
        path = file_entry.get("path", "")
        content = file_entry.get("content", "")
        lower_path = str(path or "").lower()

        if normalized_language == "python":
            python_like_file = lower_path.endswith(".py") or lower_path.endswith(".pyi") or (
                not os.path.splitext(lower_path)[1]
                and re.search(r"^\s*(def |class |import |from .+ import |if __name__ == ['\"]__main__['\"]:)", content, re.MULTILINE)
            )

            if python_like_file and re.search(r"\bconsole\.log\b|\blet\s+\w+|\bconst\s+\w+|\bfor\s*\(.*;.*;.*\)", content):
                issues.append(f"{path or 'file'} uses JavaScript-style syntax instead of Python.")
            if python_like_file and re.search(r"^\s*def\s+\w+\([^)]*\)\s+[A-Za-z_][\w\[\], ]*:", content, re.MULTILINE):
                issues.append(f"{path or 'file'} has an invalid Python return annotation; expected '-> return_type:'.")
            if python_like_file:
                try:
                    ast.parse(content or "")
                except SyntaxError as error:
                    issues.append(f"{path or 'file'} is invalid Python syntax: {error.msg} on line {error.lineno}.")

        if normalized_language == "c++" and re.search(r"\bprint\s*\(|\brange\s*\(|^\s*def\s+\w+", content, re.MULTILINE):
            issues.append(f"{path or 'file'} uses Python-style syntax instead of C++.")

        if normalized_language == "javascript" and re.search(r"^\s*def\s+\w+|\bprint\s*\(", content, re.MULTILINE):
            issues.append(f"{path or 'file'} uses Python-style syntax instead of JavaScript.")
        issues.extend(detect_file_shape_issues(path, content, normalized_language))
        if looks_like_prose_response(content, normalized_language):
            issues.append(f"{path or 'file'} contains prose or explanation instead of executable {language} code.")
        if missing_entrypoint_or_output(content, normalized_language, normalized_mode, normalized_prompt):
            issues.append(f"{path or 'file'} defines helper logic but never runs it or shows the final result.")
        issues.extend(detect_mode_issues(content, path, normalized_language, normalized_prompt, policy))

    return dedupe_issues(issues)


def dedupe_issues(issues):
    deduped = []
    seen = set()
    for issue in issues:
        normalized = " ".join(str(issue).split()).strip().lower()
        if not normalized or normalized in seen:
            continue
        seen.add(normalized)
        deduped.append(issue)
    return deduped


def detect_file_shape_issues(path, content, normalized_language):
    text = (content or "").strip()
    lower_path = str(path or "").lower()
    file_label = path or "file"
    issues = []

    if not text:
        issues.append(f"{file_label} is empty.")
        return issues

    comment_only_patterns = {
        "python": r"^\s*(#.*)?$",
        "javascript": r"^\s*(//.*)?$",
        "typescript": r"^\s*(//.*)?$",
        "java": r"^\s*(//.*)?$",
        "c": r"^\s*(//.*)?$",
        "c++": r"^\s*(//.*)?$",
        "c#": r"^\s*(//.*)?$",
        "go": r"^\s*(//.*)?$",
        "rust": r"^\s*(//.*)?$",
        "php": r"^\s*(//.*|#.*)?$",
        "ruby": r"^\s*(#.*)?$",
        "kotlin": r"^\s*(//.*)?$",
        "swift": r"^\s*(//.*)?$",
        "dart": r"^\s*(//.*)?$",
    }
    line_pattern = comment_only_patterns.get(normalized_language)
    if line_pattern:
        non_blank_lines = [line for line in text.splitlines() if line.strip()]
        if non_blank_lines and all(re.match(line_pattern, line) for line in non_blank_lines):
            issues.append(f"{file_label} contains only comments and no executable code.")

    expected_extensions = {
        "python": {".py", ".pyi"},
        "javascript": {".js", ".mjs", ".cjs"},
        "typescript": {".ts", ".tsx"},
        "java": {".java"},
        "c": {".c", ".h"},
        "c++": {".cpp", ".cc", ".cxx", ".hpp", ".hh", ".h"},
        "c#": {".cs"},
        "go": {".go"},
        "rust": {".rs"},
        "php": {".php"},
        "ruby": {".rb"},
        "kotlin": {".kt", ".kts"},
        "swift": {".swift"},
        "dart": {".dart"},
    }
    extension = os.path.splitext(lower_path)[1]
    allowed_extensions = expected_extensions.get(normalized_language)
    if extension and allowed_extensions and extension not in allowed_extensions:
        issues.append(f"{file_label} uses extension {extension} which does not match the selected language {normalized_language}.")

    if normalized_language == "python":
        if re.search(r"^\s*def\s+\w+\([^)]*\):\s*$", text, re.MULTILINE) and not re.search(r"^\s+return\b|^\s+print\s*\(|^\s+for\b|^\s+if\b|^\s+\w+\s*=", text, re.MULTILINE):
            issues.append(f"{file_label} defines a Python function but its body appears incomplete or empty.")
    if normalized_language in {"javascript", "typescript"}:
        if re.search(r"^\s*function\s+\w+\([^)]*\)\s*\{\s*$", text, re.MULTILINE) and not re.search(r"^\s+return\b|^\s+console\.log\b|^\s+if\b|^\s+for\b|^\s+(const|let|var)\b", text, re.MULTILINE):
            issues.append(f"{file_label} defines a JavaScript/TypeScript function but its body appears incomplete or empty.")

    return issues


def looks_like_prose_response(content, normalized_language):
    text = (content or "").strip()
    if not text:
        return True

    lower_text = text.lower()
    prose_markers = [
        "the javascript code to",
        "the python code to",
        "this code",
        "this program",
        "here is",
        "to create a",
        "to get user input",
    ]
    code_markers = {
        "python": [r"^\s*def\b", r"^\s*for\b", r"^\s*while\b", r"\bprint\s*\(", r"\binput\s*\(", r"=\s*\[", r"^\s*\w+\s*="],
        "javascript": [r"^\s*(const|let|var)\b", r"^\s*for\s*\(", r"^\s*while\s*\(", r"\bconsole\.log\s*\(", r"\bprompt\s*\(", r"\[\s*\["],
        "typescript": [r"^\s*(const|let|var)\b", r"^\s*for\s*\(", r":\s*(string|number|boolean|any|\w+\[\])", r"\bconsole\.log\s*\("],
        "java": [r"\bclass\s+\w+", r"public\s+static\s+void\s+main", r"System\.out\.print", r"new\s+\w+\["],
        "c": [r"#include\s*<", r"\bint\s+main\s*\(", r"\bprintf\s*\("],
        "c++": [r"#include\s*<", r"\bint\s+main\s*\(", r"std::cout", r"vector<"],
    }

    if any(marker in lower_text for marker in prose_markers):
        if not any(re.search(pattern, text, re.MULTILINE) for pattern in code_markers.get(normalized_language, [])):
            return True

    nonempty_lines = [line.strip() for line in text.splitlines() if line.strip()]
    if len(nonempty_lines) <= 2 and any(line.endswith(".") for line in nonempty_lines):
        if not any(re.search(pattern, text, re.MULTILINE) for pattern in code_markers.get(normalized_language, [])):
            return True

    return False


def missing_entrypoint_or_output(content, normalized_language, normalized_mode, normalized_prompt):
    if normalized_mode in {"leetcode", "api", "component"}:
        return False

    text = (content or "").strip()
    if not text:
        return False

    prompt_hints_execution = any(
        phrase in normalized_prompt
        for phrase in ["input", "print", "show", "display", "output", "user", "create", "build"]
    )

    patterns = {
        "python": {
            "definitions": [r"^\s*def\s+([A-Za-z_]\w*)\s*\("],
            "input": [r"\binput\s*\("],
            "output": [r"\bprint\s*\(", r"if __name__ == ['\"]__main__['\"]:"],
        },
        "javascript": {
            "definitions": [r"^\s*function\s+([A-Za-z_]\w*)\s*\(", r"^\s*(?:const|let|var)\s+([A-Za-z_]\w+)\s*=\s*(?:async\s*)?\("],
            "input": [r"\bprompt\s*\(", r"\breadline\b", r"\bprocess\.stdin\b"],
            "output": [r"\bconsole\.log\s*\(", r"\bdocument\.write\s*\(", r"\balert\s*\("],
        },
        "typescript": {
            "definitions": [r"^\s*function\s+([A-Za-z_]\w*)\s*\(", r"^\s*(?:const|let|var)\s+([A-Za-z_]\w+)\s*=\s*(?:async\s*)?\("],
            "input": [r"\bprompt\s*\(", r"\breadline\b", r"\bprocess\.stdin\b"],
            "output": [r"\bconsole\.log\s*\(", r"\bdocument\.write\s*\(", r"\balert\s*\("],
        },
        "java": {
            "definitions": [r"\bstatic\s+[A-Za-z_<>\[\]]+\s+([A-Za-z_]\w*)\s*\("],
            "input": [r"\bScanner\b", r"\bBufferedReader\b"],
            "output": [r"System\.out\.print", r"public\s+static\s+void\s+main\s*\("],
        },
        "c": {
            "definitions": [r"^\s*[A-Za-z_][\w\s\*]*\s+([A-Za-z_]\w*)\s*\([^;]*\)\s*\{"],
            "input": [r"\bscanf\s*\(", r"\bfgets\s*\("],
            "output": [r"\bprintf\s*\(", r"\bint\s+main\s*\("],
        },
        "c++": {
            "definitions": [r"^\s*[A-Za-z_][\w\s:\*<>]*\s+([A-Za-z_]\w*)\s*\([^;]*\)\s*\{"],
            "input": [r"\bcin\s*>>", r"\bgetline\s*\("],
            "output": [r"\bcout\s*<<", r"\bint\s+main\s*\("],
        },
        "c#": {
            "definitions": [r"\b(?:public|private|internal|static)\s+[A-Za-z_<>\[\]?]+\s+([A-Za-z_]\w*)\s*\("],
            "input": [r"Console\.ReadLine\s*\("],
            "output": [r"Console\.Write(Line)?\s*\(", r"static\s+void\s+Main\s*\("],
        },
        "go": {
            "definitions": [r"^\s*func\s+([A-Za-z_]\w*)\s*\("],
            "input": [r"\bfmt\.Scan", r"\bbufio\.NewReader"],
            "output": [r"\bfmt\.Print", r"^\s*func\s+main\s*\("],
        },
        "rust": {
            "definitions": [r"^\s*fn\s+([A-Za-z_]\w*)\s*\("],
            "input": [r"\bstdin\s*\(", r"\bread_line\s*\("],
            "output": [r"\bprintln!\s*\(", r"^\s*fn\s+main\s*\("],
        },
        "php": {
            "definitions": [r"^\s*function\s+([A-Za-z_]\w*)\s*\("],
            "input": [r"\breadline\s*\(", r"STDIN"],
            "output": [r"\becho\b", r"\bprint\b"],
        },
        "ruby": {
            "definitions": [r"^\s*def\s+([A-Za-z_]\w*)"],
            "input": [r"\bgets\b"],
            "output": [r"\bputs\b", r"\bp\b"],
        },
        "kotlin": {
            "definitions": [r"^\s*fun\s+([A-Za-z_]\w*)\s*\("],
            "input": [r"readLine\s*\("],
            "output": [r"\bprintln\s*\(", r"^\s*fun\s+main\s*\("],
        },
        "swift": {
            "definitions": [r"^\s*func\s+([A-Za-z_]\w*)\s*\("],
            "input": [r"readLine\s*\("],
            "output": [r"\bprint\s*\(", r"^[^/\n]*@main\b"],
        },
        "dart": {
            "definitions": [r"^\s*(?:\w+\s+)?([A-Za-z_]\w*)\s*\([^;]*\)\s*\{"],
            "input": [r"stdin\.readLineSync\s*\("],
            "output": [r"\bprint\s*\(", r"\bmain\s*\("],
        },
    }

    language_patterns = patterns.get(normalized_language)
    if not language_patterns:
        return False

    has_input = any(re.search(pattern, text, re.MULTILINE) for pattern in language_patterns["input"])
    if not has_input and not prompt_hints_execution:
        return False

    definitions = []
    for pattern in language_patterns["definitions"]:
        definitions.extend(match.group(1) for match in re.finditer(pattern, text, re.MULTILINE) if match.group(1))
    definitions = [name for name in definitions if name.lower() not in {"main"}]
    if not definitions:
        return False

    has_output = any(re.search(pattern, text, re.MULTILINE) for pattern in language_patterns["output"])
    if has_output:
        return False

    for name in definitions:
        call_pattern = rf"\b{name}\s*\("
        call_count = len(re.findall(call_pattern, text))
        if call_count > 1:
            return False

    return True


def detect_mode_issues(content, path, normalized_language, normalized_prompt, policy):
    text = (content or "").strip()
    issues = []
    file_label = path or "file"

    if policy["forbid_driver_code"]:
        driver_patterns = [
            r"\bprint\s*\(",
            r"\bconsole\.log\s*\(",
            r"System\.out\.print",
            r"\bprintf\s*\(",
            r"^\s*if __name__ == ['\"]__main__['\"]:",
            r"\bint\s+main\s*\(",
        ]
        if any(re.search(pattern, text, re.MULTILINE) for pattern in driver_patterns):
            issues.append(f"{file_label} includes driver/output code even though this mode should return only the core solution.")

    if policy["prefer_api_output"]:
        if re.search(r"<(?:html|body|main|div|section|form|button)\b", text, re.IGNORECASE) and not re.search(r"\b(app|router)\.(get|post|put|patch|delete)\b|\bjsonify\b|\brequest\b|\bresponse\b", text):
            issues.append(f"{file_label} looks like page markup instead of backend/API code.")

    if policy["prefer_ui_output"]:
        if re.search(r"\b(app|router)\.(get|post|put|patch|delete)\b|\bjsonify\b|\brequest\b|\bresponse\b", text) and not re.search(r"<(?:div|section|main|button|form)\b|\breturn\s*<|\bclassName\s*=", text):
            issues.append(f"{file_label} looks like backend route code instead of reusable UI/component output.")

    if policy["prefer_submission_shape"]:
        if re.search(r"```|^\s*(Explanation|Summary|How it works)\b", text, re.IGNORECASE | re.MULTILINE):
            issues.append(f"{file_label} includes explanatory wrapper text even though submission mode should return only the final answer.")

    if policy["prefer_beginner_structure"]:
        simple_task = any(term in normalized_prompt for term in ["array", "loop", "input", "string", "number", "list", "basic", "beginner"])
        heavy_library_patterns = {
            "python": [r"^\s*import\s+numpy\b", r"^\s*import\s+pandas\b", r"^\s*from\s+numpy\b", r"^\s*from\s+pandas\b"],
            "javascript": [r"from\s+['\"]lodash['\"]", r"require\(['\"]lodash['\"]\)"],
            "typescript": [r"from\s+['\"]lodash['\"]"],
        }
        if simple_task and any(re.search(pattern, text, re.MULTILINE) for pattern in heavy_library_patterns.get(normalized_language, [])):
            issues.append(f"{file_label} uses a heavy external library even though learning mode should prefer beginner-friendly built-in features for this task.")

    if policy["no_external_libraries"]:
        external_library_patterns = {
            "python": [r"^\s*import\s+(?!math\b|random\b|sys\b|os\b|json\b|re\b|collections\b|itertools\b|datetime\b|typing\b|string\b|functools\b|heapq\b|bisect\b|statistics\b)\w+", r"^\s*from\s+(?!math\b|random\b|sys\b|os\b|json\b|re\b|collections\b|itertools\b|datetime\b|typing\b|string\b|functools\b|heapq\b|bisect\b|statistics\b)\w+\s+import\b"],
            "javascript": [r"^\s*import\s+.+\s+from\s+['\"](?!react['\"]|next/|node:)[^'\"]+['\"]", r"require\(['\"](?!fs['\"]|path['\"]|os['\"]|http['\"]|https['\"]|url['\"]|util['\"])[^'\"]+['\"]\)"],
            "typescript": [r"^\s*import\s+.+\s+from\s+['\"](?!react['\"]|next/|node:)[^'\"]+['\"]"],
            "java": [r"^\s*import\s+(?!java\.|javax\.)[\w.]+;"],
            "c#": [r"^\s*using\s+(?!System\b)[A-Za-z_.]+;"],
            "php": [r"require(?:_once)?\s*\(['\"][^'\"]+['\"]\)", r"include(?:_once)?\s*\(['\"][^'\"]+['\"]\)"],
            "ruby": [r"^\s*require\s+['\"](?!json['\"]|set['\"]|date['\"]|time['\"])[^'\"]+['\"]"],
        }
        if any(re.search(pattern, text, re.MULTILINE) for pattern in external_library_patterns.get(normalized_language, [])):
            issues.append(f"{file_label} uses external libraries even though 'No External Libraries' is enabled.")

    if policy["studio_mode"] == "ui-builder":
        if not re.search(r"<(?:div|section|main|button|form|header|footer)\b|className\s*=|document\.querySelector|addEventListener", text, re.IGNORECASE):
            issues.append(f"{file_label} does not look like UI-building output even though UI Builder mode is active.")

    return issues


def detect_payload_issues(payload, policy):
    issues = []
    if policy["single_file_only"]:
        if payload.get("variants"):
            variant_files = payload["variants"][0].get("files", [])
            if len(variant_files) > 1:
                issues.append("The response returned multiple files even though 'Single File Only' is enabled.")
        else:
            if len(payload.get("files", [])) > 1:
                issues.append("The response returned multiple files even though 'Single File Only' is enabled.")
    return issues


def build_repair_messages(language, mode, original_prompt, payload, issues, strict_options=None):
    payload_text = json.dumps(payload, ensure_ascii=False)
    issue_text = " ".join(issues)
    policy = build_generation_policy(mode, original_prompt, language=language, strict_options=strict_options)
    system_message = " ".join(
        [
            f"Repair generated code for {language}.",
            build_language_enforcement(language),
            LANGUAGE_GUARDRAILS.get(language.strip().lower(), f"Use valid {language} syntax only."),
            f"Mode: {mode}. Return the same JSON schema as before.",
            build_policy_instruction(policy),
            "Fix the code so it is valid for the selected language and keep the answer concise.",
            build_json_schema_instruction(False),
        ]
    )
    user_message = (
        f"Original request:\n{original_prompt}\n\n"
        f"Problems found:\n{issue_text}\n\n"
        f"Current payload:\n{payload_text}\n\n"
        "Return repaired JSON only."
    )
    return [
        {"role": "system", "content": system_message},
        {"role": "user", "content": user_message},
    ]


def normalize_model_payload(payload, language, mode, compare_enabled):
    if not isinstance(payload, dict):
        return build_fallback_response("", language, mode, compare_enabled)

    summary = payload.get("summary", "Generated result")
    if not isinstance(summary, str):
        summary = "Generated result"

    notes = payload.get("notes", [])
    if not isinstance(notes, list):
        notes = []
    notes = [str(note).strip() for note in notes if str(note).strip()]

    if compare_enabled:
        variants = payload.get("variants", [])
        normalized_variants = []
        for index, variant in enumerate(variants):
            if not isinstance(variant, dict):
                continue
            label = str(variant.get("label") or f"Variant {index + 1}").strip() or f"Variant {index + 1}"
            files = variant.get("files", [])
            if not isinstance(files, list):
                files = []
            normalized_files = []
            for file_index, file_entry in enumerate(files):
                sanitized = sanitize_file_entry(file_entry, f"variant_{index + 1}_{file_index + 1}.txt")
                if sanitized:
                    normalized_files.append(sanitized)
            if normalized_files:
                normalized_variants.append({"label": label, "files": normalized_files})

        if not normalized_variants:
            return build_fallback_response("", language, mode, compare_enabled)

        return {"summary": summary, "notes": notes, "variants": normalized_variants}

    files = payload.get("files", [])
    if not isinstance(files, list):
        files = []

    normalized_files = []
    for index, file_entry in enumerate(files):
        sanitized = sanitize_file_entry(file_entry, f"file_{index + 1}.txt")
        if sanitized:
            normalized_files.append(sanitized)

    if not normalized_files:
        return build_fallback_response("", language, mode, compare_enabled)

    return {"summary": summary, "notes": notes, "files": normalized_files}


def flatten_primary_files(payload):
    if payload.get("variants"):
        return payload["variants"][0]["files"]
    return payload.get("files", [])


def build_section_index(files):
    sections = []
    for file_entry in files:
        path = file_entry["path"]
        lower_path = path.lower()
        role = file_entry.get("role", "main")
        if lower_path.endswith(".html"):
            section = "HTML"
        elif lower_path.endswith(".css") or lower_path.endswith(".scss"):
            section = "CSS"
        elif lower_path.endswith(".js") or lower_path.endswith(".jsx") or lower_path.endswith(".ts") or lower_path.endswith(".tsx"):
            section = "JS"
        elif lower_path.endswith(".json"):
            section = "JSON"
        elif lower_path.endswith(".py"):
            section = "Python"
        else:
            section = role.capitalize()
        sections.append({"label": section, "path": path})
    return sections


def first_available_command(*commands):
    for command in commands:
        if command and shutil.which(command):
            return command
    return None


def build_runtime_entry(available, command_label, supported=True, mode="run"):
    return {
        "available": bool(available),
        "command": command_label,
        "supported": supported,
        "mode": mode,
    }


def detect_runtimes():
    python_cmd = first_available_command("python", "py")
    node_cmd = first_available_command("node")
    ts_cmd = first_available_command("tsx", "ts-node", "bun", "deno")
    gcc_cmd = first_available_command("gcc")
    gpp_cmd = first_available_command("g++")
    csharp_cmd = first_available_command("csc", "dotnet-script")
    go_cmd = first_available_command("go")
    rust_cmd = first_available_command("rustc")
    java_compiler = first_available_command("javac")
    java_runtime = first_available_command("java")
    kotlin_compiler = first_available_command("kotlinc")
    swift_cmd = first_available_command("swift", "swiftc")
    php_cmd = first_available_command("php")
    ruby_cmd = first_available_command("ruby")
    dart_cmd = first_available_command("dart")

    return {
        "JavaScript": build_runtime_entry(bool(node_cmd), "node"),
        "TypeScript": build_runtime_entry(bool(ts_cmd), ts_cmd or "tsx / ts-node / bun / deno"),
        "Python": build_runtime_entry(bool(python_cmd), "python / py"),
        "HTML/CSS": build_runtime_entry(True, "in-app preview", supported=False, mode="preview"),
        "React": build_runtime_entry(True, "in-app preview", supported=False, mode="preview"),
        "Node.js": build_runtime_entry(bool(node_cmd), "node"),
        "C": build_runtime_entry(bool(gcc_cmd), "gcc"),
        "C++": build_runtime_entry(bool(gpp_cmd), "g++"),
        "C#": build_runtime_entry(bool(csharp_cmd), csharp_cmd or "csc / dotnet-script"),
        "Go": build_runtime_entry(bool(go_cmd), "go"),
        "Rust": build_runtime_entry(bool(rust_cmd), "rustc"),
        "Java": build_runtime_entry(bool(java_compiler and java_runtime), "javac / java"),
        "Kotlin": build_runtime_entry(bool(kotlin_compiler and java_runtime), "kotlinc / java"),
        "Swift": build_runtime_entry(bool(swift_cmd), swift_cmd or "swift / swiftc"),
        "PHP": build_runtime_entry(bool(php_cmd), "php"),
        "Ruby": build_runtime_entry(bool(ruby_cmd), "ruby"),
        "Dart": build_runtime_entry(bool(dart_cmd), "dart"),
    }


def runtime_probe_for_language(language):
    language_key = (language or "").strip().lower()
    if language_key == "python":
        if shutil.which("python"):
            return {"available": True, "command": ["python"], "label": "python"}
        if shutil.which("py"):
            return {"available": True, "command": ["py", "-3"], "label": "py -3"}
        return {"available": False, "command": None, "label": "python"}
    if language_key in {"javascript", "node.js"}:
        return {"available": bool(shutil.which("node")), "command": ["node"] if shutil.which("node") else None, "label": "node"}
    if language_key == "typescript":
        if shutil.which("tsx"):
            return {"available": True, "command": ["tsx"], "label": "tsx"}
        if shutil.which("ts-node"):
            return {"available": True, "command": ["ts-node"], "label": "ts-node"}
        if shutil.which("bun"):
            return {"available": True, "command": ["bun"], "label": "bun"}
        if shutil.which("deno"):
            return {"available": True, "command": ["deno", "run"], "label": "deno run"}
        return {"available": False, "command": None, "label": "tsx / ts-node / bun / deno"}
    if language_key == "c":
        return {"available": bool(shutil.which("gcc")), "command": ["gcc"] if shutil.which("gcc") else None, "label": "gcc"}
    if language_key == "c++":
        return {"available": bool(shutil.which("g++")), "command": ["g++"] if shutil.which("g++") else None, "label": "g++"}
    if language_key == "c#":
        if shutil.which("csc"):
            return {"available": True, "command": ["csc"], "label": "csc"}
        if shutil.which("dotnet-script"):
            return {"available": True, "command": ["dotnet-script"], "label": "dotnet-script"}
        return {"available": False, "command": None, "label": "csc / dotnet-script"}
    if language_key == "java":
        ready = bool(shutil.which("javac") and shutil.which("java"))
        return {"available": ready, "command": ["javac", "java"] if ready else None, "label": "javac/java"}
    if language_key == "go":
        return {"available": bool(shutil.which("go")), "command": ["go"] if shutil.which("go") else None, "label": "go"}
    if language_key == "rust":
        return {"available": bool(shutil.which("rustc")), "command": ["rustc"] if shutil.which("rustc") else None, "label": "rustc"}
    if language_key == "kotlin":
        ready = bool(shutil.which("kotlinc") and shutil.which("java"))
        return {"available": ready, "command": ["kotlinc", "java"] if ready else None, "label": "kotlinc/java"}
    if language_key == "swift":
        if shutil.which("swift"):
            return {"available": True, "command": ["swift"], "label": "swift"}
        if shutil.which("swiftc"):
            return {"available": True, "command": ["swiftc"], "label": "swiftc"}
        return {"available": False, "command": None, "label": "swift / swiftc"}
    if language_key == "php":
        return {"available": bool(shutil.which("php")), "command": ["php"] if shutil.which("php") else None, "label": "php"}
    if language_key == "ruby":
        return {"available": bool(shutil.which("ruby")), "command": ["ruby"] if shutil.which("ruby") else None, "label": "ruby"}
    if language_key == "dart":
        return {"available": bool(shutil.which("dart")), "command": ["dart"] if shutil.which("dart") else None, "label": "dart"}
    if language_key in {"html/css", "react"}:
        return {"available": True, "command": None, "label": "in-app preview", "supported": False, "mode": "preview"}
    return {"available": False, "command": None, "label": "unsupported"}


def run_process(command, cwd, stdin_text=""):
    completed = subprocess.run(
        command,
        cwd=cwd,
        input=stdin_text,
        text=True,
        capture_output=True,
        timeout=RUN_TIMEOUT_SECONDS,
        shell=False,
    )
    return {
        "command": " ".join(command),
        "stdout": completed.stdout,
        "stderr": completed.stderr,
        "exit_code": completed.returncode,
    }


def execute_code(language, code, stdin_text=""):
    language_key = (language or "").strip().lower()
    probe = runtime_probe_for_language(language_key)
    if language_key not in RUNNABLE_LANGUAGES:
        return {"ok": False, "error": f"Running {language} inside the app is not supported yet.", "supported": False, "runtime": probe}
    if not probe["available"]:
        return {"ok": False, "error": f"{language} runtime is not available on this machine right now.", "supported": True, "runtime": probe}

    with tempfile.TemporaryDirectory(prefix="codicraft-run-") as temp_dir:
        if language_key == "python":
            source_path = os.path.join(temp_dir, "main.py")
            with open(source_path, "w", encoding="utf-8") as source_file:
                source_file.write(code)
            result = run_process([*probe["command"], source_path], temp_dir, stdin_text)
        elif language_key in {"javascript", "node.js"}:
            source_path = os.path.join(temp_dir, "main.js")
            with open(source_path, "w", encoding="utf-8") as source_file:
                source_file.write(code)
            result = run_process([*probe["command"], source_path], temp_dir, stdin_text)
        elif language_key == "typescript":
            source_path = os.path.join(temp_dir, "main.ts")
            with open(source_path, "w", encoding="utf-8") as source_file:
                source_file.write(code)
            if probe["label"] == "bun":
                result = run_process([*probe["command"], source_path], temp_dir, stdin_text)
            else:
                result = run_process([*probe["command"], source_path], temp_dir, stdin_text)
        elif language_key == "php":
            source_path = os.path.join(temp_dir, "main.php")
            with open(source_path, "w", encoding="utf-8") as source_file:
                source_file.write(code)
            result = run_process([*probe["command"], source_path], temp_dir, stdin_text)
        elif language_key == "ruby":
            source_path = os.path.join(temp_dir, "main.rb")
            with open(source_path, "w", encoding="utf-8") as source_file:
                source_file.write(code)
            result = run_process([*probe["command"], source_path], temp_dir, stdin_text)
        elif language_key == "go":
            source_path = os.path.join(temp_dir, "main.go")
            with open(source_path, "w", encoding="utf-8") as source_file:
                source_file.write(code)
            result = run_process([*probe["command"], "run", source_path], temp_dir, stdin_text)
        elif language_key == "c":
            source_path = os.path.join(temp_dir, "main.c")
            output_path = os.path.join(temp_dir, "program.exe")
            with open(source_path, "w", encoding="utf-8") as source_file:
                source_file.write(code)
            compile_result = run_process([*probe["command"], source_path, "-o", output_path], temp_dir, "")
            if compile_result["exit_code"] != 0:
                return {"ok": False, "phase": "compile", "runtime": probe, **compile_result}
            result = run_process([output_path], temp_dir, stdin_text)
        elif language_key == "c++":
            source_path = os.path.join(temp_dir, "main.cpp")
            output_path = os.path.join(temp_dir, "program.exe")
            with open(source_path, "w", encoding="utf-8") as source_file:
                source_file.write(code)
            compile_result = run_process([*probe["command"], source_path, "-o", output_path], temp_dir, "")
            if compile_result["exit_code"] != 0:
                return {"ok": False, "phase": "compile", "runtime": probe, **compile_result}
            result = run_process([output_path], temp_dir, stdin_text)
        elif language_key == "c#":
            source_path = os.path.join(temp_dir, "Program.cs")
            output_path = os.path.join(temp_dir, "program.exe")
            with open(source_path, "w", encoding="utf-8") as source_file:
                source_file.write(code)
            if probe["label"] == "csc":
                compile_result = run_process([*probe["command"], "/nologo", f"/out:{output_path}", source_path], temp_dir, "")
                if compile_result["exit_code"] != 0:
                    return {"ok": False, "phase": "compile", "runtime": probe, **compile_result}
                result = run_process([output_path], temp_dir, stdin_text)
            else:
                result = run_process([*probe["command"], source_path], temp_dir, stdin_text)
        elif language_key == "rust":
            source_path = os.path.join(temp_dir, "main.rs")
            output_path = os.path.join(temp_dir, "program.exe")
            with open(source_path, "w", encoding="utf-8") as source_file:
                source_file.write(code)
            compile_result = run_process([*probe["command"], source_path, "-o", output_path], temp_dir, "")
            if compile_result["exit_code"] != 0:
                return {"ok": False, "phase": "compile", "runtime": probe, **compile_result}
            result = run_process([output_path], temp_dir, stdin_text)
        elif language_key == "java":
            source_path = os.path.join(temp_dir, "Main.java")
            with open(source_path, "w", encoding="utf-8") as source_file:
                source_file.write(code)
            compile_result = run_process(["javac", source_path], temp_dir, "")
            if compile_result["exit_code"] != 0:
                return {"ok": False, "phase": "compile", "runtime": probe, **compile_result}
            result = run_process(["java", "-cp", temp_dir, "Main"], temp_dir, stdin_text)
        elif language_key == "kotlin":
            source_path = os.path.join(temp_dir, "Main.kt")
            output_path = os.path.join(temp_dir, "main.jar")
            with open(source_path, "w", encoding="utf-8") as source_file:
                source_file.write(code)
            compile_result = run_process(["kotlinc", source_path, "-include-runtime", "-d", output_path], temp_dir, "")
            if compile_result["exit_code"] != 0:
                return {"ok": False, "phase": "compile", "runtime": probe, **compile_result}
            result = run_process(["java", "-jar", output_path], temp_dir, stdin_text)
        elif language_key == "swift":
            source_path = os.path.join(temp_dir, "main.swift")
            with open(source_path, "w", encoding="utf-8") as source_file:
                source_file.write(code)
            if probe["label"] == "swift":
                result = run_process([*probe["command"], source_path], temp_dir, stdin_text)
            else:
                output_path = os.path.join(temp_dir, "program.exe")
                compile_result = run_process([*probe["command"], source_path, "-o", output_path], temp_dir, "")
                if compile_result["exit_code"] != 0:
                    return {"ok": False, "phase": "compile", "runtime": probe, **compile_result}
                result = run_process([output_path], temp_dir, stdin_text)
        elif language_key == "dart":
            source_path = os.path.join(temp_dir, "main.dart")
            with open(source_path, "w", encoding="utf-8") as source_file:
                source_file.write(code)
            result = run_process([*probe["command"], source_path], temp_dir, stdin_text)
        else:
            return {"ok": False, "error": f"Running {language} inside the app is not supported yet.", "supported": False, "runtime": probe}

    return {"ok": result["exit_code"] == 0, "phase": "run", "runtime": probe, **result}


@app.get("/health")
def health():
    return jsonify(
        {
            "status": "ok",
            "groq_configured": client is not None,
            "allowed_origins": ALLOWED_ORIGINS,
            "model": DEFAULT_MODEL,
            "vision_model": VISION_MODEL,
            "rate_limit": {
                "window_seconds": RATE_LIMIT_WINDOW_SECONDS,
                "max_requests": RATE_LIMIT_MAX_REQUESTS,
            },
            "runtimes": detect_runtimes(),
        }
    )


@app.get("/runtimes")
def runtimes():
    if not validate_origin():
        return error_response("Origin not allowed.", 403)
    return jsonify({"runtimes": detect_runtimes(), "run_timeout_seconds": RUN_TIMEOUT_SECONDS})


@app.post("/run")
def run_code():
    if not validate_origin():
        return error_response("Origin not allowed.", 403)

    data = request.get_json(silent=True)
    validation_error = validate_run_payload(data)
    if validation_error:
        return error_response(validation_error, 400)

    language = data.get("language", "").strip()
    code = data.get("code", "")
    stdin_text = data.get("stdin", "") or ""

    try:
        result = execute_code(language, code, stdin_text)
        status_code = 200 if result.get("ok") else 422 if result.get("supported", True) else 400
        if result.get("error") and "not available" in result["error"]:
            status_code = 503
        return jsonify(result), status_code
    except subprocess.TimeoutExpired:
        return error_response(
            f"Code execution timed out after {RUN_TIMEOUT_SECONDS} seconds.",
            408,
            {"phase": "run"},
        )
    except Exception:
        logger.exception("Code execution failed.")
        message = "Code execution failed. Please try again."
        if app.config["DEV_ERROR_DETAILS"]:
            import traceback

            message = f"{message} Details: {traceback.format_exc().splitlines()[-1]}"
        return error_response(message, 500)


@app.post("/generate")
def generate():
    if not validate_origin():
        return error_response("Origin not allowed.", 403)

    if client is None:
        logger.error("GROQ_API_KEY is missing.")
        return error_response("Server is not configured for AI generation.", 500)

    data = request.get_json(silent=True)
    validation_error = validate_generate_payload(data)
    if validation_error:
        return error_response(validation_error, 400)

    rate_key = get_rate_limit_key()
    retry_after, remaining = check_rate_limit(rate_key)
    if retry_after is not None:
        return error_response(
            "Too many requests. Please wait before generating again.",
            429,
            {"retry_after": retry_after},
            rate_limit_headers(remaining, retry_after),
        )

    description = data["description"].strip()
    language = data.get("language", "Python").strip() or "Python"
    style = data.get("style", "Production-ready")
    complexity = data.get("complexity", "Balanced")
    mode = data.get("mode", "code")
    framework = data.get("framework", "None")
    edit_action = str(data.get("edit_action", "generate")).lower()
    compare_enabled = bool(data.get("compare", False))
    attachments = data.get("attachments", [])
    strict_options = data.get("strict_options", {}) or {}
    target_file = data.get("target_file", "")
    leetcode_problem_id = data.get("leetcode_problem_id", "")
    leetcode_question_name = data.get("leetcode_question_name", "")

    try:
        intent_info = detect_request_intent(description, data)
        policy = build_generation_policy(mode, description, edit_action, framework, language, attachments, strict_options)
        model_name = VISION_MODEL if has_image_attachments(attachments) else DEFAULT_MODEL
        completion = client.chat.completions.create(
            model=model_name,
            messages=build_messages(
                description=description,
                language=language,
                style=style,
                complexity=complexity,
                mode=mode,
                framework=framework,
                edit_action=edit_action,
                compare=compare_enabled,
                attachments=attachments,
                target_file=target_file,
                leetcode_problem_id=leetcode_problem_id,
                leetcode_question_name=leetcode_question_name,
                strict_options=strict_options,
            ),
            temperature=DEFAULT_TEMPERATURE,
        )

        raw_output = completion.choices[0].message.content or ""
        normalized_payload = parse_generation_output(raw_output, language, mode, compare_enabled)

        validation_files = flatten_primary_files(normalized_payload)
        validation_issues = detect_language_issues(language, validation_files, mode, description, strict_options)
        validation_issues.extend(detect_payload_issues(normalized_payload, policy))
        validation_issues = dedupe_issues(validation_issues)
        if validation_issues:
            logger.warning("Generated output failed first-pass validation for %s: %s", language, " | ".join(validation_issues))
            retry_completion = client.chat.completions.create(
                model=model_name,
                messages=build_retry_messages(language, mode, description, raw_output, compare_enabled, strict_options),
                temperature=0,
            )
            retry_output = retry_completion.choices[0].message.content or ""
            retry_payload = parse_generation_output(retry_output, language, mode, compare_enabled)
            retry_files = flatten_primary_files(retry_payload)
            retry_issues = detect_language_issues(language, retry_files, mode, description, strict_options)
            retry_issues.extend(detect_payload_issues(retry_payload, policy))
            retry_issues = dedupe_issues(retry_issues)
            if not retry_issues:
                raw_output = retry_output
                normalized_payload = retry_payload
                validation_files = retry_files
                validation_issues = []

        if validation_issues:
            logger.warning("Generated output failed validation for %s: %s", language, " | ".join(validation_issues))
            repair_completion = client.chat.completions.create(
                model=model_name,
                messages=build_repair_messages(language, mode, description, normalized_payload, validation_issues, strict_options),
                temperature=0,
            )
            repair_output = repair_completion.choices[0].message.content or ""
            repaired_payload = extract_json_object(repair_output) or extract_payload_from_wrapped_text(repair_output)
            if repaired_payload is not None:
                normalized_payload = normalize_model_payload(repaired_payload, language, mode, compare_enabled)
                validation_files = flatten_primary_files(normalized_payload)
                validation_issues = detect_language_issues(language, validation_files, mode, description, strict_options)
                validation_issues.extend(detect_payload_issues(normalized_payload, policy))
                validation_issues = dedupe_issues(validation_issues)

        primary_files = flatten_primary_files(normalized_payload)
        primary_code = primary_files[0]["content"] if primary_files else "// No code returned."
        response_notes = list(normalized_payload.get("notes", []))
        if validation_issues:
            response_notes.extend([f"Validator: {issue}" for issue in validation_issues[:5]])
        response_payload = {
            "code": primary_code,
            "summary": normalized_payload.get("summary", "Generated result"),
            "notes": response_notes,
            "sections": build_section_index(primary_files),
            "raw_model_output": raw_output,
            "intent": intent_info["intent"],
            "intent_confidence": intent_info["confidence"],
            "studio_mode": policy["studio_mode"],
            "strict_options": strict_options,
            "language": language,
            "mode": mode,
            "framework": framework,
            "model": model_name,
            "edit_action": edit_action,
            "compare": compare_enabled,
        }

        if normalized_payload.get("variants"):
            response_payload["variants"] = normalized_payload["variants"]
        else:
            response_payload["files"] = normalized_payload.get("files", [])

        response = jsonify(response_payload)
        for key, value in rate_limit_headers(remaining).items():
            response.headers[key] = value
        return response
    except Exception:
        logger.exception("Groq generation failed.")
        message = "AI generation failed. Please try again."
        if app.config["DEV_ERROR_DETAILS"]:
            import traceback

            message = f"{message} Details: {traceback.format_exc().splitlines()[-1]}"
        return error_response(message, 502)


if __name__ == "__main__":
    app.run(debug=True)
