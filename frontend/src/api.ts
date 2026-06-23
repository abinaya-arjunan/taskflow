// api.ts — all frontend API calls with TypeScript return types
// Every function calls the backend and returns typed data

import { Task, CreateTaskInput, UpdateTaskInput, ApiResponse } from "../../shared/types";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// ── GET all tasks ──
export async function fetchTasks(): Promise<Task[]> {
  const res  = await fetch(`${BASE_URL}/tasks`);
  const json = await res.json() as ApiResponse<Task[]>;
  if (!json.success || !json.data) throw new Error(json.error || "Failed to fetch tasks");
  return json.data;
}

// ── POST create a new task ──
export async function createTask(input: CreateTaskInput): Promise<Task> {
  const res  = await fetch(`${BASE_URL}/tasks`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(input),
  });
  const json = await res.json() as ApiResponse<Task>;
  if (!json.success || !json.data) throw new Error(json.error || "Failed to create task");
  return json.data;
}

// ── PATCH update a task ──
export async function updateTask(id: string, input: UpdateTaskInput): Promise<Task> {
  const res  = await fetch(`${BASE_URL}/tasks/${id}`, {
    method:  "PATCH",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(input),
  });
  const json = await res.json() as ApiResponse<Task>;
  if (!json.success || !json.data) throw new Error(json.error || "Failed to update task");
  return json.data;
}

// ── DELETE a task ──
export async function deleteTask(id: string): Promise<void> {
  const res  = await fetch(`${BASE_URL}/tasks/${id}`, { method: "DELETE" });
  const json = await res.json() as ApiResponse<{ id: string }>;
  if (!json.success) throw new Error(json.error || "Failed to delete task");
}