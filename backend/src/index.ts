// index.ts — Day 2: task routes wired up

import express from "express";
import cors    from "cors";
import taskRoutes from "./routes/tasks";

const app  = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ──
app.use(cors({
  origin: ["http://localhost:5173", "https://abinaya-arjunan.github.io"],
  methods: ["GET", "POST", "PATCH", "DELETE"],
}));
app.use(express.json());

// ── Routes ──
app.use("/tasks", taskRoutes);

// ── Health check ──
app.get("/", (_req, res) => {
  res.json({ success: true, data: "TaskFlow API is running ✅", error: null });
});

// ── Start server ──
app.listen(PORT, () => {
  console.log(`✅ TaskFlow backend running on http://localhost:${PORT}`);
});

export default app;