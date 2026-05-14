import { useState } from "react";

function App() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);

  const addTask = () => {
    if (task.trim() === "") return;

    setTodos([...todos, task]);
    setTask("");
  };

  const deleteTask = (index) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Todo App</h1>

      <input
        type="text"
        placeholder="Enter task..."
        value={task}
        onChange={(e) => setTask(e.target.value)}
        style={{
          padding: "10px",
          width: "250px",
          marginRight: "10px",
        }}
      />

      <button onClick={addTask} style={{ padding: "10px" }}>
        Add
      </button>

      <ul style={{ marginTop: "20px" }}>
        {todos.map((todo, index) => (
          <li key={index} style={{ marginBottom: "10px" }}>
            {todo}

            <button
              onClick={() => deleteTask(index)}
              style={{
                marginLeft: "10px",
                backgroundColor: "red",
                color: "white",
                border: "none",
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;