import type { Response } from "express";
import type { AuthRequest } from "../middleware/requireAuth.js";
import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import User from "../models/User.js";
import requireAuth from "../middleware/requireAuth.js";

const router = Router();

const registerSchema = z.object({
    name: z.string().trim().min(2).max(50),
    email: z.string().trim().toLowerCase().email(),
    password: z.string().min(8).max(100),
});

const loginSchema = z.object({
    email: z.string().trim().toLowerCase().email(),
    password: z.string().min(1),
});

function signToken(userId: unknown) {
    return jwt.sign({ id: String(userId) }, process.env.JWT_SECRET!, { expiresIn: "7d" });
}

function publicUser(user: {_id: unknown; name: string; email: string}) {
    return { id: user._id, name: user.name, email: user.email };
}

router.post("/register", async (req, res) => {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            error: "Check your name, email and password (at least 8 characters).",
        });
    }
    const { name, email, password } = parsed.data;

    const existing = await User.findOne({ email });
    if (existing) {
        return res.status(409).json({ error: "An account with this email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });

    res.status(201).json({ token: signToken(user._id), user: publicUser(user) });
});

router.post("/login", async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: "Enter a valid email and password." });
    }
    const { email, password } = parsed.data;

    const user = await User.findOne({ email });
    const ok = user && (await bcrypt.compare(password, user.passwordHash));
    if (!ok) {
        return res.status(401).json({ error: "Invalid email or password." });
    }

    res.json({ token: signToken(user._id), user: publicUser(user) });
});

router.get("/me", requireAuth, async (req: AuthRequest, res: Response) => {
    const user = await User.findById(req.userId);
    if (!user) {
        return res.status(401).json({ error: "Account not found." });
    }
    res.json({ user: publicUser(user) });
});

export default router;