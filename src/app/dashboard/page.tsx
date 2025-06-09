
"use client"; 

import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, ShoppingCart, Gift, ArrowRight, MessageSquare, TrendingDown, ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { Client, Sale } from "@/types"; 
import React, { useState, useEffect } from "react";
import { mockMerchantClients, mockMerchantSales } from "@/lib/mockData"; // Import from centralized mock data
import { PromoImageGenerator } from "@/components/dashboard/PromoImageGenerator"; // Import the new component

export default function DashboardPage() {
  const [totalClients, setTotalClients] = useState(0);
  const [totalSalesValue, setTotalSalesValue] = useState(0);
  const [totalCashbackGiven, setTotalCashbackGiven] = useState(0);
  const [totalCashbackRedeemed, setTotalCashbackRedeemed] = useState(0);
  const [recentSales, setRecentSales] = useState<Sale[]>([]);

  useEffect(() => {
    setTotalClients(mockMerchantClients.length);
    const salesSum = mockMerchantSales.reduce((sum, sale) => sum + sale.value, 0);
    setTotalSalesValue(salesSum);
    const cashbackSum = mockMerchantSales.reduce((sum, sale) => sum + sale.cashbackGenerated, 0);
    setTotalCashbackGiven(cashbackSum);
    const redeemedSum = mockMerchantClients.reduce((sum, client) => sum + (client.cashbackRedeemed || 0), 0);
    setTotalCashbackRedeemed(redeemedSum);

    setRecentSales(mockMerchantSales.slice(0, 3).map(sale => ({
      ...sale,
      clientName: mockMerchantClients.find(c => c.id === sale.clientId)?.name || 'Cliente Desconhecido'
    })));
  }, []);


  return (
    <div className="space-y-6 md:space-y-8">
      <h1 className="text-3xl font-headline font-bold">Painel do Comerciante</h1>
      <p className="text-muted-foreground">Bem-vindo, Comerciante Exemplo!</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
          title="Cashback Distribuído"
          value={`R$ ${totalCashbackGiven.toFixed(2)}`}
          icon={Gift}
          description="Cashback concedido aos clientes"
          colorClass="text-primary"
        />
        <StatCard
          title="Cashback Resgatado"
          value={`R$ ${totalCashbackRedeemed.toFixed(2)}`}
          icon={TrendingDown} 
          description="Cashback utilizado pelos clientes"
          colorClass="text-green-500"
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
                <Link href="/dashboard/clients"> 
                    <Users className="mr-2 h-5 w-5 text-secondary" /> Novo Cliente
                </Link>
             </Button>
             <Button className="w-full justify-start" variant="ghost" asChild>
                <Link href="/dashboard/sales">
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

      <PromoImageGenerator />

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
