import React from "react";
import TaskItem from "./TaskItem";

function TaskList({
  tasks,
  deleteTask,
  toggleTask,
  editTask,
  categories,
}) {
  return (
    <div className="task-list">
      {tasks.length === 0 ? (
        <p className="no-tasks">No tasks found. Add some to get started!</p>
      ) : (
        tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            deleteTask={deleteTask}
            toggleTask={toggleTask}
            editTask={editTask}
            categories={categories}
          />
        ))
      )}
    </div>
  );
}

export default TaskList;