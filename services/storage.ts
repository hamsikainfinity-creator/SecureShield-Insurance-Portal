
import { User, Policy, UserRole, InsuranceCompany } from '../types';

const USERS_KEY = 'ss_users';
const POLICIES_KEY = 'ss_policies';

const initialUsers: User[] = [
  { id: '1', email: 'admin@agency.com', name: 'Agency Admin', role: UserRole.ADMIN, password: 'admin123', phone: '9876543210' },
  { id: '2', email: 'staff@agency.com', name: 'Office Staff', role: UserRole.STAFF, password: 'staff123', phone: '9876543211' },
  { id: '3', email: 'cust@gmail.com', name: 'John Doe', role: UserRole.CUSTOMER, password: 'cust123', phone: '9876543212' },
];

const initialPolicies: Policy[] = [
  { 
    id: 'p1', 
    policyNumber: 'UI-2024-001', 
    company: InsuranceCompany.UNITED_INDIA, 
    insuredName: 'John Doe', 
    customerId: '3', 
    expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 15 days from now
    premiumAmount: 12500,
    status: 'Expiring Soon'
  },
  { 
    id: 'p2', 
    policyNumber: 'SH-2024-992', 
    company: InsuranceCompany.STAR_HEALTH, 
    insuredName: 'Jane Doe', 
    customerId: '3', 
    expiryDate: '2025-02-15', 
    premiumAmount: 25000,
    status: 'Active'
  },
];

export const StorageService = {
  init: () => {
    if (!localStorage.getItem(USERS_KEY)) {
      localStorage.setItem(USERS_KEY, JSON.stringify(initialUsers));
    }
    if (!localStorage.getItem(POLICIES_KEY)) {
      localStorage.setItem(POLICIES_KEY, JSON.stringify(initialPolicies));
    }
  },

  getUsers: (): User[] => {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  },

  saveUser: (user: User) => {
    const users = StorageService.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index > -1) {
      users[index] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  deleteUser: (id: string) => {
    const users = StorageService.getUsers().filter(u => u.id !== id);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  getPolicies: (): Policy[] => {
    const policies: Policy[] = JSON.parse(localStorage.getItem(POLICIES_KEY) || '[]');
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);

    return policies.map(p => {
      const expiry = new Date(p.expiryDate);
      let status: 'Active' | 'Expired' | 'Expiring Soon' = 'Active';
      if (expiry < now) status = 'Expired';
      else if (expiry <= thirtyDaysFromNow) status = 'Expiring Soon';
      return { ...p, status };
    });
  },

  savePolicy: (policy: Policy) => {
    const policies = StorageService.getPolicies();
    const index = policies.findIndex(p => p.id === policy.id);
    if (index > -1) {
      policies[index] = policy;
    } else {
      policies.push(policy);
    }
    localStorage.setItem(POLICIES_KEY, JSON.stringify(policies));
  },

  deletePolicy: (id: string) => {
    const policies = StorageService.getPolicies().filter(p => p.id !== id);
    localStorage.setItem(POLICIES_KEY, JSON.stringify(policies));
  }
};
