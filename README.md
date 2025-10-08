Kling AI SDK (Opt‑in, Minimal, Pluggable)

Overview
- A developer‑friendly SDK for Kling AI that is minimal by default, opt‑in for enhancements, and pluggable via middleware.
- Nothing is forced: retries, rate limiting, polling, webhook verification, logging, and safety are all optional.

Design Principles
- Opt‑in: all advanced features are disabled unless explicitly enabled.
- Minimal: methods require only the smallest parameter set; everything else is optional and can be passed through `extra`.
- Pluggable: middleware/plugins are not hard‑wired; enable with `client.use(plugin)`.
- Extensible: strong types plus passthrough to support future/undocumented fields.
- Non‑opinionated: no enforced model versions, quality modes, camera motions, or strict validation.

Package Layout
- JavaScript/TypeScript: `js/`
- Python: `python/`

JavaScript/TypeScript Only — Install & Quickstart
1) Build locally
```
cd js
npm install
npm run build
```
2) Minimal usage
```
import { KlingClient } from "./js/dist";

const client = new KlingClient({ apiKey: process.env.KLING_API_KEY! });

// Minimal call: prompt only
const task = await client.videos.generateText({ prompt: "A bee collecting nectar on petals" });
// You control task flow; no auto‑polling
const result = await client.tasks.get(task.task_id ?? task.id);
```
3) Optional plugins
```
import { RetryPlugin } from "./js/dist/plugins/retry";
import { RateLimitPlugin } from "./js/dist/plugins/rateLimit";

client.use(RetryPlugin({ maxRetries: 3 }));
client.use(RateLimitPlugin({ qps: 5, burst: 10 }));
```
4) Pass extra params (no forced enums)
```
await client.videos.generateText({
  prompt: "City nightscape, cinematic",
  extra: { model_name: "kling-v1-6", quality_mode: "PRO" }
});
```

Python Only — Install & Quickstart
1) Install locally
```
pip install -e ./python
```
2) Minimal usage
```
from kling_ai_sdk import KlingClient
import os

client = KlingClient(api_key=os.getenv("KLING_API_KEY"))

task = client.videos.generate_text({ "prompt": "A bee collecting nectar on petals" })
result = client.tasks.get(task.get("task_id") or task.get("id"))
```
3) Optional plugin
```
from kling_ai_sdk.plugins import RetryPlugin
client.use(RetryPlugin(max_retries=3))
```

Webhook Verification (Optional)
```
// Node.js (Express example)
app.post("/webhooks/kling", (req, res) => {
  const ok = client.webhooks.verify(
    req.headers["x-signature"],
    req.rawBody,
    { secret: process.env.KLING_WEBHOOK_SECRET, strictVerify: true }
  );
  if (!ok) return res.status(401).end();
  const event = client.webhooks.parse(req);
  res.status(200).end();
});
```

Core Methods (minimal required params)
- `videos.generateText({ prompt, ...optional, extra? })`
- `videos.generateImage({ imageUrl, prompt?, ...optional, extra? })`
- `videos.generateMultiRef({ references, ...optional, extra? })`
- `videos.extend({ taskId, ...optional, extra? })`
- `videos.lipSync({ audioUrl?, tts?, faceImageUrl?, ...optional, extra? })`
- `images.generate({ prompt, ...optional, extra? })`
- `images.vary({ referenceImages, ...optional, extra? })`
- `images.upscale({ imageUrl, ...optional, extra? })`
- `audio.sfx({ prompt, ...optional, extra? })`
- `audio.tts({ text, ...optional, extra? })`
- `tasks.get(id)` / `tasks.create(kind, params)` / `tasks.cancel(id)`
- `webhooks.verify(signature, rawBody, opts)` / `webhooks.parse(req)`

Default Behavior
- No auto‑retry, no auto‑polling, no auto‑download, no auto‑logging, no auto‑safety filtering.
- Validation is loose by default; enable strict mode if needed.

Notes
- Endpoint mapping may differ across environments; override `baseURL` or pass via `extra`.
- This repository provides a skeleton and usage patterns; refer to official Kling AI docs for exact fields.

Chinese Quickstarts
- JS 指引：`docs/zh/quickstart-js.md`
- Python 指引：`docs/zh/quickstart-python.md`