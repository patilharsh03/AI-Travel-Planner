import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    userId?: string;
}

export default function requireAuth(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");

    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({ error: "Please sign in." });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as { id: string};
        req.userId = payload.id;
        next();
    } catch {
        res.status(401).json({ error: "Your session has expired. Please sign in again." });
    }
}