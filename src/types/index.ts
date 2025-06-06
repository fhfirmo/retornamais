export interface Client {
  id: string;
  name: string;
  phone: string; // WhatsApp number
  accumulatedCashback: number;
  currentBalance: number;
}

export interface Sale {
  id:string;
  clientId: string;
  clientName: string; 
  value: number;
  date: string; // ISO string for simplicity, or Date object
  cashbackGenerated: number;
}

export interface MerchantSettings {
  cashbackPercentage: number;
  whatsappTemplate: string;
}

// Mock user for dashboard
export interface User {
  name: string;
  email: string;
}
