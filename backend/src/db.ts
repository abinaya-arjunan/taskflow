// db.ts — JSON file database helper
// Reads and writes tasks to data/tasks.json
// This replaces a real database for now — easy to swap for SQLite later

import fs   from "fs";
import path from "path";
import { Task } from "../../shared/types";

const DB_PATH = path.join(
  __dirname.includes(`${path.sep}dist${path.sep}`)
    ? __dirname.split(path.sep).join(path.sep).replace(`${path.sep}dist${path.sep}backend${path.sep}src`, "")
    : __dirname,
  "data",
  "tasks.json"
);

// Read all tasks from the JSON file
export function readTasks(): Task[] {
  try {
    const dbFolder = path.dirname(DB_PATH);
    if (!fs.existsSync(dbFolder)) {
      fs.mkdirSync(dbFolder, { recursive: true });
    }

    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, "[]", "utf-8");
    }
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(raw) as Task[];
  } catch (error) {
    console.error("Failed to read tasks from DB:", error);
    return [];
  }
}

// Write the full tasks array back to the JSON file
export function writeTasks(tasks: Task[]): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(tasks, null, 2), "utf-8");
}