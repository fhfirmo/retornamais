
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { SaleForm } from "@/components/forms/SaleForm";
import { SaleTable } from "@/components/tables/SaleTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, ShoppingCart, Search, CalendarDays } from "lucide-react";
import type { Client, Sale, MerchantSettings } from "@/types";
import { useToast } from "@/hooks/use-toast";
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
import { useRouter } from "next/navigation";
import { mockMerchantClients, mockMerchantSales, mockInitialMerchantSettings } from "@/lib/mockData"; // Import from centralized mock data

const ALL_CLIENTS_FILTER_VALUE = "__ALL_CLIENTS__";

export default function SalesPage() {
  const [clients, setClients] = useState<Client[]>(mockMerchantClients);
  const [sales, setSales] = useState<Sale[]>(mockMerchantSales);
  const [settings, setSettings] = useState<MerchantSettings>(mockInitialMerchantSettings);
  const [showForm, setShowForm] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [saleToDelete, setSaleToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const [filterClientId, setFilterClientId] = useState<string>(""); 
  const [filterDate, setFilterDate] = useState<string>(""); 

  useEffect(() => {
    // In a real app, fetch settings if they can change dynamically for the merchant
  }, []);

  const filteredSales = useMemo(() => {
    return sales.filter(sale => {
      const clientMatch = filterClientId ? sale.clientId === filterClientId : true;
      const dateMatch = filterDate ? sale.date.startsWith(filterDate) : true;
      return clientMatch && dateMatch;
    });
  }, [sales, filterClientId, filterDate]);

  const handleFormSubmit = (sale: Sale, updatedClient?: Client) => {
    if (editingSale) {
      setSales(prevSales => prevSales.map(s => s.id === sale.id ? sale : s));
      toast({ title: "Venda Atualizada", description: `Venda para ${sale.clientName} atualizada.`});
    } else {
       // Simulate adding a new sale by generating a new ID
      const newSaleWithId = { ...sale, id: crypto.randomUUID(), merchantId: "merch_example" };
      setSales(prevSales => [newSaleWithId, ...prevSales]); 
      toast({ title: "Venda Adicionada", description: `Venda para ${sale.clientName} adicionada.`});
      
      if (updatedClient) {
        toast({
          title: "Redirecionando",
          description: `Preparando mensagem WhatsApp para ${sale.clientName}...`,
          duration: 3000,
        });
        setTimeout(() => router.push(
          `/dashboard/whatsapp?clientId=${sale.clientId}&purchaseValue=${sale.value}&cashbackFromThisPurchase=${sale.cashbackGenerated}&newCurrentBalance=${updatedClient.currentBalance}`
        ), 1000);
      }
    }

    if (updatedClient) {
      setClients(prevClients => prevClients.map(c => c.id === updatedClient.id ? updatedClient : c));
    }

    setShowForm(false);
    setEditingSale(null);
  };

  const handleEdit = (sale: Sale) => {
    setEditingSale(sale);
    setShowForm(true);
  };

  const handleDeleteRequest = (saleId: string) => {
    setSaleToDelete(saleId);
  };

  const handleDeleteConfirm = () => {
    if (saleToDelete) {
      const saleBeingDeleted = sales.find(s => s.id === saleToDelete);
      if(saleBeingDeleted) {
        const client = clients.find(c => c.id === saleBeingDeleted.clientId);
        if (client) {
            const updatedClient = {
                ...client,
                accumulatedCashback: client.accumulatedCashback - saleBeingDeleted.cashbackGenerated,
                currentBalance: client.currentBalance - saleBeingDeleted.cashbackGenerated
            };
             if (updatedClient.currentBalance < 0) updatedClient.currentBalance = 0; // Ensure balance doesn't go negative
            setClients(prevClients => prevClients.map(c => c.id === updatedClient.id ? updatedClient : c));
        }
        setSales(sales.filter(s => s.id !== saleToDelete));
        toast({ title: "Venda Excluída", description: `Venda de R$ ${saleBeingDeleted.value.toFixed(2)} foi excluída e cashback revertido (simulação).`});
      }
      setSaleToDelete(null);
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
        <h1 className="text-3xl font-headline font-bold flex items-center">
            <ShoppingCart className="mr-3 h-8 w-8 text-primary" />
            Registro de Vendas
          </h1>
          <p className="text-muted-foreground">Adicione novas vendas e visualize o histórico.</p>
        </div>
        {!showForm && (
          <Button onClick={() => { setShowForm(true); setEditingSale(null); }}>
            <PlusCircle className="mr-2 h-5 w-5" /> Registrar Nova Venda
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">{editingSale ? "Editar Venda" : "Nova Venda"}</CardTitle>
            <CardDescription>
              {editingSale ? `Modifique os dados da venda.` : "Preencha os dados para registrar uma nova venda."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SaleForm 
              clients={clients} 
              settings={settings} 
              sale={editingSale} 
              onSubmitSuccess={handleFormSubmit} 
            />
            <Button variant="outline" className="mt-4" onClick={() => { setShowForm(false); setEditingSale(null); }}>
              Cancelar
            </Button>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-headline">Histórico de Vendas</CardTitle>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
            <div>
              <label htmlFor="clientFilter" className="block text-sm font-medium text-muted-foreground mb-1">Filtrar por Cliente</label>
              <Select 
                onValueChange={(value) => setFilterClientId(value === ALL_CLIENTS_FILTER_VALUE ? "" : value)} 
                value={filterClientId === "" ? ALL_CLIENTS_FILTER_VALUE : filterClientId}
              >
                <SelectTrigger id="clientFilter">
                  <SelectValue placeholder="Todos os Clientes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_CLIENTS_FILTER_VALUE}>Todos os Clientes</SelectItem>
                  {clients.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="dateFilter" className="block text-sm font-medium text-muted-foreground mb-1">Filtrar por Data</label>
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
            <Button onClick={() => {setFilterClientId(""); setFilterDate("");}} variant="outline" className="self-end">Limpar Filtros</Button>
          </div>
        </CardHeader>
        <CardContent>
          <SaleTable sales={filteredSales} onEdit={handleEdit} onDelete={handleDeleteRequest} />
        </CardContent>
      </Card>

      <AlertDialog open={!!saleToDelete} onOpenChange={() => setSaleToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta venda? Esta ação não pode ser desfeita. O cashback associado será revertido (simulação).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
