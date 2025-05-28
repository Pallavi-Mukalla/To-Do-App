import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [view, setView] = useState('ongoing'); 
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  function handleAuthErrors(res) {
    if (res.status === 401 || res.status === 403) {
      // Token expired or unauthorized, redirect to login
      navigate('/login');
      return true;
    }
    return false;
  }
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    
    fetch('https://to-do-app-9zxt.onrender.com/api/tasks', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (res.status === 401 || res.status === 403) {
          // Token expired or invalid
          localStorage.removeItem('token');  // Clear token on expiry
          navigate('/login');
          return null;  // Important: return null so next then knows no data
        }
        return res.json();
      })
      .then(data => {
        if (data && Array.isArray(data)) {
          setTasks(data);
        } else {
          setTasks([]); // fallback to empty array if data is null or invalid
        }
      })
      .catch(() => {
        setError('Failed to load tasks.');
        setTasks([]);  // fallback so tasks is always array
      });
}, [navigate, token]);


  function handleLogout() {
    localStorage.removeItem('token');
    navigate('/login');
  }

  function handleAddTask(e) {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    if (image) formData.append('image', image);

    fetch('https://to-do-app-9zxt.onrender.com/api/tasks', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) setError(data.error);
        else {
          setTasks(prev => [data, ...prev]);
          setTitle('');
          setImage(null);
          setView('ongoing');
        }
      })
      .catch(() => setError('Failed to add task.'));
  }

  function handleDelete(taskId) {
    fetch(`https://to-do-app-9zxt.onrender.com/api/tasks/${taskId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.ok ? setTasks(tasks.filter(t => t._id !== taskId)) : setError('Failed to delete task.'))
      .catch(() => setError('Failed to delete task.'));
  }

  function handleMarkComplete(taskId) {
    fetch(`https://to-do-app-9zxt.onrender.com/api/tasks/${taskId}/complete`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(updated => {
        setTasks(tasks.map(task => task._id === updated._id ? updated : task));
      })
      .catch(() => setError('Failed to mark task as complete.'));
  }

  function handleClearCompleted() {
    fetch('https://to-do-app-9zxt.onrender.com/api/tasks/completed', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.ok && setTasks(tasks.filter(task => !task.completed)))
      .catch(() => setError('Failed to clear completed tasks.'));
  }

  const filteredTasks = tasks.filter(task => view === 'ongoing' ? !task.completed : task.completed);

  return (
    <div className="container">
      <div className="top-bar">
        <h2>Dashboard</h2>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      <form onSubmit={handleAddTask} className="task-form">
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={e => setImage(e.target.files[0])}
        />
        <button type="submit">Add Task</button>
      </form>

      {error && <p className="error-message">{error}</p>}

      <div className="view-toggle">
        <button className={view === 'ongoing' ? 'active' : ''} onClick={() => setView('ongoing')}>Ongoing Tasks</button>
        <button className={view === 'completed' ? 'active' : ''} onClick={() => setView('completed')}>Completed Tasks</button>
      </div>

      {view === 'completed' && (
        <button className="clear-btn" onClick={handleClearCompleted}>Clear All Completed</button>
      )}

      <div className="tasks-wrapper">
        {filteredTasks.length === 0 && <p>No {view} tasks.</p>}
        {filteredTasks.map(task => (
          <div key={task._id} className="task-card">
            <h4>{task.title}</h4>
            {task.imageUrl && <img src={`https://to-do-app-9zxt.onrender.com${task.imageUrl}`} alt="task" />}
            <div className="task-buttons">
              {!task.completed && (
                <button onClick={() => handleMarkComplete(task._id)}>Mark as Complete</button>
              )}
              <button onClick={() => handleDelete(task._id)} className="delete-btn">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
