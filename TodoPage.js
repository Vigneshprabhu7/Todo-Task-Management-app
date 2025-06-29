import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './TodoPage.css';

const TodoPage = () => {
  const { username, logout } = useAuth();
  const navigate = useNavigate();
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem(`todos_${username}`);
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [newTodo, setNewTodo] = useState('');
  const [priority, setPriority] = useState('medium');
  const [filter, setFilter] = useState('all');
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    localStorage.setItem(`todos_${username}`, JSON.stringify(todos));
  }, [todos, username]);

  // Apply theme to document
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    
    const todo = {
      id: Date.now(),
      text: newTodo,
      completed: false,
      priority: priority,
      date: new Date().toISOString()
    };
    
    setTodos([...todos, todo]);
    setNewTodo('');
  };

  const handleToggleComplete = (id) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = (id) => {
    // Add a fade-out animation before removing
    const updatedTodos = todos.map(todo => 
      todo.id === id ? { ...todo, deleting: true } : todo
    );
    setTodos(updatedTodos);
    
    // Remove after animation completes
    setTimeout(() => {
      setTodos(todos.filter(todo => todo.id !== id));
    }, 300);
  };

  const handleChangePriority = (id, newPriority) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, priority: newPriority } : todo
      )
    );
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Filter todos based on current filter
  const filteredTodos = todos.filter(todo => {
    if (filter === 'all') return true;
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  // Count statistics
  const totalTasks = todos.length;
  const completedTasks = todos.filter(todo => todo.completed).length;
  const activeTasks = totalTasks - completedTasks;

  // Format date for display
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className={`todo-container ${theme}`}>
      <div className="todo-header">
        <h2>Welcome, {username}!</h2>
        <div className="header-actions">
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>
      
      <div className="task-counter">
        <div className="counter-item">
          <div className="counter-number">{totalTasks}</div>
          <div className="counter-label">Total Tasks</div>
        </div>
        <div className="counter-item">
          <div className="counter-number">{activeTasks}</div>
          <div className="counter-label">Active</div>
        </div>
        <div className="counter-item">
          <div className="counter-number">{completedTasks}</div>
          <div className="counter-label">Completed</div>
        </div>
      </div>
      
      <div className="add-todo">
        <form onSubmit={handleAddTodo}>
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new task..."
          />
          <select 
            value={priority} 
            onChange={(e) => setPriority(e.target.value)}
            className="priority-select"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button type="submit">Add</button>
        </form>
      </div>
      
      <div className="filter-controls">
        <button 
          className={filter === 'all' ? 'active' : ''} 
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button 
          className={filter === 'active' ? 'active' : ''} 
          onClick={() => setFilter('active')}
        >
          Active
        </button>
        <button 
          className={filter === 'completed' ? 'active' : ''} 
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>
      
      <div className="todo-list">
        <h3>Your Tasks</h3>
        {filteredTodos.length === 0 ? (
          <p className="empty-message">No tasks found. {filter !== 'all' ? 'Try changing your filter.' : 'Add one above!'}</p>
        ) : (
          <ul>
            {filteredTodos.map(todo => (
              <li 
                key={todo.id} 
                className={`priority-${todo.priority} ${todo.completed ? 'completed' : ''} ${todo.deleting ? 'deleting' : ''}`}
              >
                <div className="todo-content">
                  <span onClick={() => handleToggleComplete(todo.id)}>
                    {todo.text}
                  </span>
                  <div className="todo-meta">
                    <span className="todo-date">{formatDate(todo.date)}</span>
                  </div>
                </div>
                <div className="todo-actions">
                  <select 
                    value={todo.priority} 
                    onChange={(e) => handleChangePriority(todo.id, e.target.value)}
                    className="priority-change"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteTodo(todo.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TodoPage;