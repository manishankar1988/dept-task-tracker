import React, { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { supabase } from './lib/supabaseClient';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    duedate: "",
    assignedto: "",
    priority: "Medium",
    status: "Pending",
  });
  const [loading, setLoading] = useState(true);

  // Fetch tasks from Supabase and subscribe to changes
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('duedate', { ascending: true });
      if (error) console.error('Error fetching tasks:', error);
      else setTasks(data);
      setLoading(false);
    };

    fetchTasks();

    // Real-time subscription using Supabase Realtime v2
    const realtimeChannel = supabase
      .channel('realtime-tasks')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => {
        fetchTasks();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(realtimeChannel);
    };
  }, []);

  const handleChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const addTask = async () => {
    if (!newTask.title || !newTask.duedate) return;
    const { error } = await supabase
      .from('tasks')
      .insert([newTask]);
    if (error) console.error('Error adding task:', error);
    else setNewTask({ title: "", description: "", duedate: "", assignedto: "", priority: "Medium", status: "Pending" });
  };

  const generateMessage = (task) => {
    return `*Task Alert* 🔔\nTask: *${task.title}*\nAssigned to: ${task.assignedto}\nDeadline: ${task.duedate}\nStatus: ${task.status}\nKindly ensure timely completion.`;
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "auto" }}>
      <img
        src="/sahrdaya_header.jpg"
        alt="Sahrdaya Header"
        style={{ width: "100%", maxHeight: "150px", objectFit: "contain", marginBottom: "1rem" }}
      />
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "1rem" }}>
        Department of Computer Science and Engineering
      </h1>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "1rem" }}>
        🗂 Department Task Tracker
      </h1>

      <div style={{ marginBottom: "2rem" }}>
        <input
          name="title"
          placeholder="Task Title"
          value={newTask.title}
          onChange={handleChange}
          style={{ padding: "8px", marginRight: "8px", width: "30%" }}
        />
        <input
          name="duedate"
          type="date"
          value={newTask.duedate}
          onChange={handleChange}
          style={{ padding: "8px", marginRight: "8px" }}
        />
        <input
          name="assignedto"
          placeholder="Assigned To"
          value={newTask.assignedto}
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
        <button
          onClick={addTask}
          style={{ padding: "8px 16px", backgroundColor: "#007bff", color: "white" }}
        >
          Add Task
        </button>
      </div>

      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
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
            <p>
              <strong>Due:</strong> {task.duedate} (
              {formatDistanceToNow(new Date(task.duedate))} remaining)
            </p>
            <p><strong>Assigned To:</strong> {task.assignedto}</p>
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
