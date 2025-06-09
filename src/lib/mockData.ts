
import type { Client, Sale, MerchantUser, UserAccount, MerchantSettings, Campaign, AdminDashboardStats } from "@/types";
import { DEFAULT_CASHBACK_PERCENTAGE, DEFAULT_WHATSAPP_TEMPLATE, DEFAULT_MINIMUM_REDEMPTION_VALUE } from "@/lib/constants";

// For Merchant Dashboard
export let mockMerchantClients: Client[] = [
  { id: "1", merchantId: "merch_example", name: "Ana Silva", phone: "5511999990001", accumulatedCashback: 25.50, currentBalance: 10.00, cashbackRedeemed: 15.50 },
  { id: "2", merchantId: "merch_example", name: "Bruno Costa", phone: "5521988880002", accumulatedCashback: 120.75, currentBalance: 50.25, cashbackRedeemed: 70.50 },
  { id: "3", merchantId: "merch_example", name: "Carlos Dias", phone: "5531977770003", accumulatedCashback: 0, currentBalance: 0, cashbackRedeemed: 0 },
  { id: "4", merchantId: "merch_example", name: "Daniela Alves", phone: "5541966660004", accumulatedCashback: 55.00, currentBalance: 20.00, cashbackRedeemed: 35.00 },
];

export let mockMerchantSales: Sale[] = [
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
    { id: "camp1", name: "Natal Premiado", startDate: new Date(new Date().getFullYear(), 11, 1).toISOString(), endDate: new Date(new Date().getFullYear(), 11, 25).toISOString(), cashbackMultiplier: 2, isActive: true },
    { id: "camp2", name: "Aniversário da Loja", startDate: new Date(new Date().getFullYear() + 1, 2, 10).toISOString(), endDate: new Date(new Date().getFullYear() + 1, 2, 17).toISOString(), cashbackMultiplier: 1.5, isActive: false },
];

export const mockInitialMerchantSettings: MerchantSettings = {
  cashbackPercentage: DEFAULT_CASHBACK_PERCENTAGE,
  whatsappTemplate: DEFAULT_WHATSAPP_TEMPLATE,
  minimumRedemptionValue: DEFAULT_MINIMUM_REDEMPTION_VALUE,
  campaigns: mockCampaigns,
};


// For Admin Panel
export let initialGlobalClients: Client[] = [
  { id: "c1", merchantId: "merch1", name: "Ana Silva (Loja Esquina)", phone: "5511999990001", accumulatedCashback: 25.50, currentBalance: 10.00, cashbackRedeemed: 15.50 },
  { id: "c2", merchantId: "merch2", name: "Bruno Costa (Padaria)", phone: "5521988880002", accumulatedCashback: 120.75, currentBalance: 50.25, cashbackRedeemed: 70.50 },
  { id: "c3", merchantId: "merch1", name: "Carlos Dias (Loja Esquina)", phone: "5531977770003", accumulatedCashback: 0, currentBalance: 0, cashbackRedeemed: 0 },
  { id: "c4", merchantId: "merch3", name: "Daniela Alves (Salão)", phone: "5541966660004", accumulatedCashback: 55.00, currentBalance: 20.00, cashbackRedeemed: 35.00 },
  { id: "c5", merchantId: "merch2", name: "Eduardo Lima (Padaria)", phone: "5551955550005", accumulatedCashback: 10.00, currentBalance: 5.00, cashbackRedeemed: 5.00 },
];

export let initialGlobalSales: Sale[] = [
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

export let initialMerchants: MerchantUser[] = [
  { id: "merch1", name: "Loja da Esquina", email: "lojaesquina@email.com", role: "merchant", cnpjCpf: "11.111.111/0001-11", cpf: "111.111.111-11", city: "São Paulo", neighborhood: "Centro", state: "SP" },
  { id: "merch2", name: "Padaria Pão Quente", email: "padaria@email.com", role: "merchant", cnpjCpf: "22.222.222/0001-22", cpf: "222.222.222-22", city: "Rio de Janeiro", neighborhood: "Copacabana", state: "RJ" },
  { id: "merch3", name: "Salão Beleza Pura", email: "salao@email.com", role: "merchant", cnpjCpf: "333.333.333-33", cpf: "333.333.333-33", city: "Belo Horizonte", neighborhood: "Savassi", state: "MG" },
];

export let initialSystemUsers: UserAccount[] = [
  { id: "admin1", name: "Admin Principal", email: "admin@retornamais.com", role: "admin", cpf: "000.000.000-00", city: "Curitiba", neighborhood: "Centro", state: "PR" },
  { id: "merch1u", name: "Usuário Loja Esquina", email: "lojaesquina@email.com", role: "merchant", cpf: "111.111.111-11", city: "São Paulo", neighborhood: "Centro", state: "SP" }, // This user links to MerchantUser merch1 by email maybe
  { id: "merch2u", name: "Usuário Padaria Pão Quente", email: "padaria@email.com", role: "merchant", cpf: "222.222.222-22", city: "Rio de Janeiro", neighborhood: "Copacabana", state: "RJ" },
  { id: "admin2", name: "Admin Suporte", email: "suporte@retornamais.com", role: "admin", cpf: "999.999.999-99", city: "Porto Alegre", neighborhood: "Moinhos", state: "RS" },
];

export function getAdminDashboardStats(): AdminDashboardStats {
  const today = new Date();
  return {
    totalMerchants: initialMerchants.length,
    totalPlatformClients: initialGlobalClients.length,
    totalPlatformSales: initialGlobalSales.reduce((acc, s) => acc + s.value, 0),
    totalPlatformCashback: initialGlobalSales.reduce((acc, s) => acc + s.cashbackGenerated, 0),
    activeCampaigns: mockCampaigns.filter(c => {
      const startDate = new Date(c.startDate);
      const endDate = new Date(c.endDate);
      startDate.setHours(0,0,0,0);
      endDate.setHours(23,59,59,999);
      return c.isActive && startDate <= today && endDate >= today;
    }).length,
  };
}
