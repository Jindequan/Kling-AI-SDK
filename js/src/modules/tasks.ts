import { KlingClient } from "../client";
import { JobStatus } from "../types";

export class Tasks {
  constructor(private client: KlingClient) {}

  async create(kind: string, params: Record<string, any>) {
    const body = { kind, ...params };
    const res = await this.client.request("/v1/tasks", { method: "POST", body });
    return res.data ?? { raw: res.raw };
  }

  async get(id: string) {
    const res = await this.client.request(`/v1/tasks/${encodeURIComponent(id)}`, { method: "GET" });
    return res.data ?? { raw: res.raw };
  }

  async cancel(id: string) {
    const res = await this.client.request(`/v1/tasks/${encodeURIComponent(id)}/cancel`, { method: "POST" });
    return res.data ?? { raw: res.raw };
  }

  async pollUntilDone(id: string, opts?: { intervalMs?: number; timeoutMs?: number }) {
    const interval = opts?.intervalMs ?? 3000;
    const timeout = opts?.timeoutMs ?? 180000;
    const start = Date.now();
    while (true) {
      const r = await this.get(id);
      const status: JobStatus | undefined = (r?.task_status ?? r?.status ?? r?.data?.task_status);
      if (status === "SUCCESS" || status === "FAILED" || status === "CANCELED") return r;
      if (Date.now() - start > timeout) throw new Error("Polling timeout");
      await new Promise(res => setTimeout(res, interval));
    }
  }
}