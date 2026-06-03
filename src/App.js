import React, { useState, useEffect } from "react";
import "./App.css";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";

const CATEGORIES = ["General", "Work", "Personal", "Shopping", "Health"];

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");

  useEffect(() => {
    const savedTasks =
      JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(savedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (text, category) => {
    const newTask = {
      id: Date.now(),
      text,
      completed: false,
      category: category || "General",
      createdAt: new Date().toISOString(),
    };

    setTasks([...tasks, newTask]);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const editTask = (id, newText, newCategory) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, text: newText, category: newCategory }
          : task
      )
    );
  };

  const filteredTasks = tasks
    .filter((task) => {
      if (filter === "completed") return task.completed;
      if (filter === "pending") return !task.completed;
      return true;
    })
    .filter((task) => {
      if (categoryFilter === "all") return true;
      return task.category === categoryFilter;
    })
    .sort((a, b) => {
      if (sortBy === "date-desc") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === "date-asc") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      if (sortBy === "alphabetical") {
        return a.text.localeCompare(b.text);
      }
      return 0;
    });

  return (
    <div className="container">
      <header className="app-header">
        <h1>Task Manager</h1>
        <p className="subtitle">Organize your daily tasks beautifully</p>
      </header>

      <TaskInput addTask={addTask} categories={CATEGORIES} />

      <div className="control-panel">
        <div className="filter-group">
          <label>Status:</label>
          <div className="filter-buttons">
            <button
              className={filter === "all" ? "active" : ""}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={filter === "completed" ? "active" : ""}
              onClick={() => setFilter("completed")}
            >
              Completed
            </button>
            <button
              className={filter === "pending" ? "active" : ""}
              onClick={() => setFilter("pending")}
            >
              Pending
            </button>
          </div>
        </div>

        <div className="filter-group">
          <label htmlFor="category-select">Category:</label>
          <select
            id="category-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sort-select">Sort By:</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="alphabetical">Alphabetical</option>
          </select>
        </div>
      </div>

      <TaskList
        tasks={filteredTasks}
        deleteTask={deleteTask}
        toggleTask={toggleTask}
        editTask={editTask}
        categories={CATEGORIES}
      />
    </div>
  );
}

export default App;