"use strict";
// types.ts — shared TypeScript interfaces used by BOTH frontend and backend
// This is the heart of TypeScript — define your data shape once, use everywhere
Object.defineProperty(exports, "__esModule", { value: true });
exports.Status = exports.Priority = void 0;
// ── Enums ──
// Enums are better than plain strings — TypeScript will catch typos at compile time
var Priority;
(function (Priority) {
    Priority["Low"] = "low";
    Priority["Medium"] = "medium";
    Priority["High"] = "high";
})(Priority || (exports.Priority = Priority = {}));
var Status;
(function (Status) {
    Status["Todo"] = "todo";
    Status["InProgress"] = "in_progress";
    Status["Done"] = "done";
})(Status || (exports.Status = Status = {}));
