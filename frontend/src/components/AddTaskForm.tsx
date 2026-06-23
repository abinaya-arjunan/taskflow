// AddTaskForm.tsx — form to create a new task
// Fully typed with TypeScript — every field has a type

import { useState } from "react";
import { CreateTaskInput, Priority } from "../../../shared/types";

interface AddTaskFormProps {
  onAdd: (input: CreateTaskInput) => Promise<void>;
}

function AddTaskForm({ onAdd }: AddTaskFormProps) {
  const [title,       setTitle]       = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [priority,    setPriority]    = useState<Priority>(Priority.Medium);
  const [dueDate,     setDueDate]     = useState<string>("");
  const [loading,     setLoading]     = useState<boolean>(false);
  const [error,       setError]       = useState<string | null>(null);
  const [open,        setOpen]        = useState<boolean>(false);

  async function handleSubmit() {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onAdd({
        title:       title.trim(),
        description: description.trim(),
        priority,
        dueDate:     dueDate || null,
      });
      // Reset form
      setTitle("");
      setDescription("");
      setPriority(Priority.Medium);
      setDueDate("");
      setOpen(false);
    } catch (err) {
      setError("Failed to add task. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} style={styles.openBtn}>
        + Add Task
      </button>
    );
  }

  return (
    <div style={styles.form}>
      <h3 style={styles.formTitle}>New Task</h3>

      {/* Title */}
      <input
        type="text"
        placeholder="Task title *"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={styles.input}
        autoFocus
      />

      {/* Description */}
      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ ...styles.input, ...styles.textarea }}
        rows={2}
      />

      {/* Priority + Due date row */}
      <div style={styles.row}>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          style={{ ...styles.input, flex: 1 }}
        >
          <option value={Priority.Low}>🟢 Low</option>
          <option value={Priority.Medium}>🟡 Medium</option>
          <option value={Priority.High}>🔴 High</option>
        </select>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          style={{ ...styles.input, flex: 1 }}
        />
      </div>

      {/* Error */}
      {error && <p style={styles.error}>{error}</p>}

      {/* Buttons */}
      <div style={styles.row}>
        <button onClick={() => setOpen(false)} style={styles.cancelBtn}>
          Cancel
        </button>
        <button onClick={handleSubmit} style={styles.submitBtn} disabled={loading}>
          {loading ? "Adding..." : "Add Task"}
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  openBtn: {
    background:   "var(--accent)",
    color:        "#0d1117",
    border:       "none",
    borderRadius: "8px",
    padding:      "10px 20px",
    fontSize:     "14px",
    fontWeight:   600,
    cursor:       "pointer",
    fontFamily:   "inherit",
    width:        "100%",
  },
  form: {
    background:    "var(--surface)",
    border:        "1px solid var(--border)",
    borderRadius:  "12px",
    padding:       "20px",
    display:       "flex",
    flexDirection: "column",
    gap:           "12px",
  },
  formTitle: {
    fontSize:   "15px",
    fontWeight: 600,
    color:      "var(--text)",
  },
  input: {
    background:   "var(--bg)",
    border:       "1px solid var(--border)",
    borderRadius: "8px",
    padding:      "10px 12px",
    color:        "var(--text)",
    fontSize:     "13px",
    fontFamily:   "inherit",
    outline:      "none",
    width:        "100%",
  },
  textarea: {
    resize:    "vertical",
    minHeight: "60px",
  },
  row: {
    display: "flex",
    gap:     "10px",
  },
  error: {
    fontSize: "12px",
    color:    "#f85149",
  },
  cancelBtn: {
    flex:         1,
    background:   "transparent",
    border:       "1px solid var(--border)",
    color:        "var(--muted)",
    borderRadius: "8px",
    padding:      "10px",
    fontSize:     "13px",
    cursor:       "pointer",
    fontFamily:   "inherit",
  },
  submitBtn: {
    flex:         2,
    background:   "var(--accent)",
    color:        "#0d1117",
    border:       "none",
    borderRadius: "8px",
    padding:      "10px",
    fontSize:     "13px",
    fontWeight:   600,
    cursor:       "pointer",
    fontFamily:   "inherit",
  },
};

export default AddTaskForm;