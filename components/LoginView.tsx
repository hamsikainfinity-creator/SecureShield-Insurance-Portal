
import React, { useState } from 'react';
import { User } from '../types';
import { StorageService } from '../services/storage';

interface LoginViewProps {
  onLogin: (user: User) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const users = StorageService.getUsers();
      const user = users.find(u => u.email === email && u.password === password);

      if (user) {
        onLogin(user);
      } else {
        setError('Invalid credentials. Please try again.');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-50"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-200 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 opacity-50"></div>

      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 md:p-12 relative z-10 border border-slate-200">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center h-20 w-20 bg-blue-600 text-white rounded-3xl shadow-xl shadow-blue-200 mb-6 rotate-3">
            <i className="fas fa-shield-alt text-4xl"></i>
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">SecureShield</h1>
          <p className="text-slate-500 font-medium">Insurance Management Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input 
                required
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-700"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input 
                required
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-700"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 flex items-center space-x-2 animate-shake">
              <i className="fas fa-exclamation-circle"></i>
              <span>{error}</span>
            </div>
          )}

          <button 
            disabled={loading}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center"
          >
            {loading ? (
              <i className="fas fa-circle-notch fa-spin text-xl"></i>
            ) : (
              'Sign In to Portal'
            )}
          </button>
        </form>

        <div className="mt-10 text-center text-slate-400 text-sm font-medium">
          <p>Demo accounts:</p>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            <span className="bg-slate-100 px-2 py-1 rounded-lg">Admin: admin@agency.com</span>
            <span className="bg-slate-100 px-2 py-1 rounded-lg">Staff: staff@agency.com</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
