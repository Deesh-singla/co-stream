import multer from "multer";
import path, { dirname } from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const p = path.join(__dirname, "..", "/uploads")
        if (!fs.existsSync(p)) {
            fs.mkdirSync(p);
        }
        cb(null, p);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + uuidv4()
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
})
export const multerServer = multer({ storage })