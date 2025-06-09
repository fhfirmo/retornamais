
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, Phone, Gift, ShoppingBag, Coins, VenetianMask } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import type { Client, Sale } from '@/types';
import { mockMerchantClients, mockMerchantSales } from '@/lib/mockData'; // Using centralized mock data
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  
  const clientId = typeof params.clientId === 'string' ? params.clientId : undefined;

  const [client, setClient] = useState<Client | null>(null);
  const [clientSales, setClientSales] = useState<Sale[]>([]);
  const [redeemAmount, setRedeemAmount] = useState<string>("");

  useEffect(() => {
    if (clientId) {
      const foundClient = mockMerchantClients.find(c => c.id === clientId);
      if (foundClient) {
        setClient(foundClient);
        const salesForClient = mockMerchantSales.filter(s => s.clientId === clientId);
        setClientSales(salesForClient);
      } else {
        toast({ title: "Cliente não encontrado", variant: "destructive" });
        // Optionally redirect: router.push('/dashboard/clients');
      }
    }
  }, [clientId, toast, router]);

  const handleRedeemCashback = () => {
    if (!client) return;

    const amount = parseFloat(redeemAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({ title: "Valor inválido", description: "Por favor, insira um valor de resgate positivo.", variant: "destructive" });
      return;
    }
    if (amount > client.currentBalance) {
      toast({ title: "Saldo insuficiente", description: "O valor de resgate excede o saldo de cashback do cliente.", variant: "destructive" });
      return;
    }

    // Simulate update (in a real app, this would be an API call)
    setClient(prevClient => {
      if (!prevClient) return null;
      const newBalance = prevClient.currentBalance - amount;
      const newRedeemed = (prevClient.cashbackRedeemed || 0) + amount;
      
      // Also update the main mock data array (for prototype persistence across navigation)
      const clientIndex = mockMerchantClients.findIndex(c => c.id === prevClient.id);
      if (clientIndex > -1) {
        mockMerchantClients[clientIndex] = {
          ...mockMerchantClients[clientIndex],
          currentBalance: newBalance,
          cashbackRedeemed: newRedeemed,
        };
      }
      
      return {
        ...prevClient,
        currentBalance: newBalance,
        cashbackRedeemed: newRedeemed,
      };
    });

    toast({ title: "Cashback Resgatado!", description: `R$${amount.toFixed(2)} resgatados para ${client.name}.` });
    setRedeemAmount("");
  };

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <VenetianMask className="w-24 h-24 text-muted-foreground mb-4" />
        <p className="text-xl text-muted-foreground">Cliente não encontrado ou ID inválido.</p>
        <Button asChild variant="outline" className="mt-6">
          <Link href="/dashboard/clients">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Clientes
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={() => router.push('/dashboard/clients')} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Lista de Clientes
      </Button>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center">
            <User className="mr-3 h-7 w-7 text-primary" /> {client.name}
          </CardTitle>
          <CardDescription>Detalhes e histórico do cliente.</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center">
              <Phone className="mr-2 h-5 w-5 text-muted-foreground" />
              <span>{client.phone}</span>
            </div>
            <div className="flex items-center">
              <Gift className="mr-2 h-5 w-5 text-muted-foreground" />
              <span>Saldo Cashback: <Badge variant="secondary" className="text-lg">R$ {client.currentBalance.toFixed(2)}</Badge></span>
            </div>
            <div className="flex items-center">
              <Coins className="mr-2 h-5 w-5 text-muted-foreground" />
              <span>Total Acumulado: R$ {client.accumulatedCashback.toFixed(2)}</span>
            </div>
            <div className="flex items-center">
              <ShoppingBag className="mr-2 h-5 w-5 text-muted-foreground" />
              <span>Total Resgatado: R$ {(client.cashbackRedeemed || 0).toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><Coins className="mr-2 h-6 w-6 text-secondary"/> Resgatar Cashback</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-end gap-4">
          <div className="flex-grow w-full sm:w-auto">
            <label htmlFor="redeemAmount" className="block text-sm font-medium text-muted-foreground mb-1">Valor a Resgatar (R$)</label>
            <Input 
              id="redeemAmount"
              type="number" 
              step="0.01"
              value={redeemAmount} 
              onChange={(e) => setRedeemAmount(e.target.value)}
              placeholder="Ex: 10.00"
              className="max-w-xs"
            />
          </div>
          <Button onClick={handleRedeemCashback} disabled={!redeemAmount || parseFloat(redeemAmount) <= 0}>
            Confirmar Resgate
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-headline">Histórico de Compras</CardTitle>
        </CardHeader>
        <CardContent>
          {clientSales.length > 0 ? (
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Valor (R$)</TableHead>
                    <TableHead className="text-right">Cashback Gerado (R$)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientSales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>{format(new Date(sale.date), "dd/MM/yyyy HH:mm", { locale: ptBR })}</TableCell>
                      <TableCell className="text-right">{sale.value.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="default" className="bg-primary/80">
                            {sale.cashbackGenerated.toFixed(2)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">Nenhuma compra registrada para este cliente.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
