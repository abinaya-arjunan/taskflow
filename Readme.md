# TaskFlow ✅

A full stack task manager built with **React + TypeScript** (frontend) and **Express + TypeScript** (backend).

🔗 **[Live Demo](https://abinaya-arjunan.github.io/taskflow)**
🖥 **[Backend API](https://taskflow-api.onrender.com)**

---

## Features

- ✅ Add tasks with title, description, priority, and due date
- ⚡ Status tracking — Todo → In Progress → Done (click to cycle)
- 🔴 Priority levels — High, Medium, Low with color badges
- ⚠️ Overdue detection — tasks past due date highlighted in red
- 📊 Productivity dashboard — completion rate, stats grid, bar + pie charts
- 🔍 Filter by status, priority, and search by title
- 🌙 Dark / Light mode toggle
- 📱 Fully responsive — works on mobile

---

## Tech Stack

| Layer      | Tech                              |
|------------|-----------------------------------|
| Frontend   | React 18 + TypeScript + Vite      |
| Backend    | Node.js + Express + TypeScript    |
| Database   | JSON file (fs module)             |
| Charts     | Recharts                          |
| Deploy     | GitHub Pages + Render             |

---

## Project Structure

```
taskflow/
├── shared/
│   └── types.ts          ← shared TypeScript interfaces
├── frontend/
│   └── src/
│       ├── App.tsx
│       ├── api.ts         ← typed API client
│       └── components/
│           ├── TaskCard.tsx
│           ├── AddTaskForm.tsx
│           ├── Dashboard.tsx
│           └── FilterBar.tsx
└── backend/
    └── src/
        ├── index.ts       ← Express server
        ├── db.ts          ← JSON file database
        └── routes/
            └── tasks.ts   ← REST API routes
```

---

## API Endpoints

| Method | Route         | Description       |
|--------|---------------|-------------------|
| GET    | /tasks        | Get all tasks     |
| POST   | /tasks        | Create a task     |
| PATCH  | /tasks/:id    | Update a task     |
| DELETE | /tasks/:id    | Delete a task     |

---

## Run Locally

```bash
# Terminal 1 — Backend
cd backend
npm install
npm run dev

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev
```

---

## What I Learned

- Designing shared TypeScript interfaces used by both frontend and backend
- Building a REST API with typed Express routes and request/response types
- Writing a typed API client on the frontend that matches backend contracts
- Using TypeScript enums for status and priority instead of plain strings
- `useMemo` for efficient filtering without re-renders
- Deploying a full stack app — frontend on GitHub Pages, backend on Render

---