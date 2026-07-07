import { Request, Response, NextFunction } from "express";
import { BACKEND_URI } from "../config/env.js";

/**
 * Allows the route only when running locally.
 * Returns early after sending the block response — never calls next() in that case.
 */
export const isProduction = (req: Request, res: Response, next: NextFunction) => {
    const uri = (BACKEND_URI ?? "").replace(/\/$/, ""); // strip trailing slash
    if (uri !== "http://localhost:8000") {
        res.status(403).json({ error: "This route is only accessible in development mode." });
        return; // <-- must return, not fall through to next()
    }
    next();
};
