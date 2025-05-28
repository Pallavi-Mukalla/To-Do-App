// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="container home">
      <h1>Welcome to Your Task Manager Application</h1>
      <p>Manage your tasks easily and efficiently.</p>
      <div className="button-group">
        <Link to="/signup" className="btn btn-primary">Signup</Link>
        <Link to="/login" className="btn btn-secondary">Login</Link>
      </div>
    </div>
  );
}
