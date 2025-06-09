
export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'merchant'; // Simplified for system users
  cpf?: string;
  city?: string;
  neighborhood?: string;
  state?: string;
  password?: string; // Only for creation/update, not stored in frontend state directly
}

export interface AdminUser extends UserAccount {
  role: 'admin';
}

export interface MerchantUser extends UserAccount {
  role: 'merchant';
  cnpjCpf: string; // Specific to merchant user type
  // settings defined in MerchantSettings
}

export interface Client {
  id: string;
  merchantId?: string; // To associate client with a specific merchant if needed in a multi-tenant admin view
  name: string;
  phone: string; // WhatsApp number
  accumulatedCashback: number; // Total cashback ever earned by this client
  currentBalance: number; // Current spendable cashback balance
  cashbackRedeemed?: number;
}

export interface Sale {
  id:string;
  merchantId?: string; // To associate sale with a specific merchant
  clientId: string;
  clientName: string;
  value: number;
  date: string; // ISO string for simplicity, or Date object
  cashbackGenerated: number; // Cashback generated from this specific sale
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
  minimumRedemptionValue?: number; // Minimum cashback balance to be able to redeem
  campaigns?: Campaign[]; // List of campaigns
}

// Mock user for dashboard (can be merchant or admin)
export interface User {
  name: string;
  email: string;
}

export interface AdminDashboardStats {
  totalMerchants: number;
  totalPlatformClients: number;
  totalPlatformSales: number;
  totalPlatformCashback: number;
  activeCampaigns: number;
}
