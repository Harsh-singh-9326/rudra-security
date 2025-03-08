import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp(email, password, name);
      navigate('/dashboard');
    } catch (err) {
      setError('Error creating account');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a192f] flex items-center justify-center">
      <div className="bg-[#0f2744] p-8 rounded-lg shadow-xl w-96">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">
            <span className="text-white">future</span>
            <span className="text-[#3b82f6]">konnect</span>
          </h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 rounded bg-[#1a365d] text-white border border-[#2d4a77]"
              placeholder="John Doe"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded bg-[#1a365d] text-white border border-[#2d4a77]"
              placeholder="you@example.com"
            />
          </div>
          <div className="mb-6">
            <label className="block text-white mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded bg-[#1a365d] text-white border border-[#2d4a77]"
            />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-[#3b82f6] text-white p-2 rounded hover:bg-[#2563eb] transition-colors"
          >
            SIGNUP
          </button>
        </form>
      </div>
    </div>
  );
}