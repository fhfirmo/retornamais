
"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import { WhatsappComposer } from "@/components/dashboard/WhatsappComposer";
import { MessageSquare, Loader2 } from "lucide-react";
import type { Client, MerchantSettings } from "@/types";
import { mockMerchantClients, mockInitialMerchantSettings } from "@/lib/mockData";

// Este componente conterá a lógica que usa useSearchParams
function WhatsappPageContent() {
  const [clients, setClients] = useState<Client[]>(mockMerchantClients);
  const [merchantSettings, setMerchantSettings] = useState<MerchantSettings>(mockInitialMerchantSettings);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const searchParams = useSearchParams();

  const [initialPurchaseValue, setInitialPurchaseValue] = useState<number | undefined>(undefined);
  const [initialCashbackFromThisPurchase, setInitialCashbackFromThisPurchase] = useState<number | undefined>(undefined);
  const [initialNewCurrentBalance, setInitialNewCurrentBalance] = useState<number | undefined>(undefined);


  useEffect(() => {
    // Este efeito é executado no cliente após a hidratação e searchParams estarem disponíveis
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
    <WhatsappComposer
      clients={clients}
      initialClient={selectedClient}
      initialPurchaseValue={initialPurchaseValue}
      initialCashbackFromThisPurchase={initialCashbackFromThisPurchase}
      initialNewCurrentBalance={initialNewCurrentBalance}
      merchantSettings={merchantSettings}
    />
  );
}

// O componente da página principal que envolve WhatsappPageContent com Suspense
export default function WhatsappPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-bold flex items-center">
          <MessageSquare className="mr-3 h-8 w-8 text-primary" />
          Comunicação via WhatsApp
        </h1>
        <p className="text-muted-foreground">Crie e envie mensagens personalizadas para seus clientes.</p>
      </div>
      <Suspense fallback={
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
          <p className="text-muted-foreground">Carregando dados do cliente...</p>
        </div>
      }>
        <WhatsappPageContent />
      </Suspense>
    </div>
  );
}
