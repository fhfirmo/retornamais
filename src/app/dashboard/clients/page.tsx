"use client";

import React, { useState, useEffect } from "react";
import { ClientForm } from "@/components/forms/ClientForm";
import { ClientTable } from "@/components/tables/ClientTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Users } from "lucide-react";
import type { Client } from "@/types";
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

// Mock Data - In a real app, this would come from an API
const initialClients: Client[] = [
  { id: "1", name: "Ana Silva", phone: "5511999990001", accumulatedCashback: 25.50, currentBalance: 10.00 },
  { id: "2", name: "Bruno Costa", phone: "5521988880002", accumulatedCashback: 120.75, currentBalance: 50.25 },
  { id: "3", name: "Carlos Dias", phone: "5531977770003", accumulatedCashback: 0, currentBalance: 0 },
];


export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching data
    setClients(initialClients);
  }, []);

  const handleFormSubmit = (client: Client) => {
    if (editingClient) {
      setClients(clients.map(c => c.id === client.id ? client : c));
      toast({ title: "Cliente Atualizado", description: `${client.name} foi atualizado.`});
    } else {
      setClients([...clients, client]);
      toast({ title: "Cliente Adicionado", description: `${client.name} foi adicionado.`});
    }
    setShowForm(false);
    setEditingClient(null);
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setShowForm(true);
  };

  const handleDeleteRequest = (clientId: string) => {
    setClientToDelete(clientId);
  };

  const handleDeleteConfirm = () => {
    if (clientToDelete) {
      const clientName = clients.find(c => c.id === clientToDelete)?.name || "Cliente";
      setClients(clients.filter(c => c.id !== clientToDelete));
      toast({ title: "Cliente Excluído", description: `${clientName} foi excluído.`});
      setClientToDelete(null);
    }
  };

  const handleSendMessage = (client: Client) => {
    // This would typically redirect to the WhatsApp page or open a modal
    // For now, just a toast message
    toast({
      title: "Enviar Mensagem",
      description: `Preparando para enviar mensagem para ${client.name}. Redirecionando...`,
    });
    // router.push(`/dashboard/whatsapp?clientId=${client.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold flex items-center">
            <Users className="mr-3 h-8 w-8 text-primary" />
            Gerenciamento de Clientes
          </h1>
          <p className="text-muted-foreground">Adicione, edite e visualize seus clientes.</p>
        </div>
        {!showForm && (
          <Button onClick={() => { setShowForm(true); setEditingClient(null); }}>
            <PlusCircle className="mr-2 h-5 w-5" /> Adicionar Novo Cliente
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">{editingClient ? "Editar Cliente" : "Novo Cliente"}</CardTitle>
            <CardDescription>
              {editingClient ? `Modifique os dados de ${editingClient.name}.` : "Preencha os dados para cadastrar um novo cliente."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ClientForm client={editingClient} onSubmitSuccess={handleFormSubmit} />
            <Button variant="outline" className="mt-4" onClick={() => { setShowForm(false); setEditingClient(null); }}>
              Cancelar
            </Button>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-headline">Lista de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientTable 
            clients={clients} 
            onEdit={handleEdit} 
            onDelete={handleDeleteRequest}
            onSendMessage={handleSendMessage}
          />
        </CardContent>
      </Card>

      <AlertDialog open={!!clientToDelete} onOpenChange={() => setClientToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.
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
