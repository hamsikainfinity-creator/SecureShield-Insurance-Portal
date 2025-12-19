
import React from 'react';
import { UserRole } from '../types';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: 'dashboard' | 'users' | 'policies' | 'profile') => void;
  role: UserRole;
  onLogout: () => void;
  expiringCount: number;
}

const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab, role, onLogout, expiringCount }) => {
  const isAdmin = role === UserRole.ADMIN;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-pie' },
    { id: 'policies', label: 'Policies', icon: 'fa-file-invoice-dollar', badge: expiringCount > 0 ? expiringCount : null },
    ...(isAdmin ? [{ id: 'users', label: 'Users', icon: 'fa-users' }] : []),
    { id: 'profile', label: 'My Profile', icon: 'fa-user-circle' },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 bg-blue-900 text-white border-r border-blue-800">
      <div className="p-6">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab('dashboard')}>
          <div className="bg-white p-2 rounded-lg text-blue-900">
            <i className="fas fa-shield-alt text-xl"></i>
          </div>
          <h1 className="text-xl font-bold tracking-tight">SecureShield</h1>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentTab(item.id as any)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
              currentTab === item.id 
                ? 'bg-blue-800 text-white shadow-lg' 
                : 'text-blue-100 hover:bg-blue-800/50 hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-3">
              <i className={`fas ${item.icon} w-5`}></i>
              <span className="font-medium">{item.label}</span>
            </div>
            {item.badge && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full ring-2 ring-blue-900">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-blue-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-blue-100 hover:text-white hover:bg-red-500/20 rounded-xl transition-colors"
        >
          <i className="fas fa-sign-out-alt w-5"></i>
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
