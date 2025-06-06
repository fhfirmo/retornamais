"use client"; // For mock data and state

import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, ShoppingCart, Gift, ArrowRight, MessageSquare } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Client, Sale } from "@/types"; // Assuming types are defined
import React, { useState, useEffect } from "react";

// Mock Data - In a real app, this would come from an API
const mockClients: Client[] = [
  { id: "1", name: "Ana Silva", phone: "5511999990001", accumulatedCashback: 25.50, currentBalance: 10.00 },
  { id: "2", name: "Bruno Costa", phone: "5521988880002", accumulatedCashback: 120.75, currentBalance: 50.25 },
  { id: "3", name: "Carlos Dias", phone: "5531977770003", accumulatedCashback: 0, currentBalance: 0 },
];

const mockSales: Sale[] = [
  { id: "s1", clientId: "1", clientName: "Ana Silva", value: 100, date: new Date(2023, 10, 15).toISOString(), cashbackGenerated: 5 },
  { id: "s2", clientId: "2", clientName: "Bruno Costa", value: 250, date: new Date(2023, 10, 16).toISOString(), cashbackGenerated: 12.5 },
  { id: "s3", clientId: "1", clientName: "Ana Silva", value: 50, date: new Date(2023, 10, 18).toISOString(), cashbackGenerated: 2.5 },
];

export default function DashboardPage() {
  const [totalClients, setTotalClients] = useState(0);
  const [totalSalesValue, setTotalSalesValue] = useState(0);
  const [totalCashbackGiven, setTotalCashbackGiven] = useState(0);
  const [recentSales, setRecentSales] = useState<Sale[]>([]);

  useEffect(() => {
    // Simulate fetching data
    setTotalClients(mockClients.length);
    const salesSum = mockSales.reduce((sum, sale) => sum + sale.value, 0);
    setTotalSalesValue(salesSum);
    const cashbackSum = mockSales.reduce((sum, sale) => sum + sale.cashbackGenerated, 0);
    setTotalCashbackGiven(cashbackSum);
    setRecentSales(mockSales.slice(0, 3).map(sale => ({
      ...sale,
      clientName: mockClients.find(c => c.id === sale.clientId)?.name || 'Cliente Desconhecido'
    })));
  }, []);


  return (
    <div className="space-y-6 md:space-y-8">
      <h1 className="text-3xl font-headline font-bold">Painel do Comerciante</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Total de Clientes"
          value={totalClients}
          icon={Users}
          description="Clientes cadastrados na plataforma"
          colorClass="text-secondary"
        />
        <StatCard
          title="Valor Total de Vendas"
          value={`R$ ${totalSalesValue.toFixed(2)}`}
          icon={ShoppingCart}
          description="Soma de todas as vendas registradas"
          colorClass="text-accent"
        />
        <StatCard
          title="Total de Cashback Distribuído"
          value={`R$ ${totalCashbackGiven.toFixed(2)}`}
          icon={Gift}
          description="Cashback concedido aos clientes"
          colorClass="text-primary"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline">Vendas Recentes</CardTitle>
            <CardDescription>Últimas transações registradas.</CardDescription>
          </CardHeader>
          <CardContent>
            {recentSales.length > 0 ? (
              <ul className="space-y-3">
                {recentSales.map((sale) => (
                  <li key={sale.id} className="flex justify-between items-center p-3 bg-muted/30 rounded-md">
                    <div>
                      <p className="font-medium">{sale.clientName}</p>
                      <p className="text-sm text-muted-foreground">{new Date(sale.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">R$ {sale.value.toFixed(2)}</p>
                      <p className="text-xs text-green-600">Cashback: R$ {sale.cashbackGenerated.toFixed(2)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">Nenhuma venda recente.</p>
            )}
            <Button variant="outline" className="mt-4 w-full" asChild>
              <Link href="/dashboard/sales">Ver todas as vendas <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline">Acesso Rápido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
             <Button className="w-full justify-start" variant="ghost" asChild>
                <Link href="/dashboard/clients/new">
                    <Users className="mr-2 h-5 w-5 text-secondary" /> Novo Cliente
                </Link>
             </Button>
             <Button className="w-full justify-start" variant="ghost" asChild>
                <Link href="/dashboard/sales/new">
                    <ShoppingCart className="mr-2 h-5 w-5 text-secondary" /> Nova Venda
                </Link>
             </Button>
             <Button className="w-full justify-start" variant="ghost" asChild>
                <Link href="/dashboard/whatsapp">
                    <MessageSquare className="mr-2 h-5 w-5 text-secondary" /> Enviar WhatsApp
                </Link>
             </Button>
          </CardContent>
        </Card>
      </div>

       <Card className="shadow-sm overflow-hidden">
        <CardHeader>
            <CardTitle className="font-headline">Potencialize seu negócio!</CardTitle>
        </CardHeader>
        <CardContent className="p-0 md:flex">
            <div className="md:w-1/2 p-6 flex flex-col justify-center">
                <h3 className="text-xl font-semibold mb-2 font-headline">Descubra o poder do cashback</h3>
                <p className="text-muted-foreground mb-4">
                    Transforme clientes ocasionais em fãs da sua marca. Com o Retorna+, você implementa um sistema de cashback de forma fácil e eficiente, incentivando seus clientes a voltarem sempre.
                </p>
                <Button asChild>
                    <Link href="/dashboard/settings">Configurar Cashback <Gift className="ml-2 h-4 w-4" /></Link>
                </Button>
            </div>
            <div className="md:w-1/2 h-64 md:h-auto relative">
                <Image src="https://placehold.co/600x400.png" alt="Cashback illustration" layout="fill" objectFit="cover" data-ai-hint="rewards loyalty" />
            </div>
        </CardContent>
       </Card>

    </div>
  );
}
