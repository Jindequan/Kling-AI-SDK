from typing import Any, Dict, Optional

class Videos:
    def __init__(self, client: "KlingClient"):
        self.client = client

    def generate_text(self, params: Dict[str, Any]) -> Dict[str, Any]:
        body = {
            "prompt": params.get("prompt"),
            "duration": params.get("duration"),
            "fps": params.get("fps"),
            "resolution": params.get("resolution"),
            "aspect_ratio": params.get("aspect_ratio"),
            "quality_mode": params.get("quality_mode"),
            "style": params.get("style"),
            "seed": params.get("seed"),
            "camera_motion": params.get("camera_motion"),
            "model_name": params.get("model_name"),
            **(params.get("extra") or {})
        }
        res = self.client.request("/v1/videos/generations", method="POST", body=body)
        return res.get("data") or {"raw": res.get("raw")}

    def generate_image(self, params: Dict[str, Any]) -> Dict[str, Any]:
        body = {
            "image_url": params.get("image_url"),
            "prompt": params.get("prompt"),
            "duration": params.get("duration"),
            "fps": params.get("fps"),
            "resolution": params.get("resolution"),
            "aspect_ratio": params.get("aspect_ratio"),
            "quality_mode": params.get("quality_mode"),
            "style": params.get("style"),
            "seed": params.get("seed"),
            "camera_motion": params.get("camera_motion"),
            "model_name": params.get("model_name"),
            **(params.get("extra") or {})
        }
        res = self.client.request("/v1/videos/generations", method="POST", body=body)
        return res.get("data") or {"raw": res.get("raw")}