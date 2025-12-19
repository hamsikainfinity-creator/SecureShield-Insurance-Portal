
import React, { useMemo } from 'react';
import { Policy, User, UserRole } from '../types';

interface DashboardProps {
  policies: Policy[];
  users: User[];
  onTabChange: (tab: 'dashboard' | 'users' | 'policies' | 'profile') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ policies, users, onTabChange }) => {
  const stats = useMemo(() => {
    const totalPremium = policies.reduce((sum, p) => sum + p.premiumAmount, 0);
    const expiringSoon = policies.filter(p => p.status === 'Expiring Soon');
    const starHealth = policies.filter(p => p.company.includes('Star Health'));
    const unitedIndia = policies.filter(p => p.company.includes('United India'));

    return { totalPremium, expiringSoon, starHealth, unitedIndia };
  }, [policies]);

  const handleDownloadReport = () => {
    const header = "Policy Number,Company,Insured Name,Expiry Date,Premium,Status\n";
    const rows = policies.map(p => 
      `${p.policyNumber},${p.company},"${p.insuredName}",${p.expiryDate},${p.premiumAmount},${p.status}`
    ).join("\n");
    
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Full_Policy_Report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Policies" 
          value={policies.length} 
          icon="fa-file-contract" 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Expiring Soon" 
          value={stats.expiringSoon.length} 
          icon="fa-clock" 
          color="bg-amber-500" 
          highlight={stats.expiringSoon.length > 0}
        />
        <StatCard 
          title="United India" 
          value={stats.unitedIndia.length} 
          icon="fa-landmark" 
          color="bg-emerald-500" 
        />
        <StatCard 
          title="Star Health" 
          value={stats.starHealth.length} 
          icon="fa-hand-holding-medical" 
          color="bg-indigo-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Alerts List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-800">Critical Expirations (Next 30 Days)</h3>
            <button 
              onClick={() => onTabChange('policies')}
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              View All
            </button>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {stats.expiringSoon.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <i className="fas fa-check-circle text-emerald-500 text-3xl mb-2"></i>
                <p>No policies expiring within 30 days.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {stats.expiringSoon.map((p) => (
                  <div key={p.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl ${p.company.includes('Star') ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
                        <i className={`fas ${p.company.includes('Star') ? 'fa-star' : 'fa-building'}`}></i>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{p.insuredName}</p>
                        <p className="text-xs text-slate-500 font-mono">{p.policyNumber} • {p.company}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-amber-600 font-bold text-sm">Expires: {p.expiryDate}</p>
                      <p className="text-slate-400 text-xs font-medium">₹{p.premiumAmount.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-800">Operational Summary</h3>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Premium Managed</p>
              <p className="text-3xl font-black text-blue-900">₹{stats.totalPremium.toLocaleString()}</p>
            </div>
            
            <div className="space-y-3">
               <div className="flex justify-between items-center text-sm">
                 <span className="text-slate-600 font-medium">Customer Engagement</span>
                 <span className="font-bold text-blue-600">{users.filter(u => u.role === UserRole.CUSTOMER).length} Users</span>
               </div>
               <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                 <div className="bg-blue-600 h-full w-[85%] rounded-full"></div>
               </div>
            </div>

            <div className="space-y-3 pt-2">
              <button 
                onClick={() => onTabChange('policies')}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-100 transition-all flex items-center justify-center space-x-2"
              >
                <i className="fas fa-plus-circle"></i>
                <span>Add New Policy</span>
              </button>
              
              <button 
                onClick={handleDownloadReport}
                className="w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl font-bold border border-slate-200 transition-all flex items-center justify-center space-x-2"
              >
                <i className="fas fa-file-export"></i>
                <span>Download Policy Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: number | string; icon: string; color: string; highlight?: boolean }> = ({ title, value, icon, color, highlight }) => (
  <div className={`bg-white p-6 rounded-2xl shadow-sm border ${highlight ? 'border-amber-400 ring-2 ring-amber-50' : 'border-slate-200'} transition-all hover:shadow-md`}>
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl ${color} text-white shadow-lg shadow-blue-50`}>
        <i className={`fas ${icon}`}></i>
      </div>
      {highlight && <span className="flex h-3 w-3 rounded-full bg-amber-500 animate-pulse"></span>}
    </div>
    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{title}</p>
    <p className="text-2xl font-black text-slate-900">{value}</p>
  </div>
);

export default Dashboard;
