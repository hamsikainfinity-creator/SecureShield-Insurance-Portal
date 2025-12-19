
export enum UserRole {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  CUSTOMER = 'CUSTOMER'
}

export enum InsuranceCompany {
  UNITED_INDIA = 'United India Insurance',
  STAR_HEALTH = 'Star Health Insurance'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  password?: string; // Only for local demo
  phone?: string;
}

export interface Policy {
  id: string;
  policyNumber: string;
  company: InsuranceCompany;
  insuredName: string;
  customerId: string; // Links to a User
  expiryDate: string;
  premiumAmount: number;
  documentUrl?: string; // Link to Google Drive/PDF
  status: 'Active' | 'Expired' | 'Expiring Soon';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
