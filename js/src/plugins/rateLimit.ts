import { Plugin, RequestContext } from "../types";

export function RateLimitPlugin(opts: { qps?: number; burst?: number } = {}): Plugin {
  const qps = opts.qps ?? 0;
  const burst = opts.burst ?? 0;
  let tokens = burst;
  let last = Date.now();

  function refill() {
    const now = Date.now();
    const delta = now - last;
    last = now;
    tokens = Math.min(burst, tokens + (qps > 0 ? (delta / 1000) * qps : 0));
  }

  return {
    async onRequest(req: RequestContext) {
      // 仅当设置了qps/burst时生效
      if (qps <= 0 || burst <= 0) return req;
      refill();
      if (tokens < 1) {
        const waitMs = Math.ceil((1 - tokens) / qps * 1000);
        await new Promise(r => setTimeout(r, Math.max(waitMs, 0)));
        refill();
      }
      tokens -= 1;
      return req;
    }
  };
}