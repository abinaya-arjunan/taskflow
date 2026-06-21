// App.tsx — Day 1: root component placeholder
// Day 3: full task list and form will go here

import "./index.css";

function App() {
  return (
    <div style={styles.wrapper}>
      <header style={styles.header}>
        <h1 style={styles.logo}>
          <span style={{ color: "var(--accent)" }}>Task</span>Flow
        </h1>
        <p style={styles.tagline}>Full Stack TypeScript Task Manager</p>
      </header>

      <div style={styles.card}>
        <p style={{ color: "var(--muted)", fontSize: "14px" }}>
          ✅ Frontend scaffold ready
        </p>
        <p style={{ color: "var(--muted)", fontSize: "14px", marginTop: "8px" }}>
          ✅ TypeScript types defined in <code style={{ color: "var(--accent)" }}>shared/types.ts</code>
        </p>
        <p style={{ color: "var(--muted)", fontSize: "14px", marginTop: "8px" }}>
          🔜 Backend API coming Day 2
        </p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "40px 16px",
  },
  header: {
    textAlign: "center",
    marginBottom: "32px",
  },
  logo: {
    fontSize: "36px",
    fontWeight: 700,
    letterSpacing: "-1px",
    marginBottom: "6px",
  },
  tagline: {
    fontSize: "14px",
    color: "var(--muted)",
  },
  card: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    padding: "24px",
  },
};

export default App;