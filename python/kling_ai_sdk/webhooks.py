import hmac
import hashlib
from typing import Any, Dict, Optional

class Webhooks:
    def __init__(self, client: "KlingClient"):
        self.client = client

    def verify(self, signature: Optional[str], raw_body: bytes | str, secret: Optional[str] = None, strict_verify: bool = False) -> bool:
        sec = secret or (self.client.features.get("webhook", {}).get("secret") if self.client.features else None)
        if not sec or not signature:
            return False
        raw = raw_body if isinstance(raw_body, bytes) else raw_body.encode("utf-8")
        digest = hmac.new(sec.encode("utf-8"), raw, hashlib.sha256).hexdigest()
        return _timing_safe_equal(digest, signature)

    def parse(self, req: Any):
        try:
            if hasattr(req, "body") and req.body:
                import json
                return json.loads(req.body)
            if hasattr(req, "raw_body") and req.raw_body:
                import json
                raw = req.raw_body.decode("utf-8") if isinstance(req.raw_body, (bytes, bytearray)) else req.raw_body
                return json.loads(raw)
            return None
        except Exception:
            return None

def _timing_safe_equal(a: str, b: str) -> bool:
    try:
        return hmac.compare_digest(a, b)
    except Exception:
        return False