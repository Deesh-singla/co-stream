import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import path, { dirname } from "path"
import fs from "fs"
import { exec } from "child_process";
import { fileURLToPath } from "url";
import videosModel from "../models/videos.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export async function uploadVideo(req: Request, res: Response) {
    try {
        const videoId = uuidv4();
        if (!req.file) {
            return res.status(400).json({
                error: "No video uploaded",
            });
        }

        const videoPath = req.file.path;
        const outputPath = path.join(__dirname, "..", "uploads", "videos", videoId);

        fs.mkdirSync(path.join(outputPath, "v0"), { recursive: true });
        fs.mkdirSync(path.join(outputPath, "v1"), { recursive: true });
        fs.mkdirSync(path.join(outputPath, "v2"), { recursive: true });
        fs.mkdirSync(path.join(outputPath, "v3"), { recursive: true });

        const masterPlaylistName = "master.m3u8";

        const ffmpegCommand2 = `ffmpeg -i "${videoPath}" \
-filter_complex \
"[0:v]split=4[v360][v480][v720][v1080]; \
[v360]scale=w=-2:h=360[v360out]; \
[v480]scale=w=-2:h=480[v480out]; \
[v720]scale=w=-2:h=720[v720out]; \
[v1080]scale=w=-2:h=1080[v1080out]" \
-map "[v360out]" -map 0:a:0 \
-c:v:0 libx264 -b:v:0 800k -maxrate:v:0 856k -bufsize:v:0 1200k \
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

        exec(ffmpegCommand2, async (error, stdout, stderr) => {
            if (error) {
                console.log("ERROR");
                console.log(error);
                console.log(stderr);
                return;
            }
            const videoUrl = `http://localhost:8000/uploads/videos/${videoId}/master.m3u8`;
            console.log(videoUrl);
            await videosModel.insertOne({ url: videoUrl });
            res.json({
                message: "Video converted successfully",
                videoUrl,
                videoId
            });

        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "internal server error" })
    }
}