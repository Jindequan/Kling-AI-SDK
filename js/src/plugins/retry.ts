import { Plugin, RequestContext, ResponseContext } from "../types";

export function RetryPlugin(opts: { maxRetries?: number; backoffMs?: number } = {}): Plugin {
  const max = opts.maxRetries ?? 0;
  const backoff = opts.backoffMs ?? 500;
  return {
    async onResponse(res: ResponseContext) {
      return res;
    },
    async onError(error: any) {
      const res = (error?.response as ResponseContext) ?? undefined;
      const retriable = res && (res.status >= 500 || res.status === 429);
      let attempt = (error?.attempt ?? 0) as number;
      if (retriable && attempt < max) {
        await wait(backoff * Math.pow(2, attempt));
        error.attempt = attempt + 1;
        // 信号：由调用方捕获并重试；不强制自动重试
      }
    }
  };
}

function wait(ms: number) { return new Promise(r => setTimeout(r, ms)); }