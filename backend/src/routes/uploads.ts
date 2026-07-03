import express from "express"
import { multerServer } from "../config/multer.js";
import { uploadVideo } from "../controller/uploadController.js";
const uploadRouter = express.Router();

uploadRouter.post("/", multerServer.single("file"), uploadVideo);

export default uploadRouter;