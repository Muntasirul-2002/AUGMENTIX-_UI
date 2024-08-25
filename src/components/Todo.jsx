import React, { useState, useEffect } from "react";

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const fetchTodos = async () => {
      const response = await fetch("/api/todos");
      const data = await response.json();
      setTodos(data);
    };
    fetchTodos();
  }, []);

  const addOrUpdateTodo = async (e) => {
    e.preventDefault();
    if (!text) return;

    if (editId) {
      const response = await fetch(`/api/todos/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
      const updatedTodo = await response.json();
      setTodos(todos.map((todo) => (todo._id === editId ? updatedTodo : todo)));
      setEditId(null);
    } else {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
      const newTodo = await response.json();
      setTodos([...todos, newTodo]);
    }

    setText("");
  };

  const deleteTodo = async (id) => {
    await fetch(`/api/todos/${id}`, {
      method: "DELETE",
    });
    setTodos(todos.filter((todo) => todo._id !== id));
  };

  const toggleComplete = async (id, completed) => {
    const response = await fetch(`/api/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed: !completed }),
    });
    const updatedTodo = await response.json();
    setTodos(todos.map((todo) => (todo._id === id ? updatedTodo : todo)));
  };

  const startEdit = (todo) => {
    setText(todo.text);
    setEditId(todo._id);
  };
  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-16">
      <div className="px-4 py-2">
        <h1 className="text-gray-800 font-bold text-2xl uppercase">
          To-Do List
        </h1>
      </div>
      <form
        onSubmit={addOrUpdateTodo}
        className="w-full max-w-sm mx-auto px-4 py-2"
      >
        <div className="flex items-center border-b-2 border-teal-500 py-2">
          <input
            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            type="text"
            placeholder="Add a task"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
            type="submit"
          >
            {editId ? "Update" : "Add"}
          </button>
        </div>
      </form>
      <ul className="divide-y divide-gray-200 px-4">
        {todos.map((todo) => (
          <li key={todo._id} className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id={todo._id}
                  name={todo._id}
                  type="checkbox"
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  checked={todo.completed}
                  onChange={() => toggleComplete(todo._id, todo.completed)}
                />
                <label htmlFor={todo._id} className="ml-3 block text-gray-900">
                  <span className="text-lg font-medium">{todo.text}</span>
                </label>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => startEdit(todo)}
                  className="bg-yellow-500 text-white text-xs px-3 py-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTodo(todo._id)}
                  className="bg-red-500 text-white text-xs px-2 py-2"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todo;
