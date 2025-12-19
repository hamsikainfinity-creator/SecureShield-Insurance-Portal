
import React, { useState, useMemo } from 'react';
import { Policy, User, UserRole, InsuranceCompany } from '../types';
import { StorageService } from '../services/storage';

interface PolicyManagementProps {
  policies: Policy[];
  users: User[];
  currentUser: User;
  onRefresh: () => void;
}

const PolicyManagement: React.FC<PolicyManagementProps> = ({ policies, users, currentUser, onRefresh }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);
  
  // Filter States
  const [filterCompany, setFilterCompany] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [dateStart, setDateStart] = useState<string>('');
  const [dateEnd, setDateEnd] = useState<string>('');

  const isAdmin = currentUser.role === UserRole.ADMIN;
  const customers = users.filter(u => u.role === UserRole.CUSTOMER);

  const filteredPolicies = useMemo(() => {
    return policies.filter(p => {
      const matchesSearch = p.policyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.insuredName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCompany = filterCompany === 'All' || p.company === filterCompany;
      const matchesStatus = filterStatus === 'All' || p.status === filterStatus;
      
      let matchesDate = true;
      if (dateStart || dateEnd) {
        const pDate = new Date(p.expiryDate);
        if (dateStart && pDate < new Date(dateStart)) matchesDate = false;
        if (dateEnd && pDate > new Date(dateEnd)) matchesDate = false;
      }

      return matchesSearch && matchesCompany && matchesStatus && matchesDate;
    });
  }, [policies, searchTerm, filterCompany, filterStatus, dateStart, dateEnd]);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newPolicy: Policy = {
      id: editingPolicy?.id || Date.now().toString(),
      policyNumber: formData.get('policyNumber') as string,
      company: formData.get('company') as InsuranceCompany,
      insuredName: formData.get('insuredName') as string,
      customerId: formData.get('customerId') as string,
      expiryDate: formData.get('expiryDate') as string,
      premiumAmount: Number(formData.get('premiumAmount')),
      documentUrl: formData.get('documentUrl') as string,
      status: 'Active' // Will be recalculated by StorageService
    };

    StorageService.savePolicy(newPolicy);
    setIsModalOpen(false);
    setEditingPolicy(null);
    onRefresh();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this policy?')) {
      StorageService.deletePolicy(id);
      onRefresh();
    }
  };

  const clearFilters = () => {
    setFilterCompany('All');
    setFilterStatus('All');
    setDateStart('');
    setDateEnd('');
    setSearchTerm('');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="text-2xl font-bold text-slate-800">Policies Registry</h3>
        <button 
          onClick={() => { setEditingPolicy(null); setIsModalOpen(true); }}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-2 shadow-lg shadow-blue-100 self-start"
        >
          <i className="fas fa-plus"></i>
          <span>Add New Policy</span>
        </button>
      </div>

      {/* Advanced Filters */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Search</label>
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input 
                type="text" 
                placeholder="Policy # or Name..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none w-full"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Company</label>
            <select 
              value={filterCompany}
              onChange={(e) => setFilterCompany(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Companies</option>
              <option value={InsuranceCompany.UNITED_INDIA}>United India</option>
              <option value={InsuranceCompany.STAR_HEALTH}>Star Health</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Status</label>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Expiring Soon">Expiring Soon</option>
              <option value="Expired">Expired</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Expiry Range</label>
            <div className="flex items-center space-x-2">
              <input 
                type="date" 
                value={dateStart}
                onChange={(e) => setDateStart(e.target.value)}
                className="w-full px-2 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500" 
              />
              <span className="text-slate-400">-</span>
              <input 
                type="date" 
                value={dateEnd}
                onChange={(e) => setDateEnd(e.target.value)}
                className="w-full px-2 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500" 
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end pt-2">
          <button 
            onClick={clearFilters}
            className="text-sm font-medium text-slate-400 hover:text-blue-600 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Policy Details</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Company</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Expiry</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Premium</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPolicies.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{p.insuredName}</p>
                    <p className="text-xs text-slate-500 font-mono">{p.policyNumber}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${p.company.includes('Star') ? 'bg-indigo-100 text-indigo-700' : 'bg-red-100 text-red-700'}`}>
                      {p.company}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">{p.expiryDate}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">₹{p.premiumAmount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                      p.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 
                      p.status === 'Expiring Soon' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-1">
                    <button 
                      onClick={() => { setEditingPolicy(p); setIsModalOpen(true); }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    {isAdmin && (
                      <button 
                        onClick={() => handleDelete(p.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredPolicies.length === 0 && (
          <div className="p-12 text-center text-slate-400">
            <i className="fas fa-filter text-4xl mb-3"></i>
            <p>No policies match the selected filters.</p>
            <button onClick={clearFilters} className="mt-4 text-blue-600 font-bold hover:underline">Reset Filters</button>
          </div>
        )}
      </div>

      {/* Policy Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-slideUp">
            <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
              <h4 className="text-xl font-bold">{editingPolicy ? 'Edit Policy' : 'Create New Policy'}</h4>
              <button onClick={() => { setIsModalOpen(false); setEditingPolicy(null); }}>
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Policy Number</label>
                  <input required name="policyNumber" defaultValue={editingPolicy?.policyNumber} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Company</label>
                  <select required name="company" defaultValue={editingPolicy?.company} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500">
                    <option value={InsuranceCompany.UNITED_INDIA}>United India</option>
                    <option value={InsuranceCompany.STAR_HEALTH}>Star Health</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Insured Name</label>
                <input required name="insuredName" defaultValue={editingPolicy?.insuredName} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Link to Customer Account</label>
                <select required name="customerId" defaultValue={editingPolicy?.customerId} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500">
                  {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.email})</option>)}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Expiry Date</label>
                  <input required type="date" name="expiryDate" defaultValue={editingPolicy?.expiryDate} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Premium Amount (₹)</label>
                  <input required type="number" name="premiumAmount" defaultValue={editingPolicy?.premiumAmount} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Policy Document Link (URL)</label>
                <input name="documentUrl" defaultValue={editingPolicy?.documentUrl} placeholder="e.g., Google Drive link" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
                  {editingPolicy ? 'Update Policy' : 'Save Policy'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PolicyManagement;
