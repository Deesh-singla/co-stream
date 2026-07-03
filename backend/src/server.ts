import express from "express"
import { createServer } from "http";
import cors from "cors";
import uploadRouter from "./routes/uploads.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { isProduction } from "./middleware/DevelopmentMode.js";
import { connectDB } from "./config/db.js";
// console.log("hello");

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express();
const httpServer = createServer(app);


async function start() {
    try {
        await connectDB();
        app.use(cors());
        app.use(express.json());
        app.get("/health", (req, res) => {
            res.status(200).send("ok");
        })


        app.use("/uploads", isProduction, uploadRouter);

        app.use("/dummy", (req, res) => {
            res.json([{ id: "1", url: "https://umesyhynfwqkvfazifdz.supabase.co/storage/v1/object/public/co-stream/video-1/master.m3u8" }, { id: "2", url: "https://umesyhynfwqkvfazifdz.supabase.co/storage/v1/object/public/co-stream/video-2/master.m3u8" }])
        })


        httpServer.listen(8000, () => {
            console.log("server running on port 8000");
        })
    }
    catch (err) {
        console.log(err);
    }
}
start();