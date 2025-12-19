
import React, { useState, useEffect, useMemo } from 'react';
import { User, Policy, UserRole, AuthState, InsuranceCompany } from './types';
import { StorageService } from './services/storage';

// --- Views ---
import LoginView from './components/LoginView';
import Dashboard from './components/Dashboard';
import UserManagement from './components/UserManagement';
import PolicyManagement from './components/PolicyManagement';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import CustomerDashboard from './components/CustomerDashboard';
import ProfileView from './components/ProfileView';

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>({ user: null, isAuthenticated: false });
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'users' | 'policies' | 'profile'>('dashboard');
  const [users, setUsers] = useState<User[]>([]);
  const [policies, setPolicies] = useState<Policy[]>([]);

  useEffect(() => {
    StorageService.init();
    refreshData();
  }, []);

  const refreshData = () => {
    setUsers(StorageService.getUsers());
    const fetchedPolicies = StorageService.getPolicies();
    setPolicies(fetchedPolicies);
    
    // Sync current user if they updated their profile
    if (auth.user) {
      const updatedUsers = StorageService.getUsers();
      const currentUser = updatedUsers.find(u => u.id === auth.user?.id);
      if (currentUser) {
        setAuth(prev => ({ ...prev, user: currentUser }));
      }
    }
  };

  const handleLogin = (user: User) => {
    refreshData(); // Refresh to ensure latest data (policies/users) is available
    setAuth({ user, isAuthenticated: true });
  };

  const handleLogout = () => {
    setAuth({ user: null, isAuthenticated: false });
    setCurrentTab('dashboard');
    refreshData();
  };

  const expiringCount = useMemo(() => {
    return policies.filter(p => p.status === 'Expiring Soon').length;
  }, [policies]);

  if (!auth.isAuthenticated) {
    return <LoginView onLogin={handleLogin} />;
  }

  const isAdmin = auth.user?.role === UserRole.ADMIN;
  const isCustomer = auth.user?.role === UserRole.CUSTOMER;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Navigation Sidebar */}
      {!isCustomer && (
        <Sidebar 
          currentTab={currentTab} 
          setCurrentTab={setCurrentTab} 
          role={auth.user?.role!} 
          onLogout={handleLogout}
          expiringCount={expiringCount}
        />
      )}

      <main className="flex-1 flex flex-col overflow-hidden">
        <Header 
          user={auth.user!} 
          onLogout={handleLogout} 
          isCustomer={isCustomer} 
          onProfileClick={() => setCurrentTab('profile')}
        />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {currentTab === 'profile' ? (
            <ProfileView user={auth.user!} onUpdate={refreshData} />
          ) : isCustomer ? (
            <CustomerDashboard user={auth.user!} policies={policies} />
          ) : (
            <>
              {currentTab === 'dashboard' && (
                <Dashboard 
                  policies={policies} 
                  users={users} 
                  onTabChange={setCurrentTab} 
                />
              )}
              {currentTab === 'users' && isAdmin && (
                <UserManagement 
                  users={users} 
                  onRefresh={refreshData} 
                />
              )}
              {currentTab === 'policies' && (
                <PolicyManagement 
                  policies={policies} 
                  users={users} 
                  currentUser={auth.user!} 
                  onRefresh={refreshData} 
                />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
