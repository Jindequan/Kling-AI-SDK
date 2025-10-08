import time
from typing import Any, Dict, Optional

class Tasks:
    def __init__(self, client: "KlingClient"):
        self.client = client

    def create(self, kind: str, params: Dict[str, Any]) -> Dict[str, Any]:
        body = {"kind": kind, **params}
        res = self.client.request("/v1/tasks", method="POST", body=body)
        return res.get("data") or {"raw": res.get("raw")}

    def get(self, id: str) -> Dict[str, Any]:
        res = self.client.request(f"/v1/tasks/{id}", method="GET")
        return res.get("data") or {"raw": res.get("raw")}

    def cancel(self, id: str) -> Dict[str, Any]:
        res = self.client.request(f"/v1/tasks/{id}/cancel", method="POST")
        return res.get("data") or {"raw": res.get("raw")}

    def poll_until_done(self, id: str, interval: int = 3, timeout: int = 180) -> Dict[str, Any]:
        start = time.time()
        while True:
            r = self.get(id)
            status = r.get("task_status") or r.get("status")
            if status in ("SUCCESS", "FAILED", "CANCELED"):
                return r
            if time.time() - start > timeout:
                raise TimeoutError("Polling timeout")
            time.sleep(interval)