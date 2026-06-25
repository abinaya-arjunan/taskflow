"use strict";
// tasks.ts — all task routes
// GET    /tasks        → get all tasks
// POST   /tasks        → create a new task
// PATCH  /tasks/:id    → update a task (status, priority, title etc)
// DELETE /tasks/:id    → delete a task
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uuid_1 = require("uuid");
const db_1 = require("../db");
const types_1 = require("../../../shared/types");
const router = (0, express_1.Router)();
// ── GET /tasks — return all tasks ──
router.get("/", (_req, res) => {
    try {
        const tasks = (0, db_1.readTasks)();
        const response = {
            success: true,
            data: tasks,
            error: null,
        };
        res.json(response);
    }
    catch (err) {
        const response = {
            success: false,
            data: null,
            error: "Failed to read tasks",
        };
        res.status(500).json(response);
    }
});
// ── POST /tasks — create a new task ──
router.post("/", (req, res) => {
    try {
        const body = req.body;
        // Validate required fields
        if (!body.title || body.title.trim() === "") {
            const response = {
                success: false,
                data: null,
                error: "Title is required",
            };
            return res.status(400).json(response);
        }
        // Build new task object with TypeScript type safety
        const newTask = {
            id: (0, uuid_1.v4)(),
            title: body.title.trim(),
            description: body.description?.trim() || "",
            priority: body.priority || types_1.Priority.Medium,
            status: types_1.Status.Todo,
            dueDate: body.dueDate || null,
            createdAt: new Date().toISOString(),
            completedAt: null,
        };
        const tasks = (0, db_1.readTasks)();
        tasks.push(newTask);
        (0, db_1.writeTasks)(tasks);
        const response = {
            success: true,
            data: newTask,
            error: null,
        };
        res.status(201).json(response);
    }
    catch (err) {
        const response = {
            success: false,
            data: null,
            error: "Failed to create task",
        };
        res.status(500).json(response);
    }
});
// ── PATCH /tasks/:id — update a task ──
router.patch("/:id", (req, res) => {
    try {
        const { id } = req.params;
        const body = req.body;
        const tasks = (0, db_1.readTasks)();
        const index = tasks.findIndex((t) => t.id === id);
        if (index === -1) {
            const response = {
                success: false,
                data: null,
                error: "Task not found",
            };
            return res.status(404).json(response);
        }
        // Merge existing task with updates
        const updated = {
            ...tasks[index],
            ...body,
            // If status is being set to Done, record completedAt
            completedAt: body.status === types_1.Status.Done
                ? new Date().toISOString()
                : body.status !== undefined
                    ? null
                    : tasks[index].completedAt,
        };
        tasks[index] = updated;
        (0, db_1.writeTasks)(tasks);
        const response = {
            success: true,
            data: updated,
            error: null,
        };
        res.json(response);
    }
    catch (err) {
        const response = {
            success: false,
            data: null,
            error: "Failed to update task",
        };
        res.status(500).json(response);
    }
});
// ── DELETE /tasks/:id — delete a task ──
router.delete("/:id", (req, res) => {
    try {
        const { id } = req.params;
        const tasks = (0, db_1.readTasks)();
        const index = tasks.findIndex((t) => t.id === id);
        if (index === -1) {
            const response = {
                success: false,
                data: null,
                error: "Task not found",
            };
            return res.status(404).json(response);
        }
        tasks.splice(index, 1);
        (0, db_1.writeTasks)(tasks);
        const response = {
            success: true,
            data: { id },
            error: null,
        };
        res.json(response);
    }
    catch (err) {
        const response = {
            success: false,
            data: null,
            error: "Failed to delete task",
        };
        res.status(500).json(response);
    }
});
exports.default = router;
