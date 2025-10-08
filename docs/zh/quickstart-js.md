# JS/TS 快速指引（仅使用 JavaScript/TypeScript）

本文面向只使用 JS/TS 的开发者，提供最小接入与可选增强功能示例。默认不强制任何参数与功能。

## 本地构建
```
cd js
npm install
npm run build
```

## 最小用法
```
import { KlingClient } from "./js/dist";

const client = new KlingClient({ apiKey: process.env.KLING_API_KEY! });

// 仅使用 prompt 即可创建任务，其他参数全部可选
const task = await client.videos.generateText({ prompt: "一只蜜蜂在花瓣上采蜜" });

// 不自动轮询，由你自行控制任务查询
const result = await client.tasks.get(task.task_id ?? task.id);
```

## 按需启用插件
```
import { RetryPlugin } from "./js/dist/plugins/retry";
import { RateLimitPlugin } from "./js/dist/plugins/rateLimit";

client.use(RetryPlugin({ maxRetries: 3 }));
client.use(RateLimitPlugin({ qps: 5, burst: 10 }));
```

## 传递扩展参数（可选）
```
await client.videos.generateText({
  prompt: "城市夜景，电影感",
  extra: { model_name: "kling-v1-6", quality_mode: "PRO" }
});
```

## Webhook（可选）
```
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

## 进阶说明
- 可通过 `new KlingClient({ baseURL })` 覆盖服务端地址。
- 不强制模型、分辨率、运镜等；需要时通过普通参数或 `extra` 传入。
- 默认不启用重试/限流/合规过滤/日志等，按需开启。