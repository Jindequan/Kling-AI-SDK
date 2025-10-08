import { KlingClient } from "../client";
import { ExtraParams } from "../types";

export interface GenerateTextParams {
  prompt: string;
  duration?: number;
  fps?: number;
  resolution?: string;
  aspectRatio?: string;
  qualityMode?: string;
  style?: string;
  seed?: number;
  cameraMotion?: string;
  modelName?: string;
  extra?: ExtraParams;
}

export interface GenerateImageVideoParams {
  imageUrl: string;
  prompt?: string;
  duration?: number;
  fps?: number;
  resolution?: string;
  aspectRatio?: string;
  qualityMode?: string;
  style?: string;
  seed?: number;
  cameraMotion?: string;
  modelName?: string;
  extra?: ExtraParams;
}

export class Videos {
  constructor(private client: KlingClient) {}

  async generateText(params: GenerateTextParams) {
    const body = {
      prompt: params.prompt,
      duration: params.duration,
      fps: params.fps,
      resolution: params.resolution,
      aspect_ratio: params.aspectRatio,
      quality_mode: params.qualityMode,
      style: params.style,
      seed: params.seed,
      camera_motion: params.cameraMotion,
      model_name: params.modelName,
      ...(params.extra ?? {})
    };
    const res = await this.client.request("/v1/videos/generations", { method: "POST", body });
    return res.data ?? { raw: res.raw };
  }

  async generateImage(params: GenerateImageVideoParams) {
    const body = {
      image_url: params.imageUrl,
      prompt: params.prompt,
      duration: params.duration,
      fps: params.fps,
      resolution: params.resolution,
      aspect_ratio: params.aspectRatio,
      quality_mode: params.qualityMode,
      style: params.style,
      seed: params.seed,
      camera_motion: params.cameraMotion,
      model_name: params.modelName,
      ...(params.extra ?? {})
    };
    const res = await this.client.request("/v1/videos/generations", { method: "POST", body });
    return res.data ?? { raw: res.raw };
  }
}