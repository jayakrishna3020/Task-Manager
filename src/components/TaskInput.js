import React, { useState } from "react";

function TaskInput({ addTask, categories }) {
  const [input, setInput] = useState("");
  const [category, setCategory] = useState(categories[0] || "General");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    addTask(input, category);
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        type="text"
        placeholder="Add a new task..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="task-text-input"
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="task-category-select"
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <button type="submit" className="add-task-btn">
        Add Task
      </button>
    </form>
  );
}

export default TaskInput;