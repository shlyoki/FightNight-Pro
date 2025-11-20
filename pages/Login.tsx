import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }: { onLogin: (email: string) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock authentication
    if (email && password) {
      onLogin(email);
      navigate('/admin');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md bg-zinc-900 p-8 rounded-2xl border border-zinc-800 shadow-2xl">
        <h2 className="text-2xl font-black text-white text-center mb-6 uppercase italic">Admin Access</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-zinc-400 mb-2">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@fightnight.com"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-zinc-400 mb-2">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg uppercase tracking-wider transition-colors shadow-lg shadow-red-900/20"
          >
            Sign In
          </button>
        </form>
        <p className="text-center text-xs text-zinc-600 mt-6">
          Use any email/password to enter demo mode.
        </p>
      </div>
    </div>
  );
};

export default Login;
