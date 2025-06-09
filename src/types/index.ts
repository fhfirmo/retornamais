
export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'merchant' | 'client_user'; // Role for system users, not end-clients of merchants
}

export interface AdminUser extends UserAccount {
  role: 'admin';
}

export interface MerchantUser extends UserAccount {
  role: 'merchant';
  cnpjCpf: string;
  // settings defined in MerchantSettings
}

export interface Client {
  id: string;
  merchantId?: string; // To associate client with a specific merchant if needed in a multi-tenant admin view
  name: string;
  phone: string; // WhatsApp number
  accumulatedCashback: number;
  currentBalance: number;
  cashbackRedeemed?: number; // New field
}

export interface Sale {
  id:string;
  merchantId?: string; // To associate sale with a specific merchant
  clientId: string;
  clientName: string; 
  value: number;
  date: string; // ISO string for simplicity, or Date object
  cashbackGenerated: number;
}

export interface Campaign {
  id: string;
  name: string;
  startDate: string; // ISO string
  endDate: string; // ISO string
  cashbackMultiplier: number; // e.g., 2 for 2x cashback
  isActive?: boolean; // Calculated or set
}

export interface MerchantSettings {
  cashbackPercentage: number;
  whatsappTemplate: string;
  campaigns?: Campaign[]; // List of campaigns
}

// Mock user for dashboard (can be merchant or admin)
export interface User {
  name: string;
  email: string;
}
