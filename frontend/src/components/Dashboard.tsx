// Dashboard.tsx — Day 4: productivity stats + recharts

import { Task, Status, Priority, TaskStats } from "../../../shared/types";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie, Legend
} from "recharts";

interface DashboardProps {
  tasks: Task[];
}

// Calculate stats from tasks array
function calcStats(tasks: Task[]): TaskStats {
  const total      = tasks.length;
  const completed  = tasks.filter((t) => t.status === Status.Done).length;
  const inProgress = tasks.filter((t) => t.status === Status.InProgress).length;
  const todo       = tasks.filter((t) => t.status === Status.Todo).length;
  const overdue    = tasks.filter(
    (t) => t.dueDate && t.status !== Status.Done && new Date(t.dueDate) < new Date()
  ).length;

  return {
    total,
    completed,
    inProgress,
    todo,
    overdue,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    byPriority: {
      high:   tasks.filter((t) => t.priority === Priority.High).length,
      medium: tasks.filter((t) => t.priority === Priority.Medium).length,
      low:    tasks.filter((t) => t.priority === Priority.Low).length,
    },
  };
}

function Dashboard({ tasks }: DashboardProps) {
  if (tasks.length === 0) return null;

  const stats = calcStats(tasks);

  // Data for status bar chart
  const statusData = [
    { name: "Todo",        value: stats.todo,       color: "#7d8590" },
    { name: "In Progress", value: stats.inProgress, color: "#58a6ff" },
    { name: "Done",        value: stats.completed,  color: "#3fb950" },
  ];

  // Data for priority pie chart
  const priorityData = [
    { name: "High",   value: stats.byPriority.high,   color: "#f85149" },
    { name: "Medium", value: stats.byPriority.medium, color: "#e3b341" },
    { name: "Low",    value: stats.byPriority.low,    color: "#3fb950" },
  ].filter((d) => d.value > 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload?.length) {
      return (
        <div style={styles.tooltip}>
          <strong style={{ color: payload[0].payload.color }}>{payload[0].name}</strong>
          <span style={{ color: "var(--text)", marginLeft: 6 }}>{payload[0].value} tasks</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.title}>Dashboard</h2>

      {/* ── Stat cards ── */}
      <div style={styles.statGrid}>
        <StatCard label="Total Tasks"      value={stats.total}          color="var(--text)" />
        <StatCard label="Completed"        value={stats.completed}      color="#3fb950" />
        <StatCard label="In Progress"      value={stats.inProgress}     color="#58a6ff" />
        <StatCard label="Completion Rate"  value={`${stats.completionRate}%`} color="#bc8cff" />
        {stats.overdue > 0 && (
          <StatCard label="Overdue" value={stats.overdue} color="#f85149" />
        )}
      </div>

      {/* ── Charts row ── */}
      <div style={styles.chartsRow}>

        {/* Status bar chart */}
        <div style={styles.chartBox}>
          <h3 style={styles.chartTitle}>Tasks by Status</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={statusData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fill: "#7d8590", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#7d8590", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={40}>
                {statusData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Priority pie chart */}
        {priorityData.length > 0 && (
          <div style={styles.chartBox}>
            <h3 style={styles.chartTitle}>Tasks by Priority</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={priorityData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={65}
                  strokeWidth={0}
                >
                  {priorityData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => <span style={{ color: "var(--muted)", fontSize: 11 }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div style={styles.statCard}>
      <span style={{ ...styles.statValue, color }}>{value}</span>
      <span style={styles.statLabel}>{label}</span>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    background:    "var(--surface)",
    border:        "1px solid var(--border)",
    borderRadius:  "12px",
    padding:       "20px 24px",
    marginBottom:  "24px",
    display:       "flex",
    flexDirection: "column",
    gap:           "20px",
  },
  title: {
    fontSize:   "15px",
    fontWeight: 600,
    color:      "var(--text)",
  },
  statGrid: {
    display:             "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
    gap:                 "12px",
  },
  statCard: {
    background:    "var(--bg)",
    border:        "1px solid var(--border)",
    borderRadius:  "8px",
    padding:       "14px 10px",
    display:       "flex",
    flexDirection: "column",
    alignItems:    "center",
    gap:           "4px",
    textAlign:     "center",
  },
  statValue: {
    fontSize:   "22px",
    fontWeight: 700,
    lineHeight: 1,
  },
  statLabel: {
    fontSize:      "10px",
    color:         "var(--muted)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  chartsRow: {
    display:             "grid",
    gridTemplateColumns: "1fr 1fr",
    gap:                 "20px",
  },
  chartBox: {
    display:       "flex",
    flexDirection: "column",
    gap:           "8px",
  },
  chartTitle: {
    fontSize:   "12px",
    fontWeight: 500,
    color:      "var(--muted)",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  tooltip: {
    background:   "#1c2128",
    border:       "1px solid var(--border)",
    borderRadius: "6px",
    padding:      "6px 10px",
    fontSize:     "12px",
  },
};

export default Dashboard;