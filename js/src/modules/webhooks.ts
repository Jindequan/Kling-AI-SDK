import crypto from "node:crypto";
import { KlingClient } from "../client";

export interface VerifyOptions {
  secret?: string;
  tolerantClockSkewMs?: number;
  strictVerify?: boolean;
}

export class Webhooks {
  constructor(private client: KlingClient) {}

  verify(signature: string | undefined, rawBody: Buffer | string, opts?: VerifyOptions) {
    const secret = opts?.secret ?? this.client.features.webhook?.secret;
    if (!secret || !signature) return false;
    const hmac = crypto.createHmac("sha256", secret);
    const digest = hmac.update(typeof rawBody === "string" ? rawBody : rawBody.toString("utf8")).digest("hex");
    return timingSafeEqual(digest, signature);
  }

  parse(req: any) {
    try {
      const body = req.body ?? JSON.parse(req.rawBody?.toString?.("utf8") ?? req.rawBody ?? "{}");
      return body;
    } catch {
      return undefined;
    }
  }
}

function timingSafeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}