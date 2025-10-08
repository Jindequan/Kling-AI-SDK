export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface RequestContext {
  method: HttpMethod;
  url: string;
  headers: Record<string, string>;
  body?: any;
}

export interface ResponseContext<T = any> {
  status: number;
  headers: Record<string, string>;
  data?: T;
  raw?: any;
}

export interface Plugin {
  onRequest?(req: RequestContext): Promise<RequestContext> | RequestContext;
  onResponse?(res: ResponseContext): Promise<ResponseContext> | ResponseContext;
  onError?(error: any): Promise<void> | void;
}

export interface FeaturesConfig {
  retry?: { enabled?: boolean; maxRetries?: number; backoffMs?: number };
  rateLimit?: { enabled?: boolean; qps?: number; burst?: number };
  polling?: { enabled?: boolean; intervalMs?: number; timeoutMs?: number };
  webhook?: { secret?: string; tolerantClockSkewMs?: number; strictVerify?: boolean };
  logger?: { enabled?: boolean; level?: "silent" | "error" | "info" | "debug" };
  safety?: { enabled?: boolean; policy?: string };
  validation?: { strict?: boolean };
}

export type ExtraParams = Record<string, any> | undefined;

export type JobStatus = "QUEUED" | "PROCESSING" | "SUCCESS" | "FAILED" | "CANCELED";