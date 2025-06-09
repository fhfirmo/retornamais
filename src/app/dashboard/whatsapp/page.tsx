"use client";

import { WhatsappComposer } from "@/components/dashboard/WhatsappComposer";
import { MessageSquare } from "lucide-react";
import type { Client, MerchantSettings } from "@/types";
import React, { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import { mockMerchantClients, mockInitialMerchantSettings } from "@/lib/mockData"; // Import from centralized mock data


export default function WhatsappPage() {
  const [clients, setClients] = useState<Client[]>(mockMerchantClients);
  const [merchantSettings, setMerchantSettings] = useState<MerchantSettings>(mockInitialMerchantSettings);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const searchParams = useSearchParams();

  const [initialPurchaseValue, setInitialPurchaseValue] = useState<number | undefined>(undefined);
  const [initialCashbackFromThisPurchase, setInitialCashbackFromThisPurchase] = useState<number | undefined>(undefined);
  const [initialNewCurrentBalance, setInitialNewCurrentBalance] = useState<number | undefined>(undefined);


  useEffect(() => {
    // In a real app, fetch merchantSettings for the logged-in merchant
    // setMerchantSettings(fetchedSettings);

    const clientId = searchParams.get('clientId');
    const purchaseValueParam = searchParams.get('purchaseValue');
    const cashbackFromThisPurchaseParam = searchParams.get('cashbackFromThisPurchase');
    const newCurrentBalanceParam = searchParams.get('newCurrentBalance');

    if (clientId) {
      const client = clients.find(c => c.id === clientId); // Use 'clients' state which is mockMerchantClients
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

  }, [searchParams, clients]);


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
        merchantSettings={merchantSettings} 
        />
    </div>
  );
}