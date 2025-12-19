
import React from 'react';
import { User, UserRole } from '../types';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  isCustomer: boolean;
  onProfileClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, isCustomer, onProfileClick }) => {
  return (
    <header className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 flex items-center justify-between shadow-sm z-10">
      <div className="flex items-center space-x-3">
        <div className="md:hidden flex items-center space-x-2">
          <i className="fas fa-shield-alt text-blue-600 text-xl"></i>
          <span className="font-bold text-slate-800">SecureShield</span>
        </div>
        <div className="hidden md:block">
          <h2 className="text-lg font-semibold text-slate-800">
            {isCustomer ? 'My Insurance Portfolio' : 'Agency Management Dashboard'}
          </h2>
          <p className="text-sm text-slate-500">Secure and reliable management</p>
        </div>
      </div>

      <div className="flex items-center space-x-2 md:space-x-4">
        <div className="flex items-center space-x-2 md:space-x-3 pr-2 md:pr-4 border-r border-slate-100">
          <button 
            onClick={onProfileClick}
            className="flex items-center space-x-2 md:space-x-3 group"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors">{user.name}</p>
              <p className="text-xs text-blue-600 font-semibold">{user.role}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200 group-hover:ring-2 group-hover:ring-blue-500 transition-all">
              {user.name.charAt(0)}
            </div>
          </button>
        </div>
        
        <button 
          onClick={onLogout}
          className="flex items-center space-x-2 text-red-600 hover:text-red-700 px-2 md:px-3 py-2 rounded-lg hover:bg-red-50 transition-all font-bold text-sm"
          aria-label="Logout"
        >
          <i className="fas fa-sign-out-alt"></i>
          <span className="inline font-medium text-sm">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
