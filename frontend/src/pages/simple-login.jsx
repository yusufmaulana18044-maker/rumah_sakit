import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SimpleLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Simulasi login sederhana
    if (username === 'admin' && password === 'admin') {
      localStorage.setItem('username', username);
      localStorage.setItem('role', 'admin');
      navigate('/dashboard');
    } else if (username === 'user' && password === 'user') {
      localStorage.setItem('username', username);
      localStorage.setItem('role', 'user');
      navigate('/dashboard');
    } else {
      alert('Username atau password salah');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold text-center mb-6">Login Test</h1>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="admin atau user"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="admin atau user"
          />
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Login
        </button>

        <div className="mt-4 text-sm text-gray-600">
          <p>Test credentials:</p>
          <p>Admin: admin/admin</p>
          <p>User: user/user</p>
        </div>
      </div>
    </div>
  );
}