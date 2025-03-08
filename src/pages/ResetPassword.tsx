import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      setMessage('');
      await resetPassword(email);
      setMessage('Password reset link sent to your email');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error sending reset link');
    } finally {
      setIsLoading(false);
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
          <div className="mb-6">
            <label className="block text-white mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded bg-[#1a365d] text-white border border-[#2d4a77] focus:outline-none focus:border-[#3b82f6]"
              placeholder="you@example.com"
              required
            />
          </div>
          {error && <p className="text-red-400 mb-4">{error}</p>}
          {message && <p className="text-green-400 mb-4">{message}</p>}
          <button
            type="submit"
            className="w-full bg-[#3b82f6] text-white p-2 rounded hover:bg-[#2563eb] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            disabled={isLoading}
          >
            {isLoading ? 'SENDING...' : 'RESET PASSWORD'}
          </button>
          <div className="text-center">
            <Link to="/login" className="text-[#3b82f6] hover:text-[#60a5fa]">
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}