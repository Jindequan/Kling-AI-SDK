# Python 快速指引（仅使用 Python）

本文面向只使用 Python 的开发者，提供最小接入与可选增强功能示例。默认不强制任何参数与功能。

## 本地安装
```
pip install -e ./python
```

## 最小用法
```
from kling_ai_sdk import KlingClient
import os

client = KlingClient(api_key=os.getenv("KLING_API_KEY"))

# 仅使用 prompt 即可创建任务，其他参数全部可选
task = client.videos.generate_text({ "prompt": "一只蜜蜂在花瓣上采蜜" })

# 不自动轮询，由你自行控制任务查询
result = client.tasks.get(task.get("task_id") or task.get("id"))
```

## 按需启用插件
```
from kling_ai_sdk.plugins import RetryPlugin
client.use(RetryPlugin(max_retries=3))
```

## 传递扩展参数（可选）
```
client.videos.generate_text({
  "prompt": "城市夜景，电影感",
  "extra": { "model_name": "kling-v1-6", "quality_mode": "PRO" }
})
```

## Webhook（可选）
```
# 伪代码：根据你的 Web 框架读取原始请求体
sig = request.headers.get("x-signature")
raw = request.get_data()  # Flask示例

ok = client.webhooks.verify(sig, raw, secret=os.getenv("KLING_WEBHOOK_SECRET"), strict_verify=True)
if not ok:
    return ("", 401)
event = client.webhooks.parse(request)
return ("", 200)
```

## 进阶说明
- 可通过 `KlingClient(api_key, base_url="...")` 覆盖服务端地址。
- 不强制模型、分辨率、运镜等；需要时通过普通参数或 `extra` 传入。
- 默认不启用重试/限流/合规过滤/日志等，按需开启。