"use client";

import { WhatsappComposer } from "@/components/dashboard/WhatsappComposer";
import { MessageSquare } from "lucide-react";
import type { Client } from "@/types";
import React, { useState, useEffect } from "react";
// import { useSearchParams } from 'next/navigation'; // If using query param for client ID

// Mock Data - In a real app, this would come from an API or context
const initialClients: Client[] = [
  { id: "1", name: "Ana Silva", phone: "5511999990001", accumulatedCashback: 25.50, currentBalance: 10.00 },
  { id: "2", name: "Bruno Costa", phone: "5521988880002", accumulatedCashback: 120.75, currentBalance: 50.25 },
  { id: "3", name: "Carlos Dias", phone: "5531977770003", accumulatedCashback: 0, currentBalance: 0 },
];


export default function WhatsappPage() {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  // const searchParams = useSearchParams();

  useEffect(() => {
    // const clientId = searchParams.get('clientId');
    // if (clientId) {
    //   const client = initialClients.find(c => c.id === clientId);
    //   if (client) setSelectedClient(client);
    // }
  }, [/* searchParams */]);


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-bold flex items-center">
          <MessageSquare className="mr-3 h-8 w-8 text-primary" />
          Comunicação via WhatsApp
        </h1>
        <p className="text-muted-foreground">Crie e envie mensagens personalizadas para seus clientes.</p>
      </div>
      <WhatsappComposer clients={clients} initialClient={selectedClient} />
    </div>
  );
}
