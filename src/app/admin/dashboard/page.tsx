
"use client";

import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building, Users, ShoppingCart, Gift, BarChart3, CalendarCheck2 } from "lucide-react";
import React, { useState, useEffect } from "react";

// Mock Data for Admin Dashboard
const mockAdminStats = {
  totalMerchants: 15,
  totalPlatformClients: 250, // Sum of unique clients across all merchants
  totalPlatformSales: 12500.75,
  totalPlatformCashback: 625.03,
  activeCampaigns: 3,
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(mockAdminStats);

  useEffect(() => {
    // In a real app, fetch this data from the backend
    // setStats(fetchedAdminStats);
  }, []);

  return (
    <div className="space-y-6 md:space-y-8">
      <h1 className="text-3xl font-headline font-bold">Painel do Administrador</h1>
      <p className="text-muted-foreground">Visão geral do sistema Retorna+.</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard
          title="Total de Comerciantes"
          value={stats.totalMerchants}
          icon={Building}
          description="Comerciantes ativos na plataforma"
          colorClass="text-primary"
        />
        <StatCard
          title="Total de Clientes (Plataforma)"
          value={stats.totalPlatformClients}
          icon={Users}
          description="Clientes únicos em toda a plataforma"
          colorClass="text-secondary"
        />
        <StatCard
          title="Vendas Totais (Plataforma)"
          value={`R$ ${stats.totalPlatformSales.toFixed(2)}`}
          icon={ShoppingCart}
          description="Soma de todas as vendas registradas"
          colorClass="text-accent"
        />
        <StatCard
          title="Cashback Total (Plataforma)"
          value={`R$ ${stats.totalPlatformCashback.toFixed(2)}`}
          icon={Gift}
          description="Cashback total concedido"
          colorClass="text-green-500"
        />
        <StatCard
          title="Campanhas Ativas"
          value={stats.activeCampaigns}
          icon={CalendarCheck2}
          description="Campanhas de cashback em andamento"
          colorClass="text-orange-500"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline flex items-center">
                <BarChart3 className="mr-2 h-6 w-6 text-primary" /> Atividade Recente
            </CardTitle>
            <CardDescription>Resumo das atividades no sistema (placeholder).</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Gráficos e listas de atividades recentes seriam exibidos aqui.
              Por exemplo: Novos comerciantes, volume de vendas diário, etc.
            </p>
            {/* Placeholder for charts or lists */}
            <div className="mt-4 p-8 border rounded-md bg-muted/30 text-center">
                <p>Área para Gráficos de Atividade</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline">Gerenciamento Rápido</CardTitle>
            <CardDescription>Ações comuns do administrador (placeholder).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
             <p className="text-muted-foreground">Links para criar novos usuários, comerciantes, aprovar cadastros, etc.</p>
             <div className="mt-4 p-8 border rounded-md bg-muted/30 text-center">
                <p>Botões de Ações Rápidas</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
       <Card className="shadow-sm">
        <CardHeader>
            <CardTitle className="font-headline">Filtros Globais</CardTitle>
            <CardDescription>Filtre os dados do dashboard (placeholder).</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Placeholder for global filters */}
            <Input type="text" placeholder="Filtrar por Comerciante..." />
            <Input type="date" placeholder="Data Início" />
            <Input type="date" placeholder="Data Fim" />
            <Button>Aplicar Filtros</Button>
        </CardContent>
       </Card>
    </div>
  );
}
