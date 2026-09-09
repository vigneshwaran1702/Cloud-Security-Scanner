import logging
import sys
from typing import Any
from app.utils.sanitizer import redact_text, redact_data

class SensitiveDataFilter(logging.Filter):
    """
    Logging filter that intercepts all LogRecords and scrubs sensitive credentials,
    tokens, API keys, and connection strings from the message, arguments, and exception text.
    """
    def filter(self, record: logging.LogRecord) -> bool:
        try:
            # 1. Redact log record message
            if isinstance(record.msg, str):
                record.msg = redact_text(record.msg)
            elif isinstance(record.msg, (dict, list)):
                record.msg = redact_data(record.msg)

            # 2. Redact record arguments (tuple or dict passed to logger)
            if record.args:
                if isinstance(record.args, tuple):
                    record.args = tuple(
                        redact_text(a) if isinstance(a, str) else redact_data(a)
                        for a in record.args
                    )
                elif isinstance(record.args, dict):
                    record.args = redact_data(record.args)

            # 3. Redact exception text if present
            if record.exc_text:
                record.exc_text = redact_text(record.exc_text)

        except Exception:
            # Fallback to allow logging even if filter encounters unexpected data type
            pass

        return True

class RedactingFormatter(logging.Formatter):
    """
    Custom formatter ensuring that formatted strings are also passed through the sanitizer.
    """
    def format(self, record: logging.LogRecord) -> str:
        formatted = super().format(record)
        return redact_text(formatted)

def configure_secure_logging(level: int = logging.INFO) -> None:
    """
    Configure root and application loggers with SensitiveDataFilter and RedactingFormatter.
    Guarantees no raw secrets are written to stdout/stderr or log handlers.
    """
    root_logger = logging.getLogger()
    root_logger.setLevel(level)

    # Attach filter to root logger
    sensitive_filter = SensitiveDataFilter()
    root_logger.addFilter(sensitive_filter)

    # Configure stdout handler with redacting formatter
    formatter = RedactingFormatter(
        fmt="%(asctime)s [%(levelname)s] [%(name)s] %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )

    # If handlers already exist on root logger, attach filter & formatter
    if root_logger.handlers:
        for handler in root_logger.handlers:
            handler.addFilter(sensitive_filter)
            handler.setFormatter(formatter)
    else:
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setLevel(level)
        console_handler.addFilter(sensitive_filter)
        console_handler.setFormatter(formatter)
        root_logger.addHandler(console_handler)

    # Also secure common framework loggers
    for logger_name in ("uvicorn", "uvicorn.access", "uvicorn.error", "fastapi", "app"):
        framework_logger = logging.getLogger(logger_name)
        framework_logger.addFilter(sensitive_filter)
        for h in framework_logger.handlers:
            h.addFilter(sensitive_filter)
            h.setFormatter(formatter)
