import React, { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    assignedTo: "",
    priority: "Medium",
    status: "Pending",
  });

  // Load from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save to localStorage on every update
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const addTask = () => {
    if (newTask.title && newTask.dueDate) {
      setTasks([...tasks, { ...newTask, id: Date.now() }]);
      setNewTask({
        title: "",
        description: "",
        dueDate: "",
        assignedTo: "",
        priority: "Medium",
        status: "Pending",
      });
    }
  };

  const generateMessage = (task) => {
    return `*Task Alert* 🔔\nTask: *${task.title}*\nAssigned to: ${task.assignedTo}\nDeadline: ${task.dueDate}\nStatus: ${task.status}\nKindly ensure timely completion.`;
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "auto" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "1rem" }}>🗂 Department Task Tracker</h1>

      <div style={{ marginBottom: "2rem" }}>
        <input
          name="title"
          placeholder="Task Title"
          value={newTask.title}
          onChange={handleChange}
          style={{ padding: "8px", marginRight: "8px", width: "30%" }}
        />
        <input
          name="dueDate"
          type="date"
          value={newTask.dueDate}
          onChange={handleChange}
          style={{ padding: "8px", marginRight: "8px" }}
        />
        <input
          name="assignedTo"
          placeholder="Assigned To"
          value={newTask.assignedTo}
          onChange={handleChange}
          style={{ padding: "8px", marginRight: "8px", width: "20%" }}
        />
        <select
          name="priority"
          value={newTask.priority}
          onChange={handleChange}
          style={{ padding: "8px", marginRight: "8px" }}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <button onClick={addTask} style={{ padding: "8px 16px", backgroundColor: "#007bff", color: "white" }}>
          Add Task
        </button>
      </div>

      {tasks.length === 0 ? (
        <p>No tasks yet.</p>
      ) : (
        tasks.map((task) => (
          <div
            key={task.id}
            style={{
              border: "1px solid #ccc",
              padding: "1rem",
              marginBottom: "1rem",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <h2>{task.title}</h2>
            <p><strong>Description:</strong> {task.description || "N/A"}</p>
            <p><strong>Due:</strong> {task.dueDate} ({formatDistanceToNow(new Date(task.dueDate))} remaining)</p>
            <p><strong>Assigned To:</strong> {task.assignedTo}</p>
            <p><strong>Priority:</strong> {task.priority}</p>
            <p><strong>Status:</strong> {task.status}</p>
            <textarea
              readOnly
              style={{ width: "100%", padding: "8px", marginTop: "1rem", fontFamily: "monospace" }}
              value={generateMessage(task)}
              rows={4}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default App;
