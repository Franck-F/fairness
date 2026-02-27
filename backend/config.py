"""
Centralized configuration for the AuditIQ backend.
All environment variables, constants, and settings are managed here.
"""

import os
import logging
import json
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

# --- Environment ---
ENV = os.getenv("ENV", "development")
DEBUG = ENV == "development"

# --- CORS ---
ALLOWED_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:3001").split(",")
ALLOWED_ORIGINS = [origin.strip() for origin in ALLOWED_ORIGINS if origin.strip()]

# --- Supabase ---
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

# --- Gemini LLM ---
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

# --- Upload ---
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")
MAX_UPLOAD_SIZE_MB = int(os.getenv("MAX_UPLOAD_SIZE_MB", "10"))
MAX_UPLOAD_SIZE_BYTES = MAX_UPLOAD_SIZE_MB * 1024 * 1024
ALLOWED_FILE_EXTENSIONS = {".csv", ".xlsx", ".xls", ".json"}

# --- Rate Limiting ---
RATE_LIMIT_DEFAULT = os.getenv("RATE_LIMIT_DEFAULT", "100/minute")
RATE_LIMIT_LLM = os.getenv("RATE_LIMIT_LLM", "10/minute")
RATE_LIMIT_UPLOAD = os.getenv("RATE_LIMIT_UPLOAD", "20/minute")

# --- ML ---
ML_RANDOM_STATE = 42
ML_DEFAULT_TEST_SIZE = 0.2
ML_MAX_ESTIMATORS = 100

# --- Fairness Thresholds ---
FAIRNESS_SPD_THRESHOLD = 0.1
FAIRNESS_DI_LOW = 0.8
FAIRNESS_DI_HIGH = 1.25
FAIRNESS_EOD_THRESHOLD = 0.1
FAIRNESS_EO_THRESHOLD = 0.1
FAIRNESS_RISK_HIGH = 75
FAIRNESS_RISK_MEDIUM = 90


# --- Logging ---
class JSONFormatter(logging.Formatter):
    """JSON log formatter for structured logging."""

    def format(self, record):
        log_data = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
            "message": record.getMessage(),
        }
        if hasattr(record, "request_id"):
            log_data["request_id"] = record.request_id
        if record.exc_info and record.exc_info[0] is not None:
            log_data["exception"] = self.formatException(record.exc_info)
        return json.dumps(log_data, ensure_ascii=False)


def setup_logging():
    """Configure structured JSON logging."""
    logger = logging.getLogger("auditiq")
    logger.setLevel(logging.DEBUG if DEBUG else logging.INFO)

    if not logger.handlers:
        handler = logging.StreamHandler()
        handler.setFormatter(JSONFormatter())
        logger.addHandler(handler)

    # Silence noisy third-party loggers
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("httpx").setLevel(logging.WARNING)

    return logger


logger = setup_logging()
