
import type { Client, Sale, MerchantUser, UserAccount, MerchantSettings, Campaign } from "@/types";
import { DEFAULT_CASHBACK_PERCENTAGE, DEFAULT_WHATSAPP_TEMPLATE, DEFAULT_MINIMUM_REDEMPTION_VALUE } from "@/lib/constants";

// For Merchant Dashboard
export const mockMerchantClients: Client[] = [
  { id: "1", merchantId: "merch_example", name: "Ana Silva", phone: "5511999990001", accumulatedCashback: 25.50, currentBalance: 10.00, cashbackRedeemed: 15.50 },
  { id: "2", merchantId: "merch_example", name: "Bruno Costa", phone: "5521988880002", accumulatedCashback: 120.75, currentBalance: 50.25, cashbackRedeemed: 70.50 },
  { id: "3", merchantId: "merch_example", name: "Carlos Dias", phone: "5531977770003", accumulatedCashback: 0, currentBalance: 0, cashbackRedeemed: 0 },
  { id: "4", merchantId: "merch_example", name: "Daniela Alves", phone: "5541966660004", accumulatedCashback: 55.00, currentBalance: 20.00, cashbackRedeemed: 35.00 },
];

export const mockMerchantSales: Sale[] = [
  { id: "s1", merchantId: "merch_example", clientId: "1", clientName: "Ana Silva", value: 100, date: new Date(2023, 10, 15).toISOString(), cashbackGenerated: 5 },
  { id: "s2", merchantId: "merch_example", clientId: "2", clientName: "Bruno Costa", value: 250, date: new Date(2023, 10, 16).toISOString(), cashbackGenerated: 12.5 },
  { id: "s3", merchantId: "merch_example", clientId: "1", clientName: "Ana Silva", value: 75, date: new Date(2023, 11, 1).toISOString(), cashbackGenerated: 3.75 },
  { id: "s4", merchantId: "merch_example", clientId: "2", clientName: "Bruno Costa", value: 120, date: new Date(2023, 11, 5).toISOString(), cashbackGenerated: 6 },
];

export const mockMerchantUser: Pick<MerchantUser, 'name' | 'cnpjCpf'> = {
  name: "Loja Exemplo Retorna+",
  cnpjCpf: "00.000.000/0001-00",
};

export const mockCampaigns: Campaign[] = [
    { id: "camp1", name: "Natal Premiado", startDate: "2024-12-01", endDate: "2024-12-25", cashbackMultiplier: 2, isActive: true },
    { id: "camp2", name: "Aniversário da Loja", startDate: "2025-03-10", endDate: "2025-03-17", cashbackMultiplier: 1.5, isActive: false },
];

export const mockInitialMerchantSettings: MerchantSettings = {
  cashbackPercentage: DEFAULT_CASHBACK_PERCENTAGE,
  whatsappTemplate: DEFAULT_WHATSAPP_TEMPLATE,
  minimumRedemptionValue: DEFAULT_MINIMUM_REDEMPTION_VALUE,
  campaigns: mockCampaigns,
};


// For Admin Panel
export const initialGlobalClients: Client[] = [
  { id: "c1", merchantId: "merch1", name: "Ana Silva (Loja Esquina)", phone: "5511999990001", accumulatedCashback: 25.50, currentBalance: 10.00, cashbackRedeemed: 15.50 },
  { id: "c2", merchantId: "merch2", name: "Bruno Costa (Padaria)", phone: "5521988880002", accumulatedCashback: 120.75, currentBalance: 50.25, cashbackRedeemed: 70.50 },
  { id: "c3", merchantId: "merch1", name: "Carlos Dias (Loja Esquina)", phone: "5531977770003", accumulatedCashback: 0, currentBalance: 0, cashbackRedeemed: 0 },
  { id: "c4", merchantId: "merch3", name: "Daniela Alves (Salão)", phone: "5541966660004", accumulatedCashback: 55.00, currentBalance: 20.00, cashbackRedeemed: 35.00 },
  { id: "c5", merchantId: "merch2", name: "Eduardo Lima (Padaria)", phone: "5551955550005", accumulatedCashback: 10.00, currentBalance: 5.00, cashbackRedeemed: 5.00 },
];

export const initialGlobalSales: Sale[] = [
  { id: "s1", merchantId: "merch1", clientId: "c1", clientName: "Ana Silva", value: 100, date: new Date(2023, 10, 15).toISOString(), cashbackGenerated: 5 },
  { id: "s2", merchantId: "merch2", clientId: "c2", clientName: "Bruno Costa", value: 250, date: new Date(2023, 10, 16).toISOString(), cashbackGenerated: 12.5 },
  { id: "s3", merchantId: "merch1", clientId: "c3", clientName: "Carlos Dias", value: 75, date: new Date(2023, 11, 1).toISOString(), cashbackGenerated: 3.75 },
  { id: "s4", merchantId: "merch3", clientId: "c4", clientName: "Daniela Alves", value: 120, date: new Date(2023, 11, 5).toISOString(), cashbackGenerated: 6 },
  { id: "s5", merchantId: "merch2", clientId: "c5", clientName: "Eduardo Lima", value: 90, date: new Date(2023, 11, 10).toISOString(), cashbackGenerated: 4.5 },
];

export const merchantNames: Record<string, string> = {
    merch1: "Loja da Esquina",
    merch2: "Padaria Pão Quente",
    merch3: "Salão Beleza Pura"
};

export const initialMerchants: MerchantUser[] = [
  { id: "merch1", name: "Loja da Esquina", email: "lojaesquina@email.com", role: "merchant", cnpjCpf: "11.111.111/0001-11" },
  { id: "merch2", name: "Padaria Pão Quente", email: "padaria@email.com", role: "merchant", cnpjCpf: "22.222.222/0001-22" },
  { id: "merch3", name: "Salão Beleza Pura", email: "salao@email.com", role: "merchant", cnpjCpf: "333.333.333-33" },
];

export const initialSystemUsers: UserAccount[] = [
  { id: "admin1", name: "Admin Principal", email: "admin@retornamais.com", role: "admin" },
  { id: "merch1u", name: "Usuário Loja Esquina", email: "lojaesquina@email.com", role: "merchant" }, // Ensure ID is unique if merchants are also users
  { id: "merch2u", name: "Usuário Padaria Pão Quente", email: "padaria@email.com", role: "merchant" },
  { id: "admin2", name: "Admin Suporte", email: "suporte@retornamais.com", role: "admin" },
];

export const mockAdminStats = {
  totalMerchants: initialMerchants.length,
  totalPlatformClients: initialGlobalClients.length,
  totalPlatformSales: initialGlobalSales.reduce((acc, s) => acc + s.value, 0),
  totalPlatformCashback: initialGlobalSales.reduce((acc, s) => acc + s.cashbackGenerated, 0),
  activeCampaigns: mockCampaigns.filter(c => {
    const today = new Date();
    return c.isActive && new Date(c.startDate) <= today && new Date(c.endDate) >= today;
  }).length,
};
