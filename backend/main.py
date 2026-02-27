"""
AuditIQ ML Backend - FastAPI Application
Modular, secure, with structured logging and rate limiting.
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from datetime import datetime

from config import logger, ALLOWED_ORIGINS
from middleware import RequestLoggingMiddleware

# --- Rate Limiter ---
limiter = Limiter(key_func=get_remote_address)

# --- FastAPI App ---
app = FastAPI(
    title="AuditIQ ML Backend",
    description=(
        "Backend API for ML training, fairness calculation, "
        "bias detection, and AI-powered insights"
    ),
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Rate limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS - restricted origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Request-ID"],
)

# Request logging middleware
app.add_middleware(RequestLoggingMiddleware)



def _init_llm():
    """Initialize LLM analyzer safely."""
    try:
        from llm_service import LLMAnalyzer  # noqa: E402
        analyzer = LLMAnalyzer()
        logger.info("LLM Analyzer initialized with Gemini")
        return analyzer
    except Exception as e:
        logger.warning(f"LLM Analyzer init warning: {e}")
        return None


def _register_routers():
    """Import and register all routers."""
    from routers.datasets import router as datasets_router  # noqa: E402
    from routers.ml import router as ml_router  # noqa: E402
    from routers.fairness import router as fairness_router  # noqa: E402
    from routers.reports import router as reports_router  # noqa: E402
    from routers.datascience import router as ds_router  # noqa: E402
    from routers.fairness import set_llm_analyzer as set_fairness_llm  # noqa: E402
    from routers.datascience import set_llm_analyzer as set_ds_llm  # noqa: E402

    return (
        datasets_router, ml_router, fairness_router,
        reports_router, ds_router,
        set_fairness_llm, set_ds_llm,
    )


llm_analyzer = _init_llm()

(
    datasets_router, ml_router, fairness_router,
    reports_router, ds_router,
    set_fairness_llm, set_ds_llm,
) = _register_routers()

set_fairness_llm(llm_analyzer)
set_ds_llm(llm_analyzer)

app.include_router(datasets_router)
app.include_router(ml_router)
app.include_router(fairness_router)
app.include_router(reports_router)
app.include_router(ds_router)


# --- Health Check ---
@app.get("/health", tags=["System"])
async def health_check():
    """Health check endpoint with service status."""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "2.0.0",
        "services": {
            "llm": "available" if llm_analyzer else "unavailable",
            "api": "running",
        },
    }


# --- Global Exception Handler ---
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "detail": (
                str(exc) if app.debug
                else "An unexpected error occurred"
            ),
        },
    )


# --- Startup / Shutdown ---
@app.on_event("startup")
async def startup_event():
    logger.info("AuditIQ Backend v2.0.0 starting up")
    logger.info(f"CORS origins: {ALLOWED_ORIGINS}")
    logger.info(f"LLM status: {'enabled' if llm_analyzer else 'disabled'}")


@app.on_event("shutdown")
async def shutdown_event():
    logger.info("AuditIQ Backend shutting down")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
