"""
FastAPI middleware for request logging, timing, and error handling.
"""

import time
import uuid
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from config import logger


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Log all requests with timing and request ID."""

    async def dispatch(self, request: Request, call_next):
        request_id = str(uuid.uuid4())[:8]
        request.state.request_id = request_id

        start_time = time.time()
        method = request.method
        path = request.url.path

        logger.info(
            f"[{request_id}] {method} {path} started",
            extra={"request_id": request_id},
        )

        try:
            response: Response = await call_next(request)
            duration_ms = round((time.time() - start_time) * 1000, 2)

            logger.info(
                f"[{request_id}] {method} {path} -> {response.status_code} ({duration_ms}ms)",
                extra={"request_id": request_id},
            )

            response.headers["X-Request-ID"] = request_id
            response.headers["X-Response-Time"] = f"{duration_ms}ms"
            return response

        except Exception as e:
            duration_ms = round((time.time() - start_time) * 1000, 2)
            logger.error(
                f"[{request_id}] {method} {path} -> ERROR ({duration_ms}ms): {str(e)}",
                extra={"request_id": request_id},
                exc_info=True,
            )
            raise
