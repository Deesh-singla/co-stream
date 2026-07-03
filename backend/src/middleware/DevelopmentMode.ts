import { Request, Response, NextFunction } from "express";
import { BACKEND_URI } from "../config/env.js";

export const isProduction = (req: Request, res: Response, next: NextFunction) => {
    if (BACKEND_URI != "http://localhost:8000/") {
        res.json("This route is only accessable in Development mode");
    }
    next();
}