
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
import { initialGlobalSales, merchantNames } from "@/lib/mockData"; // Import from centralized mock data
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export default function AdminSalesPage() {
  const [sales, setSales] = useState<Sale[]>(initialGlobalSales);
  const [filterMerchantId, setFilterMerchantId] = useState<string>("");
  const [filterDate, setFilterDate] = useState<string>(""); // YYYY-MM-DD
  const [filterClientName, setFilterClientName] = useState<string>("");
  const [saleToDelete, setSaleToDelete] = useState<Sale | null>(null);
  const { toast } = useToast();

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
    alert(`Editar venda ID: ${sale.id} (Admin) - Funcionalidade de edição completa a ser implementada.`);
  };

  const handleDeleteRequest = (sale: Sale) => {
    setSaleToDelete(sale);
  };

  const handleDeleteConfirm = () => {
    if (saleToDelete) {
      setSales(prevSales => prevSales.filter(s => s.id !== saleToDelete.id));
      // Simular a persistência no mockData
      const index = initialGlobalSales.findIndex(s => s.id === saleToDelete.id);
      if (index > -1) {
        initialGlobalSales.splice(index, 1);
      }
      toast({ title: "Venda Excluída!", description: `A venda ID ${saleToDelete.id} foi excluída globalmente (simulação).` });
      setSaleToDelete(null);
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
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteRequest(sale)} title="Excluir Venda">
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

      <AlertDialog open={!!saleToDelete} onOpenChange={() => setSaleToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a venda ID "{saleToDelete?.id}" (Cliente: {saleToDelete?.clientName}, Valor: R$ {saleToDelete?.value.toFixed(2)}) globalmente? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

       <CardDescription className="text-xs text-muted-foreground">
        Esta visão permite ao administrador auditar e gerenciar todas as transações do sistema. A exclusão aqui é global.
      </CardDescription>
    </div>
  );
}
