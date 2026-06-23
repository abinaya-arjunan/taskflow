// TaskCard.tsx — displays a single task with status toggle and delete button

import { Task, Status, Priority, UpdateTaskInput } from "../../../shared/types";

interface TaskCardProps {
  task:     Task;
  onUpdate: (id: string, input: UpdateTaskInput) => void;
  onDelete: (id: string) => void;
}

// Priority colors
const PRIORITY_STYLES: Record<Priority, { bg: string; color: string; label: string }> = {
  [Priority.High]:   { bg: "rgba(248,81,73,0.15)",  color: "#f85149", label: "High" },
  [Priority.Medium]: { bg: "rgba(227,179,65,0.15)",  color: "#e3b341", label: "Medium" },
  [Priority.Low]:    { bg: "rgba(63,185,80,0.15)",   color: "#3fb950", label: "Low" },
};

// Status cycle: todo → in_progress → done → todo
const NEXT_STATUS: Record<Status, Status> = {
  [Status.Todo]:       Status.InProgress,
  [Status.InProgress]: Status.Done,
  [Status.Done]:       Status.Todo,
};

const STATUS_LABEL: Record<Status, string> = {
  [Status.Todo]:       "📋 Todo",
  [Status.InProgress]: "⚡ In Progress",
  [Status.Done]:       "✅ Done",
};

function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
  const priority = PRIORITY_STYLES[task.priority];
  const isDone   = task.status === Status.Done;

  // Check if task is overdue
  const isOverdue = task.dueDate && !isDone && new Date(task.dueDate) < new Date();

  function handleStatusClick() {
    onUpdate(task.id, { status: NEXT_STATUS[task.status] });
  }

  function handleDeleteClick() {
    if (window.confirm(`Delete "${task.title}"?`)) {
      onDelete(task.id);
    }
  }

  return (
    <div style={{ ...styles.card, opacity: isDone ? 0.6 : 1 }}>

      {/* Top row: title + delete */}
      <div style={styles.topRow}>
        <h3 style={{ ...styles.title, textDecoration: isDone ? "line-through" : "none" }}>
          {task.title}
        </h3>
        <button onClick={handleDeleteClick} style={styles.deleteBtn} title="Delete task">
          🗑
        </button>
      </div>

      {/* Description */}
      {task.description && (
        <p style={styles.description}>{task.description}</p>
      )}

      {/* Bottom row: priority + due date + status button */}
      <div style={styles.bottomRow}>

        {/* Priority badge */}
        <span style={{ ...styles.badge, background: priority.bg, color: priority.color }}>
          {priority.label}
        </span>

        {/* Due date */}
        {task.dueDate && (
          <span style={{ ...styles.dueDate, color: isOverdue ? "#f85149" : "var(--muted)" }}>
            {isOverdue ? "⚠ " : "📅 "}
            {new Date(task.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
          </span>
        )}

        {/* Status toggle button */}
        <button onClick={handleStatusClick} style={styles.statusBtn}>
          {STATUS_LABEL[task.status]}
        </button>

      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    background:    "var(--surface)",
    border:        "1px solid var(--border)",
    borderRadius:  "10px",
    padding:       "16px",
    display:       "flex",
    flexDirection: "column",
    gap:           "10px",
    transition:    "border-color 0.2s",
  },
  topRow: {
    display:        "flex",
    justifyContent: "space-between",
    alignItems:     "flex-start",
    gap:            "10px",
  },
  title: {
    fontSize:   "14px",
    fontWeight: 600,
    color:      "var(--text)",
    lineHeight: 1.4,
    flex:       1,
  },
  deleteBtn: {
    background: "transparent",
    border:     "none",
    cursor:     "pointer",
    fontSize:   "14px",
    padding:    "2px",
    flexShrink: 0,
    opacity:    0.5,
  },
  description: {
    fontSize:   "12px",
    color:      "var(--muted)",
    lineHeight: 1.5,
  },
  bottomRow: {
    display:    "flex",
    alignItems: "center",
    gap:        "8px",
    flexWrap:   "wrap",
  },
  badge: {
    fontSize:     "11px",
    fontWeight:   500,
    padding:      "2px 8px",
    borderRadius: "4px",
  },
  dueDate: {
    fontSize: "11px",
  },
  statusBtn: {
    marginLeft:   "auto",
    background:   "var(--bg)",
    border:       "1px solid var(--border)",
    color:        "var(--text)",
    borderRadius: "6px",
    padding:      "4px 10px",
    fontSize:     "11px",
    cursor:       "pointer",
    fontFamily:   "inherit",
    whiteSpace:   "nowrap",
  },
};

export default TaskCard;