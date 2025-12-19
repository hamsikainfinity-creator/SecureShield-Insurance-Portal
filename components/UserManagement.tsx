
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { StorageService } from '../services/storage';

interface UserManagementProps {
  users: User[];
  onRefresh: () => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, onRefresh }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newUser: User = {
      id: editingUser?.id || Math.random().toString(36).substr(2, 9),
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      role: formData.get('role') as UserRole,
      phone: formData.get('phone') as string,
      password: formData.get('password') as string || editingUser?.password || 'password123'
    };

    StorageService.saveUser(newUser);
    setIsModalOpen(false);
    setEditingUser(null);
    onRefresh();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure? This will permanently delete the user account.')) {
      StorageService.deleteUser(id);
      onRefresh();
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-slate-800">User Directory</h3>
        <button 
          onClick={() => { setEditingUser(null); setIsModalOpen(true); }}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all flex items-center space-x-2"
        >
          <i className="fas fa-user-plus"></i>
          <span>Add User</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div key={user.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative group">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-xl font-bold ${
                  user.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-600' :
                  user.role === UserRole.STAFF ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                }`}>
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{user.name}</h4>
                  <p className="text-sm text-slate-500">{user.email}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                user.role === UserRole.ADMIN ? 'bg-purple-50 text-purple-700' :
                user.role === UserRole.STAFF ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
              }`}>
                {user.role}
              </span>
              <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => { setEditingUser(user); setIsModalOpen(true); }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <i className="fas fa-edit"></i>
                </button>
                {user.role !== UserRole.ADMIN && (
                   <button 
                    onClick={() => handleDelete(user.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-slideUp">
            <div className="bg-slate-800 p-6 text-white flex justify-between items-center">
              <h4 className="text-xl font-bold">{editingUser ? 'Update User' : 'New User'}</h4>
              <button onClick={() => { setIsModalOpen(false); setEditingUser(null); }}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Full Name</label>
                <input required name="name" defaultValue={editingUser?.name} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Email Address</label>
                <input required type="email" name="email" defaultValue={editingUser?.email} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Phone Number</label>
                <input name="phone" defaultValue={editingUser?.phone} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Role</label>
                <select required name="role" defaultValue={editingUser?.role || UserRole.CUSTOMER} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500">
                  <option value={UserRole.ADMIN}>Admin</option>
                  <option value={UserRole.STAFF}>Office Staff</option>
                  <option value={UserRole.CUSTOMER}>Customer</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Login Password</label>
                <input type="password" name="password" placeholder={editingUser ? "Leave blank to keep current" : "Set password"} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="pt-4">
                <button type="submit" className="w-full py-3 bg-slate-800 text-white rounded-xl font-bold shadow-lg hover:bg-slate-900 transition-all">
                  {editingUser ? 'Save Changes' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
