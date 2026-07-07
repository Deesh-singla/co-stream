import express from "express"
import { createServer } from "http";
import cors from "cors";
import uploadRouter from "./routes/uploads.js";
import supabaseUploadRouter from "./routes/supabaseUploads.js";
import { isProduction } from "./middleware/DevelopmentMode.js";
import { connectDB } from "./config/db.js";


const app = express();
const httpServer = createServer(app);


async function start() {
    try {
        await connectDB();
        app.use(cors({
            origin: process.env.ALLOWED_ORIGIN ?? "http://localhost:3000",
            credentials: true,
        }));
        app.use(express.json());
        app.get("/health", (_req, res) => {
            res.status(200).send("ok");
        })



        app.use("/api/videos", isProduction, uploadRouter);
        app.use("/api/videos", isProduction, supabaseUploadRouter);


        httpServer.listen(8000, () => {
            console.log("server running on port 8000");
        })
    }
    catch (err) {
        console.log(err);
    }
}
start();