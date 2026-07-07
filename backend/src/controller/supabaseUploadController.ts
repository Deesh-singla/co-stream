/**
 * supabaseUploadController.ts
 *
 * Transcodes an uploaded video into 4-quality HLS using ffmpeg, then
 * uploads every generated file (segments + playlists) to Supabase Storage
 * as they are created.  Local temp files are cleaned up afterwards.
 *
 * Safe to delete: removing this file and supabaseUploads.ts reverts to
 * the original local-only flow with no side-effects.
 */

import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import path, { dirname } from "path";
import fs from "fs";
import { exec } from "child_process";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import VideoModel from "../models/videos.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BUCKET = "co-stream";

/* ── Lazy Supabase client — initialised on first request, not at import time ── */
let _supabase: ReturnType<typeof createClient> | null = null;

function getSupabase() {
  if (_supabase) return _supabase;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env"
    );
  }

  _supabase = createClient(url, key);
  return _supabase;
}

/* ── Helpers ─────────────────────────────────────────────────── */

/**
 * Upload a single local file to Supabase Storage.
 * Returns the public URL on success, throws on failure.
 */
async function uploadFileToSupabase(
  localPath: string,
  storagePath: string,
  contentType: string
): Promise<string> {
  const fileBuffer = fs.readFileSync(localPath);
  const supabase = getSupabase();

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, fileBuffer, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw new Error(`Supabase upload failed for ${storagePath}: ${error.message}`);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  return data.publicUrl;
}

/**
 * Recursively collect all files under a directory.
 */
function collectFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectFiles(fullPath));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Determine the correct MIME type for HLS files.
 */
function contentTypeFor(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".m3u8") return "application/vnd.apple.mpegurl";
  if (ext === ".ts") return "video/mp2t";
  return "application/octet-stream";
}

/* ── Controller ──────────────────────────────────────────────── */

export async function supabaseUploadVideo(
  req: Request,
  res: Response
): Promise<void> {
  if (!req.file) {
    res.status(400).json({ error: "No video file uploaded." });
    return;
  }

  const videoId = uuidv4();
  const videoPath = req.file.path;

  // Local temp directory — used only during transcoding, deleted afterwards
  const outputPath = path.join(__dirname, "..", "uploads", "videos", videoId);

  try {
    // Create variant subdirectories
    for (const variant of ["v0", "v1", "v2", "v3"]) {
      fs.mkdirSync(path.join(outputPath, variant), { recursive: true });
    }

    const masterPlaylistName = "master.m3u8";

    const ffmpegCommand = `ffmpeg -i "${videoPath}" \
-filter_complex \
"[0:v]split=4[v360][v480][v720][v1080]; \
[v360]scale=w=-2:h=360[v360out]; \
[v480]scale=w=-2:h=480[v480out]; \
[v720]scale=w=-2:h=720[v720out]; \
[v1080]scale=w=-2:h=1080[v1080out]" \
-map "[v360out]" -map 0:a:0 \
-c:v:0 libx264 -b:v:0 800k  -maxrate:v:0 856k  -bufsize:v:0 1200k \
-c:a:0 aac -b:a:0 96k \
-map "[v480out]" -map 0:a:0 \
-c:v:1 libx264 -b:v:1 1400k -maxrate:v:1 1498k -bufsize:v:1 2100k \
-c:a:1 aac -b:a:1 128k \
-map "[v720out]" -map 0:a:0 \
-c:v:2 libx264 -b:v:2 2800k -maxrate:v:2 2996k -bufsize:v:2 4200k \
-c:a:2 aac -b:a:2 128k \
-map "[v1080out]" -map 0:a:0 \
-c:v:3 libx264 -b:v:3 5000k -maxrate:v:3 5350k -bufsize:v:3 7500k \
-c:a:3 aac -b:a:3 192k \
-f hls \
-hls_time 6 \
-hls_playlist_type vod \
-hls_flags independent_segments \
-var_stream_map "v:0,a:0 v:1,a:1 v:2,a:2 v:3,a:3" \
-master_pl_name "${masterPlaylistName}" \
-hls_segment_filename "${outputPath}/v%v/segment_%03d.ts" \
"${outputPath}/v%v/index.m3u8"`;

    // Run ffmpeg — wait for full completion before uploading so every
    // segment and playlist file is guaranteed to exist on disk.
    await new Promise<void>((resolve, reject) => {
      exec(ffmpegCommand, (error, _stdout, stderr) => {
        if (error) {
          console.error("[ffmpeg error]", stderr);
          reject(new Error(stderr || error.message));
        } else {
          resolve();
        }
      });
    });

    /* ── Upload all generated files to Supabase ── */
    const allFiles = collectFiles(outputPath);

    console.log(`[supabase-upload] Uploading ${allFiles.length} files for videoId=${videoId}`);

    await Promise.all(
      allFiles.map((localFile) => {
        // storagePath mirrors the local structure: videos/<videoId>/v0/segment_000.ts
        const relativePath = path.relative(
          path.join(__dirname, "..", "uploads"),
          localFile
        );
        // Normalise Windows backslashes → forward slashes for S3-style paths
        const storagePath = relativePath.split(path.sep).join("/");
        const contentType = contentTypeFor(localFile);
        return uploadFileToSupabase(localFile, storagePath, contentType);
      })
    );

    /* ── Build the public master playlist URL ── */
    const masterStoragePath = `videos/${videoId}/${masterPlaylistName}`;
    const { data: urlData } = getSupabase().storage
      .from(BUCKET)
      .getPublicUrl(masterStoragePath);

    const videoUrl = urlData.publicUrl;

    /* ── Clean up local temp files ── */
    fs.rmSync(outputPath, { recursive: true, force: true });
    fs.rmSync(videoPath, { force: true });

    console.log(`[supabase-upload] Done. masterUrl=${videoUrl}`);

    /* ── Respond immediately — client gets the URL regardless of DB ── */
    res.status(201).json({
      message: "Video transcoded and uploaded to Supabase successfully.",
      videoUrl,
      videoId,
    });

    /* ── Persist to MongoDB in the background (non-blocking) ── */
    VideoModel.create({ url: videoUrl }).catch((dbErr) => {
      console.error("[supabase-upload] MongoDB save failed (video already uploaded):", dbErr?.message ?? dbErr);
    });
  } catch (err) {
    console.error("[supabase-upload] Error:", err);

    // Best-effort cleanup on failure
    try {
      if (fs.existsSync(outputPath)) fs.rmSync(outputPath, { recursive: true, force: true });
      if (fs.existsSync(videoPath)) fs.rmSync(videoPath, { force: true });
    } catch (_) {
      // ignore cleanup errors
    }

    res.status(500).json({
      error: err instanceof Error ? err.message : "Internal server error.",
    });
  }
}
