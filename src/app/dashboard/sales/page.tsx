
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
import { DEFAULT_CASHBACK_PERCENTAGE } from "@/lib/constants";
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


const initialClients: Client[] = [
  { id: "1", name: "Ana Silva", phone: "5511999990001", accumulatedCashback: 25.50, currentBalance: 10.00, cashbackRedeemed: 15.50 },
  { id: "2", name: "Bruno Costa", phone: "5521988880002", accumulatedCashback: 120.75, currentBalance: 50.25, cashbackRedeemed: 70.50 },
];

const initialSales: Sale[] = [
  { id: "s1", clientId: "1", clientName: "Ana Silva", value: 100, date: new Date(2023, 10, 15).toISOString(), cashbackGenerated: 5 },
  { id: "s2", clientId: "2", clientName: "Bruno Costa", value: 250, date: new Date(2023, 10, 16).toISOString(), cashbackGenerated: 12.5 },
  { id: "s3", clientId: "1", clientName: "Ana Silva", value: 75, date: new Date(2023, 11, 1).toISOString(), cashbackGenerated: 3.75 },
  { id: "s4", clientId: "2", clientName: "Bruno Costa", value: 120, date: new Date(2023, 11, 5).toISOString(), cashbackGenerated: 6 },
];

const initialSettings: MerchantSettings = {
  cashbackPercentage: DEFAULT_CASHBACK_PERCENTAGE,
  whatsappTemplate: "Olá {{{clientName}}}, obrigado pela sua compra de R${{{purchaseValue}}}!",
};

const ALL_CLIENTS_FILTER_VALUE = "__ALL_CLIENTS__";

export default function SalesPage() {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [sales, setSales] = useState<Sale[]>(initialSales);
  const [settings, setSettings] = useState<MerchantSettings>(initialSettings);
  const [showForm, setShowForm] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [saleToDelete, setSaleToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const [filterClientId, setFilterClientId] = useState<string>(""); // Empty string means all clients
  const [filterDate, setFilterDate] = useState<string>(""); // YYYY-MM-DD

  useEffect(() => {
    // Simulate fetching data
  }, []);

  const filteredSales = useMemo(() => {
    return sales.filter(sale => {
      const clientMatch = filterClientId ? sale.clientId === filterClientId : true; // "" means all
      const dateMatch = filterDate ? sale.date.startsWith(filterDate) : true;
      return clientMatch && dateMatch;
    });
  }, [sales, filterClientId, filterDate]);

  const handleFormSubmit = (sale: Sale, updatedClient?: Client) => {
    if (editingSale) {
      setSales(sales.map(s => s.id === sale.id ? sale : s));
      toast({ title: "Venda Atualizada", description: `Venda para ${sale.clientName} atualizada.`});
    } else {
      setSales([sale, ...sales]); 
      toast({ title: "Venda Adicionada", description: `Venda para ${sale.clientName} adicionada.`});
      // Redirect to WhatsApp message composer (simulation)
      toast({
        title: "Redirecionando",
        description: `Preparando mensagem WhatsApp para ${sale.clientName}...`,
        duration: 3000,
      });
      // In a real app, you might pass more sale details or client details
      setTimeout(() => router.push(`/dashboard/whatsapp?clientId=${sale.clientId}&purchaseValue=${sale.value}&cashbackGenerated=${sale.cashbackGenerated}`), 1000);
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
        // Basic mock logic: revert cashback for deleted sale. Real app needs robust transaction handling.
        const client = clients.find(c => c.id === saleBeingDeleted.clientId);
        if (client) {
            const updatedClient = {
                ...client,
                accumulatedCashback: client.accumulatedCashback - saleBeingDeleted.cashbackGenerated,
                currentBalance: client.currentBalance - saleBeingDeleted.cashbackGenerated
            };
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

