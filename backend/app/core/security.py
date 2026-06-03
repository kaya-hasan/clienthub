import base64
import hashlib
import hmac
import json
import secrets
from datetime import UTC, datetime, timedelta

from app.core.config import settings


def _b64url_encode(value: bytes) -> str:
    return base64.urlsafe_b64encode(value).rstrip(b"=").decode("ascii")


def _b64url_decode(value: str) -> bytes:
    padding = "=" * (-len(value) % 4)
    return base64.urlsafe_b64decode(value + padding)


def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)
    derived = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 390000)
    return f"{_b64url_encode(salt)}${_b64url_encode(derived)}"


def verify_password(password: str, stored_hash: str) -> bool:
    try:
        salt_b64, digest_b64 = stored_hash.split("$", maxsplit=1)
        salt = _b64url_decode(salt_b64)
        expected = _b64url_decode(digest_b64)
    except ValueError:
        return False

    actual = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 390000)
    return hmac.compare_digest(actual, expected)


def create_access_token(user_id: int, email: str) -> str:
    header = {"alg": "HS256", "typ": "JWT"}
    payload = {
        "sub": str(user_id),
        "email": email,
        "exp": int((datetime.now(UTC) + timedelta(minutes=settings.access_token_expire_minutes)).timestamp()),
    }
    header_segment = _b64url_encode(json.dumps(header, separators=(",", ":")).encode("utf-8"))
    payload_segment = _b64url_encode(json.dumps(payload, separators=(",", ":")).encode("utf-8"))
    signing_input = f"{header_segment}.{payload_segment}".encode("ascii")
    signature = hmac.new(settings.secret_key.encode("utf-8"), signing_input, hashlib.sha256).digest()
    return f"{header_segment}.{payload_segment}.{_b64url_encode(signature)}"


def decode_access_token(token: str) -> dict | None:
    try:
        header_segment, payload_segment, signature_segment = token.split(".")
    except ValueError:
        return None

    signing_input = f"{header_segment}.{payload_segment}".encode("ascii")
    expected_signature = hmac.new(
        settings.secret_key.encode("utf-8"),
        signing_input,
        hashlib.sha256,
    ).digest()
    actual_signature = _b64url_decode(signature_segment)
    if not hmac.compare_digest(expected_signature, actual_signature):
        return None

    try:
        payload = json.loads(_b64url_decode(payload_segment))
    except (json.JSONDecodeError, ValueError):
        return None

    if payload.get("exp", 0) < int(datetime.now(UTC).timestamp()):
        return None
    return payload
