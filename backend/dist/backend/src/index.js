"use strict";
// index.ts — Day 2: task routes wired up
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const tasks_1 = __importDefault(require("./routes/tasks"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// ── Middleware ──
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173", "https://abinaya-arjunan.github.io"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
}));
app.use(express_1.default.json());
// ── Routes ──
app.use("/tasks", tasks_1.default);
// ── Health check ──
app.get("/", (_req, res) => {
    res.json({ success: true, data: "TaskFlow API is running ✅", error: null });
});
// ── Start server ──
app.listen(PORT, () => {
    console.log(`✅ TaskFlow backend running on http://localhost:${PORT}`);
});
exports.default = app;
