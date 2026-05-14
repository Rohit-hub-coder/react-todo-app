import { useEffect, useMemo, useState } from "react";
import "./App.css";

function App() {
  const [task, setTask] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  const [todos, setTodos] = useState(() => {
    try {
      const saved = localStorage.getItem("todos");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTask = () => {
    const value = task.trim();
    if (!value) return;

    setTodos((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: value,
        completed: false,
      },
    ]);

    setTask("");
  };

  const deleteTask = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));

    if (editId === id) {
      setEditId(null);
      setEditText("");
    }
  };

  const toggleComplete = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const startEdit = (todo) => {
    setEditId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = (id) => {
    const value = editText.trim();
    if (!value) return;

    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, text: value } : todo))
    );

    setEditId(null);
    setEditText("");
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditText("");
  };

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
    cancelEdit();
  };

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      const matchesFilter =
        filter === "completed"
          ? todo.completed
          : filter === "pending"
          ? !todo.completed
          : true;

      const matchesSearch = todo.text
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [todos, filter, search]);

  const totalTasks = todos.length;
  const completedTasks = todos.filter((todo) => todo.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const progress = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="page">
      <main className="shell">
        <section className="hero">
          <div className="hero-copy">
            <div className="brand-row">
              <div className="vite-mark" aria-hidden="true">
                V
              </div>

              <div>
                <p className="eyebrow">Premium React task workspace</p>
                <h1>Todo App</h1>
                <p className="subtitle">
                  A clean, modern place to capture tasks, track progress, and finish work.
                </p>
              </div>
            </div>

            <div className="pills">
              <span>React</span>
              <span>localStorage</span>
              <span>Search</span>
              <span>Filter</span>
              <span>Edit</span>
            </div>
          </div>

          <aside className="hero-card">
            <div className="hero-card-top">
              <span>Progress</span>
              <strong>{progress}%</strong>
            </div>

            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>

            <div className="mini-grid">
              <div>
                <span>Total</span>
                <strong>{totalTasks}</strong>
              </div>
              <div>
                <span>Done</span>
                <strong>{completedTasks}</strong>
              </div>
              <div>
                <span>Left</span>
                <strong>{pendingTasks}</strong>
              </div>
            </div>
          </aside>
        </section>

        <section className="board">
          <form
            className="composer"
            onSubmit={(e) => {
              e.preventDefault();
              addTask();
            }}
          >
            <input
              type="text"
              placeholder="Add a new task..."
              value={task}
              onChange={(e) => setTask(e.target.value)}
            />
            <button type="submit" className="primary-btn">
              Add Task
            </button>
          </form>

          <div className="top-controls">
            <div className="filters">
              <button
                type="button"
                className={filter === "all" ? "chip active" : "chip"}
                onClick={() => setFilter("all")}
              >
                All
              </button>
              <button
                type="button"
                className={filter === "completed" ? "chip active" : "chip"}
                onClick={() => setFilter("completed")}
              >
                Completed
              </button>
              <button
                type="button"
                className={filter === "pending" ? "chip active" : "chip"}
                onClick={() => setFilter("pending")}
              >
                Pending
              </button>
            </div>

            <input
              className="search"
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="toolbar">
            <p className="toolbar-text">
              Showing <strong>{filteredTodos.length}</strong> task
              {filteredTodos.length !== 1 ? "s" : ""}
            </p>

            <button type="button" className="ghost-btn" onClick={clearCompleted}>
              Clear Completed
            </button>
          </div>

          {filteredTodos.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon" aria-hidden="true">
                ✓
              </div>
              <h3>No tasks found</h3>
              <p>Add a task or adjust your filter and search.</p>
            </div>
          ) : (
            <ul className="todo-list">
              {filteredTodos.map((todo) => (
                <li key={todo.id} className={todo.completed ? "todo done" : "todo"}>
                  {editId === todo.id ? (
                    <div className="edit-row">
                      <input
                        className="edit-input"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && saveEdit(todo.id)}
                      />
                      <button
                        type="button"
                        className="save-btn"
                        onClick={() => saveEdit(todo.id)}
                      >
                        Save
                      </button>
                      <button type="button" className="cancel-btn" onClick={cancelEdit}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="check-btn"
                        onClick={() => toggleComplete(todo.id)}
                        aria-label="Toggle complete"
                      >
                        {todo.completed ? "✓" : ""}
                      </button>

                      <span className="todo-text" onClick={() => toggleComplete(todo.id)}>
                        {todo.text}
                      </span>

                      <div className="todo-actions">
                        <button
                          type="button"
                          className="edit-btn"
                          onClick={() => startEdit(todo)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="delete-btn"
                          onClick={() => deleteTask(todo.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;