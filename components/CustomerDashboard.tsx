
import React from 'react';
import { User, Policy } from '../types';

interface CustomerDashboardProps {
  user: User;
  policies: Policy[];
}

const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ user, policies }) => {
  // Ensure robust matching by trimming IDs
  const myPolicies = policies.filter(p => p.customerId.trim() === user.id.trim());

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h3 className="text-3xl font-extrabold mb-2">Welcome, {user.name}!</h3>
            <p className="text-blue-100 opacity-90">
              {myPolicies.length > 0 
                ? `You have ${myPolicies.length} active insurance policies under our management.` 
                : "Welcome to your insurance portal. Your policies will appear here once they are processed by our team."}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {myPolicies.map((p) => (
          <div key={p.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className={`absolute top-0 right-0 px-4 py-1 rounded-bl-2xl text-[10px] font-bold uppercase ${
              p.status === 'Active' ? 'bg-emerald-500 text-white' : 
              p.status === 'Expiring Soon' ? 'bg-amber-500 text-white' : 'bg-red-500 text-white'
            }`}>
              {p.status}
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <div className={`h-14 w-14 rounded-2xl flex items-center justify-center text-2xl ${
                p.company.includes('Star') ? 'bg-indigo-100 text-indigo-600' : 'bg-red-100 text-red-600'
              }`}>
                <i className={`fas ${p.company.includes('Star') ? 'fa-star' : 'fa-building'}`}></i>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-lg">{p.company}</h4>
                <p className="text-slate-500 font-mono text-sm">{p.policyNumber}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                <div>
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Expiry Date</p>
                  <p className="text-slate-700 font-semibold">{p.expiryDate}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Premium Paid</p>
                  <p className="text-slate-700 font-semibold">₹{p.premiumAmount.toLocaleString()}</p>
                </div>
              </div>

              {p.documentUrl ? (
                <a 
                  href={p.documentUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full block py-3 text-center bg-blue-50 text-blue-700 rounded-xl font-bold hover:bg-blue-100 transition-colors border border-blue-100"
                >
                  <i className="fas fa-external-link-alt mr-2"></i>
                  View Policy Document
                </a>
              ) : (
                <div className="py-3 text-center text-slate-400 text-sm italic bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  Document not uploaded yet
                </div>
              )}
            </div>
          </div>
        ))}

        {myPolicies.length === 0 && (
          <div className="col-span-full py-20 bg-white rounded-3xl border border-dashed border-slate-300 text-center space-y-4">
            <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
               <i className="fas fa-folder-open text-slate-300 text-3xl"></i>
            </div>
            <p className="text-slate-500 font-medium">No policies linked to your account yet.</p>
            <p className="text-sm text-slate-400">If you recently added a policy, please wait for administrative approval or contact the office.</p>
          </div>
        )}
      </div>

      <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex items-center space-x-4">
        <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-200">
          <i className="fas fa-headset"></i>
        </div>
        <div>
          <h4 className="font-bold text-blue-900">Need Assistance?</h4>
          <p className="text-sm text-blue-700">Contact our support desk for claims, renewals, or errors at <span className="font-bold underline">support@agencyporthub.com</span></p>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
