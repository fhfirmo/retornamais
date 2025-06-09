
"use client";

import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building, Users, ShoppingCart, Gift, BarChart3, CalendarCheck2, UserPlus, CheckCircle2, BarChartHorizontalBig, Filter } from "lucide-react";
import React, { useState, useEffect } from "react";
import { mockAdminStats } from "@/lib/mockData"; // Import from centralized mock data

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(mockAdminStats);

  useEffect(() => {
    // In a real app, fetch this data from the backend
    // For now, we can re-evaluate mockAdminStats if its dependencies change,
    // but for this prototype, it's static after initial load.
    setStats(mockAdminStats);
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
            <CardDescription>Resumo das atividades no sistema.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mt-4 p-8 border rounded-md bg-muted/30 text-center space-y-4">
                <BarChartHorizontalBig className="h-16 w-16 mx-auto text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">
                  Área para gráficos de atividade, como:
                </p>
                <ul className="text-sm text-muted-foreground list-disc list-inside">
                    <li>Volume de vendas diário/semanal</li>
                    <li>Novos comerciantes cadastrados</li>
                    <li>Novos clientes na plataforma</li>
                </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline">Gerenciamento Rápido</CardTitle>
            <CardDescription>Ações comuns do administrador.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
             <Button variant="outline" className="w-full justify-start" onClick={() => alert("Placeholder: Ir para cadastro de comerciante")}>
                <UserPlus className="mr-2 h-5 w-5 text-secondary" /> Cadastrar Novo Comerciante
             </Button>
             <Button variant="outline" className="w-full justify-start" onClick={() => alert("Placeholder: Ir para aprovações pendentes")}>
                <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" /> Aprovar Cadastros Pendentes
             </Button>
             <Button variant="outline" className="w-full justify-start" onClick={() => alert("Placeholder: Ir para gerenciamento de usuários")}>
                <Users className="mr-2 h-5 w-5 text-accent" /> Gerenciar Usuários do Sistema
             </Button>
          </CardContent>
        </Card>
      </div>
      
       <Card className="shadow-sm">
        <CardHeader>
            <CardTitle className="font-headline flex items-center">
                <Filter className="mr-2 h-5 w-5 text-primary" />
                Filtros Globais do Dashboard
            </CardTitle>
            <CardDescription>Filtre os dados exibidos nos cartões e gráficos (funcionalidade simulada).</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <Input type="text" placeholder="Filtrar por Comerciante..." />
            <Input type="date" placeholder="Data Início" />
            <Input type="date" placeholder="Data Fim" />
            <Button onClick={() => alert("Filtros aplicados (simulação)")}>Aplicar Filtros</Button>
        </CardContent>
       </Card>
    </div>
  );
}
