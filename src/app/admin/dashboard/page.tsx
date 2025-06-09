
"use client";

import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building, Users, ShoppingCart, Gift, BarChart3, CalendarCheck2, UserPlus, CheckCircle2, BarChartHorizontalBig, Filter, PieChart, TrendingUp, Settings } from "lucide-react"; // Changed SettingsIcon to Settings
import React, { useState, useEffect } from "react";
import { getAdminDashboardStats, initialMerchants, initialGlobalClients, initialGlobalSales } from "@/lib/mockData"; // Import from centralized mock data
import type { AdminDashboardStats } from "@/types";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, Cell } from "recharts"


const chartDataSalesByMonth = [
  { month: "Jan", sales: Math.floor(Math.random() * 5000) + 1000 },
  { month: "Fev", sales: Math.floor(Math.random() * 5000) + 1000 },
  { month: "Mar", sales: Math.floor(Math.random() * 5000) + 1000 },
  { month: "Abr", sales: Math.floor(Math.random() * 5000) + 1000 },
  { month: "Mai", sales: Math.floor(Math.random() * 5000) + 1000 },
  { month: "Jun", sales: Math.floor(Math.random() * 5000) + 1000 },
];

const chartDataClientsByMerchant = initialMerchants.map(merchant => ({
  name: merchant.name,
  value: initialGlobalClients.filter(client => client.merchantId === merchant.id).length,
}));

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];


export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminDashboardStats>(getAdminDashboardStats());

  useEffect(() => {
    setStats(getAdminDashboardStats());
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
                <BarChart3 className="mr-2 h-6 w-6 text-primary" /> Volume de Vendas Mensal (Simulado)
            </CardTitle>
            <CardDescription>Resumo das vendas nos últimos meses.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{sales: {label: "Vendas", color: "hsl(var(--primary))"}}} className="h-[250px] w-full">
              <BarChart accessibilityLayer data={chartDataSalesByMonth} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tickMargin={10} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline flex items-center">
              <PieChart className="mr-2 h-6 w-6 text-secondary" /> Clientes por Comerciante
            </CardTitle>
            <CardDescription>Distribuição de clientes entre os comerciantes.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
             <ChartContainer config={{
                clients: { label: "Clientes" },
                ...chartDataClientsByMerchant.reduce((acc, cur) => {
                  acc[cur.name] = { label: cur.name, color: COLORS[chartDataClientsByMerchant.indexOf(cur) % COLORS.length] };
                  return acc;
                }, {})
              }} className="h-[250px] w-full max-w-xs">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="value" hideLabel />} />
                <Pie data={chartDataClientsByMerchant} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} >
                   {chartDataClientsByMerchant.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent nameKey="name" />} />
              </PieChart>
            </ChartContainer>
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

       <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline flex items-center"><TrendingUp className="mr-2 h-6 w-6 text-accent"/> Ações Rápidas</CardTitle>
            <CardDescription>Links para ações administrativas comuns.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
             <Button variant="outline" className="w-full justify-start py-6 text-base" onClick={() => alert("Placeholder: Ir para cadastro de comerciante")}>
                <UserPlus className="mr-2 h-5 w-5 text-secondary" /> Cadastrar Novo Comerciante
             </Button>
             <Button variant="outline" className="w-full justify-start py-6 text-base" onClick={() => alert("Placeholder: Ir para aprovações pendentes")}>
                <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" /> Aprovar Cadastros Pendentes
             </Button>
             <Button variant="outline" className="w-full justify-start py-6 text-base" onClick={() => alert("Placeholder: Ir para gerenciamento de usuários do sistema")}>
                <Users className="mr-2 h-5 w-5 text-accent" /> Gerenciar Usuários do Sistema
             </Button>
              <Button variant="outline" className="w-full justify-start py-6 text-base" onClick={() => alert("Placeholder: Ir para configurações globais do sistema")}>
                <Settings className="mr-2 h-5 w-5 text-primary" /> Configurações Globais 
             </Button>
          </CardContent>
        </Card>
    </div>
  );
}

