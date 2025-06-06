"use client";

import React, { useState, useEffect } from "react";
import { SaleForm } from "@/components/forms/SaleForm";
import { SaleTable } from "@/components/tables/SaleTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, ShoppingCart } from "lucide-react";
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

// Mock Data
const initialClients: Client[] = [
  { id: "1", name: "Ana Silva", phone: "5511999990001", accumulatedCashback: 25.50, currentBalance: 10.00 },
  { id: "2", name: "Bruno Costa", phone: "5521988880002", accumulatedCashback: 120.75, currentBalance: 50.25 },
];

const initialSales: Sale[] = [
  { id: "s1", clientId: "1", clientName: "Ana Silva", value: 100, date: new Date(2023, 10, 15).toISOString(), cashbackGenerated: 5 },
  { id: "s2", clientId: "2", clientName: "Bruno Costa", value: 250, date: new Date(2023, 10, 16).toISOString(), cashbackGenerated: 12.5 },
];

const initialSettings: MerchantSettings = {
  cashbackPercentage: DEFAULT_CASHBACK_PERCENTAGE,
  whatsappTemplate: "Olá {{{clientName}}}, obrigado pela sua compra de R${{{purchaseValue}}}!",
};

export default function SalesPage() {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [sales, setSales] = useState<Sale[]>(initialSales);
  const [settings, setSettings] = useState<MerchantSettings>(initialSettings);
  const [showForm, setShowForm] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [saleToDelete, setSaleToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  // In a real app, clients and settings would be fetched or from context
  useEffect(() => {
    // If settings are fetched, update them here
    // If clients are fetched, update them here
  }, []);

  const handleFormSubmit = (sale: Sale, updatedClient?: Client) => {
    if (editingSale) {
      setSales(sales.map(s => s.id === sale.id ? sale : s));
      toast({ title: "Venda Atualizada", description: `Venda para ${sale.clientName} atualizada.`});
    } else {
      setSales([sale, ...sales]); // Add to beginning of list
      toast({ title: "Venda Adicionada", description: `Venda para ${sale.clientName} adicionada.`});
    }

    if (updatedClient) {
      setClients(clients.map(c => c.id === updatedClient.id ? updatedClient : c));
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
      const saleValue = sales.find(s => s.id === saleToDelete)?.value || 0;
      setSales(sales.filter(s => s.id !== saleToDelete));
      toast({ title: "Venda Excluída", description: `Venda de R$ ${saleValue.toFixed(2)} foi excluída.`});
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
        </CardHeader>
        <CardContent>
          <SaleTable sales={sales} onEdit={handleEdit} onDelete={handleDeleteRequest} />
        </CardContent>
      </Card>

      <AlertDialog open={!!saleToDelete} onOpenChange={() => setSaleToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta venda? Esta ação não pode ser desfeita. O cashback associado não será revertido automaticamente.
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
