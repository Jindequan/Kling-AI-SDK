import time
from typing import Any, Dict

class RetryPlugin:
    def __init__(self, max_retries: int = 0, backoff_ms: int = 500):
        self.max_retries = max_retries
        self.backoff_ms = backoff_ms

    def on_request(self, req: Dict[str, Any]) -> Dict[str, Any]:
        return req

    def on_response(self, res: Dict[str, Any]) -> Dict[str, Any]:
        return res

    def on_error(self, err: Exception) -> None:
        # 仅提示性退避，调用方可据此选择重试；不强制自动重试
        time.sleep(self.backoff_ms / 1000.0)