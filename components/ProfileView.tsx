
import React, { useState } from 'react';
import { User } from '../types';
import { StorageService } from '../services/storage';

interface ProfileViewProps {
  user: User;
  onUpdate: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, onUpdate }) => {
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone || '');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser: User = {
      ...user,
      name,
      phone,
    };
    if (password) {
      updatedUser.password = password;
    }
    
    StorageService.saveUser(updatedUser);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
    onUpdate();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn">
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-blue-600 p-8 text-white relative">
          <div className="flex items-center space-x-6">
            <div className="h-24 w-24 rounded-3xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-4xl font-black">
              {user.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-2xl font-bold">{user.name}</h3>
              <p className="text-blue-100">{user.role} Account</p>
            </div>
          </div>
          <div className="absolute -bottom-6 right-8 h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-lg text-blue-600">
            <i className="fas fa-user-edit"></i>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="p-10 pt-12 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <input 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
              <input 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Not provided"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email (Cannot change)</label>
            <input 
              disabled
              value={user.email}
              className="w-full px-4 py-3 bg-slate-100 border-none rounded-xl text-slate-500 font-medium cursor-not-allowed"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">New Password</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          {success && (
            <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl text-sm font-bold border border-emerald-100 flex items-center space-x-2 animate-slideUp">
              <i className="fas fa-check-circle"></i>
              <span>Profile updated successfully!</span>
            </div>
          )}

          <div className="pt-4">
            <button 
              type="submit"
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-lg hover:bg-black transition-all active:scale-[0.98]"
            >
              Update Profile Details
            </button>
          </div>
        </form>
      </div>

      <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex items-center space-x-4">
        <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shrink-0 shadow-sm border border-blue-100">
          <i className="fas fa-lock"></i>
        </div>
        <p className="text-sm text-blue-800 font-medium">
          Your data is encrypted locally. For enhanced security, we recommend regular password updates.
        </p>
      </div>
    </div>
  );
};

export default ProfileView;
