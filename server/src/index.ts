import type { Request, Response, NextFunction } from "express";
import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js"

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" }));
app.use(express.json());

app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        database: mongoose.connection.readyState === 1 ? "connected" : "not connected",
    });
});

app.use("/api/auth", authRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong. Please try again." });
});

async function start() {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log("MongoDB connected");
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error("Failed to start:", message);
        process.exit(1);
    }
}

start();