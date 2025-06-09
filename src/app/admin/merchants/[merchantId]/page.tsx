
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Building, User, Users, ShoppingCart, Gift, Mail, FileText, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { initialMerchants, initialGlobalClients, initialGlobalSales, merchantNames } from '@/lib/mockData';
import type { MerchantUser, Client, Sale } from '@/types';
import { StatCard } from '@/components/dashboard/StatCard';
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function AdminMerchantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const merchantId = typeof params.merchantId === 'string' ? params.merchantId : undefined;

  const [merchant, setMerchant] = useState<MerchantUser | null>(null);
  const [merchantClients, setMerchantClients] = useState<Client[]>([]);
  const [merchantSales, setMerchantSales] = useState<Sale[]>([]);

  useEffect(() => {
    if (merchantId) {
      const foundMerchant = initialMerchants.find(m => m.id === merchantId);
      if (foundMerchant) {
        setMerchant(foundMerchant);
        setMerchantClients(initialGlobalClients.filter(c => c.merchantId === merchantId));
        setMerchantSales(initialGlobalSales.filter(s => s.merchantId === merchantId));
      } else {
        // Handle merchant not found, e.g., show toast and redirect
        router.push('/admin/merchants');
      }
    }
  }, [merchantId, router]);

  const totalSalesValue = useMemo(() => merchantSales.reduce((sum, sale) => sum + sale.value, 0), [merchantSales]);
  const totalCashbackGenerated = useMemo(() => merchantSales.reduce((sum, sale) => sum + sale.cashbackGenerated, 0), [merchantSales]);

  if (!merchant) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Carregando dados do comerciante...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={() => router.push('/admin/merchants')} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Lista de Comerciantes
      </Button>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center">
            <Building className="mr-3 h-7 w-7 text-primary" /> {merchant.name}
          </CardTitle>
          <CardDescription>Detalhes e atividade do comerciante.</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center">
              <Mail className="mr-2 h-5 w-5 text-muted-foreground" />
              <span>{merchant.email}</span>
            </div>
            <div className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-muted-foreground" />
              <span>CNPJ/CPF: {merchant.cnpjCpf}</span>
            </div>
          </div>
          <div>
            <Badge variant="secondary">ID do Comerciante: {merchant.id}</Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total de Clientes"
          value={merchantClients.length}
          icon={Users}
          description="Clientes associados a este comerciante"
          colorClass="text-secondary"
        />
        <StatCard
          title="Total de Vendas (Valor)"
          value={`R$ ${totalSalesValue.toFixed(2)}`}
          icon={ShoppingCart}
          description="Valor total das vendas deste comerciante"
          colorClass="text-accent"
        />
        <StatCard
          title="Total de Vendas (Qtd)"
          value={merchantSales.length}
          icon={BarChart3}
          description="Número total de vendas"
        />
        <StatCard
          title="Cashback Gerado"
          value={`R$ ${totalCashbackGenerated.toFixed(2)}`}
          icon={Gift}
          description="Total de cashback gerado por este comerciante"
          colorClass="text-primary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="font-headline flex items-center"><Users className="mr-2 h-6 w-6"/> Clientes Recentes ({merchantClients.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {merchantClients.length > 0 ? (
              <div className="rounded-lg border overflow-hidden max-h-96 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead className="text-right">Saldo Cashback (R$)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {merchantClients.slice(0, 5).map((client) => ( // Show first 5 for brevity
                      <TableRow key={client.id}>
                        <TableCell className="font-medium">{client.name.replace(` (${merchantNames[merchant.id] || merchant.id})`, '')}</TableCell>
                        <TableCell>{client.phone}</TableCell>
                        <TableCell className="text-right">
                            <Badge variant="secondary">{client.currentBalance.toFixed(2)}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">Nenhum cliente registrado para este comerciante.</p>
            )}
             {merchantClients.length > 5 && <p className="text-xs text-muted-foreground mt-2">Mostrando 5 de {merchantClients.length} clientes.</p>}
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="font-headline flex items-center"><ShoppingCart className="mr-2 h-6 w-6"/> Vendas Recentes ({merchantSales.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {merchantSales.length > 0 ? (
               <div className="rounded-lg border overflow-hidden max-h-96 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead className="text-right">Valor (R$)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {merchantSales.slice(0, 5).map((sale) => ( // Show first 5
                      <TableRow key={sale.id}>
                        <TableCell>{sale.clientName.replace(` (${merchantNames[merchant.id] || merchant.id})`, '')}</TableCell>
                        <TableCell>{format(new Date(sale.date), "dd/MM/yy", { locale: ptBR })}</TableCell>
                        <TableCell className="text-right">{sale.value.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">Nenhuma venda registrada para este comerciante.</p>
            )}
            {merchantSales.length > 5 && <p className="text-xs text-muted-foreground mt-2">Mostrando 5 de {merchantSales.length} vendas.</p>}
          </CardContent>
        </Card>
      </div>
      
      <CardFooter className="mt-4">
        <CardDescription>Esta página oferece uma visão detalhada do desempenho e atividades do comerciante {merchant.name}.</CardDescription>
      </CardFooter>
    </div>
  );
}
