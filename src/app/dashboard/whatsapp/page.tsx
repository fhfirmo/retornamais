
"use client";

import { WhatsappComposer } from "@/components/dashboard/WhatsappComposer";
import { MessageSquare } from "lucide-react";
import type { Client, MerchantSettings } from "@/types";
import React, { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import { DEFAULT_CASHBACK_PERCENTAGE, DEFAULT_WHATSAPP_TEMPLATE, DEFAULT_MINIMUM_REDEMPTION_VALUE } from "@/lib/constants";

// Mock Data - In a real app, this would come from an API or context
const initialClients: Client[] = [
  { id: "1", name: "Ana Silva", phone: "5511999990001", accumulatedCashback: 25.50, currentBalance: 10.00, cashbackRedeemed: 15.50 },
  { id: "2", name: "Bruno Costa", phone: "5521988880002", accumulatedCashback: 120.75, currentBalance: 50.25, cashbackRedeemed: 70.50 },
  { id: "3", name: "Carlos Dias", phone: "5531977770003", accumulatedCashback: 0, currentBalance: 0, cashbackRedeemed: 0 },
];

// Mock settings for the merchant
const mockMerchantSettings: MerchantSettings = {
  cashbackPercentage: DEFAULT_CASHBACK_PERCENTAGE,
  whatsappTemplate: DEFAULT_WHATSAPP_TEMPLATE,
  minimumRedemptionValue: DEFAULT_MINIMUM_REDEMPTION_VALUE, 
  campaigns: [], // Assuming no active campaigns for simplicity here
};


export default function WhatsappPage() {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [merchantSettings, setMerchantSettings] = useState<MerchantSettings>(mockMerchantSettings);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const searchParams = useSearchParams();

  const [initialPurchaseValue, setInitialPurchaseValue] = useState<number | undefined>(undefined);
  const [initialCashbackFromThisPurchase, setInitialCashbackFromThisPurchase] = useState<number | undefined>(undefined);
  const [initialNewCurrentBalance, setInitialNewCurrentBalance] = useState<number | undefined>(undefined);


  useEffect(() => {
    // In a real app, fetch merchantSettings
    // setMerchantSettings(fetchedSettings);

    const clientId = searchParams.get('clientId');
    const purchaseValueParam = searchParams.get('purchaseValue');
    const cashbackFromThisPurchaseParam = searchParams.get('cashbackFromThisPurchase');
    const newCurrentBalanceParam = searchParams.get('newCurrentBalance');

    if (clientId) {
      const client = initialClients.find(c => c.id === clientId);
      if (client) setSelectedClient(client);
    }
    if (purchaseValueParam) {
        setInitialPurchaseValue(parseFloat(purchaseValueParam));
    }
    if (cashbackFromThisPurchaseParam) {
        setInitialCashbackFromThisPurchase(parseFloat(cashbackFromThisPurchaseParam));
    }
    if (newCurrentBalanceParam) {
        setInitialNewCurrentBalance(parseFloat(newCurrentBalanceParam));
    }

  }, [searchParams]);


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-bold flex items-center">
          <MessageSquare className="mr-3 h-8 w-8 text-primary" />
          Comunicação via WhatsApp
        </h1>
        <p className="text-muted-foreground">Crie e envie mensagens personalizadas para seus clientes.</p>
      </div>
      <WhatsappComposer 
        clients={clients} 
        initialClient={selectedClient} 
        initialPurchaseValue={initialPurchaseValue}
        initialCashbackFromThisPurchase={initialCashbackFromThisPurchase}
        initialNewCurrentBalance={initialNewCurrentBalance}
        merchantSettings={merchantSettings} // Pass the full settings object
        />
    </div>
  );
}
