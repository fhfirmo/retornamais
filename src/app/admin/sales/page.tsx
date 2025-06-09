
"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Search, CalendarDays, Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Sale } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Mock Data - Representing sales from potentially different merchants
const initialGlobalSales: Sale[] = [
  { id: "s1", merchantId: "merch1", clientId: "c1", clientName: "Ana Silva", value: 100, date: new Date(2023, 10, 15).toISOString(), cashbackGenerated: 5 },
  { id: "s2", merchantId: "merch2", clientId: "c2", clientName: "Bruno Costa", value: 250, date: new Date(2023, 10, 16).toISOString(), cashbackGenerated: 12.5 },
  { id: "s3", merchantId: "merch1", clientId: "c3", clientName: "Carlos Dias", value: 75, date: new Date(2023, 11, 1).toISOString(), cashbackGenerated: 3.75 },
  { id: "s4", merchantId: "merch3", clientId: "c4", clientName: "Daniela Alves", value: 120, date: new Date(2023, 11, 5).toISOString(), cashbackGenerated: 6 },
  { id: "s5", merchantId: "merch2", clientId: "c5", clientName: "Eduardo Lima", value: 90, date: new Date(2023, 11, 10).toISOString(), cashbackGenerated: 4.5 },
];

// Mock merchant names for display
const merchantNames: Record<string, string> = {
    merch1: "Loja da Esquina",
    merch2: "Padaria Pão Quente",
    merch3: "Salão Beleza Pura"
}


export default function AdminSalesPage() {
  const [sales, setSales] = useState<Sale[]>(initialGlobalSales);
  const [filterMerchantId, setFilterMerchantId] = useState<string>("");
  const [filterDate, setFilterDate] = useState<string>(""); // YYYY-MM-DD
  const [filterClientName, setFilterClientName] = useState<string>("");

  const filteredSales = useMemo(() => {
    return sales.filter(sale => {
      const merchantMatch = filterMerchantId ? sale.merchantId === filterMerchantId : true;
      const dateMatch = filterDate ? sale.date.startsWith(filterDate) : true;
      const clientNameMatch = filterClientName ? sale.clientName.toLowerCase().includes(filterClientName.toLowerCase()) : true;
      return merchantMatch && dateMatch && clientNameMatch;
    });
  }, [sales, filterMerchantId, filterDate, filterClientName]);

  const handleEditSale = (sale: Sale) => {
    console.log("Edit sale (Admin):", sale);
    alert(`Editar venda ID: ${sale.id} (Admin) - Placeholder`);
  };

  const handleDeleteSale = (saleId: string) => {
    console.log("Delete sale ID (Admin):", saleId);
    if(confirm("Tem certeza que deseja excluir esta venda globalmente? Isso pode afetar dados de um comerciante.")) {
        setSales(sales.filter(s => s.id !== saleId));
        alert("Venda excluída globalmente (simulação).");
    }
  };


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-bold flex items-center">
          <ShoppingCart className="mr-3 h-8 w-8 text-primary" />
          Histórico de Vendas (Global)
        </h1>
        <p className="text-muted-foreground">Visualize e gerencie todas as vendas da plataforma.</p>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-headline">Filtros de Vendas</CardTitle>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <label htmlFor="merchantFilter" className="block text-sm font-medium text-muted-foreground mb-1">ID Comerciante</label>
              <Input 
                id="merchantFilter"
                type="text"
                placeholder="Ex: merch1"
                value={filterMerchantId}
                onChange={(e) => setFilterMerchantId(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="clientNameFilter" className="block text-sm font-medium text-muted-foreground mb-1">Nome do Cliente</label>
              <Input 
                id="clientNameFilter"
                type="text"
                placeholder="Buscar por cliente..."
                value={filterClientName}
                onChange={(e) => setFilterClientName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="dateFilter" className="block text-sm font-medium text-muted-foreground mb-1">Data da Venda</label>
              <div className="relative">
                <Input 
                  id="dateFilter"
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="pr-8"
                />
                <CalendarDays className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
             <Button 
                onClick={() => { setFilterMerchantId(""); setFilterDate(""); setFilterClientName(""); }} 
                variant="outline" 
                className="self-end"
            >
                Limpar Filtros
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filteredSales.length > 0 ? (
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Comerciante</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Valor (R$)</TableHead>
                    <TableHead className="text-right">Cashback (R$)</TableHead>
                    <TableHead className="text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>{sale.merchantId ? merchantNames[sale.merchantId] || sale.merchantId : 'N/A'}</TableCell>
                      <TableCell className="font-medium">{sale.clientName}</TableCell>
                      <TableCell>{format(new Date(sale.date), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                      <TableCell className="text-right">{sale.value.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="default" className="bg-primary/80">
                          {sale.cashbackGenerated.toFixed(2)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditSale(sale)} title="Editar Venda">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteSale(sale.id)} title="Excluir Venda">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
             <p className="text-muted-foreground text-center py-8">Nenhuma venda encontrada com os filtros atuais.</p>
          )}
        </CardContent>
      </Card>
       <CardDescription className="text-xs text-muted-foreground">
        Esta visão permite ao administrador auditar e gerenciar todas as transações do sistema.
      </CardDescription>
    </div>
  );
}
