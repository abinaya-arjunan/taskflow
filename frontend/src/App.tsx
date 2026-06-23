// App.tsx — Day 4: Dashboard + FilterBar added

import { useState, useEffect, useMemo } from "react";
import { Task, UpdateTaskInput, CreateTaskInput, Status, Priority } from "../../shared/types";
import { fetchTasks, createTask, updateTask, deleteTask } from "./api";
import TaskCard    from "./components/TaskCard";
import AddTaskForm from "./components/AddTaskForm";
import Dashboard   from "./components/Dashboard";
import FilterBar, { FilterState } from "./components/FilterBar";
import "./index.css";

const DEFAULT_FILTERS: FilterState = {
  search:   "",
  status:   "all",
  priority: "all",
};

function App() {
  const [tasks,   setTasks]   = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error,   setError]   = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [showDash, setShowDash] = useState<boolean>(true);

  useEffect(() => { loadTasks(); }, []);

  async function loadTasks() {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTasks();
      setTasks(data);
    } catch {
      setError("Cannot connect to backend. Make sure it is running on port 3001.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(input: CreateTaskInput) {
    const newTask = await createTask(input);
    setTasks((prev) => [newTask, ...prev]);
  }

  async function handleUpdate(id: string, input: UpdateTaskInput) {
    const updated = await updateTask(id, input);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
  }

  async function handleDelete(id: string) {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  // Apply filters using useMemo — only recalculates when tasks or filters change
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchSearch   = t.title.toLowerCase().includes(filters.search.toLowerCase());
      const matchStatus   = filters.status   === "all" || t.status   === filters.status;
      const matchPriority = filters.priority === "all" || t.priority === filters.priority;
      return matchSearch && matchStatus && matchPriority;
    });
  }, [tasks, filters]);

  const todoTasks       = filteredTasks.filter((t) => t.status === Status.Todo);
  const inProgressTasks = filteredTasks.filter((t) => t.status === Status.InProgress);
  const doneTasks       = filteredTasks.filter((t) => t.status === Status.Done);

  return (
    <div style={styles.wrapper}>

      {/* HEADER */}
      <header style={styles.header}>
        <h1 style={styles.logo}>
          <span style={{ color: "var(--accent)" }}>Task</span>Flow
        </h1>
        <p style={styles.tagline}>Full Stack TypeScript Task Manager</p>
      </header>

      {/* ADD TASK */}
      <div style={styles.formWrapper}>
        <AddTaskForm onAdd={handleAdd} />
      </div>

      {/* DASHBOARD TOGGLE */}
      {tasks.length > 0 && (
        <button onClick={() => setShowDash((v) => !v)} style={styles.toggleBtn}>
          {showDash ? "Hide Dashboard" : "Show Dashboard"}
        </button>
      )}

      {/* DASHBOARD */}
      {showDash && <Dashboard tasks={tasks} />}

      {/* FILTER BAR */}
      {tasks.length > 0 && (
        <FilterBar
          filters={filters}
          onChange={setFilters}
          taskCount={filteredTasks.length}
        />
      )}

      {/* LOADING */}
      {loading && <p style={styles.message}>Loading tasks...</p>}

      {/* ERROR */}
      {error && !loading && (
        <div style={styles.errorBox}>
          <p>⚠️ {error}</p>
          <button onClick={loadTasks} style={styles.retryBtn}>Retry</button>
        </div>
      )}

      {/* EMPTY */}
      {!loading && !error && tasks.length === 0 && (
        <div style={styles.empty}>
          <span style={{ fontSize: "40px" }}>📋</span>
          <p style={{ color: "var(--muted)", fontSize: "14px" }}>No tasks yet — add one above!</p>
        </div>
      )}

      {/* TASK COLUMNS */}
      {!loading && !error && tasks.length > 0 && (
        <div style={styles.columns}>
          <TaskColumn title="📋 Todo"        tasks={todoTasks}       onUpdate={handleUpdate} onDelete={handleDelete} />
          <TaskColumn title="⚡ In Progress"  tasks={inProgressTasks} onUpdate={handleUpdate} onDelete={handleDelete} />
          <TaskColumn title="✅ Done"         tasks={doneTasks}       onUpdate={handleUpdate} onDelete={handleDelete} />
        </div>
      )}

    </div>
  );
}

interface TaskColumnProps {
  title:    string;
  tasks:    Task[];
  onUpdate: (id: string, input: UpdateTaskInput) => void;
  onDelete: (id: string) => void;
}

function TaskColumn({ title, tasks, onUpdate, onDelete }: TaskColumnProps) {
  return (
    <div style={styles.column}>
      <div style={styles.columnHeader}>
        <span style={styles.columnTitle}>{title}</span>
        <span style={styles.columnCount}>{tasks.length}</span>
      </div>
      <div style={styles.columnBody}>
        {tasks.length === 0
          ? <p style={styles.emptyColumn}>No tasks here</p>
          : tasks.map((task) => (
              <TaskCard key={task.id} task={task} onUpdate={onUpdate} onDelete={onDelete} />
            ))
        }
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper:     { maxWidth: "1100px", margin: "0 auto", padding: "40px 16px 60px" },
  header:      { textAlign: "center", marginBottom: "32px" },
  logo:        { fontSize: "36px", fontWeight: 700, letterSpacing: "-1px", marginBottom: "6px" },
  tagline:     { fontSize: "14px", color: "var(--muted)" },
  formWrapper: { maxWidth: "480px", margin: "0 auto 24px" },
  toggleBtn:   { display: "block", margin: "0 auto 16px", background: "transparent", border: "1px solid var(--border)", color: "var(--muted)", borderRadius: "6px", padding: "6px 16px", fontSize: "12px", cursor: "pointer", fontFamily: "inherit" },
  message:     { textAlign: "center", color: "var(--muted)", fontSize: "14px", padding: "40px 0" },
  errorBox:    { background: "rgba(248,81,73,0.1)", border: "1px solid rgba(248,81,73,0.3)", borderRadius: "10px", padding: "20px", textAlign: "center", color: "#f85149", fontSize: "13px" },
  retryBtn:    { marginTop: "10px", background: "transparent", border: "1px solid #f85149", color: "#f85149", borderRadius: "6px", padding: "6px 16px", cursor: "pointer", fontFamily: "inherit", fontSize: "12px" },
  empty:       { display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", padding: "60px 0" },
  columns:     { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", alignItems: "start" },
  column:      { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden" },
  columnHeader:{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", borderBottom: "1px solid var(--border)", background: "var(--bg)" },
  columnTitle: { fontSize: "13px", fontWeight: 600, color: "var(--text)" },
  columnCount: { background: "var(--border)", color: "var(--muted)", fontSize: "11px", padding: "2px 8px", borderRadius: "10px" },
  columnBody:  { padding: "12px", display: "flex", flexDirection: "column", gap: "10px", minHeight: "100px" },
  emptyColumn: { fontSize: "12px", color: "var(--muted)", textAlign: "center", padding: "20px 0" },
};

export default App;