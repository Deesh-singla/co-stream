import dotenv from "dotenv"

dotenv.config();

if (!process.env.BACKEND_URI) {
    throw new Error("backend uri not given");
}

const BACKEND_URI = process.env.BACKEND_URI;

export { BACKEND_URI };
