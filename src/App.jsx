import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [task, setTask] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [filter, setFilter] = useState("all");

  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem("todos");
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTask = () => {
    if (task.trim() === "") return;

    setTodos([
      ...todos,
      {
        id: Date.now(),
        text: task,
        completed: false,
      },
    ]);

    setTask("");
  };

  const deleteTask = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const toggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const saveEdit = (id) => {
    if (editText.trim() === "") return;

    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: editText } : todo
      )
    );

    setEditId(null);
    setEditText("");
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "completed") return todo.completed;
    if (filter === "pending") return !todo.completed;
    return true;
  });



const totalTasks = todos.length;
const completedTasks = todos.filter((todo) => todo.completed).length;
const pendingTasks = totalTasks - completedTasks;

  return (
    <div className="app">
      <h1>Todo App</h1>

      <div className="input-area">
        <input
          type="text"
          placeholder="Enter task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button onClick={addTask}>Add</button>
      </div>

      <div className="filter-area">
        <button
          onClick={() => setFilter("all")}
          className={filter === "all" ? "active-filter" : ""}
        >
          All
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={filter === "completed" ? "active-filter" : ""}
        >
          Completed
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={filter === "pending" ? "active-filter" : ""}
        >
          Pending
        </button>
      </div>

  <div className="stats">
  <p>Total: {totalTasks}</p>
  <p>Completed: {completedTasks}</p>
  <p>Pending: {pendingTasks}</p>
</div>

      <ul className="todo-list">
        {filteredTodos.map((todo) => (
          <li key={todo.id} className={todo.completed ? "done" : ""}>
            {editId === todo.id ? (
              <>
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button onClick={() => saveEdit(todo.id)}>Save</button>
              </>
            ) : (
              <>
                <span onClick={() => toggleComplete(todo.id)}>{todo.text}</span>

                <div>
                  <button
                    onClick={() => {
                      setEditId(todo.id);
                      setEditText(todo.text);
                    }}
                  >
                    Edit
                  </button>
                  <button onClick={() => deleteTask(todo.id)}>Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;