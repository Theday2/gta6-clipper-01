import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const VIDEO_FILE = "VIDEO.json";
const CLIP_FILE = "CLIP.json";
const MANIFEST_FILE = "manifest.json";
const COMPETITION = "gta6-clipper-01";
const MAX_VIDEO_BYTES = 16384;
const MIN_CLIP_SECONDS = 18;
const MAX_CLIP_SECONDS = 22;
const CLIP_WIDTH = 1080;
const CLIP_HEIGHT = 1920;

const YOUTUBE_URL =
  /^https?:\/\/(?:www\.|m\.)?(?:youtube\.com\/(?:shorts\/|watch\?v=)|youtu\.be\/)([A-Za-z0-9_-]{11})(?:[?&#].*)?$/;
const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;
const SHA256_HEX = /^[0-9a-f]{64}$/;

function repoDir(): string {
  const fromEnv = process.env.MAKEFUN_BOT_DIR;
  if (fromEnv !== undefined && fromEnv !== "") {
    return fromEnv;
  }
  return process.cwd();
}

function outputDir(repo: string): string {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  if (fromEnv !== undefined && fromEnv !== "") {
    return fromEnv;
  }
  return join(repo, "out");
}

function readJsonObject(path: string, maxBytes?: number): Record<string, unknown> {
  const raw = readFileSync(path);
  if (maxBytes !== undefined && raw.length > maxBytes) {
    throw new Error(path + " is over " + maxBytes + " bytes");
  }
  const text = raw.toString("utf8");
  const value: unknown = JSON.parse(text);
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("not a JSON object: " + path);
  }
  return value as Record<string, unknown>;
}

function asObject(value: unknown, name: string): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(name + " must be a JSON object");
  }
  return value as Record<string, unknown>;
}

function asNonEmptyString(value: unknown, name: string): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(name + " must be a non-empty string");
  }
  return value;
}

function asFiniteNumber(value: unknown, name: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(name + " must be a finite number");
  }
  return value;
}

function videoIdFromUrl(url: unknown): string {
  if (typeof url !== "string") {
    throw new Error("VIDEO.json url must be a string");
  }
  const match = YOUTUBE_URL.exec(url);
  if (match === null) {
    throw new Error("VIDEO.json url is not a YouTube video address");
  }
  return match[1];
}

function validateClip(clip: Record<string, unknown>): {
  startSeconds: number;
  endSeconds: number;
  width: number;
  height: number;
  hookText: string;
  pitchText: string;
  clipSha256: string;
  sourceVideoId: string;
} {
  const source = asObject(clip.source, "CLIP.json source");
  const sourceVideoId = asNonEmptyString(source.video_id, "CLIP.json source.video_id");
  if (!VIDEO_ID.test(sourceVideoId)) {
    throw new Error("CLIP.json source.video_id must be 11 characters");
  }
  const plan = asObject(clip.clip, "CLIP.json clip");
  const startSeconds = asFiniteNumber(plan.start_seconds, "CLIP.json clip.start_seconds");
  const endSeconds = asFiniteNumber(plan.end_seconds, "CLIP.json clip.end_seconds");
  if (startSeconds < 0 || endSeconds <= startSeconds) {
    throw new Error("CLIP.json clip needs 0 <= start_seconds < end_seconds");
  }
  const width = asFiniteNumber(plan.width, "CLIP.json clip.width");
  const height = asFiniteNumber(plan.height, "CLIP.json clip.height");
  if (width !== CLIP_WIDTH || height !== CLIP_HEIGHT) {
    throw new Error("CLIP.json clip must be " + CLIP_WIDTH + "x" + CLIP_HEIGHT);
  }
  const duration = endSeconds - startSeconds;
  if (duration < MIN_CLIP_SECONDS || duration > MAX_CLIP_SECONDS) {
    throw new Error(
      "CLIP.json clip must be " + MIN_CLIP_SECONDS + "-" + MAX_CLIP_SECONDS + " seconds",
    );
  }
  const hookText = asNonEmptyString(plan.hook_text, "CLIP.json clip.hook_text");
  const pitchText = asNonEmptyString(plan.pitch_text, "CLIP.json clip.pitch_text");
  if (!pitchText.includes("make.fun")) {
    throw new Error("CLIP.json clip.pitch_text must name make.fun");
  }
  const clipSha256 = asNonEmptyString(clip.clip_sha256, "CLIP.json clip_sha256");
  if (!SHA256_HEX.test(clipSha256)) {
    throw new Error("CLIP.json clip_sha256 must be 64 lowercase hex characters");
  }
  return {
    startSeconds,
    endSeconds,
    width,
    height,
    hookText,
    pitchText,
    clipSha256,
    sourceVideoId,
  };
}

function main(): void {
  const repo = repoDir();
  const out = outputDir(repo);
  const videoPath = join(repo, VIDEO_FILE);
  const clipPath = join(repo, CLIP_FILE);
  const video = readJsonObject(videoPath, MAX_VIDEO_BYTES);
  const clip = readJsonObject(clipPath);
  const videoId = videoIdFromUrl(video.url);
  const checked = validateClip(clip);
  mkdirSync(out, { recursive: true });
  copyFileSync(videoPath, join(out, VIDEO_FILE));
  copyFileSync(clipPath, join(out, CLIP_FILE));
  const manifest = {
    competition: COMPETITION,
    video: {
      url: video.url,
      id: videoId,
    },
    clip: {
      source_video_id: checked.sourceVideoId,
      start_seconds: checked.startSeconds,
      end_seconds: checked.endSeconds,
      duration_seconds: checked.endSeconds - checked.startSeconds,
      width: checked.width,
      height: checked.height,
      hook_text: checked.hookText,
      pitch_text: checked.pitchText,
      clip_sha256: checked.clipSha256,
    },
    files: [VIDEO_FILE, CLIP_FILE, MANIFEST_FILE],
  };
  writeFileSync(join(out, MANIFEST_FILE), JSON.stringify(manifest, null, 2) + "\n", "utf8");
}

main();
