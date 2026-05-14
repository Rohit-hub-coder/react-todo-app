import { useEffect, useState } from "react";
import "./App.css";

function App() {
 const [task, setTask] = useState("");
const [editId, setEditId] = useState(null);
const [editText, setEditText] = useState("");

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

const saveEdit = (id) => {
  setTodos(
    todos.map((todo) =>
      todo.id === id
        ? { ...todo, text: editText }
        : todo
    )
  );

  setEditId(null);
  setEditText("");
};

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

     <ul className="todo-list">
  {todos.map((todo) => (
    <li
      key={todo.id}
      className={todo.completed ? "done" : ""}
    >
      {editId === todo.id ? (
        <>
          <input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />

          <button onClick={() => saveEdit(todo.id)}>
            Save
          </button>
        </>
      ) : (
        <>
          <span onClick={() => toggleComplete(todo.id)}>
            {todo.text}
          </span>

          <div>
            <button
              onClick={() => {
                setEditId(todo.id);
                setEditText(todo.text);
              }}
            >
              Edit
            </button>

            <button onClick={() => deleteTask(todo.id)}>
              Delete
            </button>
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