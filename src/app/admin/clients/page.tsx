
"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Briefcase, Search, Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Client } from "@/types";

// Mock Data - Representing clients from potentially different merchants
const initialGlobalClients: Client[] = [
  { id: "c1", merchantId: "merch1", name: "Ana Silva (Loja Esquina)", phone: "5511999990001", accumulatedCashback: 25.50, currentBalance: 10.00, cashbackRedeemed: 15.50 },
  { id: "c2", merchantId: "merch2", name: "Bruno Costa (Padaria)", phone: "5521988880002", accumulatedCashback: 120.75, currentBalance: 50.25, cashbackRedeemed: 70.50 },
  { id: "c3", merchantId: "merch1", name: "Carlos Dias (Loja Esquina)", phone: "5531977770003", accumulatedCashback: 0, currentBalance: 0, cashbackRedeemed: 0 },
  { id: "c4", merchantId: "merch3", name: "Daniela Alves (Salão)", phone: "5541966660004", accumulatedCashback: 55.00, currentBalance: 20.00, cashbackRedeemed: 35.00 },
  { id: "c5", merchantId: "merch2", name: "Eduardo Lima (Padaria)", phone: "5551955550005", accumulatedCashback: 10.00, currentBalance: 5.00, cashbackRedeemed: 5.00 },
];

// Mock merchant names for display
const merchantNames: Record<string, string> = {
    merch1: "Loja da Esquina",
    merch2: "Padaria Pão Quente",
    merch3: "Salão Beleza Pura"
}

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>(initialGlobalClients);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMerchantId, setFilterMerchantId] = useState("");


  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      const searchMatch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          client.phone.includes(searchTerm);
      const merchantMatch = filterMerchantId ? client.merchantId === filterMerchantId : true;
      return searchMatch && merchantMatch;
    });
  }, [clients, searchTerm, filterMerchantId]);


  const handleEditClient = (client: Client) => {
    console.log("Edit client (Admin):", client);
    alert(`Editar cliente: ${client.name} (Admin) - Placeholder`);
  };

  const handleDeleteClient = (clientId: string) => {
    console.log("Delete client ID (Admin):", clientId);
     if(confirm("Tem certeza que deseja excluir este cliente globalmente? Isso pode afetar dados de um comerciante.")) {
        setClients(clients.filter(c => c.id !== clientId));
        alert("Cliente excluído globalmente (simulação).");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-bold flex items-center">
          <Briefcase className="mr-3 h-8 w-8 text-primary" />
          Gerenciamento de Clientes (Global)
        </h1>
        <p className="text-muted-foreground">Visualize e gerencie todos os clientes da plataforma.</p>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-headline">Lista Global de Clientes</CardTitle>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                type="text"
                placeholder="Buscar por nome ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
                />
            </div>
            {/* Basic filter by merchant for demonstration */}
            <Input 
              type="text"
              placeholder="Filtrar por ID do Comerciante (ex: merch1)"
              value={filterMerchantId}
              onChange={(e) => setFilterMerchantId(e.target.value)}
              className="w-full"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredClients.length > 0 ? (
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome Cliente</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Comerciante</TableHead>
                    <TableHead className="text-right">Saldo (R$)</TableHead>
                    <TableHead className="text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">{client.name}</TableCell>
                      <TableCell>{client.phone}</TableCell>
                      <TableCell>{client.merchantId ? merchantNames[client.merchantId] || client.merchantId : 'N/A'}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary">{client.currentBalance.toFixed(2)}</Badge>
                      </TableCell>
                      <TableCell className="text-center space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditClient(client)} title="Editar Cliente">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteClient(client.id)} title="Excluir Cliente">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">Nenhum cliente encontrado com os filtros atuais.</p>
          )}
        </CardContent>
      </Card>
      <CardDescription className="text-xs text-muted-foreground">
        Clientes também podem ser cadastrados por Administradores ou Comerciantes em seus respectivos painéis.
      </CardDescription>
    </div>
  );
}
