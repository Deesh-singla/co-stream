/**
 * supabaseUploads.ts
 *
 * Route: POST /api/videos/supabase-upload
 *
 * Separate from the original /api/videos/uploads route.
 * Delete this file + supabaseUploadController.ts to revert completely.
 */

import express from "express";
import { multerServer } from "../config/multer.js";
import { supabaseUploadVideo } from "../controller/supabaseUploadController.js";

const supabaseUploadRouter = express.Router();

supabaseUploadRouter.post(
  "/supabase-upload",
  multerServer.single("file"),
  supabaseUploadVideo
);

export default supabaseUploadRouter;
