import time
import json
import hmac
import hashlib
from typing import Any, Callable, Dict, Optional, Tuple

import requests


class Plugin:
    def on_request(self, req: Dict[str, Any]) -> Dict[str, Any]:
        return req

    def on_response(self, res: Dict[str, Any]) -> Dict[str, Any]:
        return res

    def on_error(self, err: Exception) -> None:
        pass


class KlingClient:
    def __init__(self, api_key: str, base_url: Optional[str] = None, features: Optional[Dict[str, Any]] = None):
        self.api_key = api_key
        self.base_url = base_url or "https://app.klingai.com"
        self.features = features or {}
        self.plugins: list[Plugin] = []

        from .videos import Videos
        from .tasks import Tasks
        from .webhooks import Webhooks

        self.videos = Videos(self)
        self.tasks = Tasks(self)
        self.webhooks = Webhooks(self)

    def use(self, plugin: Plugin):
        self.plugins.append(plugin)
        return self

    def request(self, path: str, method: str = "POST", headers: Optional[Dict[str, str]] = None, body: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        url = path if path.startswith("http") else f"{self.base_url}{path}"
        req = {
            "method": method,
            "url": url,
            "headers": {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
                **(headers or {})
            },
            "json": body,
        }

        for p in self.plugins:
            req = p.on_request(req)

        resp = requests.request(req["method"], req["url"], headers=req["headers"], json=req.get("json"))
        raw_text = resp.text
        try:
            data = resp.json() if raw_text else None
        except Exception:
            data = raw_text

        res = {"status": resp.status_code, "headers": dict(resp.headers), "data": data, "raw": raw_text}

        for p in self.plugins:
            res = p.on_response(res)

        if resp.status_code >= 400:
            err = Exception(f"HTTP {resp.status_code}")
            for p in self.plugins:
                p.on_error(err)
            raise err

        return res