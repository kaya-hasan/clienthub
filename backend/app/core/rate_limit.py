from collections import defaultdict, deque
from threading import Lock
from time import time

from fastapi import HTTPException, Request, status

_REQUEST_LOG: dict[str, deque[float]] = defaultdict(deque)
_REQUEST_LOCK = Lock()


def rate_limit(max_requests: int, window_seconds: int):
    async def dependency(request: Request) -> None:
        client_ip = request.client.host if request.client else "unknown"
        key = f"{client_ip}:{request.url.path}"
        current = time()

        with _REQUEST_LOCK:
            bucket = _REQUEST_LOG[key]
            while bucket and current - bucket[0] > window_seconds:
                bucket.popleft()
            if len(bucket) >= max_requests:
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="Too many requests",
                )
            bucket.append(current)

    return dependency
