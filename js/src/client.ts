import crypto from "node:crypto";
import { Plugin, RequestContext, ResponseContext, FeaturesConfig } from "./types";
import { Videos } from "./modules/videos";
import { Tasks } from "./modules/tasks";
import { Webhooks } from "./modules/webhooks";

export interface KlingClientOptions {
  apiKey: string;
  baseURL?: string;
  features?: FeaturesConfig;
}

export class KlingClient {
  readonly apiKey: string;
  readonly baseURL: string;
  readonly features: FeaturesConfig;
  private plugins: Plugin[] = [];

  readonly videos: Videos;
  readonly tasks: Tasks;
  readonly webhooks: Webhooks;

  constructor(opts: KlingClientOptions) {
    this.apiKey = opts.apiKey;
    this.baseURL = opts.baseURL ?? "https://app.klingai.com";
    this.features = opts.features ?? {};

    this.videos = new Videos(this);
    this.tasks = new Tasks(this);
    this.webhooks = new Webhooks(this);
  }

  use(plugin: Plugin) {
    this.plugins.push(plugin);
    return this;
  }

  async request<T = any>(path: string, init: Partial<RequestContext>): Promise<ResponseContext<T>> {
    const url = path.startsWith("http") ? path : `${this.baseURL}${path}`;
    let req: RequestContext = {
      method: init.method ?? "POST",
      url,
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        ...(init.headers ?? {})
      },
      body: init.body
    };

    for (const p of this.plugins) {
      if (p.onRequest) req = await p.onRequest(req);
    }

    const res = await fetch(req.url, {
      method: req.method,
      headers: req.headers,
      body: req.body ? JSON.stringify(req.body) : undefined
    });

    const raw = await res.text();
    let data: any;
    try { data = raw ? JSON.parse(raw) : undefined; } catch { data = raw; }

    let ctx: ResponseContext<T> = {
      status: res.status,
      headers: Object.fromEntries(res.headers.entries()),
      data,
      raw
    };

    for (const p of this.plugins) {
      if (p.onResponse) ctx = await p.onResponse(ctx);
    }

    if (!res.ok) {
      for (const p of this.plugins) { if (p.onError) await p.onError(ctx); }
      const err = new Error(`HTTP ${res.status}`);
      (err as any).response = ctx;
      throw err;
    }

    return ctx;
  }
}