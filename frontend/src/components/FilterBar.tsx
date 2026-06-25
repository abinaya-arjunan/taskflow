// FilterBar.tsx — Day 4: filter tasks by status, priority, search by title

import { Status, Priority } from "../../../shared/types";

export interface FilterState {
  search:   string;
  status:   Status | "all";
  priority: Priority | "all";
}

interface FilterBarProps {
  filters:   FilterState;
  onChange:  (filters: FilterState) => void;
  taskCount: number;
}

function FilterBar({ filters, onChange, taskCount }: FilterBarProps) {
  function update(partial: Partial<FilterState>) {
    onChange({ ...filters, ...partial });
  }

  return (
    <div style={styles.wrapper}>

      {/* Search input */}
      <input
        type="text"
        placeholder="🔍 Search tasks..."
        value={filters.search}
        onChange={(e) => update({ search: e.target.value })}
        style={styles.search}
      />

      {/* Status filter */}
      <select
        value={filters.status}
        onChange={(e) => update({ status: e.target.value as Status | "all" })}
        style={styles.select}
      >
        <option value="all">All Status</option>
        <option value={Status.Todo}>📋 Todo</option>
        <option value={Status.InProgress}>⚡ In Progress</option>
        <option value={Status.Done}>✅ Done</option>
      </select>

      {/* Priority filter */}
      <select
        value={filters.priority}
        onChange={(e) => update({ priority: e.target.value as Priority | "all" })}
        style={styles.select}
      >
        <option value="all">All Priority</option>
        <option value={Priority.High}>🔴 High</option>
        <option value={Priority.Medium}>🟡 Medium</option>
        <option value={Priority.Low}>🟢 Low</option>
      </select>

      {/* Task count */}
      <span style={styles.count}>{taskCount} task{taskCount !== 1 ? "s" : ""}</span>

      {/* Clear filters */}
      {(filters.search || filters.status !== "all" || filters.priority !== "all") && (
        <button
          onClick={() => onChange({ search: "", status: "all", priority: "all" })}
          style={styles.clearBtn}
        >
          Clear
        </button>
      )}

    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display:     "flex",
    alignItems:  "center",
    gap:         "10px",
    flexWrap:    "wrap",
    marginBottom: "20px",
    padding:     "14px 16px",
    background:  "var(--surface)",
    border:      "1px solid var(--border)",
    borderRadius: "10px",
  },
  search: {
    flex:         "1 1 180px",
    background:   "var(--bg)",
    border:       "1px solid var(--border)",
    borderRadius: "8px",
    padding:      "8px 12px",
    color:        "var(--text)",
    fontSize:     "13px",
    fontFamily:   "inherit",
    outline:      "none",
  },
  select: {
    background:   "var(--bg)",
    border:       "1px solid var(--border)",
    borderRadius: "8px",
    padding:      "8px 10px",
    color:        "var(--text)",
    fontSize:     "12px",
    fontFamily:   "inherit",
    cursor:       "pointer",
    outline:      "none",
  },
  count: {
    fontSize:   "12px",
    color:      "var(--muted)",
    marginLeft: "auto",
    whiteSpace: "nowrap",
  },
  clearBtn: {
    background:   "transparent",
    border:       "1px solid var(--border)",
    color:        "var(--muted)",
    borderRadius: "6px",
    padding:      "6px 12px",
    fontSize:     "12px",
    cursor:       "pointer",
    fontFamily:   "inherit",
  },
};

export default FilterBar;