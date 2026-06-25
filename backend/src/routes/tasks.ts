// tasks.ts — all task routes
// GET    /tasks        → get all tasks
// POST   /tasks        → create a new task
// PATCH  /tasks/:id    → update a task (status, priority, title etc)
// DELETE /tasks/:id    → delete a task

import { Router, Request, Response } from "express";
import { v4 as uuidv4 }             from "uuid";
import { readTasks, writeTasks }     from "../db";
import {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  ApiResponse,
  Priority,
  Status,
} from "../../../shared/types";

const router = Router();

// ── GET /tasks — return all tasks ──
router.get("/", (_req: Request, res: Response) => {
  try {
    const tasks = readTasks();
    const response: ApiResponse<Task[]> = {
      success: true,
      data:    tasks,
      error:   null,
    };
    res.json(response);
  } catch (err) {
    const response: ApiResponse<null> = {
      success: false,
      data:    null,
      error:   "Failed to read tasks",
    };
    res.status(500).json(response);
  }
});

// ── POST /tasks — create a new task ──
router.post("/", (req: Request, res: Response) => {
  try {
    const body = req.body as CreateTaskInput;

    // Validate required fields
    if (!body.title || body.title.trim() === "") {
      const response: ApiResponse<null> = {
        success: false,
        data:    null,
        error:   "Title is required",
      };
      return res.status(400).json(response);
    }

    // Build new task object with TypeScript type safety
    const newTask: Task = {
      id:          uuidv4(),
      title:       body.title.trim(),
      description: body.description?.trim() || "",
      priority:    body.priority || Priority.Medium,
      status:      Status.Todo,
      dueDate:     body.dueDate || null,
      createdAt:   new Date().toISOString(),
      completedAt: null,
    };

    const tasks = readTasks();
    tasks.push(newTask);
    writeTasks(tasks);

    const response: ApiResponse<Task> = {
      success: true,
      data:    newTask,
      error:   null,
    };
    res.status(201).json(response);
  } catch (err) {
    const response: ApiResponse<null> = {
      success: false,
      data:    null,
      error:   "Failed to create task",
    };
    res.status(500).json(response);
  }
});

// ── PATCH /tasks/:id — update a task ──
router.patch("/:id", (req: Request, res: Response) => {
  try {
    const { id }   = req.params;
    const body     = req.body as UpdateTaskInput;
    const tasks    = readTasks();
    const index    = tasks.findIndex((t) => t.id === id);

    if (index === -1) {
      const response: ApiResponse<null> = {
        success: false,
        data:    null,
        error:   "Task not found",
      };
      return res.status(404).json(response);
    }

    // Merge existing task with updates
    const updated: Task = {
      ...tasks[index],
      ...body,
      // If status is being set to Done, record completedAt
      completedAt:
  body.status === Status.Done
    ? new Date().toISOString()
    : body.status !== undefined
    ? null
    : tasks[index].completedAt,
    };

    tasks[index] = updated;
    writeTasks(tasks);

    const response: ApiResponse<Task> = {
      success: true,
      data:    updated,
      error:   null,
    };
    res.json(response);
  } catch (err) {
    const response: ApiResponse<null> = {
      success: false,
      data:    null,
      error:   "Failed to update task",
    };
    res.status(500).json(response);
  }
});

// ── DELETE /tasks/:id — delete a task ──
router.delete("/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const tasks  = readTasks();
    const index  = tasks.findIndex((t) => t.id === id);

    if (index === -1) {
      const response: ApiResponse<null> = {
        success: false,
        data:    null,
        error:   "Task not found",
      };
      return res.status(404).json(response);
    }

    tasks.splice(index, 1);
    writeTasks(tasks);

    const response: ApiResponse<{ id: string }> = {
      success: true,
      data:    { id },
      error:   null,
    };
    res.json(response);
  } catch (err) {
    const response: ApiResponse<null> = {
      success: false,
      data:    null,
      error:   "Failed to delete task",
    };
    res.status(500).json(response);
  }
});

export default router;