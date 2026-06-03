import React, { useState } from "react";

function TaskItem({
  task,
  deleteTask,
  toggleTask,
  editTask,
  categories,
}) {
  const [editing, setEditing] = useState(false);
  const [newText, setNewText] = useState(task.text);
  const [newCategory, setNewCategory] = useState(task.category || "General");

  const saveEdit = () => {
    if (!newText.trim()) return;

    editTask(task.id, newText, newCategory);
    setEditing(false);
  };

  const formattedDate = task.createdAt
    ? new Date(task.createdAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div className={`task-card ${task.completed ? "task-completed" : ""}`}>
      <div className="task-left">
        <label className="checkbox-container">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => toggleTask(task.id)}
          />
          <span className="checkmark"></span>
        </label>

        {editing ? (
          <div className="edit-container">
            <input
              type="text"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              className="edit-text-input"
            />
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="edit-category-select"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="task-content">
            <span className={`task-text ${task.completed ? "line-through" : ""}`}>
              {task.text}
            </span>
            <div className="task-meta">
              <span className={`category-tag tag-${task.category?.toLowerCase() || "general"}`}>
                {task.category || "General"}
              </span>
              {formattedDate && <span className="task-date">{formattedDate}</span>}
            </div>
          </div>
        )}
      </div>

      <div className="task-actions">
        {editing ? (
          <>
            <button onClick={saveEdit} className="btn-save">
              Save
            </button>
            <button onClick={() => setEditing(false)} className="btn-cancel">
              Cancel
            </button>
          </>
        ) : (
          <>
            <button onClick={() => setEditing(true)} className="btn-edit">
              Edit
            </button>
            <button onClick={() => deleteTask(task.id)} className="btn-delete">
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default TaskItem;