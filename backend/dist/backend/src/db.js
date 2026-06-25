"use strict";
// db.ts — JSON file database helper
// Reads and writes tasks to data/tasks.json
// This replaces a real database for now — easy to swap for SQLite later
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readTasks = readTasks;
exports.writeTasks = writeTasks;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const DB_PATH = path_1.default.join(__dirname, "../../data/tasks.json");
// Read all tasks from the JSON file
function readTasks() {
    try {
        if (!fs_1.default.existsSync(DB_PATH)) {
            fs_1.default.writeFileSync(DB_PATH, "[]", "utf-8");
        }
        const raw = fs_1.default.readFileSync(DB_PATH, "utf-8");
        return JSON.parse(raw);
    }
    catch {
        return [];
    }
}
// Write the full tasks array back to the JSON file
function writeTasks(tasks) {
    fs_1.default.writeFileSync(DB_PATH, JSON.stringify(tasks, null, 2), "utf-8");
}
