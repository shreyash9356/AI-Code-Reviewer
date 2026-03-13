from datetime import datetime


def current_timestamp() -> str:
    """Return an ISO8601 timestamp string."""
    return datetime.utcnow().isoformat() + "Z"

